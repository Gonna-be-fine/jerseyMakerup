<template>
  <div class="p-6">
    <div v-for="category in categories" 
         :key="category.id" 
         class="mb-8"
    >
      <h3 class="text-sm font-extrabold tracking-widest text-slate-400 uppercase mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
        {{ category.name }}
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="subcategory in category.subcategories" 
             :key="subcategory.id"
             class="group cursor-pointer"
             @click="$emit('select-category', subcategory)"
        >
          <div class="relative aspect-[4/3] overflow-hidden rounded-xl mb-2.5 shadow-sm group-hover:shadow border border-slate-100 dark:border-slate-800">
            <img 
              :src="subcategory.image" 
              :alt="subcategory.name"
              class="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            >
            <!-- Overlay and micro transition -->
            <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/35 transition-all duration-300 flex items-end p-3">
              <span class="text-white text-[10px] font-bold tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                点击切换 &rarr;
              </span>
            </div>
          </div>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-605 transition-colors duration-300 pl-1">
            {{ subcategory.name }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignCategories',
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script> 