const importDesignCache = new Map();

export const stashImportedDesign = (productId, designText) => {
  if (!productId || typeof designText !== 'string') return;
  importDesignCache.set(String(productId), designText);
};

export const takeImportedDesign = (productId) => {
  if (!productId) return '';

  const cacheKey = String(productId);
  const designText = importDesignCache.get(cacheKey) || '';
  importDesignCache.delete(cacheKey);
  return designText;
};
