<template>
  <div v-if="isOpen" class="fixed inset-0 z-[20000] flex items-center justify-center p-4 overflow-y-auto">
    <!-- Backdrop Overlay with smooth transition -->
    <div 
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
      @click="close"
    ></div>

    <!-- Modal Content Panel with enter-animation -->
    <div 
      class="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 transform transition-transform duration-300 z-10 max-h-[90vh] overflow-y-auto"
      v-motion
      :initial="{ opacity: 0, scale: 0.95, y: 15 }"
      :enter="{ opacity: 1, scale: 1, y: 0 }"
      :leave="{ opacity: 0, scale: 0.95, y: 15 }"
    >
      <!-- Close Button -->
      <button 
        @click="close"
        class="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 transition-colors cursor-pointer"
        aria-label="关闭"
      >
        <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
      </button>

      <!-- Header Area -->
      <div class="text-center mb-6">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/30 text-teal-750 dark:text-teal-400 border border-teal-150 dark:border-teal-900/30 mb-2">
          <font-awesome-icon :icon="['fas', 'compass']" class="animate-pulse" />
          全链定制 &middot; 购买导览
        </span>
        <h2 class="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          简易三步，开启高品质团队高能战衣
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          极速设计审核流程，尊享高级 280g 双面速干面料和阶梯大单折扣
        </p>
      </div>

      <!-- Roadmap Timeline Steps -->
      <div class="space-y-6">
        
        <!-- Step 1 Card -->
        <div class="flex gap-4 items-start p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850">
          <div class="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm shadow-indigo-500/20">
            01
          </div>
          <div class="space-y-1">
            <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'palette']" class="text-indigo-500 text-[11px]" />
              完成您的球衣创意设计
            </h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              调整心仪的衣服色彩（多区配色可选），自定义球队名称与号码，运用 AI 贴片及 Logo 库，在 3D 面板确认效果。
            </p>
          </div>
        </div>

        <!-- Step 2 Card -->
        <div class="flex gap-4 items-start p-4 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
          <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm shadow-teal-600/20">
            02
          </div>
          <div class="space-y-3.5 flex-1 w-full">
            <div class="space-y-1">
              <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <font-awesome-icon :icon="['fas', 'download']" class="text-teal-600 text-[11px]" />
                导出并一键生成设计包
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                无需截图！点击下方按钮将自动把 2D 织成矢量平面图、高清配置 json 参数一并压缩导出。
              </p>
            </div>

            <!-- Download trigger element -->
            <div class="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center shadow-sm">
              <button 
                @click="triggerDownload"
                class="w-full max-w-sm py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/15 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <font-awesome-icon :icon="isDownloaded ? ['fas', 'check'] : ['fas', 'file-zipper']" class="text-xs" />
                <span>{{ isDownloaded ? '设计包已打包下载！可进入下一步' : '一键打包并下载设计包文件 (.ZIP)' }}</span>
              </button>
              <div class="text-[9.5px] text-slate-450 flex items-center gap-1 mt-0.5">
                <font-awesome-icon :icon="['fas', 'shield-halved']" class="text-emerald-5s0 text-[8px]" />
                <span>一键完美归档：包含所有配色的矢量图设计细节</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3 Card -->
        <div class="flex gap-4 items-start p-4 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/20">
          <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm shadow-emerald-600/20">
            03
          </div>
          <div class="space-y-4 flex-grow">
            <div class="space-y-1">
              <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <font-awesome-icon :icon="['fas', 'user-tie']" class="text-emerald-650 dark:text-emerald-450 text-[11px]" />
                对接专属客服 · 开启高定生产
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                添加服装顾问微信号（或直接扫描下方二维码）。客服将对接您下载的设计包，核对尺码（S-XXXL）与精梳网眼面料类型（透气/柔顺系列），24小时内为您极速安排发货生产。
              </p>
            </div>

            <!-- WeChat Area -->
            <div class="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4 shadow-sm">
              <div class="w-36 shrink-0 rounded-xl border border-emerald-100 bg-slate-50 p-2 dark:border-emerald-900/40 dark:bg-slate-900">
                <img
                  src="/images/link.jpg"
                  alt="客服微信二维码"
                  class="w-full rounded-lg object-contain"
                />
              </div>

              <!-- WeChat Contact Details -->
              <div class="flex-grow space-y-2.5 w-full">
                <div class="flex items-center gap-1.5">
                  <div class="px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    客服微信
                  </div>
                  <span class="text-[10px] text-slate-400">扫码添加专属顾问</span>
                </div>
                
                <div class="rounded-xl border border-slate-150 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-inner dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  下载设计包后，请扫码添加客服，并发送设计包、尺码和数量需求。
                </div>

                <div class="rounded-lg bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 p-2 leading-relaxed">
                  <p class="text-[9.5px] text-orange-850 dark:text-orange-400 flex items-start gap-1 font-medium">
                    <font-awesome-icon :icon="['fas', 'gift']" class="mt-0.5 text-[8.5px] text-orange-500 shrink-0" />
                    <span><b>特惠好礼：</b>前 50 名提供 Zip 文件的团队客户，专享免费印制队标一次与送精美水洗标签！</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer Area -->
      <div class="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        <button 
          @click="close"
          class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
        >
          我知道了，继续编辑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'triggerDownload']);
const isDownloaded = ref(false);

const close = () => {
  emit('close');
};

const triggerDownload = () => {
  emit('triggerDownload');
  isDownloaded.value = true;
};

</script>
