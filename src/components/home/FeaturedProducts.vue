<template>
  <section class="featured-products bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <div class="featured-inner">
      <div class="section-heading">
        <h2>精选产品</h2>
        <p>来自商品 mock 数据的专业定制系列</p>
      </div>

      <div class="products-grid">
        <article
          v-for="product in featuredProducts"
          :key="product.id"
          class="product-card"
        >
          <button class="product-image" type="button" @click="showQuickView(product)">
            <img
              :src="product.image"
              :data-fallback-src="product.fallbackImage"
              :alt="product.name"
              loading="lazy"
              @error="handleImageError"
            >
            <span v-if="product.isNew" class="product-badge">新品</span>
          </button>

          <div class="product-info">
            <div>
              <span class="product-category">{{ product.category }}</span>
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="product-footer">
              <strong>￥{{ formatPrice(product.price) }}</strong>
              <button type="button" @click="openProduct(product)">查看</button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div
      v-if="selectedProduct"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      @click.self="closeQuickView"
    >
      <div class="modal-panel">
        <button class="modal-close" type="button" aria-label="关闭" @click="closeQuickView">
          ×
        </button>

        <div class="modal-grid">
          <div class="modal-image">
            <img
              :src="selectedProduct.image"
              :data-fallback-src="selectedProduct.fallbackImage"
              :alt="selectedProduct.name"
              @error="handleImageError"
            >
          </div>
          <div class="modal-content">
            <span class="product-category">{{ selectedProduct.category }}</span>
            <h3>{{ selectedProduct.name }}</h3>
            <p>{{ selectedProduct.description }}</p>
            <strong>￥{{ formatPrice(selectedProduct.price) }}</strong>
            <button type="button" @click="openProduct(selectedProduct)">查看商品详情</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { publicPath } from '../../utils/publicPath';
import { handleProductImageError, resolveProductImageUrl } from '../../utils/productImages';

const imagePrefix = publicPath(import.meta.env.VITE_CLOTH_PREX || '/images/clothes/');
const defaultImage = publicPath('/images/assets/placeholder.png');

const getProductImageUrl = (image) => {
  return resolveProductImageUrl(image, { prefix: imagePrefix, defaultImage });
};

const getProductImageFallbackUrl = (image) => {
  return resolveProductImageUrl(image, { prefix: imagePrefix, defaultImage, preferCompressed: false });
};

const featuredSlots = [
  {
    label: '篮球服',
    match: (item) => item.sportType === 'basketball',
  },
  {
    label: '足球服',
    match: (item) => item.sportType === 'football',
  },
  {
    label: '团队服饰',
    match: (item) => item.sportType === 'polo',
  },
  {
    label: 'T-shirt',
    match: (item) => ['t_shirt', 't-shirt'].includes(item.sportType),
  },
];

export default {
  name: 'FeaturedProducts',
  data() {
    return {
      featuredProducts: [],
      selectedProduct: null,
    };
  },
  mounted() {
    this.fetchFeaturedProducts();
  },
  methods: {
    async fetchFeaturedProducts() {
      try {
        const response = await fetch(publicPath('/dataset/mockdata.json'));
        const data = await response.json();

        this.featuredProducts = featuredSlots
          .map((slot, index) => {
            const item = data.find(slot.match);
            if (!item) return null;

            return {
          id: item.id,
          name: item.name,
          category: slot.label,
          price: item.price,
          isNew: index < 2,
          image: getProductImageUrl(item.pictures?.[0]),
          fallbackImage: getProductImageFallbackUrl(item.pictures?.[0]),
          description: item.description || '支持队名、号码、颜色和图案定制。',
            };
          })
          .filter(Boolean);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    },
    showQuickView(product) {
      this.selectedProduct = product;
    },
    closeQuickView() {
      this.selectedProduct = null;
    },
    openProduct(product) {
      this.$router.push(`/product/${product.id}`);
    },
    formatPrice(value) {
      return Number(value || 0).toFixed(1);
    },
    handleImageError(event) {
      handleProductImageError(event, defaultImage);
    },
  },
};
</script>

<style scoped>
.featured-products {
  padding: 4rem 0;
}

.featured-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-heading {
  margin-bottom: 3rem;
  text-align: center;
}

.section-heading h2 {
  color: #111827;
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
}

.section-heading p {
  color: #4b5563;
  margin-top: 0.75rem;
}

.products-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.product-card {
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  transform: translateY(-3px);
}

.product-image {
  aspect-ratio: 3 / 4;
  background: #f1f5f9;
  border: 0;
  cursor: pointer;
  display: block;
  overflow: hidden;
  padding: 0;
  position: relative;
  width: 100%;
}

.product-image img {
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  width: 100%;
}

.product-card:hover .product-image img {
  transform: scale(1.04);
}

.product-badge {
  background: #4f46e5;
  border-radius: 4px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  left: 1rem;
  padding: 0.3rem 0.65rem;
  position: absolute;
  top: 1rem;
}

.product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1rem;
}

.product-category {
  color: #64748b;
  display: block;
  font-size: 0.82rem;
  margin-bottom: 0.45rem;
}

.product-info h3,
.modal-content h3 {
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.45;
  margin: 0;
}

.product-info p,
.modal-content p {
  color: #64748b;
  display: -webkit-box;
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0.65rem 0 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.product-footer strong,
.modal-content strong {
  color: #4f46e5;
  font-size: 1.25rem;
}

.product-footer button,
.modal-content button {
  background: #111827;
  border: 0;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  padding: 0.65rem 1rem;
}

.modal-backdrop {
  align-items: center;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 50;
}

.modal-panel {
  background: #fff;
  border-radius: 8px;
  max-width: 42rem;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.modal-close {
  background: rgba(15, 23, 42, 0.85);
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-size: 1.25rem;
  height: 2rem;
  line-height: 1;
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  width: 2rem;
  z-index: 1;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr;
}

.modal-image {
  aspect-ratio: 3 / 4;
  background: #f1f5f9;
}

.modal-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.modal-content {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

:global(.dark) .section-heading h2,
:global(.dark) .product-info h3,
:global(.dark) .modal-content h3 {
  color: #f8fafc;
}

:global(.dark) .product-card,
:global(.dark) .modal-panel {
  background: #1f2937;
  border-color: #374151;
}

:global(.dark) .section-heading p,
:global(.dark) .product-category,
:global(.dark) .product-info p,
:global(.dark) .modal-content p {
  color: #cbd5e1;
}

@media (min-width: 640px) {
  .featured-inner {
    padding: 0 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .featured-inner {
    padding: 0 2rem;
  }

  .products-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .modal-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
