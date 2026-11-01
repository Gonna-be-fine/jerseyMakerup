<template>
  <section id="best-seller" class="relative overflow-hidden bg-slate-50 py-16 pb-20 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div class="pointer-events-none absolute -left-40 top-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10"></div>
    <div class="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10"></div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section-title title="设计品类 &middot; 赛场美学">
        <template #action>
          <button
            @click="router.push('/products')"
            class="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-600/30 active:scale-95"
          >
            <span>开始自由设计</span>
            <font-awesome-icon :icon="['fas', 'arrow-right']" class="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </template>
      </section-title>

      <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <p class="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          从赛场装备到日常穿搭，选择你的创作方向，把每一份灵感变成专属设计。
        </p>
        <span class="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500 sm:block">
          Find your style · Make it yours
        </span>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
        <article
          v-for="(product, index) in products"
          :key="product.id"
          :id="'category-card-' + product.id"
          @click="openDesignPanel(product)"
          class="group relative isolate min-h-[350px] cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/70 bg-slate-200 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/15 dark:border-white/10 dark:bg-slate-900 dark:hover:shadow-black/40 sm:min-h-[390px]"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          <div class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/5 to-slate-950/90 transition-colors duration-500 group-hover:from-slate-950/30 group-hover:to-slate-950/95"></div>
          <div class="absolute inset-0 ring-1 ring-inset ring-white/10"></div>

          <div class="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
            <span class="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-white/90 backdrop-blur-md">
              COLLECTION
            </span>
            <span class="font-mono text-xs font-semibold tracking-widest text-white/75">
              0{{ index + 1 }}
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-5 sm:p-5">
            <div class="mb-3 h-0.5 w-8 rounded-full bg-indigo-400 transition-all duration-500 group-hover:w-14 group-hover:bg-cyan-300"></div>
            <p class="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-200 sm:text-[10px]">
              {{ product.subtitle }}
            </p>
            <h3 class="mb-2 text-xl font-extrabold tracking-tight text-white sm:text-lg xl:text-xl">
              {{ product.name }}
            </h3>
            <p class="mb-5 line-clamp-2 min-h-[2.75rem] text-xs leading-[1.4rem] text-white/75">
              {{ product.description }}
            </p>

            <div class="flex items-center justify-between border-t border-white/20 pt-3">
              <span class="text-[10px] font-bold tracking-[0.16em] text-white">
                开始定制
              </span>
              <span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-white group-hover:bg-white group-hover:text-slate-900">
                <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-xs" />
              </span>
            </div>
          </div>
        </article>
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
import { useRouter } from 'vue-router'
import { SceneCategories } from '../../configs/clothes'

const router = useRouter()
const products = ref(SceneCategories)
const isDesignPanelOpen = ref(false)

const openDesignPanel = (product) => {
  router.push({
    path: '/products',
    query: {
      design: product.id
    }
  })
}

const handleCategorySelect = (category) => {
  console.log('Selected category:', category)
  isDesignPanelOpen.value = false
}
</script>
