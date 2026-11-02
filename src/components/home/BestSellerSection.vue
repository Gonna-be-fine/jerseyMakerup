<template>
  <section class="category-section">
    <div class="category-inner">
      <div class="category-heading">
        <div>
          <p class="section-eyebrow"><span></span> DESIGN CATEGORIES</p>
          <h2>设计品类 · 赛场美学</h2>
          <p class="section-description">从专业到个性，满足不同场景的设计需求</p>
        </div>
        <button class="category-all" type="button" @click="router.push('/products')">
          开始自由设计 <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>

      <div class="category-grid">
        <button
          v-for="product in products"
          :key="product.id"
          type="button"
          class="category-card"
          :class="'category-' + product.id.toLowerCase()"
          @click="openDesignPanel(product)"
        >
          <div class="category-card-heading">
            <span class="category-icon"><font-awesome-icon :icon="categoryIcon(product.id)" /></span>
            <span class="category-title-wrap">
              <strong>{{ product.name }}</strong>
              <small>{{ categoryTagline(product.id) }}</small>
            </span>
          </div>
          <div class="category-product-image">
            <img :src="product.image" :alt="product.name" loading="lazy">
          </div>
          <span class="category-caption">{{ categoryCaption(product.id) }}</span>
          <span class="category-arrow"><font-awesome-icon :icon="['fas', 'arrow-right']" /></span>
        </button>
      </div>
    </div>
    <design-panel v-model:isOpen="isDesignPanelOpen" @select-category="handleCategorySelect" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import DesignPanel from './DesignPanel.vue'
import { useRouter } from 'vue-router'
import { SceneCategories } from '../../configs/clothes'

const router = useRouter()
const products = ref(SceneCategories)
const isDesignPanelOpen = ref(false)

const categoryIcon = (id) => ({
  Basketball: ['fas', 'basketball'],
  Football: ['fas', 'futbol'],
  Couple: ['fas', 'heart'],
  Team: ['fas', 'users'],
  Person: ['fas', 'palette'],
}[id] || ['fas', 'shirt'])

const categoryTagline = (id) => ({
  Basketball: '热血篮场，尽显锋芒',
  Football: '绿茵场上，为热爱而战',
  Couple: '一份专属，惟有爱',
  Team: '凝聚团队，创造不凡',
  Person: '释放创意，定义风格',
}[id] || '自由创作你的风格')

const categoryCaption = (id) => ({
  Basketball: '设计专属篮球队服',
  Football: '打造你的专属球衣',
  Couple: '定制专属情侣信物',
  Team: '打造团队专属战袍',
  Person: '随心设计，独一无二',
}[id] || '立即开始设计')

const openDesignPanel = (product) => {
  router.push({ path: '/products', query: { design: product.id } })
}
const handleCategorySelect = () => { isDesignPanelOpen.value = false }
</script>

<style scoped>
.category-section {
  position: relative;
  padding: 34px 0 54px;
  background: transparent;
}
.category-inner { width: min(1440px, calc(100% - 64px)); margin: 0 auto; }
.category-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 26px; }
.section-eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 8px; color: #9aa4b8; font-size: 11px; font-weight: 800; letter-spacing: .13em; }
.section-eyebrow span { width: 3px; height: 13px; background: #6758f4; border-radius: 4px; transform: skew(-20deg); }
.category-heading h2 { margin: 0; color: #17243e; font-size: clamp(25px, 2.4vw, 32px); font-weight: 900; letter-spacing: -.035em; }
.section-description { margin: 7px 0 0; color: #758198; font-size: 14px; }
.category-all { display: inline-flex; align-items: center; gap: 10px; flex: 0 0 auto; padding: 11px 22px; border: 0; border-radius: 999px; background: #5d50ef; color: #fff; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 20px rgba(93,80,239,.2); }
.category-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px; }
.category-card { position: relative; display: flex; flex-direction: column; min-width: 0; height: 320px; padding: 0; border: 0; border-radius: 0; overflow: visible; text-align: left; cursor: pointer; color: #17243e; background: transparent; box-shadow: none; transition: transform .25s ease; }
.category-card:hover { transform: translateY(-4px); box-shadow: none; }





.category-card-heading { display: flex; align-items: center; gap: 11px; position: relative; z-index: 2; }
.category-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; border-radius: 50%; background: rgba(255,255,255,.72); color: #293a63; box-shadow: 0 4px 12px rgba(47,66,116,.08); font-size: 17px; }
.category-title-wrap { display: flex; flex-direction: column; min-width: 0; }
.category-title-wrap strong { font-size: 15px; font-weight: 900; line-height: 1.3; }
.category-title-wrap small { margin-top: 3px; color: #738097; font-size: 10px; font-weight: 600; white-space: nowrap; }
.category-product-image { position: absolute; inset: 68px 0 0; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 20px; background: transparent; }
.category-product-image img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: inherit; transition: transform .4s ease; }
.category-card:hover .category-product-image img { transform: scale(1.035); }
.category-caption { position: absolute; left: 14px; bottom: 13px; z-index: 2; color: #1d2942; font-size: 11px; font-weight: 900; text-shadow: 0 1px 8px rgba(255,255,255,.85); }
.category-arrow { position: absolute; right: 12px; bottom: 7px; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; color: #263451; background: rgba(255,255,255,.88); box-shadow: 0 4px 12px rgba(35,54,94,.08); transition: transform .25s ease; }
.category-card:hover .category-arrow { transform: translateX(3px); }
@media (max-width: 1100px) { .category-grid { grid-template-columns: repeat(3,minmax(0,1fr)); } }
@media (max-width: 720px) {
  .category-inner { width: calc(100% - 36px); }
  .category-heading { align-items: flex-start; flex-direction: column; }
  .category-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .category-card { height: 285px; padding: 0; border-radius: 0; }
  .category-title-wrap strong { font-size: 13px; }
  .category-title-wrap small { font-size: 9px; }
  .category-icon { width: 31px; height: 31px; flex-basis: 31px; font-size: 14px; }
  .category-product-image { inset: 62px 0 0; border-radius: 16px; }
  .category-caption { left: 12px; font-size: 10px; }
}
@media (max-width: 390px) { .category-grid { grid-template-columns: 1fr; } .category-card { height: 280px; } }
</style>