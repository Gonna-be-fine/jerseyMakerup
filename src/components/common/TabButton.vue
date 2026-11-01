<template>
  <div 
    @click="onClick" 
    :class="[
      'p-1.5 sm:p-2.5 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 shadow-sm border select-none shrink-0',
      active 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/15' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
    ]"
    :title="title"
  >
    <font-awesome-icon 
      :icon="icon" 
      :class="[active ? 'text-white scale-110' : 'text-slate-500 dark:text-slate-400', 'text-xs sm:text-sm mb-0.5 sm:mb-1 transition-transform duration-200']" 
    />
    <span 
      :class="[active ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-300', 'text-[9px] sm:text-[11px] font-medium tracking-wide leading-none text-center']"
    >
      {{ type }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>

<style scoped>
</style> 
