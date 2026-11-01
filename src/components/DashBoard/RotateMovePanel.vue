<template>
  <div
    ref="containerRef"
    class="fixed z-50 cursor-grab select-none"
    :style="{ left: containerPosX + 'px', top: containerPosY + 'px' }"
    @mousedown="startDragContainer"
    @touchstart="startDragContainer"
  >
    <!-- 悬浮球按钮 -->
    <div
      v-if="!isVisible"
      class="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.35),inset_0_1px_2px_rgba(255,255,255,0.15)] cursor-pointer transition-all duration-300 hover:scale-110 hover:border-indigo-400 hover:text-indigo-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.55),inset_0_1px_2px_rgba(255,255,255,0.3)] active:scale-95"
      @click="handleClickFloatingBall"
    >
      <!-- 新的齿轮图标 -->
      <svg
        class="w-6 h-6 animate-[spin_20s_linear_infinite]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    </div>

    <!-- 你的拨盘组件，根据 isVisible 状态显示/隐藏 -->
    <div
      v-if="isVisible"
      class="relative w-48 h-48 flex items-center justify-center bg-slate-950/90 border border-slate-800/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(99,102,241,0.1),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-300 transform scale-100 opacity-100"
    >
      <!-- 关闭按钮 -->
      <button
        @click="toggleVisibility"
        class="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 p-0.5 rounded-full cursor-pointer transition-all duration-200 z-30"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <!-- Directional Icons to control cross movement -->
      <div
        @click="setMovement('top')"
        class="absolute top-[-26px] left-1/2 -translate-x-1/2 cursor-pointer p-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border border-slate-700/60 bg-slate-900/95 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] active:scale-90 transition-all duration-200 z-25 text-slate-400"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          ></path>
        </svg>
      </div>
      <div
        @click="setMovement('bottom')"
        class="absolute bottom-[-26px] left-1/2 -translate-x-1/2 cursor-pointer p-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border border-slate-700/60 bg-slate-900/95 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] active:scale-90 transition-all duration-200 z-25 text-slate-400"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
      <div
        @click="setMovement('left')"
        class="absolute left-[-26px] top-1/2 -translate-y-1/2 cursor-pointer p-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border border-slate-700/60 bg-slate-900/95 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] active:scale-90 transition-all duration-200 z-25 text-slate-400"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
      </div>
      <div
        @click="setMovement('right')"
        class="absolute right-[-26px] top-1/2 -translate-y-1/2 cursor-pointer p-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border border-slate-700/60 bg-slate-900/95 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] active:scale-90 transition-all duration-200 z-25 text-slate-400"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </div>

      <!-- The Precision Dial -->
      <div
        ref="dial"
        class="relative w-40 h-40 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-zinc-950 border-[3px] border-slate-800 shadow-[0_12px_28px_rgba(0,0,0,0.65),inset_0_2px_4px_rgba(255,255,255,0.06),0_0_0_1px_rgba(99,102,241,0.15)] flex items-center justify-center select-none touch-none hover:border-indigo-900/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_25px_rgba(99,102,241,0.08)] transition-all duration-300 cursor-grab active:cursor-grabbing"
        @mousedown="startDrag"
        @touchstart="startDrag"
        :style="{ transform: 'rotate(' + rotation + 'deg)' }"
      >
        <!-- Fine Calibration Ticks -->
        <div
          v-for="tick in tickMarks"
          :key="'tick-' + tick"
          class="absolute origin-center rounded-full transition-all duration-300"
          :class="[
            tick % 90 === 0 ? 'w-[2px] h-[7px] bg-indigo-400' :
            tick % 30 === 0 ? 'w-[1.5px] h-[5px] bg-slate-400/80' :
            'w-[1px] h-[3px] bg-slate-600/55'
          ]"
          :style="getTickMarkStyle(tick)"
        ></div>

        <!-- Degree Markings -->
        <div
          v-for="degree in degrees"
          :key="degree"
          class="absolute text-slate-400/90 text-[9px] font-mono font-bold tracking-tighter"
          :style="getDegreeMarkStyle(degree)"
        >
          {{ degree }}
        </div>

        <!-- Center Pivot Dot -->
        <div class="absolute w-3 h-3 rounded-full bg-slate-950 border-2 border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10"></div>

        <!-- Decorative Icons inside the dial (rotate with the dial) -->
        <div
          class="absolute text-[13px] transition-transform duration-300 pointer-events-none select-none opacity-80"
          :style="{
            transform: 'translate(32px, -18px) rotate(' + -rotation + 'deg)',
          }"
        >
          ✨
        </div>
        <div
          class="absolute text-[13px] transition-transform duration-300 pointer-events-none select-none opacity-80"
          :style="{
            transform: 'translate(-22px, 22px) rotate(' + -rotation + 'deg)',
          }"
        >
          ☀️
        </div>
      </div>

      <!-- Neon Needle Indicator (Fixed) -->
      <div
        class="absolute left-1/2 w-[3px] h-10 bg-gradient-to-t from-red-500 to-rose-400 z-20 rounded-full shadow-[0_0_6px_1px_rgba(239,68,68,0.5)] pointer-events-none"
        :style="{ transform: 'translateX(-50%) translateY(-100%)', top: '50%', transformOrigin: 'bottom center' }"
      ></div>

      <!-- Current Rotation Display Pill (Positioned elegantly at bottom) -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-35 bg-slate-900/95 border border-slate-700/60 shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_12px_rgba(99,102,241,0.08)] text-indigo-400 font-mono font-bold text-xs tracking-wide px-3 py-1 rounded-full cursor-pointer hover:border-indigo-400 hover:text-indigo-300 hover:shadow-[0_0_10px_rgba(99,102,241,0.25)] transition-all flex items-center justify-center min-w-[50px] active:scale-95 select-none">
        <template v-if="!isEditing">
          <span @click="startEdit" class="w-full text-center">{{ 360 - Math.round(currentRotation) }}°</span>
        </template>
        <template v-else>
          <div class="flex items-center justify-center">
            <input
              ref="inputRef"
              v-model.number="editValue"
              type="number"
              min="0"
              max="360"
              class="w-10 text-center bg-transparent text-indigo-300 font-bold border-b border-indigo-500/80 focus:border-indigo-400 outline-none rounded-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              @blur="finishEdit"
              @keyup.enter="finishEdit"
              @mousedown.stop
              @touchstart.stop
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed, inject, watch, nextTick } from 'vue';

