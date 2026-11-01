<template>
  <div class="space-y-5">
    <!-- Header Area -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
      <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'font']" class="text-indigo-500" />
        <span>文字图层管理</span>
      </h3>
      <button 
        @click="addText"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-200 shadow-md shadow-indigo-600/15 active:scale-95 cursor-pointer"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="text-[10px]" />
        <span>新增文字</span>
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="texts.length === 0"
      class="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-250 dark:border-slate-800 text-center animate-fade-in"
    >
      <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
        <font-awesome-icon :icon="['fas', 'font']" class="text-lg" />
      </div>
      <p class="text-slate-700 dark:text-slate-300 font-semibold text-xs mb-1">未添加任何文字图层</p>
      <p class="text-slate-400 dark:text-slate-500 text-[11px] max-w-[200px] mx-auto">点击上方“新增文字”按钮，开启您的创意服装印字</p>
    </div>

    <!-- Text List -->
    <div v-else class="space-y-3">
      <div
        v-for="(text, index) in texts"
        :key="index"
        class="group/card border transition-all duration-300 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900/50"
        :class="[
          editingElement.id === text.id 
            ? 'border-indigo-500 shadow-md shadow-indigo-500/5 bg-slate-50/50 dark:bg-slate-900/90' 
            : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-755 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        ]"
      >
        <!-- Card Header -->
        <div
          class="flex justify-between items-center px-4 py-3 cursor-pointer select-none border-b border-transparent transition-colors"
          :class="{'border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40': text.isExpanded}"
          @click="() => { selectElement(text); openDialog(index); }"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <div 
              class="w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors"
              :class="editingElement.id === text.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400'"
            >
              T{{ index + 1 }}
            </div>
            <div class="min-w-0">
              <p class="text-slate-700 dark:text-slate-200 font-bold text-xs truncate max-w-[130px]">
                {{ text.text || '输入内容...' }}
              </p>
              <p class="text-[10px] text-slate-455 dark:text-slate-450 font-medium">
                字体: {{ text.fontFamily || '默认样式' }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-1 shrink-0">
            <!-- Copy Layer Button -->
            <button
              @click.stop="copyElement(index)"
              class="w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-center transition-all cursor-pointer"
              title="复制图层"
            >
              <font-awesome-icon :icon="['fas', 'copy']" class="text-[11px]" />
            </button>
            
            <!-- Remove Layer Button -->
            <button
              @click.stop="removeText(index)"
              class="w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-center transition-all cursor-pointer"
              title="删除图层"
            >
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="text-[11px]" />
            </button>
            
            <!-- Expand Indicator -->
            <div
              class="w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 flex items-center justify-center transition-transform duration-350"
              :class="{'rotate-180 text-indigo-500': text.isExpanded}"
            >
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-[10px]" />
            </div>
          </div>
        </div>

        <!-- Expanded Settings Content Area -->
        <div
          class="text-content"
          :class="{ 'expanded': text.isExpanded }"
        >
          <div class="p-4 space-y-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-950/20 border-t border-slate-205 dark:border-slate-800/50">
            <!-- 1. Text Entry Input -->
            <div class="space-y-1.5">
              <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">输入文本</span>
              <input
                v-if="text.isCurved"
                v-model="text.text"
                type="text"
                :placeholder="'自定义文字 ' + (index + 1)"
                class="input-element"
              />
              <textarea
                v-else
                v-model="text.text"
                rows="2"
                :placeholder="'自定义文字 ' + (index + 1)"
                class="input-element resize-none"
              />
            </div>

            <!-- 2. Font Selection -->
            <div class="space-y-1.5">
              <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">选择字体</span>
              <FontSelectionVue
                :currentFont="text.fontFamily"
                @font-selected="(e) => setFontFamily(index, e)"
              />
            </div>

            <!-- 3. Size and Basic Weights -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Font Size -->
              <div class="space-y-1.5">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">字体大小</span>
                <div class="relative flex items-center">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase select-none">PX</span>
                  </div>
                  <input
                    v-model.number="text.fontSize"
                    type="number"
                    min="1"
                    max="100"
                    class="block w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <!-- Align Options & Weight Toggles -->
              <div class="space-y-1.5">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">排版效果</span>
                <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-1 h-[34px]">
                  <button
                    @click="setFontWeight(index)"
                    class="w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer"
                    :class="text.fontWeight === 'bold' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'"
                    title="加粗"
                  >
                    <font-awesome-icon :icon="['fas', 'bold']" class="text-xs" />
                  </button>
                  <button
                    @click="setFontItalic(index)"
                    class="w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer"
                    :class="text.fontStyle === 'italic' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'"
                    title="斜体"
                  >
                    <font-awesome-icon :icon="['fas', 'italic']" class="text-xs" />
                  </button>
                  <button
                    @click="setFontUnderline(index)"
                    class="w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer"
                    :class="text.underline ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'"
                    title="下划线"
                  >
                    <font-awesome-icon :icon="['fas', 'underline']" class="text-xs" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 4. Text Alignment & Spacings -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Tracking (Letter Spacing) -->
              <div class="space-y-1.5">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block font-hans">字间距 (Spacing)</span>
                <div class="relative flex items-center">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase select-none">AV</span>
                  </div>
                  <input
                    v-model.number="text.charSpacing"
                    type="number"
                    min="0"
                    max="100"
                    class="block w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <!-- Line Lead (Line Height) -->
              <div class="space-y-1.5">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block font-hans">行距 (Leading)</span>
                <div class="relative flex items-center">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase select-none font-sans">LH</span>
                  </div>
                  <input
                    v-model.number="text.lineHeight"
                    type="number"
                    min="0"
                    max="100"
                    class="block w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <!-- Alignment Block -->
            <div class="flex items-center justify-between py-2 border-t border-slate-200/80 dark:border-slate-800/40">
              <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide">文本对齐方式</span>
              <div class="flex gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-0.5">
                <button
                  class="w-8 h-7 rounded-md flex items-center justify-center text-xs transition-all cursor-pointer"
                  :class="text.textAlign === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'"
                  @click="setFontLayout(index, 'left')"
                >
                  <font-awesome-icon :icon="['fas', 'align-left']" />
                </button>
                <button
                  class="w-8 h-7 rounded-md flex items-center justify-center text-xs transition-all cursor-pointer"
                  :class="text.textAlign === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'"
                  @click="setFontLayout(index, 'center')"
                >
                  <font-awesome-icon :icon="['fas', 'align-center']" />
                </button>
                <button
                  class="w-8 h-7 rounded-md flex items-center justify-center text-xs transition-all cursor-pointer"
                  :class="text.textAlign === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'"
                  @click="setFontLayout(index, 'right')"
                >
                  <font-awesome-icon :icon="['fas', 'align-right']" />
                </button>
              </div>
            </div>

            <!-- Curved Toggle -->
            <div class="flex items-center justify-between py-1.5 border-t border-slate-200/80 dark:border-slate-800/40">
              <div class="flex flex-col">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide">3D 弯曲立体环绕</span>
                <span class="text-[10px] text-slate-400 dark:text-slate-500">使文字形成弧形或圆环效果</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  :checked="text.isCurved"
                  @change="toggleCurve(index)"
                  class="sr-only peer"
                />
                <div class="w-10 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 dark:after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-white"></div>
              </label>
            </div>

            <!-- Curve Value Slider or input -->
            <div
              v-if="text.isCurved"
              class="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <div class="flex justify-between items-center text-[10px] font-bold">
                <span class="text-slate-500 dark:text-slate-400">弧度调节</span>
                <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ text.curveValue }}°</span>
              </div>
              <div class="flex items-center space-x-3">
                <input
                  v-model.number="text.curveValue"
                  type="range"
                  min="-360"
                  max="360"
                  step="5"
                  class="flex-1 accent-indigo-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  @input="$emit('updateText', index)"
                />
                <input
                  v-model.number="text.curveValue"
                  type="number"
                  min="-360"
                  max="360"
                  class="w-14 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 font-mono text-[10px] text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  @input="$emit('updateText', index)"
                />
              </div>
            </div>

            <!-- Colors -->
            <div class="grid grid-cols-2 gap-3 border-t border-slate-200/80 dark:border-slate-800/40 pt-3">
              <!-- Text Fill Color -->
              <div class="space-y-1.5">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">字体主色</span>
                <div class="flex items-center bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-2 h-9 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <input
                    v-model="text.fill"
                    type="color"
                    class="w-5 h-5 border-0 p-0 bg-transparent cursor-pointer rounded overflow-hidden"
                  />
                  <input
                    v-model="text.fill"
                    type="text"
                    class="flex-1 bg-transparent border-0 text-[10px] font-mono text-slate-700 dark:text-slate-300 uppercase pl-2 focus:ring-0 w-full outline-none"
                  />
                </div>
              </div>

              <!-- Text Stroke Color -->
              <div class="space-y-1.5">
                <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">描边颜色</span>
                <div class="flex items-center bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-2 h-9 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <input
                    v-model="text.stroke"
                    type="color"
                    class="w-5 h-5 border-0 p-0 bg-transparent cursor-pointer rounded overflow-hidden"
                  />
                  <input
                    v-model="text.stroke"
                    type="text"
                    placeholder="描边色"
                    class="flex-1 bg-transparent border-0 text-[10px] font-mono text-slate-700 dark:text-slate-300 uppercase pl-2 focus:ring-0 w-full outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Stroke width -->
            <div class="space-y-1.5">
              <span class="text-slate-550 dark:text-slate-400 font-semibold text-[11px] tracking-wide block">描边粗细</span>
              <div class="flex items-center space-x-3">
                <input
                  v-model.number="text.strokeWidth"
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  class="flex-1 accent-indigo-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  @input="$emit('updateText', index)"
                />
                <input
                  v-model.number="text.strokeWidth"
                  type="number"
                  min="0"
                  max="10"
                  class="w-12 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 font-mono text-[10px] text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  @input="$emit('updateText', index)"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fontOptions } from '../../utils/StyleManager'
