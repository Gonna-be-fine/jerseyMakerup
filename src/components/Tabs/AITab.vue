<template>
  <div class="space-y-4 pb-6">
    <!-- Header Area -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
      <div class="flex flex-col">
        <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase flex items-center gap-2 tracking-wider">
          <font-awesome-icon :icon="['fas', 'palette']" class="text-indigo-500 animate-pulse" />
          <span>AI 专属设计师手稿坊</span>
        </h3>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">真正像时装设计师一样提炼灵感、拼配色彩与定制徽章</p>
      </div>
      <div class="flex items-center gap-1.5">
        <span
          v-if="userStore.isLoggedIn"
          class="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50"
        >
          {{ userStore.userInfo.pointsBalance || 0 }} 积分
        </span>
        <router-link
          v-if="userStore.isLoggedIn"
          to="/recharge"
          class="text-[9px] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition"
        >
          充值
        </router-link>
        <span class="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md border border-indigo-205">
          Studio V3
        </span>
      </div>
    </div>

    <!-- AI Mode Sub-Tabs -->
    <div class="flex p-0.5 bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200/40 dark:border-slate-800/65">
      <button 
        @click="activeSubTab = 'design'"
        type="button"
        :class="activeSubTab === 'design' ? 'bg-white dark:bg-slate-800 text-indigo-750 dark:text-indigo-400 font-extrabold shadow-sm' : 'text-slate-500 hover:text-slate-705 dark:text-slate-400 font-semibold'"
        class="flex-1 py-1.5 text-center text-[10px] rounded-lg transition-all cursor-pointer select-none"
      >
        <font-awesome-icon :icon="['fas', 'palette']" class="mr-1 text-[8.5px]" />
        AI 灵感设计
      </button>
      <button 
        @click="activeSubTab = 'logo-gen'"
        type="button"
        :class="activeSubTab === 'logo-gen' ? 'bg-white dark:bg-slate-800 text-indigo-750 dark:text-indigo-400 font-extrabold shadow-sm' : 'text-slate-500 hover:text-slate-705 dark:text-slate-400 font-semibold'"
        class="flex-1 py-1.5 text-center text-[10px] rounded-lg transition-all cursor-pointer select-none"
      >
        <font-awesome-icon :icon="['fas', 'stamp']" class="mr-1 text-[8.5px]" />
        AI 独创印花
      </button>
      <button 
        @click="activeSubTab = 'model'"
        type="button"
        :class="activeSubTab === 'model' ? 'bg-white dark:bg-slate-800 text-indigo-750 dark:text-indigo-400 font-extrabold shadow-sm' : 'text-slate-500 hover:text-slate-705 dark:text-slate-400 font-semibold'"
        class="flex-1 py-1.5 text-center text-[10px] rounded-lg transition-all cursor-pointer select-none"
      >
        <font-awesome-icon :icon="['fas', 'user']" class="mr-1 text-[8.5px]" />
        模特试穿宣传
      </button>
    </div>

    <!-- Tab 1: AI Design Generator -->
    <div v-if="activeSubTab === 'design'" class="space-y-4">
      <!-- Alert if API Key is not set -->
      <div 
        v-if="!hasApiKey" 
        class="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/55 dark:border-amber-900/40 rounded-xl flex items-start gap-2.5"
      >
        <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed">
          <span class="font-bold block mb-0.5">设计工坊提示</span>
          当前处于<b>本地高级设计师模组</b>。我们将加载内置全套启发式灵感算法，为您推荐最纯正的运动美学要素、色彩和专属材质。
        </div>
      </div>

      <!-- Quick Inspiration Presets -->
      <div class="space-y-1.5">
        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">🎨 经典主张与设计意向推介</span>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="preset in presets" 
            :key="preset.name"
            @click="applyPreset(preset)"
            type="button"
            class="p-2.5 text-left rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition-all text-xs cursor-pointer active:scale-97 group"
          >
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-slate-700 dark:text-slate-300 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {{ preset.name }}
              </span>
              <span class="text-[8px] px-1 bg-slate-100 dark:bg-slate-800 font-medium text-slate-500 dark:text-slate-400 rounded scale-90">{{ preset.styleTag }}</span>
            </div>
            <span class="text-[9px] text-slate-400 dark:text-slate-500 block truncate mt-1 leading-tight">{{ preset.prompt }}</span>
          </button>
        </div>
      </div>

      <!-- Interactive Prompt Box -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">💡 阐述您的定制理念或服装概念</span>
          <button 
            v-if="userPrompt" 
            @click="userPrompt = ''"
            type="button" 
            class="text-[10px] text-red-500 hover:text-red-600 cursor-pointer font-bold"
          >
            清空
          </button>
        </div>
        <div class="relative">
          <textarea
            v-model="userPrompt"
            rows="3"
            placeholder="可以用中文描述你想传达的氛围，例如：'我想做一个富有街头狂野感的篮球服，衣服要红黑碰撞，胸前有一圈弯曲的 PHOENIX 字样，搭配火焰般热烈的神话生物纹样贴纸'..."
            class="w-full p-3.5 border border-slate-250 dark:border-slate-800/80 bg-white dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-650 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm leading-relaxed"
          ></textarea>
          <span class="absolute bottom-2 right-2 text-[8px] text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-1.5 py-0.5 rounded-md font-mono">
            {{ userPrompt.length }} 字符
          </span>
        </div>
      </div>

      <!-- Creative Controls Box -->
      <div class="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">智能矢量印花检索</span>
            <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">从系统大数据库中自适应匹配检索最贴合理念的优质矢量材质</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" v-model="autoSelectSVG" class="sr-only peer">
            <div class="w-8 h-4 bg-slate-250 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div class="h-px bg-slate-150 dark:bg-slate-800/80 my-1"></div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">生成式 AI 绘图贴画 (Badge)</span>
            <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">开启 Imagen 专属创意画贴精修，生成完美剥离白底的透明 PNG (需要API Key)</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" v-model="generateCustomDecal" :disabled="!hasApiKey" class="sr-only peer">
            <div @click="handleCustomDecalClick" class="w-8 h-4 bg-slate-250 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600" :class="{'opacity-50 cursor-not-allowed': !hasApiKey}"></div>
          </label>
        </div>

        <!-- Option B: Sync Pants color if suit is selected -->
        <template v-if="isSuitProduct">
          <div class="h-px bg-slate-150 dark:bg-slate-800/80 my-1"></div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <font-awesome-icon :icon="['fas', 'sync-alt']" class="text-[10px]" />
                <span>整套色彩同步机制</span>
              </span>
              <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">将上衣匹配的底片、侧袖、镶边色一键镜像同步到配套球裤</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" v-model="syncPantColor" class="sr-only peer">
              <div class="w-8 h-4 bg-slate-250 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </template>
      </div>

      <!-- Generating State / Loader -->
      <div 
        v-if="isGenerating" 
        class="p-5 border border-indigo-200/40 dark:border-indigo-900/30 bg-indigo-50/10 dark:bg-indigo-950/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3"
      >
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-900"></div>
          <div class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {{ currentLoadingStep || 'AI 正在构思服装定制画册...' }}
          </span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">分析色彩深度对冲，遴选适配矢量微章，排布字型印花比例...</span>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        v-if="!isGenerating"
        @click="triggerAIGeneration"
        type="button"
        :disabled="!userPrompt.trim()"
        class="w-full py-3 px-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-97"
      >
        <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
        <span>让 AI 专属设计师为您策划提案 · {{ aiPointCosts.design }} 积分</span>
      </button>

      <!-- Design Outputs / Interactive Sketchbook -->
      <div 
        v-if="aiDesignResult && !isGenerating" 
        class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-md overflow-hidden space-y-0 animate-fadeIn"
      >
        <!-- Sketchbook Cover / Top branding -->
        <div class="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'pencil-ruler']" class="text-indigo-400 text-xs" />
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">Designer's Live Sketchbook</span>
          </div>
          <span class="text-[9px] text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">EXCLUSIVE</span>
        </div>

        <div class="p-4 space-y-4">
          <!-- Rationale & Vibe Breakdown -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wide block">💡 方案美学构思 (Design Concept)</span>
            <div class="p-3 rounded-xl border border-indigo-100 dark:border-indigo-950/55 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-2">
              <p class="text-[10px] text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                {{ aiDesignResult.explanation }}
              </p>
              <div v-if="aiDesignResult.colorsRationale" class="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold flex items-center gap-1 leading-normal border-t border-indigo-150/50 dark:border-indigo-900/40 pt-1.5">
                <span>● 色彩主张：</span>
                <span>{{ aiDesignResult.colorsRationale }}</span>
              </div>
            </div>
          </div>

          <!-- Cointegrated Apparel wireframe representation -->
          <div class="relative py-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
            <span class="absolute top-2 left-2 text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">DRAFT SCHEMATIC</span>
            
            <!-- Miniature blueprint SVG of a sports shirt -->
            <svg class="w-32 h-32 text-slate-300 dark:text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2">
              <!-- Main Jersey body outline -->
              <path d="M15,25 L35,15 L45,21 L55,21 L65,15 L85,25 L78,45 L72,42 L72,85 L28,85 L28,42 L22,45 Z" :fill="aiDesignResult.jerseyColors?.COLOUR_BASE || '#eceff1'" stroke-linejoin="round" />
              <!-- Inner collar detailing -->
              <path d="M45,21 Q50,26 55,21" :stroke="aiDesignResult.jerseyColors?.COLOUR_SECONDARY || '#37474f'" stroke-width="2" />
              <!-- Left shoulder accent line -->
              <path d="M15,25 L28,42" :stroke="aiDesignResult.jerseyColors?.COLOUR_PRIMARY || '#ffa000'" stroke-width="1.5" />
              <!-- Right shoulder accent line -->
              <path d="M85,25 L72,42" :stroke="aiDesignResult.jerseyColors?.COLOUR_PRIMARY || '#ffa000'" stroke-width="1.5" />
              <!-- Sleeve bands -->
              <line x1="16" y1="28" x2="23" y2="33" :stroke="aiDesignResult.jerseyColors?.COLOUR_HEM || '#37474f'" stroke-width="2" />
              <line x1="84" y1="28" x2="77" y2="33" :stroke="aiDesignResult.jerseyColors?.COLOUR_HEM || '#37474f'" stroke-width="2" />
              <!-- Hem band -->
              <line x1="28" y1="84" x2="72" y2="84" :stroke="aiDesignResult.jerseyColors?.COLOUR_HEM || '#37474f'" stroke-width="2.5" />
              
              <!-- Schematic Label Placements -->
              <text v-for="t in aiDesignResult.texts" :key="t.text" :x="50" :y="t.topRatio ? t.topRatio * 100 - 10 : 58" text-anchor="middle" class="text-[6px] font-bold fill-slate-500 dark:fill-slate-400 pointer-events-none tracking-widest uppercase">
                "{{ t.text }}"
              </text>
              <circle v-for="d in aiDesignResult.decals" :key="d.role" :cx="d.leftRatio ? d.leftRatio * 100 : 50" :cy="d.topRatio ? d.topRatio * 100 - 10 : 42" r="3" class="fill-indigo-500/25 stroke-indigo-500 pointer-events-none" />
            </svg>

            <!-- Hotspot Info labels below schematic -->
            <div class="mt-2 text-[8.5px] text-slate-400 dark:text-slate-505 text-center flex flex-wrap gap-x-2 gap-y-1 items-center justify-center">
              <span class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> 衣服底色
              </span>
              <span class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 材质锚点
              </span>
              <span class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 配色同步
              </span>
            </div>
          </div>

          <!-- 🎨 Element Section A: Colors Palette -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
                <font-awesome-icon :icon="['fas', 'palette']" class="text-indigo-550 text-[10px]" />
                <span>🎨 精配色彩配方 (Apparel Color Formulas)</span>
              </span>
              <button 
                @click="applyEntirePaletteOnly"
                type="button"
                class="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900/60 px-2 py-0.5 rounded hover:bg-indigo-100 transition-all cursor-pointer"
              >
                应用整套配色
              </button>
            </div>
            <p class="text-[8.5px] text-slate-400 dark:text-slate-500">点击色片可<b>单独调试</b>并将该单色投射对应的服装位置</p>

            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="(hex, key) in aiDesignResult.jerseyColors" 
                :key="key"
                @click="applySingleColor(key, hex)"
                class="p-2 border border-slate-150/80 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl flex items-center gap-3 hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer select-none transition-all group active:scale-97"
                title="单独应用此位置色彩"
              >
                <div 
                  class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm relative group-hover:scale-105 transition-transform flex items-center justify-center text-[10px]" 
                  :style="{ backgroundColor: hex }"
                >
                  <font-awesome-icon :icon="['fas', 'check']" class="text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-[9px] text-slate-400 font-bold truncate">{{ getPartLabel(key) }}</span>
                  <span class="text-[10px] text-slate-800 dark:text-slate-300 font-bold font-mono mt-0.5">{{ hex }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 🔤 Element Section B: Typography elements -->
          <div v-if="aiDesignResult.texts && aiDesignResult.texts.length" class="space-y-2">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
              <font-awesome-icon :icon="['fas', 'font']" class="text-slate-400 text-[10px]" />
              <span>🔤 提炼印字及排号 (Custom Typographic Elements)</span>
            </span>
            <p class="text-[8.5px] text-slate-400 dark:text-slate-500">设计师度身拟定的英文字型及对称性腹部数字，点击【投射】加入画布</p>

            <div class="space-y-2">
              <div 
                v-for="(txt, idx) in aiDesignResult.texts" 
                :key="idx" 
                class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850 hover:border-indigo-400 transition-all"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg flex items-center justify-center text-xs border border-indigo-100 dark:border-indigo-900/60">
                    {{ idx + 1 }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-slate-800 dark:text-slate-200">"{{ txt.text }}"</span>
                    <p class="text-[8.5px] text-slate-400 mt-0.5">
                      字型: <span class="font-bold font-mono text-slate-500">{{ txt.fontFamily }}</span>
                      <span class="mx-1">•</span> 样式: {{ txt.isCurved ? '曲面字' : '直行字' }} ({{ txt.isCurved ? '半径' + txt.curveValue : '标准' }})
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full border border-slate-300 shadow-sm" :style="{ backgroundColor: txt.fill }" title="印花填充色" />
                  <button
                    @click="applySingleText(txt)"
                    type="button"
                    class="px-2 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-800 rounded-lg text-[9px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer active:scale-95 transition-all"
                  >
                    投射到样衣
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 🛡️ Element Section C: Materials & Badges Vault -->
          <div v-if="aiDesignResult.decals && aiDesignResult.decals.length" class="space-y-2">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
              <font-awesome-icon :icon="['fas', 'shield-halved']" class="text-slate-400 text-[10px]" />
              <span>🛡️ 主题徽记插图备选 (Badge & Crest Decals)</span>
            </span>
            <p class="text-[8.5px] text-slate-400 dark:text-slate-500">为以下徽章槽匹配了对应内生体系的矢量材质。您可以点击小磁贴一键穿戴投射，支持手动调整：</p>

            <div class="space-y-3">
              <div 
                v-for="decal in aiDesignResult.decals" 
                :key="decal.role"
                class="p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10 space-y-1.5"
              >
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-indigo-600 dark:text-indigo-400 text-[9.5px] flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {{ getDecalRoleLabel(decal.role) }}
                  </span>
                  <span class="text-[8px] text-slate-400 font-mono scale-95 origin-right">
                    相对投射位: ({{ (decal.leftRatio || 0.5).toFixed(1) }}, {{ (decal.topRatio || 0.5).toFixed(1) }})
                  </span>
                </div>
                
                <!-- If logo description provided by AI, show user -->
                <p v-if="decal.designIdea" class="text-[8.5px] text-slate-400 dark:text-slate-500 italic px-2 border-l-2 border-slate-200 dark:border-slate-800 mb-2">
                  设计导语: {{ decal.designIdea }}
                </p>

                <!-- Local Match SVG items -->
                <div v-if="decal.localMatches && decal.localMatches.length" class="grid grid-cols-3 gap-2 pt-1">
                  <div 
                    v-for="item in decal.localMatches" 
                    :key="item.id"
                    @click="selectLocalLibraryItem(item)"
                    class="bg-white dark:bg-slate-950 rounded-lg border border-slate-205 dark:border-slate-850 hover:border-indigo-500 p-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-sm group select-none active:scale-95"
                    title="点击添加该推荐素材到画布"
                  >
                    <div class="w-7 h-7 text-slate-650 dark:text-slate-300 group-hover:scale-105 transition-transform flex items-center justify-center" v-html="item.svgContent"></div>
                    <span class="text-[8px] text-slate-400 mt-1 truncate w-full text-center scale-90">{{ item.name }}</span>
                  </div>
                </div>
                <div v-else class="text-[8.5px] text-slate-400 italic">正在查询最匹配徽记系列，请稍候...</div>
              </div>
            </div>
          </div>

          <div v-if="aiDesignResult.patterns && aiDesignResult.patterns.length" class="space-y-2">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
              <font-awesome-icon :icon="['fas', 'grip-lines']" class="text-slate-400 text-[10px]" />
              <span>🧩 面料底纹策略 (Pattern Layer Plan)</span>
            </span>
            <p class="text-[8.5px] text-slate-400 dark:text-slate-500">AI 会判断是否需要底纹，并在现有 preset 与 AI 生成 SVG 底纹之间做选择。</p>

            <div class="space-y-2">
              <div
                v-for="(pattern, idx) in aiDesignResult.patterns"
                :key="`${pattern.patternId || pattern.brief}-${idx}`"
                class="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850"
              >
                <div class="flex items-start gap-2.5 min-w-0">
                  <div class="w-7 h-7 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg flex items-center justify-center text-xs border border-emerald-100 dark:border-emerald-900/60 shrink-0">
                    {{ idx + 1 }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{{ pattern.name || pattern.patternId || pattern.brief }}</span>
                      <span class="text-[8px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                        {{ pattern.source === 'generated_svg' ? 'AI SVG' : 'Preset' }}
                      </span>
                    </div>
                    <p class="text-[8.5px] text-slate-400 mt-0.5">{{ pattern.designIdea || pattern.brief }}</p>
                    <p class="text-[8px] text-slate-400 mt-1 font-mono">
                      目标: {{ pattern.targetMode === 'parts' && pattern.targetPartIds?.length ? pattern.targetPartIds.join(', ') : 'ALL' }}
                      · Opacity {{ Math.round((pattern.opacity || 0) * 100) }}%
                    </p>
                  </div>
                </div>
                <div
                  class="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950"
                  :style="{
                    backgroundColor: currentBaseColor,
                    backgroundImage: resolvePatternUrl(pattern) ? `url(${resolvePatternUrl(pattern)})` : 'none',
                    backgroundRepeat: 'repeat',
                    backgroundSize: `${Math.max(8, Math.round((pattern.scale || 1) * 18))}px`
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div v-if="generatedBadgeImage" class="space-y-2">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-indigo-500 text-[10px]" />
              <span>✨ AI 专属核心透明贴纸 (Generative Custom Crest)</span>
            </span>
            <div class="relative flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-955 p-4 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2.5">
              <img :src="generatedBadgeImage" class="w-24 h-24 object-contain drop-shadow-md" />
              
              <button 
                @click="applyGeneratedBadgeImage"
                type="button"
                class="py-1 px-3 bg-indigo-600 hover:bg-indigo-755 text-white font-bold rounded-lg text-[9.5px] shadow-sm cursor-pointer transition-all"
              >
                将此核心专属贴纸投射到正面
              </button>
              <span class="absolute bottom-1 right-2 text-[7.5px] text-slate-400 select-none">SVG Badge Preview</span>
            </div>
          </div>

          <!-- Section E: Main Deliver synthesis package -->
          <div class="pt-2 border-t border-slate-150 dark:border-slate-800">
            <button
              @click="applyDesignToJersey"
              type="button"
              class="w-full py-3 px-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all active:scale-97 shadow-md"
            >
              <font-awesome-icon :icon="['fas', 'check']" />
              <span>【一键多维交付】：合成并应用全套要素与色彩</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Pivot: AI Logo/Decal Generator -->
    <div v-else-if="activeSubTab === 'logo-gen'" class="space-y-4 animate-fadeIn">
      <!-- Tip Alert Area -->
      <div class="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-950/50 rounded-xl leading-relaxed">
        <span class="text-xs font-black text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
          <font-awesome-icon :icon="['fas', 'stamp']" class="text-indigo-500" />
          <span>AI 独创印花徽章工坊 (Creative Emblem Studio)</span>
        </span>
        <p class="text-[9.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
          基于高阶 Imagen 架构精绘专属图章，并配合<b>动态白底剥离通道</b>生成透明 PNG，可在 2D / 3D 衣服表面任意拖转、缩放。
        </p>
      </div>

      <!-- Quick Concept Suggestion Pills -->
      <div class="space-y-1.5">
        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">💡 快速载入创意印花元素推荐</span>
        <div class="flex flex-wrap gap-1.5">
          <button 
            v-for="word in ['🦁 咆哮雄狮兽首', '🦅 雷霆展翅战鹰', '🐉 东方远古金龙', '⚡ 双交叉闪电箭头', '🔥 抽象机能火枫', '🧭 探险定位罗盘', '🛡️ 帝国荣耀铁卫盾']"
            :key="word"
            @click="aiLogoPrompt = word.split(' ').slice(1).join(' ')"
            type="button"
            class="px-2 py-1 text-[9px] font-semibold bg-slate-50 hover:bg-indigo-50 dark:bg-slate-905 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg border border-slate-200/60 dark:border-slate-800 transition-all cursor-pointer active:scale-95"
          >
            {{ word }}
          </button>
        </div>
      </div>

      <!-- Prompt Text Box -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">📝 详释您的印花徽章主题 (中文或英文)</label>
        <div class="relative">
          <textarea
            v-model="aiLogoPrompt"
            rows="2"
            placeholder="描述您期待在衣服上涂敷的图案，例如: 'a fierce tactical grey wolf head with glowing eyes' (一只带着猛烈眼睛的雷霆野狼徽标) ..."
            class="w-full p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm font-medium"
          ></textarea>
        </div>
      </div>

      <!-- Process and Option Checkboxes Card -->
      <div class="p-3 bg-slate-50/65 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800/60 space-y-2.5">
        <div class="flex items-center justify-between gap-3">
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">输出格式</span>
            <span class="text-[8px] text-slate-400 dark:text-slate-500">SVG 适合矢量印花；PNG 适合复杂图像</span>
          </div>
          <div class="flex p-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0">
            <button
              v-for="format in ['svg', 'png']"
              :key="format"
              type="button"
              @click="logoOutputFormat = format"
              class="px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all"
              :class="logoOutputFormat === format ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            >
              {{ format }}
            </button>
          </div>
        </div>

        <div class="h-px bg-slate-150 dark:bg-slate-800/40"></div>

        <!-- Option 1: Trim background transparent -->
        <div v-if="logoOutputFormat === 'png'" class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">纯白像素智能剥离</span>
            <span class="text-[8px] text-slate-400 dark:text-slate-500">自动解析矩形边缘并切除白底，使印花深度融入面料肌理</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" v-model="logoTrimWhite" class="sr-only">
            <div 
              class="relative w-9 h-5 rounded-full transition-colors duration-200 outline-none"
              :class="logoTrimWhite ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-750'"
            >
              <div 
                class="absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform duration-200 shadow-sm"
                :class="logoTrimWhite ? 'translate-x-[16px]' : 'translate-x-0'"
              ></div>
            </div>
          </label>
        </div>

        <div v-if="logoOutputFormat === 'png'" class="h-px bg-slate-150 dark:bg-slate-800/40"></div>

        <!-- Option 2: Inherit jersey colors -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">主题色自适应协同</span>
            <span class="text-[8px] text-slate-400 dark:text-slate-500">自动使用衣服配底色（{{ currentBaseColor }}）与次彩色（{{ currentAccentColor }}）来构架徽标色彩</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" v-model="logoInheritColors" class="sr-only">
            <div 
              class="relative w-9 h-5 rounded-full transition-colors duration-200 outline-none"
              :class="logoInheritColors ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-750'"
            >
              <div 
                class="absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform duration-200 shadow-sm"
                :class="logoInheritColors ? 'translate-x-[16px]' : 'translate-x-0'"
              ></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Key Alert Reminder -->
      <div v-if="!hasApiKey" class="p-2.5 bg-amber-50/60 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-start gap-2">
        <span class="text-xs mt-0.5">💡</span>
        <div class="text-[9.5px] text-amber-850 dark:text-amber-400 leading-normal">
          当前处于<b>本地智能推荐形态</b>。系统将在检测到创意后，为您瞬间提取本地专业矢量徽章并支持无限次投放。在 Settings 配置 Gemini API Key 可解锁无限真实 Imagen 创意徽章。
        </div>
      </div>

      <!-- Generation Loading block -->
      <div v-if="isGeneratingLogo" class="p-5 border border-indigo-200/40 dark:border-indigo-900/30 bg-indigo-50/10 dark:bg-indigo-950/10 rounded-xl flex flex-col items-center justify-center text-center space-y-2.5">
        <font-awesome-icon :icon="['fas', 'circle-notch']" class="text-indigo-500 text-xl animate-spin" />
        <div>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300 block">AI 专属画师精心绘制中...</span>
          <span class="text-[8.5px] text-slate-400 dark:text-slate-500 block mt-1">
            正在调配像素比对... 剔除多余噪点，生成高透贴片
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <button
        v-else
        @click="triggerLogoGeneration"
        type="button"
        :disabled="!aiLogoPrompt.trim()"
        class="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-md active:scale-95 duration-200"
        :class="aiLogoPrompt.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse shadow-indigo-600/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-405 dark:text-slate-500 cursor-not-allowed border border-slate-200/80 dark:border-slate-800 shadow-none'"
      >
        <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
        <span>立即绘制创意专属徽章/Logo · {{ aiPointCosts.logo }} 积分</span>
      </button>

      <!-- Results Display Panel -->
      <div v-if="generatedLogoImage && !isGeneratingLogo" class="border border-slate-205 dark:border-slate-805 bg-white dark:bg-slate-950 rounded-2xl shadow-md overflow-hidden animate-fadeIn w-full">
        <div class="p-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'stamp']" class="text-indigo-400 text-xs" />
            <span class="text-[9.5px] font-black uppercase tracking-widest text-slate-200">AI EMBLEM CANVAS PREVIEW</span>
          </div>
          <span class="text-[8px] bg-emerald-955 border border-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">{{ generatedLogoFormat?.toUpperCase() || 'READY' }}</span>
        </div>
        
        <div class="p-4 space-y-3 flex flex-col items-center">
          <div class="relative w-36 h-36 border border-slate-150 dark:border-slate-850 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2 shadow-inner group overflow-hidden animate-fadeIn">
            <!-- Transparent Grid Backdrop simulation -->
            <div class="absolute inset-0 opacity-15" style="background-image: radial-gradient(#94a3b8 1px, transparent 1px); background-size: 8px 8px;"></div>
            <img :src="generatedLogoImage" class="w-full h-full object-contain drop-shadow-md relative z-10" />
          </div>

          <span class="text-[9px] text-slate-400 dark:text-slate-500 text-center">透明底印花贴图已构置完成。请选择放置在衣服的哪个区域：</span>

          <!-- Smart Apply Hotspots Actions Grid -->
          <div class="grid grid-cols-3 gap-1.5 w-full">
            <button
              @click="applyCustomLogoToPosition('center')"
              type="button"
              class="py-1.5 px-1 bg-indigo-600 hover:bg-indigo-505 text-white rounded-lg text-[9px] font-bold cursor-pointer transition-all text-center"
            >
              👑 胸口正中
            </button>
            <button
              @click="applyCustomLogoToPosition('left')"
              type="button"
              class="py-1.5 px-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-705 dark:text-slate-300 rounded-lg text-[9px] font-bold cursor-pointer transition-all text-center"
            >
              🛡️ 左侧心口
            </button>
            <button
              @click="applyCustomLogoToPosition('right')"
              type="button"
              class="py-1.5 px-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-705 dark:text-slate-300 rounded-lg text-[9px] font-bold cursor-pointer transition-all text-center"
            >
              ⚡ 右胸先锋
            </button>
          </div>
        </div>
      </div>

      <!-- Offline / No API key Local Search Selector Results -->
      <div v-show="logoLocalMatches.length > 0 && !isGeneratingLogo" class="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">🎯 推荐竞技徽章与精美贴纸库</span>
          <span class="text-[8px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">100+ 专属矢量大库 </span>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div 
            v-for="item in logoLocalMatches"
            :key="item.id"
            class="p-2 border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900 rounded-xl hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-505 transition-all text-center flex flex-col items-center justify-between relative group"
          >
            <!-- SVG Preview container -->
            <div class="w-12 h-12 flex items-center justify-center p-1 bg-slate-50 dark:bg-slate-955 rounded-lg overflow-hidden border border-slate-150 dark:border-slate-800">
              <div v-if="item.svgContent" v-html="item.svgContent" class="w-full h-full text-indigo-600 dark:text-indigo-400 flex items-center justify-center"></div>
              <img v-else :src="item.svgUrl" class="w-full h-full object-contain" />
            </div>

            <!-- Meta info -->
            <div class="mt-1.5 w-full">
              <span class="text-[8.5px] font-black text-slate-705 dark:text-slate-350 block truncate">{{ item.name }}</span>
            </div>

            <!-- Smart deployment links -->
            <div class="mt-2 w-full grid grid-cols-2 gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                @click="applyLocalLogoItemToPosition(item, 'center')"
                type="button"
                class="py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 text-indigo-605 dark:text-indigo-400 text-[8px] font-bold rounded cursor-pointer transition-all"
                title="置于胸中"
              >
                胸中
              </button>
              <button
                @click="applyLocalLogoItemToPosition(item, 'left')"
                type="button"
                class="py-1 bg-slate-55 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-605 dark:text-slate-300 text-[8px] font-bold rounded cursor-pointer transition-all"
                title="心口处"
              >
                左心
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: AI Live Model Try-On -->
    <div v-else-if="activeSubTab === 'model'" class="space-y-4 animate-fadeIn">
      <!-- Description Section -->
      <div class="p-3 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-xl border border-indigo-105/40 dark:border-indigo-950/50">
        <span class="text-xs font-black text-indigo-700 dark:text-indigo-400 block mb-0.5">🧍 AI 智能上身试样间 (Wear & Try-On)</span>
        <p class="text-[9.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
          AI 智能引擎将自动提炼您当前工作台所设计的<b>款式品类、主配色、印字</b>等参数，并在 3D 模型的基础上直接跨模态渲染出极具真实质感的运动模特全景上身大片！
        </p>
      </div>

      <!-- Current Sync Specs Badge Card -->
      <div class="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/35 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
        <span class="text-[9.5px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">👔 配套样衣参数同步：</span>
        <div class="grid grid-cols-2 gap-2 text-[10px]">
          <div class="flex items-center gap-1.5 text-slate-650 dark:text-slate-400 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span class="truncate">款式：{{ props.currentProduct?.name || '定制运动服' }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-655 dark:text-slate-400 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: currentBaseColor }"></span>
            <span class="font-mono">主色：{{ currentBaseColor }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-650 dark:text-slate-400 col-span-2 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: currentAccentColor }"></span>
            <span class="truncate">印花：{{ activeTeamName ? `"${activeTeamName}"` : '无字标印花' }}</span>
          </div>
        </div>
      </div>

      <!-- Model Presets selector -->
      <div class="space-y-1.5">
        <span class="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">🙋 选择展示模特与场景：</span>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="model in modelPresets" 
            :key="model.id"
            @click="selectedModelPreset = model"
            type="button"
            class="p-2 text-left rounded-xl border transition-all text-xs cursor-pointer active:scale-97 flex flex-col gap-1.5 bg-white dark:bg-slate-900/50 relative overflow-hidden"
            :class="selectedModelPreset.id === model.id ? 'border-indigo-500/85 ring-1 ring-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/10' : 'border-slate-205 dark:border-slate-850 hover:border-slate-350'"
          >
            <!-- Checkmark badge for selected -->
            <div 
              v-if="selectedModelPreset.id === model.id" 
              class="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[7px]"
            >
              <font-awesome-icon :icon="['fas', 'check']" />
            </div>

            <div class="flex items-center gap-2">
              <img :src="model.avatar" class="w-8 h-8 rounded-full object-cover border border-slate-150 dark:border-slate-805" referrerPolicy="no-referrer" />
              <div class="flex flex-col min-w-0">
                <span class="text-[9.5px] font-black text-slate-700 dark:text-slate-300 truncate">{{ model.name }}</span>
                <span class="text-[8px] text-slate-400 mt-0.5 font-bold">{{ model.tag }}</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Posing and Details controls -->
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-1">
          <span class="text-[9.5px] font-bold text-slate-450 dark:text-slate-500 block">📸 拍摄视角：</span>
          <div class="w-full p-2 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-150/45 dark:border-indigo-900/60 rounded-xl text-[10px] text-indigo-650 dark:text-indigo-400 font-extrabold flex items-center gap-1.5 h-[34px]">
            <font-awesome-icon :icon="['fas', 'camera']" class="text-[9px]" />
            <span>模特正面宣传照 (已对齐优化)</span>
          </div>
        </div>
        <div class="space-y-1">
          <span class="text-[9.5px] font-bold text-slate-450 dark:text-slate-500 block">🕶️ 创意微调：</span>
          <input 
            v-model="customModelDetails" 
            type="text"
            placeholder="微笑 / 戴墨镜 / 手持运动水壶..."
            class="w-full py-1.5 px-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-[10px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-650 animate-fadeIn"
          />
        </div>
      </div>

      <!-- Action Button with Debug visual sandbox -->
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <button
            v-if="!isGeneratingModelPhoto"
            @click="runModelTryOnAI"
            type="button"
            class="flex-1 py-3 px-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-md hover:shadow-lg active:scale-97"
          >
            <font-awesome-icon :icon="['fas', 'shirt']" />
            <span>AI 模特上身试衣 · {{ aiPointCosts.modelTryOn }} 积分</span>
          </button>

          <!-- <button
            v-if="!isGeneratingModelPhoto"
            @click="captureDebugSnapshot"
            type="button"
            class="py-3 px-3.5 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-97"
            title="测试捕获当前设计发送给 AI 的原图"
          >
            <font-awesome-icon :icon="['fas', 'eye']" />
            <span>调试：看原图</span>
          </button> -->
        </div>

        <!-- Collapsible Captured Layout Sandbox -->
        <div 
          v-if="debugSnapshot2d || debugSnapshot3d" 
          class="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900/60 space-y-2.5 animate-fadeIn"
        >
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              🔬 [双通道调试] 已发送给 AI 的双极源参考图 (Dual Reference)
            </span>
            <button 
              @click="debugSnapshot2d = null; debugSnapshot3d = null" 
              type="button"
              class="text-[9px] font-bold text-rose-500 hover:text-rose-600 px-1.5 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
            >
              收起
            </button>
          </div>
          <p class="text-[8.5px] text-slate-400 dark:text-slate-500 leading-relaxed">
            我们将 <b>1. 3D WebGL 模型结构图</b>（提供衣领、侧边带、肩线及布料垂坠物理轮廓）与 <b>2. 2D 平面展开贴图</b>（提供最清晰、无拉伸形变的设计图章与文字纹理）同时打包装载输入。这极大增强了 AI 精密对齐和渲染的精确度。
          </p>
          
          <div class="grid grid-cols-2 gap-2 mt-1">
            <!-- 3D Channel -->
            <div class="flex flex-col items-center space-y-1">
              <span class="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">1. 3D 模型特征参考</span>
              <div class="w-full aspect-square bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center relative">
                <img v-if="debugSnapshot3d" :src="debugSnapshot3d" class="w-full h-full object-contain" />
                <div v-else class="text-[8.5px] text-slate-400 dark:text-slate-500 p-2 text-center leading-tight font-medium">暂无三维图层<br/>(非3D视图模式)</div>
              </div>
            </div>
            
            <!-- 2D Channel -->
            <div class="flex flex-col items-center space-y-1">
              <span class="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">2. 2D 细节印字贴图</span>
              <div class="w-full aspect-square bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center relative">
                <img v-if="debugSnapshot2d" :src="debugSnapshot2d" class="w-full h-full object-contain" />
                <div v-else class="text-[8.5px] text-slate-400 dark:text-slate-500 p-2 text-center leading-tight font-medium">暂无二维贴图<br/>(画布加载中)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generating state screen -->
      <div 
        v-if="isGeneratingModelPhoto" 
        class="p-5 border border-indigo-200/40 dark:border-indigo-900/30 bg-indigo-50/10 dark:bg-indigo-950/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 animate-pulse"
      >
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-900"></div>
          <div class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <div>
          <span class="text-xs font-bold text-slate-705 dark:text-slate-300 block">
            {{ currentLoadingStep || '更衣间正在换装...' }}
          </span>
          <span class="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
            正在解构样衣主色板，微积分合成定制字标图层，融入拟合摄影光学阴影...
          </span>
        </div>
      </div>

      <!-- Showcase Result Display Card with Dynamic Local Blending Filter -->
      <div 
        v-if="generatedModelImage" 
        class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl shadow-md overflow-hidden"
      >
        <!-- Showcase Title -->
        <div class="p-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-1.5">
            <font-awesome-icon :icon="['fas', 'camera']" class="text-indigo-400 text-xs" />
            <span class="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-200">AI LIVE WEAR SHOWCASE</span>
          </div>
          <span class="text-[8px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 uppercase">READY</span>
        </div>

        <!-- Render area -->
        <div class="p-4 space-y-3">
          <!-- The container containing dynamic blending if no API key is used -->
          <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-200/50 dark:border-slate-850 shadow-inner flex items-center justify-center">
            
            <template v-if="hasApiKey">
              <!-- Real AI Output -->
              <img 
                :src="generatedModelImage" 
                class="w-full h-full object-cover animate-fadeIn" 
                referrerPolicy="no-referrer" 
              />
            </template>
            <template v-else>
              <!-- High-fidelity local layered template image with active CSS mix-blend blending! -->
              <!-- Layer 1: Base high resolution grayscale model photograph -->
              <img 
                :src="generatedModelImage" 
                class="w-full h-full object-cover grayscale mix-blend-luminosity opacity-85" 
                referrerPolicy="no-referrer" 
              />
              <!-- Layer 2: Base design color overlay blending precisely -->
              <div 
                class="absolute inset-0 mix-blend-color pointer-events-none transition-all duration-500 opacity-65"
                :style="{ backgroundColor: currentBaseColor }"
              ></div>
              <!-- Layer 3: Secondary highlight color layer on collars and hems -->
              <div 
                class="absolute inset-0 mix-blend-overlay pointer-events-none transition-all duration-500 opacity-20"
                :style="{ background: `radial-gradient(circle, transparent 40%, ${currentSecondaryColor} 90%)` }"
              ></div>
              <!-- Layer 4: Custom Word decal projection representing active team design -->
              <div 
                v-if="activeTeamName" 
                class="absolute inset-x-0 top-[40%] text-center pointer-events-none transform -rotate-6 transition-all duration-500 select-none scale-100"
              >
                <div class="inline-block py-1 px-3 shadow-md border bg-black/45 backdrop-blur-[1px] border-white/10 rounded-md">
                  <span 
                    class="text-sm font-extrabold tracking-widest uppercase block"
                    :style="{ 
                      color: currentAccentColor,
                      fontFamily: currentTextFontFamily || 'American Captain',
                      textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                    }"
                  >
                    {{ activeTeamName }}
                  </span>
                </div>
              </div>

              <!-- Overlay info text -->
              <div class="absolute bottom-2 left-2 text-[8px] bg-black/60 text-white border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span>动态高级滤镜实时混合预览中</span>
              </div>
            </template>
          </div>

          <!-- Quick Tip for UX -->
          <div class="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg text-slate-400 dark:text-slate-500 text-[8.5px] leading-relaxed flex items-start gap-1">
            <span>💡</span>
            <span>
              <b>上身效果联动：</b> 只要更改左侧的印字、Logo 或底板配色，右侧的模特上身渲染即会实时自适应进行底色、装饰色、印字文本及字型的精准变化！
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { get, post } from '../../utils/request';
import { useToast } from '../../utils/toast';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../../stores/userStore';
import { PatternPresets } from '../../configs/patterns';
import { makeWhiteBackgroundTransparent } from '../../utils/removeBackground';

const props = defineProps({
  currentRenderData: Object,
  renderData: Array,
  currentProduct: Object,
  modelType: String,
  world: Object,
  editType: String,
});

const emit = defineEmits();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const aiPointCosts = {
  design: 8,
  logo: 16,
  modelTryOn: 25,
};

const userPrompt = ref('');
const isGenerating = ref(false);
const currentLoadingStep = ref('');
const autoSelectSVG = ref(true);
const generateCustomDecal = ref(false);
const syncPantColor = ref(true);

const isSuitProduct = computed(() => {
  return props.currentProduct?.clothType === 'suit';
});

const aiDesignResult = ref(null);
const localLibraryMatches = ref([]);
const generatedBadgeImage = ref(null);

const requireLoginForAI = () => {
  if (userStore.isLoggedIn) return true;

  toast.warning('AI 功能需要登录后使用');
  router.push({
    path: '/login',
    query: { redirect: route.fullPath }
  });
  return false;
};

const syncPointsBalance = (pointsBalance) => {
  if (typeof pointsBalance === 'number') {
    userStore.setPointsBalance(pointsBalance);
  }
};

const handleAIRequestError = (error, fallbackMessage) => {
  const message = error?.message || fallbackMessage;
  const isInsufficientPoints =
    message.includes('Insufficient points') ||
    message.includes('积分不足') ||
    message.includes('points');

  if (isInsufficientPoints) {
    toast.warning('积分不足，请先充值后再使用 AI 功能');
    router.push({ path: '/recharge', query: { redirect: route.fullPath } });
    return;
  }

  toast.error(message || fallbackMessage);
};

// AI Sub-Tab selection
const activeSubTab = ref('design'); // 'design' or 'model'

// Try-on features properties
const modelPresets = [
  {
    id: 'male_court',
    name: '男子热血操场 (Sunny Athlete)',
    gender: 'young handsome fit athletic male',
    desc: 'with high-definition athletic physique, muscular chest and arms, light tanned skin, energetic confident expression',
    pose: 'holding a basketball under arm, posing on a court with supreme confidence, looking at camera',
    bg: 'stunning outdoor urban basketball court at golden hour, blurred industrial metal mesh fence in background, sunset lighting',
    avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=350&h=350',
    tag: '阳光动感'
  },
  {
    id: 'female_track',
    name: '女子健美跑道 (Lean Runner)',
    gender: 'young beautiful athletic fitness female',
    desc: 'toned lean athletic build, high-definition abs, beautiful dynamic sport energy, braided hair, subtle glistening sweat',
    pose: 'crouching in standard start position on stadium running lane, looking forward with intense focus and confidence',
    bg: 'outdoor stadium running track, stadium lanes, professional sports field, cinematic sports photography aesthetic',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=350&h=350',
    tag: '健美力量'
  },
  {
    id: 'studio_unisex',
    name: '高级时尚摄影棚 (Studio Tech)',
    gender: 'cool detached neutral professional sports model',
    desc: 'sculpted athletic build, modern professional fitness model onwear look, stylish short hair, cool gaze',
    pose: 'standing in a crisp minimalist fashion pose, focusing light on the shirt texture details and clean lines',
    bg: 'sleek ultra clean professional photography studio backdrop, spotlight casting elegant key lighting and soft backlighting',
    avatar: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&q=80&w=350&h=350',
    tag: '奢华时尚'
  },
  {
    id: 'urban_neon',
    name: '街头霓虹滑板 (Extreme Skate)',
    gender: 'cool stylish energetic trendy street skater',
    desc: 'athletic posture, energetic modern youngster style, casual and rebellious confidence',
    pose: 'leaning casually next to a carbon fiber skateboard, front and shoulder view with relaxed body posture',
    bg: 'cyberpunk street corner in Tokyo at night, gorgeous glowing yellow and cyan neon signs, rain slicked cobblestones reflecting colorful streetlights',
    avatar: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=350&h=350',
    tag: '极客街头'
  }
];

const selectedModelPreset = ref(modelPresets[0]);
const modelPosingStyle = ref('front');
const customModelDetails = ref('');
const isGeneratingModelPhoto = ref(false);
const generatedModelImage = ref(null);
const debugSnapshot2d = ref(null);
const debugSnapshot3d = ref(null);

// AI Logo Generator custom states and presets
const aiLogoPrompt = ref('');
const activeLogoStyle = ref('vector');
const logoOutputFormat = ref('svg');
const logoTrimWhite = ref(true);
const logoInheritColors = ref(true);
const isGeneratingLogo = ref(false);
const generatedLogoImage = ref(null);
const generatedLogoFormat = ref(null);
const logoLocalMatches = ref([]);
const resourceBaseUrl = import.meta.env.VITE_RESOURCE_URL || 'http://localhost:3000';

const logoStylePresets = [
  { 
    id: 'vector', 
    name: '现代竞技矢量 (Modern Vector)', 
    desc: '扁平高能几何矢量图章。',
    promptAddition: 'Modern high-contrast minimalist flat vector sports logo, simple geometric outline emblem, clean sportswear design illustration, bold contrast lines'
  },
  { 
    id: 'vintage', 
    name: '复古传奇徽章 (Classic Retro)', 
    desc: '常春藤经典学院风及盾形外廓。',
    promptAddition: 'Vintage classic collegiate athletic club crest logo, circular seal border outline with retro typography accenting, premium clean sport heritage shield'
  },
  { 
    id: 'gaming', 
    name: '电竞猛禽巨兽 (Gaming Esport)', 
    desc: '电竞赛事锋芒犀利兽首图腾。',
    promptAddition: 'Aggressive esport sports gaming team mascot emblem logo, sharp stylized wild beast animal head crest, modern vector outline illustration, athletic badge'
  },
  { 
    id: 'luxury', 
    name: '奢华极简机能 (Luxury Abstract)', 
    desc: '大师级极简几何时尚设计。',
    promptAddition: 'Elegant luxury brand monogram, high-end minimal abstract geometric fashion logo, technical sportswear label graphic emblem'
  }
];

// Get currently configured colors and texts dynamically
const currentBaseColor = computed(() => {
  if (props.currentRenderData?.colors) {
    const baseObj = props.currentRenderData.colors.find(c => c.id === 'COLOUR_BASE');
    return baseObj?.color || '#111111';
  }
  return '#111111';
});

const currentAccentColor = computed(() => {
  if (props.currentRenderData?.colors) {
    const actObj = props.currentRenderData.colors.find(c => c.id === 'COLOUR_PRIMARY') || props.currentRenderData.colors.find(c => c.id === 'COLOUR_SECONDARY');
    return actObj?.color || '#ffffff';
  }
  return '#ffffff';
});

const currentSecondaryColor = computed(() => {
  if (props.currentRenderData?.colors) {
    const actObj = props.currentRenderData.colors.find(c => c.id === 'COLOUR_SECONDARY');
    return actObj?.color || '#333333';
  }
  return '#333333';
});

const currentHemColor = computed(() => {
  if (props.currentRenderData?.colors) {
    const actObj = props.currentRenderData.colors.find(c => c.id === 'COLOUR_HEM');
    return actObj?.color || '#111111';
  }
  return '#111111';
});

const activeTeamName = computed(() => {
  if (props.currentRenderData?.texts?.length > 0) {
    return props.currentRenderData.texts[0].text;
  }
  return '';
});

const currentTextFontFamily = computed(() => {
  if (props.currentRenderData?.texts?.length > 0) {
    return props.currentRenderData.texts[0].fontFamily;
  }
  return 'American Captain';
});

const currentProductType = computed(() => props.currentProduct?.clothType || 'sportswear');

const availableColorParts = computed(() => {
  return (props.currentRenderData?.colors || []).map((part) => ({
    id: part.id,
    name: part.name,
    color: part.color,
  }));
});

const currentColors = computed(() => {
  return (props.currentRenderData?.colors || []).reduce((acc, part) => {
    acc[part.id] = part.color;
    return acc;
  }, {});
});

const availablePatterns = computed(() => {
  return PatternPresets.map((pattern) => ({
    id: pattern.id,
    name: pattern.name,
    category: pattern.category,
    keywords: [pattern.id, pattern.name, pattern.category].filter(Boolean),
    url: pattern.url,
  }));
});

const resolvePatternUrl = (pattern) => {
  if (pattern?.url) return pattern.url;
  if (pattern?.patternId) {
    const localPattern = PatternPresets.find((item) => item.id === pattern.patternId);
    if (localPattern?.url) {
      return localPattern.url;
    }
  }
  return null;
};

// Helper prompt building formula supporting single or dual reference tracks
const constructModelPrompt = (hasBoth = false, has2dOnly = false, has3dOnly = false) => {
  const model = selectedModelPreset.value;
  const product = props.currentProduct?.name || 'custom athletic sportswear';
  
  // text overlay representation
  let textDesc = '';
  if (activeTeamName.value) {
    textDesc = `with clean block print matching typography '${activeTeamName.value}' on front chest`;
  }
  
  const posingText = 'standing in a perfectly centered, clear straight front-facing model portrait pose, framing the absolute front view of the chest and torso to clearly showcase the custom jersey design and lettering details';
  const customDetailsText = customModelDetails.value ? 'Special requests: ' + customModelDetails.value : '';
  
  let prompt = '';
  if (hasBoth) {
    prompt = `Highest quality professional commercial sports catalogue photography: An athletic ${model.gender} ${model.desc}, ${posingText}, wearing the custom sports ${product} uniform.

We have attached TWO complementary references to guarantee pixel-perfect reconstruction:
1. "Reference Image 1: 3D WebGL Mockup": This is a 3D WebGL preview on a 3D body form. Use it for physical context: understand the structural layout, collar style, hem contours, shoulder fit, panel proportions, and overall drapery alignment.
2. "Reference Image 2: 2D Layout Blueprint": This is a pristine, flat 2D layout pattern from our vector design board. Use it as the master high-fidelity texture source: it provides distortion-free typography glyphs, branding insignias, numbers, and exact graphic alignments.

YOUR MISSION:
- You MUST synthesize both references perfectly. Translate the crisp flat designs from Reference 2 (the 2D Blueprint) onto the active physical layout zones shown on Reference 1 (the 3D Mockup).
- The main chest custom printed text logo is: '${activeTeamName.value}'. Keep this typography centered, readable, and aligned precisely on the chest area just as previewed.
- Match colors exactly: base color is hex ${currentBaseColor.value}, accent trim blocks/sleeves are hex ${currentSecondaryColor.value || currentAccentColor.value}, and hem borders are hex ${currentHemColor.value}.
- Background scene: ${model.bg}.
- Aesthetics: ${customDetailsText} Extremely realistic skin texture and muscle definition, natural fabric drape with micro garments folds, professional outdoor/indoor dramatic photography lighting, premium sports catalogue grade, 8k resolution, photorealistic masterpiece.`;
  } else if (has3dOnly) {
    prompt = `Highest quality professional commercial sports catalogue photography: An athletic ${model.gender} ${model.desc}, ${posingText}, wearing the sports ${product} uniform. The provided reference image is a 3D WebGL render of the exact custom uniform showcasing precise physical layout placement. You MUST match the clothing's exact colors (base color hex ${currentBaseColor.value}, accent borders/sleeves of ${currentSecondaryColor.value || currentAccentColor.value}, hems of ${currentHemColor.value}), the exact placement and shape of logo graphics, sports crests, and custom typography exactly as aligned on the 3D body representation, ensuring collar elements stay perfectly on the collar and shoulder elements stay perfectly on the shoulders. Background setting is ${model.bg}. ${customDetailsText}. Extremely realistic skin and muscle detail, elegant fabric drape and realistic garment folds, cinematic photorealistic lighting, full studio production value, 8k resolution, award winning sport photography.`;
  } else if (has2dOnly) {
    prompt = `Highest quality professional commercial sports catalogue photography: An athletic ${model.gender} ${model.desc}, ${posingText}, wearing the sports ${product} uniform. The provided reference image is a flat 2D custom graphic apparel design template showing the layout panels (with the T-shirt front panel layout on the left side of the graphic, and back panel layout on the right side). You MUST translate this flat 2D design layout into a realistic 3D wearing look on the model. Match the apparel base color hex ${currentBaseColor.value}, accents of ${currentSecondaryColor.value || currentAccentColor.value} and hems of ${currentHemColor.value}. Identify custom logos, graphics, and typography (specifically looking at the front panel layout on the left side of the reference image) and wrap them naturally on the model's front upper chest torso exactly where they belong. The typography on chest is: '${activeTeamName.value}'. Keep all design elements crisp, beautifully centered, physically correct, and fully custom. Background setting is ${model.bg}. ${customDetailsText}. Extremely realistic skin and muscle detail, elegant fabric drape and realistic garment folds, cinematic photorealistic lighting, full studio production value, 8k resolution, award winning sport photography.`;
  } else {
    prompt = `Highest quality professional commercial sports catalogue photography: An athletic ${model.gender} ${model.desc}, ${posingText}, wearing a fully customized sports ${product} uniform. The uniform consists of base color exact hex ${currentBaseColor.value}, accented beautifully with borders of ${currentAccentColor.value} and hems of ${currentHemColor.value}. ${textDesc}. Background setting is ${model.bg}. ${customDetailsText}. Extremely realistic skin and muscle detail, elegant fabric drape and realistic garment folds, cinematic photorealistic lighting, full studio production value, 8k resolution, award winning sport photography.`;
  }
  return prompt;
};

// Function to capture both 2D static fabric designs and 3D WebGL viewport designs
const getDualDesignSnapshots = () => {
  let snap3d = null;
  let snap2d = null;

  // 1. Capture 3D render snapshot if WebGL context exists
  try {
    if (props.world && typeof props.world.get3DModelSnapshot === 'function') {
      const snap = props.world.get3DModelSnapshot();
      if (snap && snap.length > 100 && snap !== 'data:,') {
        snap3d = snap;
      }
    }
  } catch (err) {
    console.warn('Could not extract active 3D WebGL snapshot:', err);
  }

  // 2. Capture 2D Fabric canvas design panel snapshot
  try {
    const editor = props.world.getSvgEditorByType(props.modelType);
    if (editor && editor.canvas) {
      // Temporarily clear active selection to avoid drawing handles/borders in the layout snapshot
      const activeObj = editor.canvas.getActiveObject();
      if (activeObj) {
        editor.canvas.discardActiveObject();
        editor.canvas.requestRenderAll();
      }
      
      const snap = editor.canvas.toDataURL({ format: 'png', quality: 1.0 });
      
      // Restore active selection
      if (activeObj) {
        editor.canvas.setActiveObject(activeObj);
        editor.canvas.requestRenderAll();
      }
      if (snap && snap.length > 100 && snap !== 'data:,') {
        snap2d = snap;
      }
    }
  } catch (err) {
    console.warn('Could not extract 2D canvas layout snapshot:', err);
  }

  return { snap2d, snap3d };
};

// Debug action to capture and display both design snapshots
const captureDebugSnapshot = () => {
  const { snap2d, snap3d } = getDualDesignSnapshots();
  debugSnapshot2d.value = snap2d;
  debugSnapshot3d.value = snap3d;
  
  if (snap2d || snap3d) {
    let msg = '📸 已成功捕获当前设计快照！包含 ';
    if (snap3d) msg += '3D模型快照 ';
    if (snap2d) msg += '2D平面贴图 ';
    toast.success(msg);
  } else {
    toast.error('❌ 无法捕获当前设计视图，请确保画布已就绪。');
  }
};

// Model Dress orchestrator
const runModelTryOnAI = async () => {
  if (!selectedModelPreset.value) {
    toast.error('请先选择一位 AI 模特！');
    return;
  }
  if (!requireLoginForAI()) return;

  isGeneratingModelPhoto.value = true;
  generatedModelImage.value = null;
  currentLoadingStep.value = '正在提取并发送 3D/2D 双通道设计快照...';

  const { snap2d, snap3d } = getDualDesignSnapshots();
  debugSnapshot2d.value = snap2d;
  debugSnapshot3d.value = snap3d;

  try {
    const hasBoth = !!(snap2d && snap3d);
    const has2dOnly = !snap3d && !!snap2d;
    const has3dOnly = !snap2d && !!snap3d;
    const prompt = constructModelPrompt(hasBoth, has2dOnly, has3dOnly);

    const aiResponse = await post('/ai/model-preview', {
      prompt,
      modelPreset: selectedModelPreset.value,
      snap2d,
      snap3d,
    }, {
      timeout: 120000,
    });

    syncPointsBalance(aiResponse.pointsBalance);

    if (aiResponse.result?.imageUrl) {
      generatedModelImage.value = aiResponse.result.imageUrl;
      toast.success(`AI 模特试穿已生成，消耗 ${aiResponse.costPoints} 积分`);
    } else {
      generatedModelImage.value = selectedModelPreset.value.avatar;
      toast.success(`AI 模特试穿已扣除 ${aiResponse.costPoints} 积分，当前使用本地预览图。`);
    }
  } catch (err) {
    console.error('AI Model preview failed:', err);
    handleAIRequestError(err, '积分不足、登录过期或 AI 试穿生成失败，请处理后再试。');
  } finally {
    isGeneratingModelPhoto.value = false;
  }
};





const DEFAULT_TXT_ITEM = {
  text: 'NAME',
  fill: '#ffffff',
  fontSize: 40,
  fontFamily: 'serif',
  fontWeight: 500,
  charSpacing: 100,
  textAlign: 'center',
  lineHeight: 1.2,
  fontStyle: 'normal',
  underline: false,
  stroke: '',
  strokeWidth: 1,
  curveValue: 50,
};

// AI generation is handled by the backend proxy.
const hasApiKey = computed(() => true);

onMounted(async () => {
  if (hasApiKey.value) {
    generateCustomDecal.value = true;
  }
  // Load default premium presets for logo matching gallery on startup
  try {
    const defaultResult = await get('/resources?limit=6&search=star');
    if (defaultResult && defaultResult.items) {
      logoLocalMatches.value = defaultResult.items.map(item => ({
        id: item.id,
        name: item.name,
        svgContent: item.svgContent,
        svgUrl: `${resourceBaseUrl}/resources/${item.relativePath}`
      }));
    }
  } catch (err) {
    console.warn('Could not pre-populate default logo library matches:', err);
  }
});

// Preset recommendations for immediate, delightful experience
const presets = [
  { 
    name: '灰烬与烈焰 ☄️', 
    styleTag: '高能竞技',
    prompt: '橙红与焦炭黑的交错。胸部具有弧拱形的 “PHOENIX” 烈焰文字。主微量采用火焰的抽象徽志，富有狂野的斗志。' 
  },
  { 
    name: '北欧静谧原野 🍃', 
    styleTag: '极简森系',
    prompt: '深邃高耸的松针墨绿。辅以大地灰和卡其白。心口点缀极小体量一行单行字母标，配以精致的月桂树、叶片的简约配图。' 
  },
  { 
    name: '东京极夜虹霓 🌌', 
    styleTag: '赛博霓虹',
    prompt: '幽深沉稳的黑炭灰色做基地。注入炫亮的荧光极光粉与电光蓝线条。胸正中辅以卡通机能漫画徽章，具有潮流冲突张力。' 
  },
  { 
    name: '洛杉矶黄金巨星 🏀', 
    styleTag: '洛城经典',
    prompt: '高饱和的亮色明黄色。辅助紫金衣褶线条和黑色衣领。胸中配备金边 American Captain 厚重立体的 “CHAMPIONS” 斜切印字。' 
  }
];

const applyPreset = (preset) => {
  userPrompt.value = preset.prompt;
};

const showKeyTip = () => {
  toast.info('AI 生成已由后端代理处理，请确认后端 AI 服务已启用。');
};

const handleCustomDecalClick = (e) => {
  if (!hasApiKey.value) {
    e.preventDefault();
    e.stopPropagation();
    showKeyTip();
  }
};

const getPartLabel = (key) => {
  const partsMap = {
    'COLOUR_BASE': '底片色',
    'COLOUR_SECONDARY': '侧袖/衣领',
    'COLOUR_PRIMARY': '辅色线条/装饰',
    'COLOUR_HEM': '下摆/袖口收边'
  };
  return partsMap[key] || '局部颜色';
};

const getDecalRoleLabel = (role) => {
  const roleMap = {
    'primary_badge': '核心主题徽志 (Left Chest / Center)',
    'brand_logo': '专业体育品牌标 (Right Chest)',
    'sponsor': '胸前副标志 / 赞助商微章 (Sponsor Banner)'
  };
  return roleMap[role] || role;
};

// Apply a single recommended color of the palette to a specific part
const applySingleColor = (partId, hex) => {
  const editor = props.world.getSvgEditorByType(props.modelType);
  if (!editor) {
    toast.error('找不到对应的服装编辑器。');
    return;
  }

  const part = props.currentRenderData.colors.find(p => p.id === partId);
  if (part) {
    part.color = hex;
    editor.setColor(partId, hex);

    // Sync to pants if checked
    if (syncPantColor.value && isSuitProduct.value && props.renderData) {
      const pantData = props.renderData.find(v => v.type === 'pant');
      const pantEditor = props.world.getSvgEditorByType('pant');
      if (pantData && pantEditor) {
        const pantPart = pantData.colors.find(p => p.id === partId);
        if (pantPart) {
          pantPart.color = hex;
          pantEditor.setColor(partId, hex);
        }
      }
    }

    editor.markTextureNeedsUpdate();
    toast.success(`已应用 ${getPartLabel(partId)} 为: ${hex}`);
  }
};

// Apply entire color recommendation at once
const applyEntirePaletteOnly = () => {
  if (!aiDesignResult.value || !aiDesignResult.value.jerseyColors) {
    toast.warning('暂无可以应用的色彩处方。');
    return;
  }
  const colors = aiDesignResult.value.jerseyColors;
  const editor = props.world.getSvgEditorByType(props.modelType);
  if (!editor) return;

  props.currentRenderData.colors.forEach((part) => {
    const aiColor = colors[part.id];
    if (aiColor) {
      part.color = aiColor;
      editor.setColor(part.id, aiColor);
    }
  });

  // Sync back to pants if suit is selected
  if (syncPantColor.value && isSuitProduct.value && props.renderData) {
    const pantData = props.renderData.find(v => v.type === 'pant');
    const pantEditor = props.world.getSvgEditorByType('pant');
    if (pantData && pantEditor) {
      pantData.colors.forEach((part) => {
        const aiColor = colors[part.id];
        if (aiColor) {
          part.color = aiColor;
          pantEditor.setColor(part.id, aiColor);
        }
      });
    }
  }

  editor.markTextureNeedsUpdate();
  toast.success('🎉 整套色彩提案已全幅投射至服装模型！');
};

// Apply a single recommended text element
const applySingleText = (txt) => {
  const editor = props.world.getSvgEditorByType(props.modelType);
  if (!editor) {
    toast.error('服装编辑器不可用。');
    return;
  }

  const W = editor.canvas.getWidth() || 720;
  const H = editor.canvas.getHeight() || 720;

  const leftRatio = txt.leftRatio !== undefined ? txt.leftRatio : 0.5;
  const topRatio = txt.topRatio !== undefined ? txt.topRatio : 0.65;

  const textOptions = {
    ...DEFAULT_TXT_ITEM,
    text: txt.text,
    fill: txt.fill,
    fontFamily: txt.fontFamily || 'Komikazoom',
    fontSize: txt.fontSize || 42,
    isCurved: txt.isCurved || false,
    curveValue: txt.curveValue || 45,
    left: W * leftRatio,
    top: H * topRatio
  };

  const newText = editor._addText(textOptions);
  if (newText) {
    textOptions.id = newText.id;
    // Remove duplicates if same spelling to keep canvas neat!
    props.currentRenderData.texts = props.currentRenderData.texts.filter(t => t.text !== txt.text);
    props.currentRenderData.texts.unshift(textOptions);
    
    editor.markTextureNeedsUpdate();
    toast.success(`已在绝对坐标 [${leftRatio.toFixed(2)}, ${topRatio.toFixed(2)}] 投放定制字图 "${txt.text}"`);
  }
};

// Helper for image transparent badge placement
const applyGeneratedBadgeImage = async () => {
  if (!generatedBadgeImage.value) return;
  const editor = props.world.getSvgEditorByType(props.modelType);
  if (!editor) return;

  const W = editor.canvas.getWidth() || 720;
  const H = editor.canvas.getHeight() || 720;

  try {
    const imgObj = await editor.addLogo(generatedBadgeImage.value, {
      left: W * 0.5,
      top: H * 0.48
    });
    if (imgObj) {
      imgObj.set({
        scaleX: imgObj.scaleX * 0.95,
        scaleY: imgObj.scaleY * 0.95,
      });
      editor.canvas.requestRenderAll();
      props.currentRenderData.logos.unshift({ id: imgObj.id, url: generatedBadgeImage.value });
      editor.markTextureNeedsUpdate();
      toast.success('已应用专属核心透明 PNG 徽章到胸部正中！');
    }
  } catch (err) {
    console.error('Failed to add transparent custom badge:', err);
    toast.error('贴纸投射失败。');
  }
};

// Select a local matching SVG and upload into canvas
const selectLocalLibraryItem = (item) => {
  if (!item || !item.svgUrl) return;
  emit('uploadLogo', item.svgUrl);
  toast.success(`已成功添加 [${item.name}] 推荐素材到画布中，您可以随意拖拽旋转。`);
};

// Trigger AI Generation Orchestration
const triggerAIGeneration = async () => {
  if (!userPrompt.value.trim()) return;
  if (!requireLoginForAI()) return;

  isGenerating.value = true;
  aiDesignResult.value = null;
  localLibraryMatches.value = [];
  generatedBadgeImage.value = null;

  try {
    currentLoadingStep.value = '正在校验登录状态与积分余额...';
    const aiResponse = await post('/ai/design', {
      prompt: userPrompt.value,
      generateCustomDecal: generateCustomDecal.value,
      productType: currentProductType.value,
      primaryText: activeTeamName.value || undefined,
      availableColorParts: availableColorParts.value,
      currentColors: currentColors.value,
      availablePatterns: availablePatterns.value,
    });

    syncPointsBalance(aiResponse.pointsBalance);
    aiDesignResult.value = aiResponse.result;

    const primaryBadgeDecal =
      aiResponse.result?.decals?.find(d => d.role === 'primary_badge') ||
      aiResponse.result?.decals?.[0];
    if (primaryBadgeDecal?.localMatches) {
      localLibraryMatches.value = primaryBadgeDecal.localMatches;
    }
    if (aiResponse.result?.generatedBadgeImage) {
      generatedBadgeImage.value = aiResponse.result.generatedBadgeImage;
    }
    toast.success(`AI 设计方案已生成，消耗 ${aiResponse.costPoints} 积分`);
  } catch (error) {
    console.error('AI Generation Failed:', error);
    handleAIRequestError(error, 'AI 方案策划遇到一点小麻烦，请稍后重试。');
  } finally {
    isGenerating.value = false;
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Apply all AI design changes to 3D fabric canvas at once
const applyDesignToJersey = async () => {
  if (!aiDesignResult.value) return;

  const result = aiDesignResult.value;
  const editor = props.world.getSvgEditorByType(props.modelType);
  if (!editor) {
    toast.error('找不到对应的服装编辑器。');
    return;
  }

  const W = editor.canvas.getWidth() || 720;
  const H = editor.canvas.getHeight() || 720;

  // 1. Colors Apply
  if (result.jerseyColors) {
    props.currentRenderData.colors.forEach((part) => {
      const aiColor = result.jerseyColors[part.id];
      if (aiColor) {
        part.color = aiColor;
        editor.setColor(part.id, aiColor);
      }
    });

    if (syncPantColor.value && isSuitProduct.value && props.renderData) {
      const pantData = props.renderData.find(v => v.type === 'pant');
      const pantEditor = props.world.getSvgEditorByType('pant');
      if (pantData && pantEditor) {
        pantData.colors.forEach((part) => {
          const aiColor = result.jerseyColors[part.id];
          if (aiColor) {
            part.color = aiColor;
            pantEditor.setColor(part.id, aiColor);
          }
        });
      }
    }
  }

  // 2. Clear old texts
  (props.currentRenderData.patterns || []).forEach((pattern) => {
    const targetIds =
      pattern.targetMode === 'parts' && Array.isArray(pattern.targetPartIds) && pattern.targetPartIds.length
        ? pattern.targetPartIds
        : ['ALL'];
    targetIds.forEach((targetId) => {
      editor.removePattern(targetId);
    });
  });
  props.currentRenderData.patterns = [];

  // 3. Clear old texts
  props.currentRenderData.texts.forEach((txt) => {
    editor.removeObjectById(txt.id);
  });
  props.currentRenderData.texts = [];

  // 4. Clear old logos
  props.currentRenderData.logos.forEach((logo) => {
    editor.removeObjectById(logo.id);
  });
  props.currentRenderData.logos = [];

  // 5. Patterns
  if (result.patterns && result.patterns.length) {
    for (const pattern of result.patterns) {
      const patternUrl = resolvePatternUrl(pattern);
      if (!patternUrl) {
        continue;
      }
      const patternOptions = {
        url: patternUrl,
        scale: pattern.scale,
        angle: pattern.angle,
        opacity: pattern.opacity,
        offsetX: pattern.offsetX ?? 0,
        offsetY: pattern.offsetY ?? 0,
        patternColor: pattern.patternColor,
        bgColor: null,
      };
      const targetIds =
        pattern.targetMode === 'parts' && Array.isArray(pattern.targetPartIds) && pattern.targetPartIds.length
          ? pattern.targetPartIds
          : ['ALL'];
      for (const targetId of targetIds) {
        await editor.setPattern(targetId, patternOptions);
      }
      props.currentRenderData.patterns.unshift({
        ...pattern,
        url: patternUrl,
        targetPartIds: targetIds[0] === 'ALL' ? [] : [...targetIds],
        targetMode: targetIds[0] === 'ALL' ? 'all' : 'parts',
      });
    }
  }

  // 6. Texts
  if (result.texts && result.texts.length) {
    result.texts.forEach((txt) => {
      const leftRatio = txt.leftRatio !== undefined ? txt.leftRatio : 0.5;
      const topRatio = txt.topRatio !== undefined ? txt.topRatio : 0.7;
      const textOptions = {
        ...DEFAULT_TXT_ITEM,
        text: txt.text,
        fill: txt.fill,
        fontFamily: txt.fontFamily || 'Komikazoom',
        fontSize: txt.fontSize || 40,
        isCurved: txt.isCurved || false,
        curveValue: txt.curveValue || 50,
        left: W * leftRatio,
        top: H * topRatio
      };

      const newText = editor._addText(textOptions);
      if (newText) {
        textOptions.id = newText.id;
        props.currentRenderData.texts.unshift(textOptions);
      }
    });
  }

  // 7. Decals Placement
  if (result.decals && result.decals.length) {
    for (const decal of result.decals) {
      const leftRatio = decal.leftRatio !== undefined ? decal.leftRatio : 0.5;
      const topRatio = decal.topRatio !== undefined ? decal.topRatio : 0.5;
      const scaleVal = decal.scale !== undefined ? decal.scale : 0.6;

      let src = null;
      if (decal.role === 'primary_badge' && generatedBadgeImage.value) {
        src = generatedBadgeImage.value;
      } else if (decal.localMatches && decal.localMatches.length > 0) {
        src = decal.localMatches[0].svgUrl;
      }

      if (src) {
        try {
          const imgObj = await editor.addLogo(src, {
            left: W * leftRatio,
            top: H * topRatio
          });
          if (imgObj) {
            imgObj.set({
              scaleX: imgObj.scaleX * scaleVal,
              scaleY: imgObj.scaleY * scaleVal,
            });
            editor.canvas.requestRenderAll();
            props.currentRenderData.logos.unshift({ id: imgObj.id, url: src });
          }
        } catch (err) {
          console.warn('Failed to place composed decal:', decal.role, err);
        }
      }
    }
  }

  editor.markTextureNeedsUpdate();

  toast.success('🎉 AI 专属设计师成套定制方案全幅合构，已成功应用至样衣！');
};

// AI Logo Custom generation actions
const triggerLogoGeneration = async () => {
  if (!aiLogoPrompt.value.trim()) {
    toast.warning('请输入所需的印花徽标描述！');
    return;
  }
  if (!requireLoginForAI()) return;
  
  isGeneratingLogo.value = true;
  generatedLogoImage.value = null;
  generatedLogoFormat.value = null;
  
  try {
    const aiResponse = await post('/ai/logo', {
      prompt: aiLogoPrompt.value,
      style: activeLogoStyle.value,
      inheritColors: logoInheritColors.value,
      baseColor: currentBaseColor.value,
      accentColor: currentAccentColor.value,
      outputFormat: logoOutputFormat.value,
    });

    syncPointsBalance(aiResponse.pointsBalance);
    logoLocalMatches.value = aiResponse.result?.localMatches || [];
    const rawLogoImage = aiResponse.result?.imageUrl || logoLocalMatches.value[0]?.svgUrl || null;
    if (
      rawLogoImage &&
      logoOutputFormat.value === 'png' &&
      logoTrimWhite.value &&
      rawLogoImage.startsWith('data:image/png')
    ) {
      generatedLogoImage.value = await makeWhiteBackgroundTransparent(rawLogoImage);
    } else {
      generatedLogoImage.value = rawLogoImage;
    }
    generatedLogoFormat.value = aiResponse.result?.outputFormat || logoOutputFormat.value;
    toast.success(`AI 印花已生成，消耗 ${aiResponse.costPoints} 积分`);
  } catch (err) {
    console.error('AI Logo generation failed:', err);
    handleAIRequestError(err, 'AI 印花构建稍有波动，请检查网络或重试。');
  } finally {
    isGeneratingLogo.value = false;
  }
};

const applyCustomLogoToPosition = async (position = 'center') => {
  if (!generatedLogoImage.value) return;
  await applyLogoToCoordinate(generatedLogoImage.value, position);
};

const applyLocalLogoItemToPosition = async (item, position = 'center') => {
  if (!item || !item.svgUrl) return;
  await applyLogoToCoordinate(item.svgUrl, position);
};

const applyLogoToCoordinate = async (imgUrl, position = 'center') => {
  const editor = props.world.getSvgEditorByType(props.modelType);
  if (!editor) {
    toast.error('找不到对应图层编辑器');
    return;
  }

  const W = editor.canvas.getWidth() || 720;
  const H = editor.canvas.getHeight() || 720;
  
  let leftRatio = 0.5;
  let topRatio = 0.48;
  let labelText = '胸部正中';

  if (position === 'left') {
    leftRatio = 0.35;
    topRatio = 0.42;
    labelText = '左侧心口';
  } else if (position === 'right') {
    leftRatio = 0.65;
    topRatio = 0.42;
    labelText = '右侧心口';
  }

  try {
    const imgObj = await editor.addLogo(imgUrl, {
      left: W * leftRatio,
      top: H * topRatio
    });
    
    if (imgObj) {
      imgObj.set({
        scaleX: imgObj.scaleX * (position === 'center' ? 0.95 : 0.72),
        scaleY: imgObj.scaleY * (position === 'center' ? 0.95 : 0.72),
      });
      editor.canvas.requestRenderAll();
      props.currentRenderData.logos.unshift({ id: imgObj.id, url: imgUrl });
      
      editor.markTextureNeedsUpdate();
      toast.success(`🎉 印花已成功投放至 [${labelText}]！您可用鼠标点击旋转移动它。`);
    }
  } catch (err) {
    console.error('Failed to project logo sticker:', err);
    toast.error('应用印花贴纸失败');
  }
};
</script>

<style scoped>
.peer-checked\:after\:translate-x-full:checked::after {
  transform: translateX(100%);
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
