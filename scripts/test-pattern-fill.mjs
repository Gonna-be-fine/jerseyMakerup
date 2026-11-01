import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { Rect, setEnv, util } from 'fabric';
import { buildPatternTile, createPatternFill, GarmentPattern } from '../src/world/editor/PatternFill.js';

const { window } = new JSDOM();
const parseSvg = (svg) => {
  const doc = new window.DOMParser().parseFromString(svg, 'image/svg+xml');
  assert.equal(doc.querySelector('parsererror'), null, 'SVG must be valid XML');
  return doc;
};
const dataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
const decodeSvg = (url) => {
  const comma = url.indexOf(',');
  return /;base64/i.test(url.slice(0, comma))
    ? Buffer.from(url.slice(comma + 1), 'base64').toString('utf8')
    : decodeURIComponent(url.slice(comma + 1));
};
const href = (node) => node.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20"><defs><linearGradient id="ink"><stop stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient></defs><path d="M0 0h20v20H0z" fill="url(#ink)"/><text x="22" y="15">球衣</text></svg>`;

// jsdom has no image decoder. Stub decoding only; Fabric's actual pattern
// registry, serialization, restoration and SVG export run unchanged below.
class TestImage {
  set src(value) {
    this._src = value;
    if (!value) return;
    queueMicrotask(() => {
      try {
        const svg = parseSvg(decodeSvg(value)).documentElement;
        this.width = this.naturalWidth = Number(svg.getAttribute('width'));
        this.height = this.naturalHeight = Number(svg.getAttribute('height'));
        this.complete = true;
        this.onload?.();
      } catch (error) {
        this.onerror?.(error);
      }
    });
  }
  get src() { return this._src; }
}
globalThis.Image = TestImage;
setEnv({
  window,
  document: { createElement: (tag) => tag === 'img' ? new TestImage() : window.document.createElement(tag) },
});

test('SVG export keeps artwork vectors, tint, opacity and dimensions after JSON restoration', async () => {
  const fill = await createPatternFill({
    url: dataUrl(artwork), scale: 2, patternColor: '#123456', bgColor: '#abcdef',
    angle: 35, opacity: 0.6, offsetX: -17, offsetY: 19,
  });
  const rect = new Rect({ width: 600, height: 400, fill });
  const serialized = JSON.parse(JSON.stringify(rect.toObject()));
  const [restored] = await util.enlivenObjects([serialized]);
  assert.ok(restored.fill instanceof GarmentPattern);
  assert.deepEqual(restored.fill.patternTransform, fill.patternTransform);

  const exported = parseSvg(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${restored.toSVG()}</svg>`);
  const pattern = exported.querySelector('pattern');
  assert.equal(Number(pattern.getAttribute('width')) * rect.width, 256);
  assert.equal(Number(pattern.getAttribute('height')) * rect.height, 128);
  const tile = parseSvg(decodeSvg(href(pattern.querySelector('image'))));
  assert.equal(tile.querySelector('g').getAttribute('transform'), 'rotate(35 128 64)');
  assert.equal(tile.querySelector('g').getAttribute('opacity'), '0.6');
  assert.equal(tile.querySelector('feFlood').getAttribute('flood-color'), '#123456');
  assert.equal(tile.querySelector('feComposite').getAttribute('in2'), 'SourceAlpha');
  assert.equal(tile.querySelector('svg > rect').getAttribute('fill'), '#abcdef');
  assert.equal(tile.querySelector('pattern').getAttribute('x'), '239');
  assert.equal(tile.querySelector('pattern').getAttribute('y'), '19');
  assert.equal(decodeSvg(href(tile.querySelector('image'))), artwork);
  assert.doesNotMatch(restored.toSVG(), /data:image\/png/);
  assert.equal(parseSvg(artwork).querySelector('linearGradient').id, 'ink');
});

test('preview density changes resolution while retaining tile size and respecting memory limits', async () => {
  const options = { url: dataUrl(artwork) };
  const desktop = await createPatternFill(options);
  const mobile = await createPatternFill(options, { density: 2, maxSize: 1024 });
  for (const fill of [desktop, mobile]) {
    assert.equal(fill.source.width * fill.patternTransform[0], 128);
    assert.equal(fill.source.height * fill.patternTransform[3], 64);
  }
  assert.equal(desktop.source.width, 512);
  assert.equal(mobile.source.width, 256);
  const large = await createPatternFill({ ...options, scale: 50 });
  assert.equal(large.tileWidth, 6400);
  assert.ok(large.source.width <= 2048 && large.source.height <= 2048);
  assert.equal(large.source.width * large.patternTransform[0], 6400);
});

test('PNG uploads keep their original source and transparent background', () => {
  const source = { url: 'data:image/png;base64,originalPixels', width: 100, height: 50 };
  const { svg } = buildPatternTile(source, { bgColor: 'transparent' });
  const tile = parseSvg(svg);
  assert.equal(href(tile.querySelector('image')), source.url);
  assert.equal(tile.querySelector('filter'), null);
  assert.equal(tile.querySelector('svg > rect'), null);
});

test('panels sharing a preview image have distinct SVG IDs and keep the same tile size', async () => {
  const fill = await createPatternFill({ url: dataUrl(artwork) });
  const front = new Rect({ width: 600, height: 400, fill: fill.clone() });
  const sleeve = new Rect({ width: 200, height: 100, fill: fill.clone() });
  assert.equal(front.fill.source, sleeve.fill.source);
  const svg = parseSvg(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${front.toSVG()}${sleeve.toSVG()}</svg>`);
  const patterns = [...svg.querySelectorAll('pattern')];
  assert.notEqual(patterns[0].id, patterns[1].id);
  assert.equal(Number(patterns[0].getAttribute('width')) * front.width, 128);
  assert.equal(Number(patterns[1].getAttribute('width')) * sleeve.width, 128);
});

test('remote SVGs are embedded for offline export and failed requests can be retried', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.FileReader = class {
    async readAsDataURL(blob) {
      this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`;
      this.onload();
    }
  };
  let attempts = 0;
  globalThis.fetch = async () => {
    attempts++;
    return attempts === 1
      ? new Response('', { status: 404 })
      : new Response(artwork, { headers: { 'Content-Type': 'application/octet-stream' } });
  };
  try {
    const options = { url: 'https://example.test/pattern.svg?v=1' };
    await assert.rejects(createPatternFill(options), /404/);
    const fill = await createPatternFill(options);
    const tile = parseSvg(decodeSvg(fill.source.src));
    assert.equal(decodeSvg(href(tile.querySelector('image'))), artwork);
    await createPatternFill(options);
    assert.equal(attempts, 2, 'successful source loads should be cached');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
