const siteName = 'MoMoFit';
const defaultTitle = 'MoMoFit 团队服饰定制 - AI在线设计球衣T恤Polo衫';
const defaultDescription = 'MoMoFit 提供篮球服、足球服、Polo 衫和团队活动服在线定制，支持 3D 预览、AI 徽章设计、队名号码编辑和设计包导出。';
const defaultImage = '/images/brand/black.png';

const externalUrlPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

function getBasePath() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

function getSiteOrigin() {
  const configuredUrl = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_RESOURCE_URL;

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch (error) {
      console.warn('Invalid site URL for SEO metadata:', configuredUrl);
    }
  }

  return window.location.origin;
}

function normalizePath(path = '/') {
  const value = String(path || '/');
  const pathOnly = value.split('#')[0].split('?')[0] || '/';
  return pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
}

function joinUrl(...parts) {
  return parts
    .filter(Boolean)
    .join('/')
    .replace(/([^:]\/)\/+/g, '$1');
}

function toSiteUrl(path = '/') {
  if (externalUrlPattern.test(path)) return path;

  const origin = getSiteOrigin().replace(/\/$/, '');
  const base = getBasePath().replace(/^\//, '').replace(/\/$/, '');
  const normalizedPath = normalizePath(path).replace(/^\//, '');

  return joinUrl(origin, base, normalizedPath);
}

function toAbsoluteAssetUrl(path = defaultImage) {
  if (externalUrlPattern.test(path)) return path;

  const origin = getSiteOrigin().replace(/\/$/, '');
  const base = getBasePath().replace(/^\//, '').replace(/\/$/, '');
  const normalizedPath = String(path || defaultImage).replace(/^\//, '');

  return joinUrl(origin, base, normalizedPath);
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function setMetaName(name, content) {
  upsertMeta(`meta[name="${name}"]`, { name, content });
}

function setMetaProperty(property, content) {
  upsertMeta(`meta[property="${property}"]`, { property, content });
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = url;
}

function setJsonLd(schema) {
  const existing = document.head.querySelector('script[type="application/ld+json"][data-managed-seo="true"]');

  if (existing) {
    existing.remove();
  }

  if (!schema) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.managedSeo = 'true';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function truncate(value, maxLength) {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

export function setSeo(options = {}) {
  const title = truncate(options.title || defaultTitle, 70);
  const description = truncate(options.description || defaultDescription, 155);
  const canonicalUrl = toSiteUrl(options.path || window.location.pathname);
  const imageUrl = toAbsoluteAssetUrl(options.image || defaultImage);
  const robots = options.noindex ? 'noindex, follow' : 'index, follow';

  document.title = title;
  setMetaName('description', description);
  setMetaName('robots', robots);
  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', title);
  setMetaName('twitter:description', description);
  setMetaName('twitter:image', imageUrl);
  setMetaProperty('og:type', options.type || 'website');
  setMetaProperty('og:title', title);
  setMetaProperty('og:description', description);
  setMetaProperty('og:url', canonicalUrl);
  setMetaProperty('og:image', imageUrl);
  setMetaProperty('og:site_name', siteName);
  setCanonical(canonicalUrl);
  setJsonLd(options.schema);
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: toSiteUrl('/'),
    logo: toAbsoluteAssetUrl('/images/brand/black.png'),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'ggbone0917@163.com',
        availableLanguage: ['zh-CN'],
      },
    ],
  };
}

export function createProductSchema(product = {}) {
  const image = product.pictures?.[0] || defaultImage;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncate(product.description || defaultDescription, 500),
    image: product.pictures?.length
      ? product.pictures.map((item) => toAbsoluteAssetUrl(`/images/clothes/${String(item).replace(/^\//, '')}`))
      : [toAbsoluteAssetUrl(image)],
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    category: product.sportType || product.clothType || 'custom sportswear',
    offers: {
      '@type': 'Offer',
      url: toSiteUrl(`/product/${product.id}`),
      priceCurrency: 'CNY',
      price: String(product.price || ''),
      availability: 'https://schema.org/InStock',
    },
  };
}