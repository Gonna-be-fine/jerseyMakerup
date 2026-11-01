<template>
  <div class="space-y-5">
    <!-- Header Area -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
      <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'shapes']" class="text-indigo-500" />
        <span>版型样式选择</span>
      </h3>
    </div>

    <!-- Styles Grid Selection -->
    <div class="grid grid-cols-2 gap-4 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
      <div v-for="style in jerseyStyles" :key="style.name"
        class="rounded-xl p-2 cursor-pointer border border-transparent hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-950/60 transition-all duration-200 flex flex-col items-center shadow-sm hover:shadow"
        :class="{ 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-600/10 dark:border-indigo-505 text-indigo-600 dark:text-indigo-400 font-bold': selectedStyle.name === style.name }" @click="() => selectStyle(style)">
        <img :src="style.image" :alt="style.name" class="w-full h-24 object-contain rounded-lg mb-2 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-1" />
        <p class="text-[11px] text-slate-600 dark:text-slate-300 transition-colors text-center font-semibold tracking-wide">{{ style.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  jerseyStyles: Array,
  selectedStyle: Object,
});
const emit = defineEmits();

const selectStyle = (style) => {
  emit('selectStyle', style);
};
</script>

<style scoped>
</style>