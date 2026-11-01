<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 text-gray-800 dark:text-gray-100">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 面包屑导航 -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 dark:text-gray-400 hover:text-primary">首页</router-link>
          </li>
          <li class="text-gray-500">/</li>
          <li>
            <router-link to="/products" class="text-gray-500 dark:text-gray-400 hover:text-primary">产品列表</router-link>
          </li>
          <li class="text-gray-500">/</li>
          <li class="text-primary truncate max-w-[180px] sm:max-w-xs" :title="product.name">
            {{ truncateText(product.name, 24) }}
          </li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- 左侧产品图片 -->
        <div class="space-y-4">
          <!-- 主图轮播 -->
          <div class="relative h-[500px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <!-- 主图片 -->
            <transition-group name="fade">
              <img 
                v-for="(image, index) in product.pictures" 
                :key="image"
                v-show="currentImageIndex === index"
                :src="getProductImageUrl(image)"
                :data-fallback-src="getProductImageFallbackUrl(image)"
                :alt="product.name"
                class="absolute inset-0 w-full h-full object-contain cursor-zoom-in"
                title="点击放大查看"
                @click="openImagePreview(index)"
                @error="handleImageError">
            </transition-group>
            
            <!-- 轮播控制按钮 -->
            <button 
              v-if="product.pictures?.length > 1"
              @click="prevImage"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="product.pictures?.length > 1"
              @click="nextImage"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- 轮播指示器 -->
            <div v-if="product.pictures?.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              <button 
                v-for="(_, index) in product.pictures"
                :key="index"
                @click="currentImageIndex = index"
                class="w-2 h-2 rounded-full transition-colors duration-300"
                :class="currentImageIndex === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'">
              </button>
            </div>
          </div>

          <!-- 缩略图列表 -->
          <div v-if="product.pictures?.length > 1" class="flex justify-center gap-2 overflow-x-auto py-2">
            <button 
              v-for="(image, index) in product.pictures" 
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors duration-300"
              :class="currentImageIndex === index ? 'border-primary' : 'border-transparent dark:border-gray-700'">
              <img 
                :src="getProductImageUrl(image)"
                :data-fallback-src="getProductImageFallbackUrl(image)"
                :alt="product.name" 
                class="w-full h-full object-cover"
                @error="handleImageError">
            </button>
          </div>
        </div>

        <!-- 右侧产品信息 -->
        <div class="space-y-6">
          <h1
            class="text-3xl font-bold text-gray-900 dark:text-gray-100 break-words"
            :title="product.name"
          >
            {{ truncateText(product.name, 48) }}
          </h1>
          
          <!-- 价格信息 -->
          <div class="space-y-2">
            <div class="flex items-baseline">
              <span class="text-2xl font-semibold text-primary">￥{{ product.price }}</span>
            </div>
            <!-- 批发价格表 -->
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <div v-for="[range, price] in product.priceList" :key="range" class="flex justify-between">
                <span>{{ formatPriceRange(range) }}件</span>
                <span>￥{{ price }}/件</span>
              </div>
            </div>
          </div>

          <!-- 尺码选择 -->
          <div>
            <div class="mb-4 flex items-center justify-between gap-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">选择尺码</h3>
              <button
                type="button"
                class="text-sm font-medium text-primary hover:text-secondary transition-colors duration-300"
                @click="openSizeChart"
              >
                查看尺码表
              </button>
            </div>
            <div class="grid grid-cols-4 gap-4">
              <button 
                v-for="size in sizes" 
                :key="size"
                @click="selectedSize = size"
                class="py-2 px-4 border rounded-md text-center transition-colors duration-300"
                :class="selectedSize === size ? 'border-primary text-primary' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary'">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-4">
            <button 
              @click="handleCustomize"
              class="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md transition-colors duration-300">
              开始定制
            </button>
            <button 
              @click="addToCart"
              :disabled="!selectedSize"
              class="flex-1 bg-secondary hover:bg-secondary-dark disabled:bg-gray-300 text-white py-3 px-6 rounded-md transition-colors duration-300">
              加入购物车
            </button>
          </div>

          <!-- 产品描述 -->
          <div class="prose prose-sm mt-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">产品描述</h3>
            <p class="text-gray-500 dark:text-gray-300">{{ product.description || '暂无描述' }}</p>
          </div>

          <!-- 产品特点 -->
          <div class="border-t dark:border-gray-700 pt-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">产品特点</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-500 dark:text-gray-300">
              <li v-for="feature in productFeatures" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 尺码表 -->
    <teleport to="body">
      <div
        v-if="isSizeChartOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click="closeSizeChart"
      >
        <div
          class="w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-lg bg-white text-gray-800 shadow-2xl dark:bg-gray-800 dark:text-gray-100"
          @click.stop
        >
          <div class="flex items-start justify-between gap-4 border-b border-gray-200 p-5 dark:border-gray-700">
            <div>
              <h2 class="text-xl font-semibold">尺码表</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">单位：{{ activeSizeChart.unit || 'cm' }}</p>
            </div>
            <button
              type="button"
              class="rounded-full p-2 text-gray-500 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="关闭尺码表"
              @click="closeSizeChart"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto p-5">
            <div
              v-if="sizeChartSections.length > 1"
              class="mb-4 inline-flex rounded-md border border-gray-200 p-1 dark:border-gray-700"
            >
              <button
                v-for="section in sizeChartSections"
                :key="section.key"
                type="button"
                class="rounded px-4 py-2 text-sm font-medium transition-colors duration-300"
                :class="activeSizeChartSection === section.key ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary dark:text-gray-300'"
                @click="activeSizeChartSection = section.key"
              >
                {{ section.label }}
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                <thead>
                  <tr class="bg-gray-100 text-left dark:bg-gray-700">
                    <th
                      v-for="column in activeSizeChartColumns"
                      :key="column"
                      class="whitespace-nowrap border border-gray-200 px-4 py-3 font-medium dark:border-gray-600"
                    >
                      {{ sizeChartLabels[column] || column }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in activeSizeChartRows"
                    :key="row.size"
                    class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                  >
                    <td
                      v-for="column in activeSizeChartColumns"
                      :key="`${row.size}-${column}`"
                      class="whitespace-nowrap border border-gray-200 px-4 py-3 dark:border-gray-600"
                    >
                      {{ row[column] || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">手工测量可能存在 1-3cm 误差，建议结合版型和穿着偏好选择。</p>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 图片放大预览 -->
    <teleport to="body">
      <div
        v-if="isPreviewOpen"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
        @click="closeImagePreview"
      >
        <button
          type="button"
          class="absolute right-4 top-4 sm:right-6 sm:top-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-300"
          aria-label="关闭图片预览"
          @click.stop="closeImagePreview"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          v-if="product.pictures?.length > 1"
          type="button"
          class="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
          aria-label="上一张图片"
          @click.stop="prevImage"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <img
          :src="previewImageUrl"
          :data-fallback-src="previewImageFallbackUrl"
          :alt="product.name"
          class="max-w-full max-h-full object-contain"
          @click.stop
          @error="handleImageError"
        >

        <button
          v-if="product.pictures?.length > 1"
          type="button"
          class="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
          aria-label="下一张图片"
          @click.stop="nextImage"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          v-if="product.pictures?.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex max-w-[90vw] gap-2 overflow-x-auto px-2 py-1"
          @click.stop
        >
          <button
            v-for="(image, index) in product.pictures"
            :key="`preview-${index}`"
            type="button"
            class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors duration-300"
            :class="currentImageIndex === index ? 'border-primary' : 'border-white/30'"
            @click="currentImageIndex = index"
          >
            <img
              :src="getProductImageUrl(image)"
              :data-fallback-src="getProductImageFallbackUrl(image)"
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            >
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../utils/toast';
import { useCartStore } from '../stores/cartStore';
import { truncateText } from '../utils/text';
import { defaultSizeCharts, sizeChartLabels } from '../configs/sizeCharts';
import { publicPath } from '../utils/publicPath';
import { handleProductImageError, resolveProductImageUrl } from '../utils/productImages';
import { createProductSchema, setSeo } from '../utils/seo';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();

// 默认占位图片
const defaultImage = publicPath('/images/assets/placeholder.png');

// 产品数据
const product = ref({
  id: '',
  name: '',
  price: 0,
  pictures: [],
  description: '',
  features: [],
  priceList: [],
  isComb: false,
  relativeId: 0,
  clothType: '',
  sportType: '',
  sizeChart: null
});

// 轮播相关状态
const currentImageIndex = ref(0);
const autoPlayInterval = ref(null);
const isPreviewOpen = ref(false);
const isSizeChartOpen = ref(false);
const activeSizeChartSection = ref('top');

// 其他状态
const selectedSize = ref('');
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const defaultFeatures = [
  '双面可穿设计',
  '轻量透气面料',
  '专业运动剪裁',
  '防褪色耐洗涤'
];
const productFeatures = computed(() => {
  return product.value.features?.length ? product.value.features : defaultFeatures;
});
const previewImageUrl = computed(() => {
  return getProductImageFallbackUrl(product.value.pictures?.[currentImageIndex.value]);
});
const previewImageFallbackUrl = computed(() => {
  return getProductImageFallbackUrl(product.value.pictures?.[currentImageIndex.value]);
});

const clothTypeAliases = {
  tee: 'tees',
  tees: 'tees',
  tshirt: 'tees',
  't-shirt': 'tees',
  t_shirt: 'tees',
  jersey: 'jersey',
  jerseys: 'jersey',
  shorts: 'shorts',
  suit: 'suit',
  tracksuit: 'suit',
  tracksuits: 'suit'
};

const normalizeClothType = (value) => {
  const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
  return clothTypeAliases[normalized] || normalized;
};

const normalizeSizeChart = (chart) => {
  if (!chart) {
    return null;
  }

  if (Array.isArray(chart)) {
    return { unit: 'cm', top: chart };
  }

  if (Array.isArray(chart.rows)) {
    return { ...chart, top: chart.rows };
  }

  return chart;
};

const activeSizeChart = computed(() => {
  const customChart = normalizeSizeChart(product.value.sizeChart);
  if (customChart?.top?.length || customChart?.bottom?.length) {
    return customChart;
  }

  if (product.value.isComb) {
    return defaultSizeCharts.suit;
  }

  const chartKey = normalizeClothType(product.value.clothType);
  return defaultSizeCharts[chartKey] || defaultSizeCharts.jersey;
});

const sizeChartSections = computed(() => {
  const sections = [];

  if (activeSizeChart.value.top?.length) {
    sections.push({ key: 'top', label: '上衣', rows: activeSizeChart.value.top });
  }

  if (activeSizeChart.value.bottom?.length) {
    sections.push({ key: 'bottom', label: '裤子', rows: activeSizeChart.value.bottom });
  }

  return sections;
});

const activeSizeChartRows = computed(() => {
  return sizeChartSections.value.find(section => section.key === activeSizeChartSection.value)?.rows
    || sizeChartSections.value[0]?.rows
    || [];
});

const activeSizeChartColumns = computed(() => {
  const preferredOrder = ['size', 'chest', 'length', 'shoulder', 'sleeve', 'waist', 'hip', 'outseam', 'height', 'weight'];
  const rowKeys = new Set(activeSizeChartRows.value.flatMap(row => Object.keys(row)));
  const orderedKeys = preferredOrder.filter(key => rowKeys.has(key));
  const extraKeys = [...rowKeys].filter(key => !preferredOrder.includes(key));

  return [...orderedKeys, ...extraKeys];
});

const getProductImageUrl = (image) => {
  return resolveProductImageUrl(image, { defaultImage });
};

const getProductImageFallbackUrl = (image) => {
  return resolveProductImageUrl(image, { defaultImage, preferCompressed: false });
};

// 格式化价格区间
const formatPriceRange = (range) => {
  const [min, max] = range.split('-');
  return max ? `${min}-${max}` : `${min}+`;
};

// 图片加载错误处理
const handleImageError = (e) => {
  handleProductImageError(e, defaultImage);
};

// 轮播控制方法
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.pictures.length;
};

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? product.value.pictures.length - 1 
    : currentImageIndex.value - 1;
};

const openImagePreview = (index = currentImageIndex.value) => {
  currentImageIndex.value = index;
  isPreviewOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeImagePreview = () => {
  isPreviewOpen.value = false;
  document.body.style.overflow = '';
};

const openSizeChart = () => {
  activeSizeChartSection.value = sizeChartSections.value[0]?.key || 'top';
  isSizeChartOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeSizeChart = () => {
  isSizeChartOpen.value = false;
  document.body.style.overflow = '';
};

const handlePreviewKeydown = (event) => {
  if (event.key === 'Escape' && isSizeChartOpen.value) {
    closeSizeChart();
    return;
  }

  if (!isPreviewOpen.value) return;

  if (event.key === 'Escape') {
    closeImagePreview();
  } else if (event.key === 'ArrowLeft' && product.value.pictures?.length > 1) {
    prevImage();
  } else if (event.key === 'ArrowRight' && product.value.pictures?.length > 1) {
    nextImage();
  }
};

// 处理定制按钮点击
const handleCustomize = () => {
  const id = product.value.id || route.params.id || 'default';

  router.push({
    name: 'Design',
    params: { 
      productId: id
    }
  });
};

// 处理加入购物车
const addToCart = () => {
  if (!selectedSize.value) {
    toast.warning('请选择尺码');
    return;
  }

  // 添加到购物车
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    size: selectedSize.value,
    quantity: 1,
    image: getProductImageUrl(product.value.pictures[0])
  });

  toast.success('已添加到购物车');
};

// 获取产品数据
const fetchProduct = async () => {
  try {
    const response = await fetch(publicPath('/dataset/mockdata.json'));
    const data = await response.json();
    const productId = Number(route.params.id);
    const productData = data.find(item => item.id === productId);
    
    if (productData) {
      product.value = productData;
      activeSizeChartSection.value = sizeChartSections.value[0]?.key || 'top';
      setSeo({
        title: `${productData.name} - 在线定制与3D预览 | MoMoFit`,
        description: productData.description,
        path: `/product/${productData.id}`,
        image: productData.pictures?.[0] ? `/images/clothes/${String(productData.pictures[0]).replace(/^\//, '')}` : undefined,
        type: 'product',
        schema: createProductSchema(productData),
      });
    } else {
      setSeo({
        title: '商品未找到 - MoMoFit',
        description: '该定制球衣款式暂时无法查看，请返回款式列表选择其他商品。',
        path: '/products',
        noindex: true,
      });
      toast.error('产品不存在');
      router.push('/products');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('获取产品数据失败');
  }
};

onMounted(() => {
  fetchProduct();
  window.addEventListener('keydown', handlePreviewKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handlePreviewKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