import { defineProps, defineEmits, inject, onMounted } from 'vue';
import fontManager from '../../utils/FontManager';
import FontSelectionVue from '../DashBoard/FontSelection.vue';

const editingElement = inject('editingElement');
const props = defineProps({
  texts: Array,
});
const emit = defineEmits();

const addText = () => {
  emit('addText');
};

const removeText = (index) => {
  emit('removeText', index);
};

const copyElement = (index) => {
  emit('copyText', index);
}

const updateText = (index) => {
  emit('updateText', index);
}

const setFontWeight = (index) => {
  if (props.texts[index].fontWeight === 'bold') {
    props.texts[index].fontWeight = 'normal';
  } else {
    props.texts[index].fontWeight = 'bold';
  }
}

const setFontFamily = async (index, fontType) => {
  props.texts[index].fontFamily = fontType.type;
  await fontManager.loadFont(fontType.type, { fontUrl: fontType.url });
  emit('updateFontFamily', index, fontType.type);
}

const setFontItalic = (index) => {
  if (props.texts[index].fontStyle === 'normal') {
    props.texts[index].fontStyle = 'italic';
  } else {
    props.texts[index].fontStyle = 'normal';
  }
}

const setFontUnderline = (index) => {
  if (props.texts[index].underline) {
    props.texts[index].underline = false;
  } else {
    props.texts[index].underline = true;
  }
}

