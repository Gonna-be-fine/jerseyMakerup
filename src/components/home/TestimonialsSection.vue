<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden">
    <div class="home-content-container">
      <div class="text-center mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">用户真实体验</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-3 font-primary">客户评价</h2>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          听听来自专业运动队、俱乐部与创意设计者们的真实定制体验与反馈
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id" 
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between"
        >
          <div>
            <!-- Header: Avatar & Info -->
            <div class="flex items-center gap-4 mb-5">
              <img 
                :src="testimonial.avatar" 
                :alt="testimonial.name"
                class="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-sm"
              >
              <div class="min-w-0 flex-1">
                <div class="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
                  {{ testimonial.name }}
                </div>
                <router-link 
                  :to="testimonial.productLink" 
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
                >
                  <span>定制款：{{ testimonial.productName }}</span>
                </router-link>
              </div>
              <div class="text-amber-400 text-sm hidden sm:block tracking-widest">
                ★★★★★
              </div>
            </div>

            <!-- Quote Content -->
            <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic relative">
              “{{ testimonial.content }}”
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection',
  data() {
    return {
      testimonials: [
        {
          id: 1,
          name: '张伟 (篮球教练)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
          productName: '排汗速干运动球衣',
          productLink: '/products',
          content: '为我们篮球队定制的队服面料非常好，吸湿排汗性能极佳，比赛时队员们都觉得特别合身舒适。3D预览和实际成衣毫无二致！'
        },
        {
          id: 2,
          name: '李静 (创意工作室创始人)',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150', 
          productName: '重磅定制T恤',
          productLink: '/products',
          content: '衣服设计的细节在3D模型里看得非一清二楚，印出的字样及其细腻，手感极佳。团建时大家都赞不绝口，定制首选！'
        }
      ]
    }
  }
}
</script> 
<style scoped>
.home-content-container {
  width: min(1440px, calc(100% - 64px));
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
@media (max-width: 720px) {
  .home-content-container { width: calc(100% - 36px); }
}
</style>
