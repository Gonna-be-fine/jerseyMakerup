<template>
  <div class="space-y-4">
    <!-- <div class="tab-title flex items-center justify-between">
      <p>上传LOGO/SVG</p>
      <input
        type="file"
        @change="uploadLogo"
        accept="image/*"
        class="hidden"
        id="logo-upload"
      />
      <label
        for="logo-upload"
        class="cursor-pointer inline-flex items-center justify-center hover:text-gray-500"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </label>
    </div> -->
    <!-- <div class="flex flex-wrap gap-4 p-2 bg-dark rounded-lg">
      <div
        v-for="(logo, index) in logos"
        :key="logo.id"
        class="relative"
      >
        <img
          :src="logo.url"
          alt="logo"
          class="w-20 h-20 object-contain border rounded"
          @click="() => selectElement(logo.id)"
        />
        <button
          @click="() => removeLogo(index)"
          class="absolute top-1 right-1 bg-red-500 text-red-100 rounded-full shadow-lg w-4 h-4 flex items-center justify-center"
        >
          <font-awesome-icon :icon="['fas', 'circle-minus']" />
        </button>
      </div>
    </div> -->

    <!-- Header / Action Bar -->
    <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <p class="font-bold pl-2 text-xs text-slate-700 dark:text-slate-300">素材/商标图层集</p>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="toggleDefaultLogoVisibility"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors shadow-sm cursor-pointer"
          :class="defaultLogoVisible ? 'text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-950 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'"
          :title="defaultLogoVisible ? 'Hide default logos' : 'Show default logos'"
        >
          <svg
            v-if="defaultLogoVisible"
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.364 0 2.675.267 3.875.755M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c-.9 1.568-2.225 2.944-3.829 4" />
          </svg>
          <svg
            v-else
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18m-7.071-7.071A3 3 0 116.071 6.07m11.314 11.314A9.956 9.956 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.235-3.592M9.878 9.879A3 3 0 0115 12" />
          </svg>
          <span>{{ defaultLogoVisible ? '隐藏默认Logo' : '显示默认Logo' }}</span>
        </button>

        <!-- Hidden File Input -->
        <input
          type="file"
          ref="fileInputRef"
          @change="uploadLogo"
          accept="image/*"
          class="hidden"
          id="logo-upload"
        />

        <!-- Upload Button -->
        <button
          for="logo-upload"
          @click="triggerFileInput"
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm cursor-pointer"
          title="Upload Local File"
        >
          <svg
            class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>本地上传</span>
        </button>

        <!-- Library Button -->
        <button
          type="button"
          @click="isRepoOpen = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer active:scale-95"
          title="Choose from Library"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span>模板库</span>
        </button>
      </div>
    </div>

    <!-- Grid Area: Logos -->
    <div class="flex flex-wrap gap-4 p-4 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 rounded-xl shadow-inner min-h-[160px]">
      <!-- empty state -->
      <div
        v-if="!logos || logos.length === 0"
        class="w-full h-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg"
      >
        <svg
          class="w-8 h-8 mb-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-xs font-semibold">暂无添加的Logo图层</span>
      </div>

      <!-- logos -->
      <div
        v-for="(logo, index) in logos"
        :key="logo.id"
        class="relative group w-24 h-24"
      >
        <!-- Image / SVG container -->
        <div
          class="w-full h-full p-2 border border-slate-250 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 flex items-center justify-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors overflow-hidden"
          :class="editingElement.id === logo.id ? 'border-indigo-500 ring-1 ring-indigo-500' : ''"
          @click="() => selectElement(logo.id)"
        >
          <div
            v-if="isRawSvg(logo.url)"
            class="w-full h-full text-slate-800 dark:text-slate-100"
            v-html="logo.url"
          ></div>
          <img
            v-else-if="logo.url"
            :src="logo.url"
            :alt="logo.name"
            class="w-full h-full object-contain"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
            <font-awesome-icon :icon="['fas', 'shapes']" class="text-2xl" />
          </div>
        </div>

        <label
          v-if="editingElement.id === logo.id && isSvgLogo(logo)"
          class="absolute left-1.5 top-1.5 w-7 h-7 rounded-full border border-white/80 bg-white shadow-md overflow-hidden cursor-pointer"
          title="Change SVG color"
          @click.stop
        >
          <input
            type="color"
            :value="logo.color || '#000000'"
            class="w-9 h-9 -m-1 cursor-pointer"
            @input="(event) => changeLogoColor(logo, event.target.value)"
            @change="flushLogoColorChange"
          />
        </label>

        <label
          v-else-if="isRasterLogo(logo)"
          class="absolute left-1.5 top-1.5 w-7 h-7 rounded-md border border-white/80 bg-white/95 dark:bg-slate-950/95 shadow-md flex items-center justify-center cursor-pointer"
          :class="logo.removeBackground ? 'text-indigo-600 border-indigo-300' : 'text-slate-400 border-slate-200 dark:border-slate-700'"
          title="Remove background"
          @click.stop
        >
          <input
            type="checkbox"
            :checked="Boolean(logo.removeBackground)"
            class="sr-only"
            @change="(event) => toggleLogoBackgroundRemoval(logo, event.target.checked)"
          />
          <svg
            class="w-4 h-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path v-if="logo.removeBackground" stroke-linecap="round" stroke-linejoin="round" d="M4 10.5l3.25 3.25L16 5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M5 10h10" />
          </svg>
        </label>

        <!-- remove button -->
        <button
          @click.stop="() => removeLogo(index)"
          class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
          title="Remove"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>

        <!-- hover label -->
        <div class="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] text-center truncate rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity p-0.5 pointer-events-none">
          {{ logo.name }}
        </div>
      </div>
    </div>

    <!-- Clip logo to a jersey panel -->
    <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <font-awesome-icon :icon="['fas', 'crop']" class="text-indigo-500" />
          <span>裁片剪贴蒙版 (Clip to Panel)</span>
        </label>
        <span v-if="activeLogo" class="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
          已选：{{ activeLogo.id }}
        </span>
        <span v-else class="text-[10px] text-slate-400 dark:text-slate-500">请先选择图案</span>
      </div>

      <p class="text-[11px] text-slate-500 dark:text-slate-400">将所选图案裁切至衣服指定裁片内部，裁切后仍可自由拖动平移与缩放。</p>

      <div class="space-y-1.5">
        <span class="text-[11px] font-medium text-slate-600 dark:text-slate-400">选择剪贴的目标板片：</span>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            @click="onSelectPanel('')"
            :disabled="!activeLogo"
            :class="[
              'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center justify-between border cursor-pointer',
              !currentClippedPanelId
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300',
              !activeLogo ? 'opacity-40 cursor-not-allowed' : ''
            ]"
          >
            <span class="truncate">自由浮动 (无裁剪)</span>
            <span v-if="!currentClippedPanelId" class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          </button>

          <button
            v-for="panel in jerseyParts"
            :key="panel.id"
            type="button"
            @click="onSelectPanel(panel.id)"
            :disabled="!activeLogo"
            :class="[
              'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center justify-between border cursor-pointer',
              currentClippedPanelId === panel.id
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300',
              !activeLogo ? 'opacity-40 cursor-not-allowed' : ''
            ]"
            :title="`${panel.name} (${panel.id})`"
          >
            <span class="truncate">{{ panel.name }}</span>
            <span v-if="currentClippedPanelId === panel.id" class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
            <span v-else class="text-[9px] font-mono opacity-50 shrink-0">{{ panel.id.replace('COLOUR_', '') }}</span>
          </button>
        </div>
      </div>

      <div v-if="activeLogo" class="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          @click="onFitToPanel"
          :disabled="!currentClippedPanelId"
          class="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'expand']" class="text-[10px]" />
          <span>一键对齐并铺满板片</span>
        </button>
        <button
          type="button"
          @click="onSelectPanel('')"
          :disabled="!currentClippedPanelId"
          class="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>解除裁切</span>
        </button>
      </div>
    </div>

    <!-- 右侧弹出的 SVG 素材库组件 -->
    <div>
      <SvgDrawer
        :isOpen="isRepoOpen"
        @close="isRepoOpen = false"
        @select="handleLibrarySelect"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, inject, ref, computed, onMounted, watch } from 'vue';
