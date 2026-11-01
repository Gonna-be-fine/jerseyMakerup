<template>
  <div class="space-y-5">
    <!-- Header Area -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
      <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'palette']" class="text-indigo-500" />
        <span>服饰配色调整</span>
      </h3>
    </div>

    <!-- Parts Color Selector -->
    <div class="space-y-4">
      <div 
        v-for="(part, index) in jerseyParts" 
        :key="index" 
        class="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 shadow-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-750"
      >
        <span class="text-slate-500 dark:text-slate-400 font-semibold text-[11px] tracking-wide block mb-3">
          {{ part.name }} 色块
        </span>
        <div class="flex flex-wrap gap-2.5">
          <button 
            v-for="color in colors" 
            :key="color" 
            @click="() => setColor(index, color)"
            :class="[
              'w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 transition-all duration-250 cursor-pointer hover:scale-110 active:scale-95',
              part.color === color
                ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 scale-105 shadow-md' 
                : 'hover:shadow-sm'
            ]"
            :style="{ backgroundColor: color }"
            :title="color"
          ></button>
          <label
            class="relative w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-all duration-250 cursor-pointer hover:scale-110 hover:border-indigo-400 hover:text-indigo-500 active:scale-95 flex items-center justify-center overflow-hidden"
            :for="`custom-color-${index}`"
            title="Custom color"
          >
            <font-awesome-icon :icon="['fas', 'plus']" class="text-[10px]" />
            <input
              :id="`custom-color-${index}`"
              class="absolute inset-0 opacity-0 cursor-pointer"
              type="color"
              :value="normalizeColor(part.color)"
              @input="setColor(index, $event.target.value)"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  jerseyParts: Array,
  colors: Array,
});
const emit = defineEmits();

const setColor = (index, color) => {
  emit('setColor', index, color);
};

const normalizeColor = (color) => {
  if (typeof color !== 'string') return '#000000';
  const value = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return '#000000';
};
</script>

<style scoped>
</style>
