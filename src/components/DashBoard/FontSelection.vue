<template>
  <div class="relative inline-block text-left w-full ">
    <!-- Font Dropdown Button -->
    <button
      @click="toggleFontDropdown"
      type="button"
      class="outline-none bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 text-slate-800 dark:text-slate-100 inline-flex justify-between items-center w-full rounded-lg px-4 py-2 transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      ref="fontButton"
      aria-haspopup="true"
      :aria-expanded="isFontDropdownOpen ? 'true' : 'false'"
    >
      <span
        class="truncate text-slate-700 dark:text-slate-200 text-xs font-semibold"
      >
        {{ selectedFont && selectedFont.type ? selectedFont.type : '' }}
      </span>
      <svg
        class="-mr-1 ml-2 h-4 w-4 transform transition-transform duration-200 text-slate-400 dark:text-slate-550"
        :class="{ 'rotate-180': isFontDropdownOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Font Dropdown Menu -->
    <teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isFontDropdownOpen"
          class="absolute z-50 mt-2 w-full sm:w-60 rounded-xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 scrollbar-thin overflow-hidden animate-fade-in"
          :style="dropdownStyle"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="font-options-menu"
        >
          <div
            class="py-1 max-h-60 overflow-y-auto"
            role="none"
          >
            <a
              v-for="font in fonts"
              :key="font.type"
              @click="selectFont(font)"
              href="#"
              class="block mx-1.5 my-1 px-3 py-2 rounded-md cursor-pointer transition-all duration-200"
              :class="selectedFont && selectedFont.type === font.type ? 'bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/50' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-750 border border-transparent'"
              role="menuitem"
            >
              <div v-if="font.img" :style="{ background: `url(${font.img}) no-repeat center center / contain`}" class="h-6 bg-white rounded-md px-2 py-1 shadow-sm select-none pointer-events-none" ></div>
              <div v-else class="h-6 text-slate-700 dark:text-slate-100 flex items-center select-none font-medium font-sans text-sm" >{{font.type}}</div>
            </a>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { FontTypeList } from '../../configs';

export default {
  name: 'FontSelection',
  props: {
    currentFont: {
      type: String
    }
  },
  emits: ['font-selected'], // 声明组件可以发出的事件
  setup (props, { emit }) {
    const isFontDropdownOpen = ref(false);
    const fontButton = ref(null); // 使用 ref 获取按钮元素
    const font = FontTypeList.find(v => v.type === props.currentFont)
    const selectedFont = ref(font);
    const dropdownStyle = ref({});

    watch(() => props.currentFont, (newVal) => {
      const matched = FontTypeList.find(v => v.type === newVal);
      selectedFont.value = matched || null;
    }, { immediate: true });


    const fonts = ref(FontTypeList);

    /**
     * Toggles the visibility of the font dropdown menu.
     */
    const toggleFontDropdown = () => {
      isFontDropdownOpen.value = !isFontDropdownOpen.value;
    };

    /**
     * Selects a font from the dropdown and closes the dropdown.
     * Also emits a 'font-selected' event to the parent.
     * @param {Object} font - The selected font object { name: string, value: string }.
     */
    const selectFont = (font) => {
      selectedFont.value = font;
      isFontDropdownOpen.value = false;
      emit('font-selected', selectedFont.value); // 发送选中的字体对象到父组件
    };

    /**
     * Handles clicks outside the dropdown to close it.
     * @param {Event} event - The click event.
     */
    const handleClickOutside = (event) => {
      const componentRoot = fontButton.value.closest('.relative');
      if (isFontDropdownOpen.value && componentRoot && !componentRoot.contains(event.target)) {
        isFontDropdownOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    const updateDropdownPosition = () => {
      const button = fontButton.value;
      if (button) {
        const rect = button.getBoundingClientRect();
        dropdownStyle.value = {
          position: 'absolute',
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
        };
      }
    };

    watch(isFontDropdownOpen, (open) => {
      if (open) {
        nextTick(updateDropdownPosition);
      }
    });

    return {
      isFontDropdownOpen,
      selectedFont,
      fonts,
      toggleFontDropdown,
      selectFont,
      dropdownStyle,
      fontButton
    };
  },
};
</script>

<style scoped>
/* 可选：添加自定义样式 */
.max-h-60 {
  max-height: 15rem;
}
</style>