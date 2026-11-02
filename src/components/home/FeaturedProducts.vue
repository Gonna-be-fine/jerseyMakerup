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
.featured-products { padding: 18px 0 68px; background: transparent; }
.featured-inner { width: min(1440px, calc(100% - 64px)); margin: 0 auto; padding: 0; box-sizing: border-box; }
.section-heading { position: relative; margin-bottom: 24px; text-align: left; }
.section-heading::before { content: ' /  FEATURED PRODUCTS'; display: block; margin-bottom: 7px; color: #9aa4b8; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
.section-heading h2 { color: #17243e; font-size: clamp(25px,2.4vw,32px); font-weight: 900; line-height: 1.2; letter-spacing: -.035em; }
.section-heading p { color: #758198; margin-top: 6px; font-size: 13px; }
.products-grid { display: grid; gap: 18px; grid-template-columns: repeat(4,minmax(0,1fr)); }
.product-card { background: rgba(255,255,255,.88); border: 1px solid rgba(225,231,244,.9); border-radius: 19px; box-shadow: 0 8px 25px rgba(34,54,100,.055); display: flex; flex-direction: column; min-width: 0; overflow: hidden; transition: box-shadow .25s ease,transform .25s ease; }
.product-card:hover { box-shadow: 0 16px 34px rgba(34,54,100,.12); transform: translateY(-4px); }
.product-image { aspect-ratio: 1.22 / 1; background: linear-gradient(145deg,#f8f9ff,#edf2fc); border: 0; cursor: pointer; display: block; overflow: hidden; padding: 12px; position: relative; width: 100%; }
.product-image img { height: 100%; object-fit: contain; transition: transform .35s ease; width: 100%; }
.product-card:hover .product-image img { transform: scale(1.045); }
.product-badge { position: absolute; top: 12px; left: 12px; background: #6558ef; border-radius: 999px; color: #fff; font-size: 10px; font-weight: 800; padding: 5px 9px; }
.product-info { display: flex; flex: 1; flex-direction: column; justify-content: space-between; gap: 15px; padding: 15px 16px 17px; }
.product-category { color: #8b96ac; display: block; font-size: 11px; margin-bottom: 5px; }
.product-info h3,.modal-content h3 { color: #1b2944; font-size: 14px; font-weight: 850; line-height: 1.45; margin: 0; }
.product-info p,.modal-content p { color: #7a859a; display: -webkit-box; font-size: 11px; line-height: 1.65; margin: 6px 0 0; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.product-footer { align-items: center; display: flex; justify-content: space-between; gap: 1rem; }
.product-footer strong,.modal-content strong { color: #5e52ed; font-size: 16px; }
.product-footer button,.modal-content button { background: #f0efff; border: 0; border-radius: 999px; color: #5c50e9; cursor: pointer; font-size: 11px; font-weight: 800; padding: 8px 14px; }
.modal-backdrop { align-items: center; background: rgba(15,23,42,.55); display: flex; inset: 0; justify-content: center; padding: 20px; position: fixed; z-index: 10000; }
.modal-panel { background: #fff; border-radius: 20px; max-width: 760px; padding: 24px; position: relative; width: 100%; }
.modal-close { position: absolute; right: 14px; top: 10px; border: 0; background: transparent; color: #64748b; cursor: pointer; font-size: 28px; }
.modal-grid { display: grid; gap: 24px; grid-template-columns: 1fr 1fr; align-items: center; }
.modal-image img { width: 100%; border-radius: 14px; }
.modal-content { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
@media(max-width:1000px) { .products-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media(max-width:720px) { .featured-inner { width: calc(100% - 36px); } }\n@media(max-width:560px) { .products-grid { gap: 12px; } .product-info { padding: 12px; } .modal-grid { grid-template-columns: 1fr; } }
</style>
