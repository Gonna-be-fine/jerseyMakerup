const externalUrlPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function publicPath(path = '') {
  if (!path) return import.meta.env.BASE_URL || '/';

  const value = String(path);
  if (
    externalUrlPattern.test(value) ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  if (value.startsWith(normalizedBase)) {
    return value;
  }

  return `${normalizedBase}${value.replace(/^\.?\//, '')}`;
}

export function joinPublicPath(...parts) {
  return publicPath(
    parts
      .filter(part => part !== undefined && part !== null && part !== '')
      .join('/')
      .replace(/\/{2,}/g, '/')
  );
}