const editingElement = inject('editingElement');
const modelType = inject('modelType');

// 控制组件显示/隐藏的状态
const isVisible = ref(false);

// 拨盘拖动相关的状态
const dial = ref(null);
const isDragging = ref(false); // 用于拨盘旋转
const startAngle = ref(0);
const startRotation = ref(0);
const rotation = ref(0);

// 悬浮球/容器拖动相关的状态
const containerRef = ref(null);
const isDraggingContainer = ref(false); // 用于悬浮球容器拖动
const hasMovedContainer = ref(false); // 判断悬浮球容器是否发生了移动
const containerPosX = ref(10); // Initial right position
const containerPosY = ref(window.innerHeight - 80); // Initial bottom position
const startClientX = ref(0);
const startClientY = ref(0);

// 增加编辑逻辑
const isEditing = ref(false);
const editValue = ref(0);
const inputRef = ref(null);

watch(
  () => editingElement.value,
  (a, b) => {
    console.log('----', a, b)
    const cloth = window.world.getSvgEditorByType(modelType.value)
    if (!cloth) {
      console.warn('cloth not found')
      return;
    }
    const editEl = cloth.canvas.getObjectById(a.id);
    if (!editEl) {
      console.warn('editEl not found')
      return;
    }
    editValue.value = editEl.angle;
    rotation.value = editEl.angle;
  })

const startEdit = () => {
  isEditing.value = true;
  editValue.value = 360 - Math.round(currentRotation.value);
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

const finishEdit = () => {
  isEditing.value = false;
  // 限制输入范围 0–360
  let val = parseFloat(editValue.value);
  if (isNaN(val)) val = 0;
  val = Math.max(0, Math.min(360, val));
  // 转换为内部 rotation（与显示方向相反）
  rotation.value = 360 - val;
};

const setMovement = (type) => {
  const cloth = window.world.getSvgEditorByType(modelType.value)
  if (!cloth) {
    console.warn('cloth not found')
    return;
  }
  const editEl = cloth.canvas.getObjectById(editingElement.value.id);
  if (!editEl) {
    console.warn('editEl not found')
    return;
  }
  let moveX = editEl.left;
  let moveY = editEl.top;
  switch (type) {
    case 'left':
      moveX -= 1;
      break;
    case 'right':
      moveX += 1;
      break;
    case 'top':
      moveY -= 1;
      break;
    case 'bottom':
      moveY += 1;
      break;
  }
  cloth.moveElement(editEl, moveX, moveY);
}

function setRotation (val) {
  const cloth = window.world.getSvgEditorByType(modelType.value)
  if (!cloth) {
    console.warn('cloth not found')
    return;
  }
  const editEl = cloth.canvas.getObjectById(editingElement.value.id);
  if (!editEl) {
    console.warn('editEl not found')
    return;
  }
  console.log('set editEl angle', val)
  // editEl.angle = val
  cloth.rotateElement(editEl, val);

}
// 使用计算属性来处理旋转值的规范化
const currentRotation = computed(() => {
  let normalizedRotation = rotation.value % 360;
  if (normalizedRotation < 0) {
    normalizedRotation += 360;
  }
  setRotation(normalizedRotation)
  return normalizedRotation;
});

const degrees = Array.from({ length: 12 }, (_, i) => i * 30); // 0, 30, 60, ..., 330

// Fine-calibration tick marks (every 15 degrees)
const tickMarks = computed(() => {
  const marks = [];
  for (let i = 0; i < 360; i += 15) {
    marks.push(i);
  }
  return marks;
});

const getTickMarkStyle = (tick) => {
  const radius = 68; // Sit right at the outer rim of the dial
  const angleRad = (tick - 90) * (Math.PI / 180); // Adjust so 0° is top
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  return {
    transform: `translate(${x}px, ${y}px) rotate(${tick}deg)`,
  };
};

const getDegreeMarkStyle = (degree) => {
  const radius = 48; // Sit nicely inside the tick marks
  const angleRad = (degree - 90) * (Math.PI / 180); // Adjust so 0° is top
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  return {
    transform: `translate(${x}px, ${y}px) rotate(${degree}deg)`,
  };
};

const getCenter = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

// 拨盘拖动事件处理
const startDrag = (event) => {
  // 阻止事件冒泡到父级容器，避免同时触发悬浮球容器的拖动
  event.stopPropagation();
  isDragging.value = true;
  const clientX = event.type.startsWith('mouse') ? event.clientX : event.touches[0].clientX;
  const clientY = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  const center = getCenter(dial.value);
  startAngle.value = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
  startRotation.value = rotation.value;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', endDrag);
};

const onDrag = (event) => {
  if (!isDragging.value) return;

  if (event.type.startsWith('touch')) {
    event.preventDefault();
  }

  const clientX = event.type.startsWith('mouse')
    ? event.clientX
    : event.touches[0].clientX;
  const clientY = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  const center = getCenter(dial.value);
  const currentAngle = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);

  let deltaAngle = currentAngle - startAngle.value;

  // 规范化 deltaAngle 到 -180 到 180 度之间
  if (deltaAngle > 180) {
    deltaAngle -= 360;
  } else if (deltaAngle < -180) {
    deltaAngle += 360;
  }

  rotation.value = startRotation.value + deltaAngle;
};

const endDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', endDrag);
};

// 悬浮球/容器拖动事件处理
const startDragContainer = (event) => {
  isDraggingContainer.value = true;
  hasMovedContainer.value = false; // 重置移动状态
  startClientX.value = event.type.startsWith('mouse') ? event.clientX : event.touches[0].clientX;
  startClientY.value = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  // 获取当前容器的位置，作为拖动的起始点
  const rect = containerRef.value.getBoundingClientRect();
  containerPosX.value = rect.left;
  containerPosY.value = rect.top;

  window.addEventListener('mousemove', onDragContainer);
  window.addEventListener('mouseup', endDragContainer);
  window.addEventListener('touchmove', onDragContainer, { passive: false });
  window.addEventListener('touchend', endDragContainer);
};

const onDragContainer = (event) => {
  if (!isDraggingContainer.value) return;

  if (event.type.startsWith('touch')) {
    event.preventDefault();
  }

  const clientX = event.type.startsWith('mouse') ? event.clientX : event.touches[0].clientX;
  const clientY = event.type.startsWith('mouse') ? event.clientY : event.touches[0].clientY;

  const dx = clientX - startClientX.value;
  const dy = clientY - startClientY.value;

  // 如果移动距离超过一个阈值，则认为是拖动
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    hasMovedContainer.value = true;
  }

  let newPosX = containerPosX.value + dx;
  let newPosY = containerPosY.value + dy;

  // 获取容器的当前尺寸（无论是悬浮球还是展开的拨盘）
  const containerWidth = containerRef.value.offsetWidth;
  const containerHeight = containerRef.value.offsetHeight;

  // 限制拖动边界：允许自身一半空间超出屏幕
  newPosX = Math.max(-containerWidth / 2, Math.min(newPosX, window.innerWidth - containerWidth / 2));
  newPosY = Math.max(-containerHeight / 2, Math.min(newPosY, window.innerHeight - containerHeight / 2));

  containerPosX.value = newPosX;
  containerPosY.value = newPosY;

  startClientX.value = clientX;
  startClientY.value = clientY;
};

const endDragContainer = () => {
  isDraggingContainer.value = false;
  window.removeEventListener('mousemove', onDragContainer);
  window.removeEventListener('mouseup', endDragContainer);
  window.removeEventListener('touchmove', onDragContainer);
  window.removeEventListener('touchend', endDragContainer);
};

// 切换显示/隐藏状态的函数
const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
  // 在可见性切换后，确保容器位置在屏幕内，以防尺寸变化导致超出
  nextTick(() => {
    if (containerRef.value) {
      const containerWidth = containerRef.value.offsetWidth;
      const containerHeight = containerRef.value.offsetHeight;
      // 重新应用边界限制
      containerPosX.value = Math.max(-containerWidth / 2, Math.min(containerPosX.value, window.innerWidth - containerWidth / 2));
      containerPosY.value = Math.max(-containerHeight / 2, Math.min(containerPosY.value, window.innerHeight - containerHeight / 2));
    }
  });
};

// 处理悬浮球点击事件，仅在没有拖动时才切换可见性
const handleClickFloatingBall = () => {
  if (!hasMovedContainer.value) {
    toggleVisibility();
  }
};

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', endDrag);

  window.removeEventListener('mousemove', onDragContainer);
  window.removeEventListener('mouseup', endDragContainer);
  window.removeEventListener('touchmove', onDragContainer);
  window.removeEventListener('touchend', endDragContainer);
});

</script>

<style scoped>
/* Scoped styles for the component */
</style>