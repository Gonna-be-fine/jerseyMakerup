<template>
  <section class="py-16 pb-20 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section-title title="设计品类 &middot; 赛场美学">
        <template #action>
          <button 
            @click="router.push('/products')"
            class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs shadow-md shadow-indigo-600/15 cursor-pointer active:scale-95"
          >
            <span>开始自由设计</span>
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </template>
      </section-title>
      
      <!-- Premium Scenic Category Cards in symmetric 5-column grid -->
      <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="product in products" 
             :key="product.id" 
             @click="openDesignPanel(product)"
             class="group relative h-[384px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 bg-slate-100 dark:bg-slate-900 cursor-pointer border border-slate-150/45 dark:border-slate-800/40"
             :id="'category-card-' + product.id"
        >
          <!-- Adaptive Scenery Image with slow zoom -->
          <div class="absolute inset-0 w-full h-full">
            <img :src="product.image" 
                 :alt="product.name"
                 class="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-[800ms]"
                 loading="lazy"
            >
          </div>

          <!-- Premium Gradient Overlay Scrim for high-contrast reading -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300"></div>

          <!-- Glassmorphic Spec Badge -->
          <div class="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[8.5px] font-extrabold tracking-widest uppercase bg-white/10 dark:bg-slate-950/30 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PRO EDITION</span>
          </div>

          <!-- Content Panel -->
          <div class="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end min-h-[160px]">
            <span class="text-[9.5px] font-black tracking-widest text-indigo-400 dark:text-indigo-350 uppercase select-none mb-1">
              {{ product.subtitle }}
            </span>
            <h3 class="text-base font-black text-white hover:text-indigo-200 transition-colors tracking-tight select-none mb-1.5">
              {{ product.name }}
            </h3>
            
            <p class="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-4 select-none pr-1 opacity-90 group-hover:opacity-100 transition-opacity">
              {{ product.description }}
            </p>

            <div class="pt-2.5 border-t border-white/10 flex items-center justify-between">
              <span class="text-[10.5px] font-bold text-white group-hover:text-indigo-350 transition-colors uppercase tracking-widest flex items-center gap-1">
                立即定制
                <font-awesome-icon :icon="['fas', 'angle-right']" class="text-[10px] transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div class="w-7 h-7 rounded-full bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/25 flex items-center justify-center text-white text-[11px] transform group-hover:rotate-45 duration-500">
                <font-awesome-icon :icon="['fas', 'arrow-right-long']" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <design-panel 
    v-model:isOpen="isDesignPanelOpen"
    @select-category="handleCategorySelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import SectionTitle from './SectionTitle.vue'
import DesignPanel from './DesignPanel.vue'
import { useRouter } from 'vue-router';
import { SceneCategories } from '../../configs/clothes';

const router = useRouter();

// 定义数据
const products = ref(SceneCategories)

const isDesignPanelOpen = ref(false)

// 定义方法
const openDesignPanel = (product) => {
  router.push({
    path: '/products',
    query: { 
      design: product.id // 传递设计类型ID
    }
  });
};

const handleCategorySelect = (category) => {
  console.log('Selected category:', category)
  // 处理分类选择逻辑
  isDesignPanelOpen.value = false
}

// 定义Tailwind的主题颜色
const colors = {
  primary: '#4f46e5',
  secondary: '#06b6d4'
}
</script>
