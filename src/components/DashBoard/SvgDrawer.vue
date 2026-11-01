<template>
  <div v-if="isOpen" class="fixed inset-0 z-[20000] flex justify-end">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      @click="onClose"
    ></div>

    <!-- Drawer -->
    <aside class="relative w-full md:w-[800px] h-full bg-white shadow-2xl flex flex-col animate-slide-in">

      <!-- Header -->
      <div class="flex flex-col border-b border-gray-100 bg-white z-10">
        <div class="flex items-center justify-between p-4 pb-2">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Library</h2>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ isInitialLoading ? "Loading assets..." : `${totalItems} assets found` }}
            </p>
          </div>
          <button
            @click="onClose"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search -->
        <div class="px-4 pb-4">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              type="text"
              placeholder="Search icons, shapes..."
              v-model="searchQuery"
              :disabled="isInitialLoading"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- Main -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">

        <!-- Category Sidebar -->
        <nav class="w-full md:w-56 flex-shrink-0 bg-gray-50/80 border-b md:border-b-0 md:border-r border-gray-100 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto h-[60px] md:h-full">
          <div class="flex md:flex-col p-2 md:p-3 gap-1 md:gap-1.5 min-w-max md:min-w-0 w-full">

            <div class="hidden md:block px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Categories
            </div>

            <!-- Skeleton -->
            <template v-if="isInitialLoading">
              <div
                v-for="i in 8"
                :key="i"
                class="h-9 w-full bg-gray-200/50 rounded-lg animate-pulse mb-1 hidden md:block"
              ></div>
            </template>

            <template v-else>
              <button
                v-for="cat in computedCategories"
                :key="cat"
                @click="selectedCategory = cat"
                class="group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-medium'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'"
              >
                <span>{{ cat }}</span>
                <span
                  class="hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded-full bg-opacity-20"
                  :class="selectedCategory === cat ? 'bg-white text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-100'"
                >
                  {{ cat === 'All' ? totalItems : getCategoryCount(cat) }}
                </span>
              </button>
            </template>

          </div>
        </nav>

        <!-- Grid -->
        <div
          ref="scrollContainer"
          class="flex-1 min-w-0 min-h-0 overflow-y-auto bg-white p-4 md:p-6"
        >

          <!-- Loading skeleton -->
          <div
            v-if="isInitialLoading"
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
          >
            <div
              v-for="i in 24"
              :key="i"
              class="aspect-square bg-gray-100 rounded-xl animate-pulse"
            ></div>
          </div>

          <!-- Results -->
          <div
            v-else-if="displayedItems.length"
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
          >
          <div
            v-for="item in displayedItems"
            :key="item.id"
            @click="onSelect(item)"
            class="group relative aspect-square flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div
              v-if="item.svgContent"
              class="svg-preview w-10 h-10 shrink-0 mb-2 text-gray-600 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
              v-html="item.svgContent"
            ></div>
            <img
              v-else
              :src="item.svgUrl || item.pngUrl"
              :alt="item.name"
              loading="lazy"
              class="w-10 h-10 shrink-0 mb-2 text-gray-600 transition-transform duration-300 group-hover:scale-110 object-contain"
            />
            <span class="text-[10px] text-gray-400 font-medium truncate w-full text-center group-hover:text-blue-600 transition-colors">
              {{ item.name }}
            </span>
          </div>
          </div>

          <!-- Empty -->
          <div
            v-else
            class="flex flex-col items-center justify-center h-64 text-center"
          >
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-gray-900 font-medium">No assets found</h3>
            <p class="text-gray-500 text-sm mt-1">Try adjusting your search or category.</p>
            <button
              @click="clearFilters"
              class="mt-4 text-blue-600 text-sm font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>

          <!-- Infinite scroll trigger -->
          <div
            v-if="!isInitialLoading && items.length < totalItems && !isLoadingMore"
            ref="loadingTrigger"
            class="py-8 flex justify-center w-full"
          >
          </div>
          
          <!-- Loading more indicator -->
          <div
            v-if="isLoadingMore"
            class="py-8 flex justify-center w-full"
          >
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-b-blue-600"></div>
          </div>

          <div class="h-10"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 text-center">
        Click an asset to insert it into your canvas
      </div>

    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { get } from '../../utils/request'

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
  onSelect: Function,
})

const PAGE_SIZE = 24
const resourceBaseUrl = import.meta.env.VITE_RESOURCE_URL || 'http://localhost:3000'

// data
const items = ref([])
const categories = ref([])
const isInitialLoading = ref(true)
const selectedCategory = ref("All")
const searchQuery = ref("")
const visibleCount = ref(PAGE_SIZE)
const totalItems = ref(0)
const currentPage = ref(1)
const isLoadingMore = ref(false)

// refs
const scrollContainer = ref(null)
const loadingTrigger = ref(null)

// API 基础 URL
const API_BASE = '/resources'

// 加载类别
async function loadCategories() {
  try {
    const data = await get(`${API_BASE}/categories`)
    console.log(data)
    categories.value = data
  } catch (error) {
    console.error('加载类别失败:', error)
  }
}

// 加载资源
async function loadResources(append = false) {
  try {
    if (!append) {
      isInitialLoading.value = true
      currentPage.value = 1
      items.value = []
    } else {
      isLoadingMore.value = true
    }

    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: PAGE_SIZE.toString(),
    })

    if (selectedCategory.value !== 'All') {
      params.append('category', selectedCategory.value)
    }

    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }

    const data = await get(`${API_BASE}?${params}`)

    const formattedItems = data.items.map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category.name,
      svgContent: item.svgContent,
      svgUrl: `${resourceBaseUrl}/resources/${item.relativePath}`,
      pngUrl: item.hasPng ? `${resourceBaseUrl}/resources/${item.relativePath.replace('.svg', '.png')}` : null,
    }))

    if (append) {
      items.value.push(...formattedItems)
    } else {
      items.value = formattedItems
    }

    totalItems.value = data.total
  } catch (error) {
    console.error('加载资源失败:', error)
  } finally {
    isInitialLoading.value = false
    isLoadingMore.value = false
  }
}

// 初始加载
onMounted(async () => {
  await loadCategories()
  await loadResources()
})

// computed categories
const computedCategories = computed(() => {
  const categoryNames = categories.value.map(c => c.name)
  return ["All", ...categoryNames.sort()]
})

// 获取类别数量
function getCategoryCount(categoryName) {
  if (categoryName === 'All') {
    return totalItems.value
  }
  const category = categories.value.find(c => c.name === categoryName)
  return category ? category.resourceCount : 0
}

// displayed items (for infinite scroll)
const displayedItems = computed(() => items.value)

// reset pagination when filters change
watch([selectedCategory, searchQuery], () => {
  loadResources()
})

// infinite scroll
let observer = null
watch(loadingTrigger, () => {
  if (!loadingTrigger.value) return
  if (observer) observer.disconnect()

  if (isInitialLoading.value || isLoadingMore.value) return

  observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && items.value.length < totalItems.value) {
        loadMoreItems()
      }
    },
    { root: scrollContainer.value, threshold: 0.1, rootMargin: "200px" }
  )
  observer.observe(loadingTrigger.value)
})

// load more items
async function loadMoreItems() {
  if (isLoadingMore.value || items.value.length >= totalItems.value) return
  
  currentPage.value++
  await loadResources(true)
}

// clear all
const clearFilters = () => {
  selectedCategory.value = "All"
  searchQuery.value = ""
  loadResources()
}
</script>

<style>
@keyframes slide-in {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.animate-slide-in {
  animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.svg-preview svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