const setFontLayout = (index, layout) => {
  props.texts[index].textAlign = layout;
}

let currentOpenIndex = -1;
const openDialog = (index) => {
  props.texts.forEach(text => {
    text.isExpanded = false;
  });
  if (currentOpenIndex === index) {
    currentOpenIndex = -1;
    return;
  }
  currentOpenIndex = index;
  props.texts[index].isExpanded = true;
}
const selectElement = (text) => {
  if (!text.isExpanded) return;
  emit('selectElement', text.id);
};

/**
 * 切换弯曲功能的开关状态
 * @param {number} index 文本对象在数组中的索引
 */
const toggleCurve = (index) => {
  const textItem = props.texts[index];
  textItem.isCurved = !textItem.isCurved;

  textItem.text = textItem.text.replaceAll('\n', '');
  // 1. 开关状态通知事件:
  // 可以在这里发出一个事件，通知父组件开关状态已改变
  emit('curveToggled', {
    index: index,
    id: textItem.id,
    textOptions: textItem,
    isCurved: textItem.isCurved
  });

  // 2. 确保更新到画布：
  // 调用父组件的 updateText 方法以同步更改到画布/编辑器
  emit('updateText', index);
}
</script>

<style scoped>
/* 样式可以根据需要添加 */
.text-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.text-content.expanded {
  max-height: 1000px;
  transition: max-height 0.5s ease-in;
}

.input-element {
  @apply bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 w-full;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>