import _ from 'lodash';
import SvgDrawer from '../DashBoard/SvgDrawer.vue';
import { get } from '../../utils/request';
import { isSvgSource, isRasterImageSource } from '../../utils/removeBackground';

const props = defineProps({
  logos: Array,
  jerseyParts: {
    type: Array,
    default: () => [],
  },
  defaultLogoVisible: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits([
  'uploadLogo',
  'removeLogo',
  'selectElement',
  'changeLogoColor',
  'toggleLogoBackgroundRemoval',
  'toggleDefaultLogoVisibility',
  'setLogoClip',
  'fitLogoToPanel',
]);
const fileInputRef = ref(null);
const editingElement = inject('editingElement', ref({}));

const isRepoOpen = ref(false);
const defaultLogoVisible = ref(true);
const activeLogo = computed(() => {
  if (!props.logos?.length) return null;
  return props.logos.find((logo) => logo.id === editingElement.value?.id) || props.logos[0];
});
const currentClippedPanelId = computed(() => activeLogo.value?.clippedPanelId || '');
watch(
  () => props.defaultLogoVisible,
  (value) => {
    if (typeof value === 'boolean') {
      defaultLogoVisible.value = value;
    }
  },
  { immediate: true }
);

// ---- helpers ----
const isRawSvg = (str) => typeof str === 'string' && str.trim().startsWith('<svg');
const isSvgLogo = (logo) => {
  const url = logo?.url;
  return isSvgSource(url) || isRawSvg(url);
};
const isRasterLogo = (logo) => isRasterImageSource(logo?.url);

const triggerFileInput = () => {
  fileInputRef.value && fileInputRef.value.click();
};
const uploadLogo = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      emit('uploadLogo', {
        url,
        originalUrl: url,
        name: file.name,
        removeBackground: false,
      });
    };
    reader.readAsDataURL(file);
  }
  // 清空 input 的值，确保可以再次上传相同文件
  event.target.value = '';
};

