export const isSvgSource = (src) => (
  typeof src === 'string' && (
    src.trim().startsWith('<svg') ||
    /^data:image\/svg\+xml/i.test(src) ||
    /\.svg(?:[?#].*)?$/i.test(src)
  )
);

export const isRasterImageSource = (src) => (
  typeof src === 'string' && !isSvgSource(src)
);

export const makeWhiteBackgroundTransparent = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const edgeBg = sampleEdgeBackground(data, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const threshold = 86;
      const fullCutoff = 24;
      const visited = new Uint8Array(width * height);
      const queue = new Int32Array(width * height);
      let head = 0;
      let tail = 0;

      const enqueueIfBackground = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const pixelIndex = y * width + x;
        if (visited[pixelIndex]) return;

        const dataIndex = pixelIndex * 4;
        if (!isEdgeConnectedBackgroundPixel(data, dataIndex, edgeBg, threshold)) return;

        visited[pixelIndex] = 1;
        queue[tail++] = pixelIndex;
      };

      for (let x = 0; x < width; x += 1) {
        enqueueIfBackground(x, 0);
        enqueueIfBackground(x, height - 1);
      }
      for (let y = 0; y < height; y += 1) {
        enqueueIfBackground(0, y);
        enqueueIfBackground(width - 1, y);
      }

      while (head < tail) {
        const pixelIndex = queue[head++];
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);

        enqueueIfBackground(x + 1, y);
        enqueueIfBackground(x - 1, y);
        enqueueIfBackground(x, y + 1);
        enqueueIfBackground(x, y - 1);
      }

      for (let pixelIndex = 0; pixelIndex < visited.length; pixelIndex += 1) {
        if (!visited[pixelIndex]) continue;

        const dataIndex = pixelIndex * 4;
        const bgDistance = colorDistance(
          data[dataIndex],
          data[dataIndex + 1],
          data[dataIndex + 2],
          edgeBg.r,
          edgeBg.g,
          edgeBg.b
        );
        const fade = Math.max(0, Math.min(1, (bgDistance - fullCutoff) / (threshold - fullCutoff)));
        data[dataIndex + 3] = Math.round(data[dataIndex + 3] * fade);
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
};

const isEdgeConnectedBackgroundPixel = (data, idx, edgeBg, threshold) => {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];

  if (a === 0) return false;

  const brightness = (r + g + b) / 3;
  const neutralSpread = Math.max(r, g, b) - Math.min(r, g, b);
  const bgDistance = colorDistance(r, g, b, edgeBg.r, edgeBg.g, edgeBg.b);

  return (brightness >= 226 && neutralSpread <= 34) || bgDistance <= threshold;
};

const sampleEdgeBackground = (data, width, height) => {
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  const sum = points.reduce((acc, [x, y]) => {
    const idx = (y * width + x) * 4;
    acc.r += data[idx];
    acc.g += data[idx + 1];
    acc.b += data[idx + 2];
    return acc;
  }, { r: 0, g: 0, b: 0 });
  return {
    r: sum.r / points.length,
    g: sum.g / points.length,
    b: sum.b / points.length,
  };
};

const colorDistance = (r1, g1, b1, r2, g2, b2) => {
  return Math.sqrt(
    (r1 - r2) ** 2 +
    (g1 - g2) ** 2 +
    (b1 - b2) ** 2
  );
};
