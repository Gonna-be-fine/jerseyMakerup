<template>
  <section id="featured-products" class="featured-products bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <div class="featured-inner">
      <div class="section-heading">
        <span class="section-kicker">DESIGN INSPIRATION</span>
        <h2>灵感单品 <span>·</span> 设计示范</h2>
        <p>看看不同款式的设计可能，从一件单品开始打造你的专属风格。</p>
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
  padding: 5.5rem 0;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}
.featured-inner { max-width: 80rem; margin: 0 auto; padding: 0 1rem; }
.section-heading { margin-bottom: 2.8rem; text-align: center; }
.section-kicker { display: inline-block; margin-bottom: .8rem; color: #6366f1; font-size: .65rem; font-weight: 900; letter-spacing: .24em; }
.section-heading h2 { color: #0f172a; font-size: clamp(1.9rem, 4vw, 2.7rem); font-weight: 900; letter-spacing: -.04em; line-height: 1.2; }
.section-heading h2 span { color: #818cf8; }
.section-heading p { color: #64748b; margin-top: .85rem; font-size: .95rem; }
.products-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(1, minmax(0, 1fr)); }
.product-card { background: #fff; border: 1px solid rgba(226,232,240,.85); border-radius: 1.25rem; box-shadow: 0 8px 30px rgba(15,23,42,.045); display: flex; flex-direction: column; min-width: 0; overflow: hidden; transition: box-shadow .3s ease, transform .3s ease, border-color .3s ease; }
.product-card:hover { border-color: rgba(129,140,248,.45); box-shadow: 0 20px 45px rgba(49,46,129,.12); transform: translateY(-6px); }
.product-image { aspect-ratio: 4 / 4.5; background: #e2e8f0; border: 0; cursor: pointer; display: block; overflow: hidden; padding: 0; position: relative; width: 100%; }
.product-image::after { content: ''; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, rgba(15,23,42,.12)); pointer-events: none; }
.product-image img { height: 100%; object-fit: cover; transition: transform .65s cubic-bezier(.2,.7,.2,1); width: 100%; }
.product-card:hover .product-image img { transform: scale(1.07); }
.product-badge { background: #4f46e5; border-radius: 999px; color: #fff; font-size: .68rem; font-weight: 800; left: 1rem; padding: .35rem .7rem; position: absolute; top: 1rem; z-index: 1; }
.product-info { display: flex; flex: 1; flex-direction: column; justify-content: space-between; gap: 1.25rem; padding: 1.15rem 1.2rem 1.25rem; }
.product-category { color: #6366f1; display: block; font-size: .7rem; font-weight: 800; letter-spacing: .08em; margin-bottom: .5rem; }
.product-info h3, .modal-content h3 { color: #0f172a; font-size: 1rem; font-weight: 850; line-height: 1.45; margin: 0; }
.product-info p, .modal-content p { color: #64748b; display: -webkit-box; font-size: .83rem; line-height: 1.7; margin: .55rem 0 0; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.product-footer { align-items: center; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; gap: 1rem; padding-top: 1rem; }
.product-footer strong, .modal-content strong { color: #4f46e5; font-size: 1.15rem; font-weight: 900; }
.product-footer button, .modal-content button { background: #0f172a; border: 0; border-radius: .7rem; color: #fff; cursor: pointer; font-size: .78rem; font-weight: 800; padding: .65rem 1rem; transition: background .2s ease, transform .2s ease; }
.product-footer button:hover, .modal-content button:hover { background: #4f46e5; transform: translateY(-1px); }
.modal-backdrop { align-items: center; background: rgba(15,23,42,.68); backdrop-filter: blur(8px); display: flex; inset: 0; justify-content: center; padding: 1rem; position: fixed; z-index: 50; }
.modal-panel { background: #fff; border-radius: 1.25rem; max-width: 42rem; overflow: hidden; position: relative; width: 100%; }
.modal-close { background: rgba(15,23,42,.85); border: 0; border-radius: 999px; color: #fff; cursor: pointer; font-size: 1.25rem; height: 2rem; line-height: 1; position: absolute; right: .75rem; top: .75rem; width: 2rem; z-index: 1; }
.modal-grid { display: grid; grid-template-columns: 1fr; }
.modal-image { aspect-ratio: 3 / 4; background: #f1f5f9; }
.modal-image img { height: 100%; object-fit: cover; width: 100%; }
.modal-content { display: grid; align-content: center; gap: 1rem; padding: 1.5rem; }
:global(.dark) .featured-products { background: linear-gradient(180deg, #0b1220 0%, #101827 100%); }
:global(.dark) .section-heading h2, :global(.dark) .product-info h3, :global(.dark) .modal-content h3 { color: #f8fafc; }
:global(.dark) .section-heading p, :global(.dark) .product-info p, :global(.dark) .modal-content p { color: #94a3b8; }
:global(.dark) .product-card, :global(.dark) .modal-panel { background: #172033; border-color: #263449; }
:global(.dark) .product-footer { border-color: #263449; }
@media (min-width: 640px) { .featured-inner { padding: 0 1.5rem; } .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .featured-inner { padding: 0 2rem; } .products-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } .modal-grid { grid-template-columns: 1fr 1fr; } }
</style>