const removeLogo = (index) => {
  emit('removeLogo', index);
};

const selectElement = (id) => {
  emit('selectElement', id);
};

const onSelectPanel = (panelId) => {
  if (!activeLogo.value) return;
  emit('setLogoClip', {
    logoId: activeLogo.value.id,
    panelId,
  });
};

const onFitToPanel = () => {
  if (!activeLogo.value) return;
  emit('fitLogoToPanel', {
    logoId: activeLogo.value.id,
    panelId: currentClippedPanelId.value,
  });
};

const emitLogoColorChange = _.throttle((id, color) => {
  emit('changeLogoColor', { id, color });
}, 120, { leading: true, trailing: true });

const changeLogoColor = (logo, color) => {
  logo.color = color;
  emitLogoColorChange(logo.id, color);
};

const toggleLogoBackgroundRemoval = (logo, enabled) => {
  emit('toggleLogoBackgroundRemoval', {
    id: logo.id,
    enabled,
  });
};

const flushLogoColorChange = () => {
  emitLogoColorChange.flush();
};

const toggleDefaultLogoVisibility = () => {
  const nextVisible = !defaultLogoVisible.value;
  defaultLogoVisible.value = nextVisible;
  emit('toggleDefaultLogoVisibility', {
    ids: ['logoFront-0', 'logoBack-1'],
    visible: nextVisible,
  });
};

// ---- Drawer selection ----
const handleLibrarySelect = async (item) => {
  if (!item || !item.svgUrl) return;

  try {
    // const data = await get(`/resources/${item.id}/content`);
    // emit('uploadLogo', data.svgContent || item.svgUrl);
    emit('uploadLogo', item.svgContent || item.svgUrl);
  } catch (error) {
    console.error('请求svg素材报错', error);
    emit('uploadLogo', item.svgContent || item.svgUrl);
  }

  isRepoOpen.value = false;
};


// ---- Fetch SVG from server ----
onMounted(async () => {
  
});

</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>
