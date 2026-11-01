import { Pattern, classRegistry } from 'fabric';

const sourceCache = new Map();
const escapeAttribute = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
})[char]);
const svgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load pattern image'));
    image.src = url;
  });
}

async function loadSource(url) {
  if (sourceCache.has(url)) return sourceCache.get(url);
  const pending = (async () => {
    // SVG images cannot load external subresources. Embed remote uploads so the
    // preview and downloaded SVG are both self-contained.
    let sourceUrl = url;
    if (!url.startsWith('data:')) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load pattern (${response.status})`);
      let blob = await response.blob();
      if (/\.svg(?:[?#].*)?$/i.test(url)) {
        blob = new Blob([blob], { type: 'image/svg+xml' });
      }
      sourceUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    const image = await loadImage(sourceUrl);
    return { url: sourceUrl, width: image.naturalWidth, height: image.naturalHeight };
  })();
  sourceCache.set(url, pending);
  if (sourceCache.size > 12) sourceCache.delete(sourceCache.keys().next().value);
  try {
    return await pending;
  } catch (error) {
    if (sourceCache.get(url) === pending) sourceCache.delete(url);
    throw error;
  }
}

export function buildPatternTile(source, options, { density = 4, maxSize = 2048 } = {}) {
  const {
    scale = 1, angle = 0, opacity = 1, offsetX = 0, offsetY = 0,
    patternColor = null, bgColor = 'transparent'
  } = options;
  const tileWidth = Math.max(8, Math.round(128 * scale));
  const tileHeight = Math.max(8, Math.round(128 * source.height / source.width * scale));
  const resolution = Math.min(density, maxSize / Math.max(tileWidth, tileHeight));
  const width = Math.max(1, Math.round(tileWidth * resolution));
  const height = Math.max(1, Math.round(tileHeight * resolution));
  const x = ((offsetX % tileWidth) + tileWidth) % tileWidth;
  const y = ((offsetY % tileHeight) + tileHeight) % tileHeight;
  const coverage = Math.hypot(tileWidth, tileHeight);
  const tint = patternColor ? `<filter id="tint" color-interpolation-filters="sRGB"><feFlood flood-color="${escapeAttribute(patternColor)}"/><feComposite in2="SourceAlpha" operator="in"/></filter>` : '';
  const background = bgColor && bgColor !== 'transparent'
    ? `<rect width="${tileWidth}" height="${tileHeight}" fill="${escapeAttribute(bgColor)}"/>` : '';
  // Keep the original SVG as an SVG image, including gradients, masks and IDs.
  // No canvas/PNG conversion is involved, even when applying a tint.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${tileWidth} ${tileHeight}">
    <defs>${tint}<pattern id="artwork" patternUnits="userSpaceOnUse" x="${x}" y="${y}" width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${tileWidth} ${tileHeight}"><image width="${tileWidth}" height="${tileHeight}" preserveAspectRatio="none" xlink:href="${escapeAttribute(source.url)}"${patternColor ? ' filter="url(#tint)"' : ''}/></pattern></defs>
    ${background}<g opacity="${opacity}" transform="rotate(${angle} ${tileWidth / 2} ${tileHeight / 2})"><rect x="${-coverage}" y="${-coverage}" width="${tileWidth + coverage * 2}" height="${tileHeight + coverage * 2}" fill="url(#artwork)"/></g>
  </svg>`;
  return { svg, width, height, tileWidth, tileHeight };
}

export class GarmentPattern extends Pattern {
  static type = 'GarmentPattern';

  clone() {
    return new GarmentPattern({
      source: this.source,
      repeat: this.repeat,
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      patternTransform: this.patternTransform?.slice(),
    });
  }

  toObject(propertiesToInclude = []) {
    return {
      ...super.toObject(propertiesToInclude),
      type: GarmentPattern.type,
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight,
    };
  }

  toSVG({ width, height }) {
    // Fabric's default export uses source pixel dimensions and ignores the
    // preview's downscale matrix. Export in logical units to keep tile size.
    return `<pattern id="SVGID_${this.id}" x="${this.offsetX / width || 0}" y="${this.offsetY / height || 0}" width="${this.tileWidth / width}" height="${this.tileHeight / height}"><image width="${this.tileWidth}" height="${this.tileHeight}" preserveAspectRatio="none" xlink:href="${escapeAttribute(this.source.src)}"/></pattern>\n`;
  }
}

classRegistry.setClass(GarmentPattern);

export async function createPatternFill(options, previewOptions) {
  const source = await loadSource(options.url);
  const tile = buildPatternTile(source, options, previewOptions);
  const image = await loadImage(svgDataUrl(tile.svg));
  return new GarmentPattern({
    source: image,
    repeat: 'repeat',
    tileWidth: tile.tileWidth,
    tileHeight: tile.tileHeight,
    patternTransform: [tile.tileWidth / tile.width, 0, 0, tile.tileHeight / tile.height, 0, 0],
  });
}
