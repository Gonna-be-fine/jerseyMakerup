import { joinPublicPath, publicPath } from './publicPath';

const externalUrlPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const imageExtensionPattern = /\.(png|jpe?g|webp)([?#].*)?$/i;

const isLocalImage = (image) => {
  if (!image) return false;
  const value = String(image);
  return !externalUrlPattern.test(value) && !value.startsWith('data:') && !value.startsWith('blob:');
};

export const getCompressedProductImagePath = (image) => {
  if (!isLocalImage(image)) return image;

  const value = String(image);
  if (/_cp\.jpe?g([?#].*)?$/i.test(value)) return value;

  return value.replace(imageExtensionPattern, '_cp.jpg$2');
};

export const resolveProductImageUrl = (image, options = {}) => {
  const {
    prefix = '/images/clothes/',
    defaultImage = publicPath('/images/assets/placeholder.png'),
    preferCompressed = true,
  } = options;

  if (!image) return defaultImage;

  const imagePath = preferCompressed ? getCompressedProductImagePath(image) : image;

  if (externalUrlPattern.test(imagePath) || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  if (imagePath.startsWith(import.meta.env.BASE_URL)) {
    return imagePath;
  }

  if (imagePath.startsWith('/images/')) {
    return publicPath(imagePath);
  }

  return joinPublicPath(prefix, imagePath);
};

export const handleProductImageError = (event, defaultImage = publicPath('/images/assets/placeholder.png')) => {
  const imageElement = event?.target;
  if (!imageElement) return;

  const fallbackSrc = imageElement.dataset?.fallbackSrc;
  if (fallbackSrc && imageElement.src !== fallbackSrc) {
    imageElement.dataset.fallbackSrc = '';
    imageElement.src = fallbackSrc;
    return;
  }

  if (imageElement.dataset?.defaultImageApplied !== 'true') {
    imageElement.dataset.defaultImageApplied = 'true';
    imageElement.src = defaultImage;
  }
};
