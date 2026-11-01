<template>
  <div>
    <!-- 遮罩层 -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="closePanel"
      ></div>
    </transition>

    <!-- 设计面板 -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isOpen"
        class="fixed top-0 right-0 w-full max-w-2xl h-screen bg-white shadow-xl z-50 flex flex-col"
      >
        <!-- 面板头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Design Categories</h2>
          <button 
            @click="closePanel"
            class="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 面板内容 -->
        <div class="flex-1 overflow-y-auto">
          <design-categories 
            :categories="categories"
            @select-category="selectCategory"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import DesignCategories from './DesignCategories.vue'

export default {
  name: 'DesignPanel',
  components: {
    DesignCategories
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: [
        {
          id: 1,
          name: '运动竞技系列 (Sports Collections)',
          subcategories: [
            { id: 11, name: '篮球服饰 (Basketball)', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600' },
            { id: 12, name: '足球服饰 (Football)', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600' },
            { id: 13, name: '棒球服饰 (Baseball)', image: 'https://images.unsplash.com/photo-1544045560-6b9f7a57adb3?auto=format&fit=crop&q=80&w=600' }
          ]
        },
        {
          id: 2,
          name: '日常潮流系列 (Clothing Collections)',
          subcategories: [
            { id: 21, name: '潮流宽版T恤 (T-Shirts)', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600' },
            { id: 22, name: '高街连帽卫衣 (Hoodies)', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' },
            { id: 23, name: '刺绣街头帽款 (Caps)', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600' }
          ]
        }
      ]
    }
  },
  methods: {
    closePanel() {
      this.$emit('update:isOpen', false)
    },
    selectCategory(category) {
      this.$router.push({
        name: 'Design',
        params: { categoryId: category.id }
      })
      this.closePanel()
    }
  }
}
</script> 