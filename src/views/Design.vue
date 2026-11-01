<template>
  <div class="design-container bg-slate-50 dark:bg-darker min-h-screen transition-colors duration-300">
    <div class="overflow-y-auto text-slate-800 dark:text-slate-205">
      <div class=" mx-auto grid grid-cols-1 lg:grid-cols-12 h-full gap-2 sm:gap-6">
        <!-- <div ref="glCanvas" class="w-full h-full absolute top-0 left-0 z-10"></div> -->
        <div 
          ref="editContainerRef"
          id="edit-container" 
          class="relative isolate w-full h-[50vh] md:h-[70vh] lg:h-full lg:col-span-8 z-[10000] lg:z-[49] border-container transition-all duration-500 ease-out overflow-hidden" 
          :style="{ backgroundColor: activeBgColor }"
          @mousedown="handleBgMouseDown"
          @mousemove="handleBgMouseMove"
          @mouseup="handleBgMouseUp"
          @mouseleave="handleBgMouseUp"
        >
          <!-- 返回按钮 - 放在顶部 -->
          <button
            @click="router.back()"
            class="z-[10020] lg:z-[260] absolute left-2 top-2 sm:left-4 sm:top-4 w-10 h-10 rounded-full bg-white dark:bg-dark hover:bg-slate-100 dark:hover:bg-darker 
                   transition-colors duration-300 flex items-center justify-center text-slate-700 dark:text-white 
                   border border-slate-200 dark:border-slate-800 shadow-md group cursor-pointer pointer-events-auto"
            title="返回上一页"
          >
            <font-awesome-icon
              :icon="['fas', 'arrow-left']"
              class="group-hover:scale-110 transition-transform duration-300"
            />
          </button>

          <!-- 修改服装类型选择tabs -->
          <div class="z-[260] absolute right-4 top-4 flex flex-col items-end gap-3 pointer-events-none">
            <div class="inline-grid grid-cols-2 gap-0 bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 p-0.5 rounded-full shadow-md pointer-events-auto">
              <button
                @click="switch2_3D('2D')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
                  editType === '2D' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                ]"
                title="切换2D模式"
              >
                <svg t="1750953950619" width="50%" height="50%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8412" xmlns:xlink="http://www.w3.org/1999/xlink" ><path d="M1019.815253 635.448889c-7.168 23.381333-20.48 42.268444-35.84 57.856a320.739556 320.739556 0 0 1-51.143111 41.130667c-73.671111 47.843556-158.606222 74.467556-234.382222 92.273777a1189.546667 1189.546667 0 0 1-91.079111 15.587556v-119.011556c23.552 0 50.119111 0 77.767111-2.218666 70.599111-4.437333 152.519111-15.587556 221.070222-43.349334 33.792-14.449778 65.536-33.393778 78.848-58.936889a55.239111 55.239111 0 0 0 5.12-40.049777 112.753778 112.753778 0 0 0-19.512889-36.693334 255.772444 255.772444 0 0 0-48.071111-44.487111c-13.312-8.817778-20.48-13.312-20.48-13.312s8.192 2.218667 22.528 8.931556c14.336 6.656 35.84 15.530667 58.311111 34.474666 11.264 8.817778 23.552 21.105778 32.768 42.211556 9.216 17.806222 11.264 43.406222 4.096 65.592889z m-366.193777-102.684445h-117.76V121.799111h113.322666c126.122667 0 204.288 64.967111 204.288 203.776 0 138.296889-78.165333 207.189333-199.850666 207.189333z m-9.443556-345.429333h-25.713778v279.324445h25.713778c76.970667 0 124.984889-41.073778 124.984889-141.084445 0-100.465778-48.014222-138.24-124.984889-138.24zM397.564587 838.940444c-24.064-3.527111-47.900444-7.964444-71.623111-13.312-75.776-17.749333-160.711111-44.487111-234.382223-92.273777a269.312 269.312 0 0 1-50.176-41.130667c-15.416889-16.725333-29.696-35.612444-36.864-57.856a95.175111 95.175111 0 0 1 3.185778-65.592889c8.248889-17.806222 20.48-30.037333 31.687111-40.049778 23.552-18.887111 44.088889-27.818667 58.424889-34.474666a157.013333 157.013333 0 0 1 22.471111-8.874667s-8.192 4.437333-20.48 13.312c-13.255111 10.012444-31.744 23.381333-48.071111 44.544-8.192 9.955556-15.36 23.267556-18.432 36.636444a49.607111 49.607111 0 0 0 5.063111 40.049778c14.392889 24.405333 46.136889 44.487111 79.872 57.799111 68.551111 27.818667 150.414222 37.831111 221.070223 42.268445 20.48 1.137778 39.822222 2.218667 58.254222 2.275555V661.048889l133.176889 124.529778-133.063111 124.586666v-71.224889z m-217.315556-353.393777c112.184889-99.953778 178.574222-177.152 178.574222-240.469334 0-41.642667-22.869333-66.673778-61.952-66.673777-30.151111 0-55.239111 19.456-75.889777 42.211555l-44.657778-44.430222c37.944889-39.992889 74.808889-62.179556 131.185778-62.179556 78.108444 0 130.048 49.948444 130.048 126.634667 0 74.410667-61.952 154.396444-137.329778 227.669333 20.650667-2.218667 48.014222-4.437333 67.015111-4.437333h89.827555v68.892444H180.249031v-47.217777z" fill="currentColor" p-id="8413"></path></svg>
              </button>
              <button
                @click="switch2_3D('3D')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
                  editType === '3D'
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                ]"
                title="切换3D模式"
              >
                <svg t="1750954137343" width="50%" height="50%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20898" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M1019.953493 635.448889c-7.168 23.381333-20.48 42.268444-35.84 57.856-15.36 15.530667-32.711111 28.842667-51.143111 41.130667-73.671111 47.843556-158.663111 74.467556-234.382222 92.273777a1189.546667 1189.546667 0 0 1-91.079111 15.587556v-119.011556c23.552 0 50.119111 0 77.767111-2.218666 70.599111-4.437333 152.519111-15.587556 221.127111-43.349334 33.735111-14.449778 65.479111-33.393778 78.791111-58.936889a54.954667 54.954667 0 0 0 5.12-40.049777 111.843556 111.843556 0 0 0-19.569778-36.693334 255.431111 255.431111 0 0 0-48.014222-44.487111c-13.312-8.817778-20.48-13.312-20.48-13.312s8.192 2.218667 22.528 8.931556c14.336 6.656 35.84 15.530667 58.311111 34.474666 11.264 8.817778 23.552 21.105778 32.768 42.211556 9.216 17.806222 11.264 43.406222 4.096 65.592889z m-366.193777-102.684445h-117.76V121.799111h113.322666c126.122667 0 204.288 64.967111 204.288 203.776 0 138.296889-78.165333 207.189333-199.850666 207.189333z m-9.500445-345.429333h-25.656889v279.324445h25.656889c77.084444 0 125.041778-41.073778 125.041778-141.084445 0-100.465778-47.957333-138.24-125.041778-138.24zM397.702827 838.940444c-24.064-3.527111-47.957333-7.964444-71.68-13.312-75.719111-17.749333-160.711111-44.487111-234.382223-92.273777a270.791111 270.791111 0 0 1-50.119111-41.130667c-15.416889-16.725333-29.696-35.612444-36.864-57.856a94.833778 94.833778 0 0 1 3.128889-65.592889c8.135111-17.806222 20.423111-30.037333 31.687111-40.049778 23.495111-18.887111 44.032-27.818667 58.368-34.474666a157.013333 157.013333 0 0 1 22.471111-8.874667s-8.192 4.437333-20.48 13.312c-13.255111 10.012444-31.744 23.381333-48.071111 44.544a92.273778 92.273778 0 0 0-18.488889 36.636444 50.062222 50.062222 0 0 0 5.12 40.049778c14.336 24.405333 46.08 44.487111 79.815112 57.799111 68.608 27.818667 150.471111 37.831111 221.127111 42.268445 20.48 1.137778 39.879111 2.275556 58.311111 2.275555V661.048889l133.063111 124.529778-133.006222 124.586666v-71.224889z m56.718222-417.792c0 75.491556-66.389333 119.352889-145.123556 119.352889-65.308444 0-109.397333-24.405333-138.410666-57.173333l38.513777-51.655111c24.576 23.893333 54.670222 42.211556 92.103112 42.211555 41.870222 0 70.314667-20.536889 70.314666-57.230222 0-40.504889-24.007111-65.479111-113.891555-65.479111V292.295111c75.946667 0 100.465778-26.112 100.465777-62.748444 0-32.256-20.081778-51.143111-55.239111-51.655111-29.582222 0.512-53.589333 14.392889-78.165333 36.636444l-41.813333-50.005333c35.669333-31.061333 75.320889-50.517333 123.904-50.517334 79.815111 0 133.973333 38.855111 133.973333 109.397334 0 44.430222-25.088 76.629333-69.233778 93.866666v2.787556c46.876444 12.743111 82.602667 47.217778 82.602667 101.091555z" fill="currentColor" p-id="20899"></path></svg>
              </button>
            </div>
            
            <div class="flex bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 p-0.5 rounded-full shadow-md pointer-events-auto">
              <button
                @click="switchClothType('jersey')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
                  clothType === 'jersey' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200'
                ]"
                :disabled="!enabledTypes.includes('jersey')"
                :title="enabledTypes.includes('jersey') ? '上衣' : '无同款类型'"
              >
                <svg
                  fill="currentColor"
                  width="50%"
                  height="50%"
                  class="text-lg"
                  :class="{'opacity-50': !enabledTypes.includes('jersey')}"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3811"
                >
                  <path
                    d="M716.9 112H608.4a4 4 0 0 0-4 3.8c-2 49.1-42.6 88.2-92.4 88.2s-90.5-39.1-92.5-88.2a4 4 0 0 0-4-3.8H311.4c-1.6 0-151.7 120.1-209.3 166.2a40 40 0 0 0-12.7 44.6l66.1 187a40 40 0 0 0 59.7 20.1l49.9-32.9v375a40 40 0 0 0 40 40h413.7a40 40 0 0 0 40-40V497l49.9 32.9a40 40 0 0 0 59.7-20.1l66.2-187.3a40.1 40.1 0 0 0-12.4-44.3C865.7 232 718.5 112 716.9 112z"
                    p-id="3812"
                  ></path>
                </svg>
              </button>

              <button
                @click="switchClothType('pant')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
                  clothType === 'pant' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-751 dark:text-slate-400 dark:hover:text-slate-200'
                ]"
                :disabled="!enabledTypes.includes('pant')"
                :title="enabledTypes.includes('pant') ? '裤子' : '无同款类型'"
              >
                <svg
                  width="50%"
                  height="50%"
                  class="text-lg"
                  :class="{'opacity-50': !enabledTypes.includes('jersey')}"
                  t="1740807255007"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4709"
                >
                  <path
                    d="M750.933333 218.453333l-34.133333-167.253333v-34.133333c0-10.24-6.826667-17.066667-17.066667-17.066667H614.4v47.786667c0 10.24-6.826667 17.066667-17.066667 17.066666s-17.066667-6.826667-17.066666-17.066666V0h-136.533334v47.786667c0 10.24-6.826667 17.066667-17.066666 17.066666s-17.066667-6.826667-17.066667-17.066666V0H324.266667c-3.413333 0-10.24 3.413333-13.653334 3.413333S307.2 13.653333 307.2 17.066667v30.72l-34.133333 170.666666v3.413334l34.133333 785.066666c0 10.24 6.826667 17.066667 17.066667 17.066667h136.533333c10.24 0 17.066667-6.826667 17.066667-17.066667l34.133333-512 34.133333 512c0 10.24 6.826667 17.066667 17.066667 17.066667h136.533333c10.24 0 17.066667-6.826667 17.066667-17.066667l34.133333-785.066666v-3.413334z"
                    fill="currentColor"
                    p-id="4710"
                  ></path>
                </svg>
              </button>

              <button
                v-if="editType === '3D'"
                @click="switchClothType('suit')"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
                  clothType === 'suit' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200'
                ]"
                :disabled="!enabledTypes.includes('suit')"
                :title="enabledTypes.includes('suit') ? '套装' : '无同款类型'"
              >
                <svg
                  fill="currentColor"
                  width="50%"
                  height="50%"
                  class="text-lg"
                  :class="{'opacity-50': !enabledTypes.includes('suit')}"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="9909"
                >
                  <path
                    d="M553.6512 591.3856h-21.8112v41.0368q0 7.6288-7.6288 7.6288-7.68 0-7.68-7.6288V591.36l-126.7712-0.0512q0.384 44.7488-25.6 76.3648-27.648 33.6896-73.2928 42.5216l9.8048-25.0368q29.2608-8.2432 51.456-30.8224 20.736-21.1456 20.3776-63.0272h-53.8368c-2.304 7.0912-4.5056 13.824-6.0928 19.712L234.0352 900.608a4.992 4.992 0 0 0 3.584 6.144l245.9392 62.0032a4.992 4.992 0 0 0 6.144-3.8912l23.6032-120.576 24.6272 120.6272a4.992 4.992 0 0 0 6.0672 3.84l246.0672-61.8752a4.992 4.992 0 0 0 3.584-6.1696l-78.5408-289.6128c-1.5872-5.888-3.7632-12.5952-6.0928-19.712H655.616q-0.3328 41.8304 20.3776 62.9504 22.1696 22.5792 51.456 30.8224l6.144 25.0368q-41.984-8.832-69.632-42.496-25.9584-31.616-25.6-76.288l-69.4272-0.0512v100.48q0 7.6288-7.6288 7.6288-7.6544 0-7.6544-7.6288v-100.48z"
                    p-id="9910"
                  ></path>
                  <path
                    d="M844.8 240.64L749.7216 332.8l-47.5392-46.08 0.9472 276.48H320.8704l0.9472-276.48-47.5392 46.08L179.2 240.64 321.8176 102.4h47.5648c18.9952 53.9136 79.3856 92.16 141.6704 92.16 61.7984 0 124.0832-38.2464 143.5648-92.16h47.5648L844.8 240.64z"
                    p-id="9911"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            ref="glCanvas"
            class="w-full h-full"
          ></div>

          <!-- 编辑操作按钮 - 放在中间 -->
          <div class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-4 z-[10020] lg:z-[260] pointer-events-none">
            <!-- 场景背景控制器 -->
            <div class="relative z-[260] pointer-events-auto">
              <button
                @click="showBgPanel = !showBgPanel; if (showBgPanel) showZoomPanel = false;"
                class="w-10 h-10 rounded-full bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-darker transition-all duration-300 flex items-center justify-center shadow-lg group cursor-pointer hover:scale-105"
                title="调整画布背景"
              >
                <!-- An inner circle previewing the background color with a paint icon -->
                <div class="w-6 h-6 rounded-full border border-slate-250 dark:border-slate-700 shadow-inner flex items-center justify-center" :style="{ backgroundColor: activeBgColor }">
                  <font-awesome-icon
                    :icon="['fas', 'fill-drip']"
                    class="text-[9px] drop-shadow-sm transition-transform group-hover:rotate-12"
                    :class="isColorDark(activeBgColor) ? 'text-white' : 'text-slate-800'"
                  />
                </div>
              </button>

              <!-- Popover Adjuster Menu -->
              <div
                v-if="showBgPanel"
                class="absolute left-11 sm:left-14 top-0 sm:top-auto bottom-auto sm:bottom-0 w-60 sm:w-64 p-3.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-2xl space-y-3 animate-fade-in text-xs z-[10030] lg:z-[400] pointer-events-auto"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-805 dark:text-slate-100 uppercase tracking-wider text-[10px]">🎨 场景背景设置</span>
                  <button 
                    @click="showBgPanel = false" 
                    type="button"
                    class="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer relative z-[301] pointer-events-auto"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" class="text-[9px]" />
                  </button>
                </div>

                <!-- Presets selection grid -->
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="preset in bgPresets"
                    :key="preset.color"
                    @click="updateBgColor(preset.color)"
                    type="button"
                    class="w-8 h-8 rounded-full border border-slate-200/80 dark:border-slate-800 relative hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    :style="{ backgroundColor: preset.color }"
                    :title="preset.name"
                  >
                    <font-awesome-icon
                      v-if="activeBgColor === preset.color"
                      :icon="['fas', 'check']"
                      class="text-[8px] drop-shadow-sm"
                      :class="isColorDark(preset.color) ? 'text-white' : 'text-slate-800'"
                    />
                  </button>

                  <!-- Custom design picker inside circle -->
                  <div class="relative w-8 h-8 rounded-full border border-dashed border-slate-350 dark:border-slate-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-850">
                    <input
                      type="color"
                      v-model="customColorInput"
                      @input="updateBgColor(customColorInput)"
                      class="absolute inset-x-0 inset-y-0 opacity-0 cursor-pointer scale-150 w-full h-full"
                    />
                    <font-awesome-icon
                      :icon="['fas', 'palette']"
                      class="text-[10px] text-slate-450 dark:text-slate-500"
                    />
                  </div>
                </div>

                <!-- Status details / automation adaptation -->
                <div class="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-501 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                  <span class="flex items-center gap-1.5 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span class="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{{ activeBgColor }}</span>
                  </span>
                  <button 
                    @click="resetBgToPresetDefault"
                    type="button"
                    class="hover:text-indigo-650 dark:hover:text-indigo-400 font-extrabold cursor-pointer border border-indigo-100 dark:border-indigo-900/50 px-1.5 py-0.5 rounded bg-indigo-50/30 dark:bg-indigo-950/10 active:scale-95 transition-transform"
                  >
                    自动适配
                  </button>
                </div>
              </div>
            </div>

            <!-- 2D 视口缩放与平移控制器 (仅在2D模式下显示) -->
            <div v-if="editType === '2D'" class="relative z-[260] pointer-events-auto">
              <button
                @click="showZoomPanel = !showZoomPanel; if (showZoomPanel) showBgPanel = false;"
                class="w-10 h-10 rounded-full bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-darker transition-all duration-300 flex items-center justify-center shadow-lg group cursor-pointer hover:scale-105"
                :class="showZoomPanel ? 'bg-indigo-55 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/80' : ''"
                title="2D 视口缩放与平移"
              >
                <font-awesome-icon
                  :icon="['fas', 'search-plus']"
                  class="group-hover:scale-110 transition-transform duration-300 text-xs"
                />
              </button>

              <!-- Popover 2D Zoom Panel -->
              <div
                v-if="showZoomPanel"
                class="absolute left-11 sm:left-14 top-0 sm:top-auto bottom-auto sm:bottom-0 w-40 sm:w-44 p-3.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-2xl space-y-3 animate-fade-in text-xs z-[10030] lg:z-[400] pointer-events-auto"
              >
                <!-- 标题与关闭按钮 -->
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span class="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-[10px]">🔎 2D 视口缩放</span>
                  <button 
                    @click="showZoomPanel = false" 
                    type="button"
                    class="w-4 h-4 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer relative z-[301] pointer-events-auto"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" class="text-[8px]" />
                  </button>
                </div>

                <!-- 缩放按钮和数值 -->
                <div class="flex items-center justify-between w-full gap-1">
                  <button
                    @click="adjustZoom(-0.1)"
                    class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darker flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    title="缩小"
                  >
                    <font-awesome-icon :icon="['fas', 'search-minus']" class="text-xs" />
                  </button>
                  
                  <span class="text-xs font-mono font-bold text-slate-755 dark:text-slate-200 min-w-[36px] text-center">
                    {{ Math.round(zoom2D * 100) }}%
                  </span>
                  
                  <button
                    @click="adjustZoom(0.1)"
                    class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darker flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    title="放大"
                  >
                    <font-awesome-icon :icon="['fas', 'search-plus']" class="text-xs" />
                  </button>
                </div>

                <!-- 自适应/重置 & 平移方向微调 -->
                <div class="flex flex-col gap-2 w-full pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    @click="resetZoomAndPan"
                    class="w-full py-1.5 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-all cursor-pointer text-center font-extrabold"
                    title="重置为初始居中大小"
                  >
                    自适应居中
                  </button>

                  <!-- 微调方向盘 -->
                  <div class="flex flex-col items-center gap-1 w-full mt-0.5">
                    <!-- 上 -->
                    <button
                      @click="panCanvas('up')"
                      class="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-darker text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                      title="向上平移"
                    >
                      <font-awesome-icon :icon="['fas', 'chevron-up']" class="text-[9px]" />
                    </button>
                    
                    <!-- 左 中 右 -->
                    <div class="flex items-center gap-2.5 justify-center w-full">
                      <button
                        @click="panCanvas('left')"
                        class="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-darker text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                        title="向左平移"
                      >
                        <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-[9px]" />
                      </button>
                      
                      <!-- 小十字装饰 -->
                      <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>

                      <button
                        @click="panCanvas('right')"
                        class="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-darker text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                        title="向右平移"
                      >
                        <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-[9px]" />
                      </button>
                    </div>

                    <!-- 下 -->
                    <button
                      @click="panCanvas('down')"
                      class="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-darker text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                      title="向下平移"
                    >
                      <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-[9px]" />
                    </button>
                  </div>

                  <!-- 拖拽操作提示说明 -->
                  <div class="text-[8px] text-slate-450 dark:text-slate-550 text-center leading-normal border-t border-slate-100 dark:border-slate-800/60 pt-1.5">
                    提示：在空白处按住鼠标拖拽，或使用滚轮，均可控制缩放平移。
                  </div>
                </div>
              </div>
            </div>

            <!-- 撤销上一步 (Undo) -->
            <button
              @click="undo"
              :disabled="historyIndex <= 0"
              class="w-10 h-10 rounded-full bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-darker transition-all duration-300 flex items-center justify-center shadow-lg group cursor-pointer pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
              :title="historyIndex > 0 ? `撤销 (Ctrl+Z): ${historyStack[historyIndex]?.actionName || ''}` : '无法撤销'"
            >
              <font-awesome-icon
                :icon="['fas', 'undo']"
                class="group-hover:-scale-x-110 transition-transform duration-300 text-xs"
              />
            </button>

            <!-- 重做上一步 (Redo) -->
            <button
              @click="redo"
              :disabled="historyIndex >= historyStack.length - 1"
              class="w-10 h-10 rounded-full bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-darker transition-all duration-300 flex items-center justify-center shadow-lg group cursor-pointer pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
              :title="historyIndex < historyStack.length - 1 ? `重做 (Ctrl+Y): ${historyStack[historyIndex + 1]?.actionName || ''}` : '无法重做'"
            >
              <font-awesome-icon
                :icon="['fas', 'redo']"
                class="group-hover:scale-x-110 transition-transform duration-300 text-xs"
              />
            </button>

            <!-- 截图当前视角 -->
            <button
              @click="takeSnapshot"
              class="w-10 h-10 rounded-full bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-darker transition-colors duration-300 
                     flex items-center justify-center shadow-lg group cursor-pointer pointer-events-auto"
              title="保存当前视角截图"
            >
              <font-awesome-icon
                :icon="['fas', 'camera']"
                class="group-hover:scale-110 transition-transform duration-300 text-xs"
              />
            </button>

            <button
              @click="saveDesign"
              class="w-10 h-10 rounded-full bg-white dark:bg-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-darker transition-colors duration-300 
                     flex items-center justify-center shadow-lg group cursor-pointer pointer-events-auto"
              title="下载"
            >
              <font-awesome-icon
                :icon="['fas', 'download']"
                class="group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          </div>

          <div class="absolute right-3 bottom-3 sm:right-10 sm:bottom-10 z-[260] pointer-events-auto">
            <RotateMovePanel />
          </div>
        </div>
        <!-- 设计工具区域 -->
        <div class="lg:h-screen md:h-[70vh] lg:col-span-4 flex flex-col border-container">
          <!-- 工具栏头部 -->
          <div class="flex items-center justify-between border-b border-slate-205 dark:border-dark px-6 py-4">
            <div class="flex items-center space-x-3">
              <button
                v-if="currentTab === 'order'"
                @click="setTab('text')"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-705 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in cursor-pointer"
                title="返回"
              >
                <font-awesome-icon
                  :icon="['fas', 'arrow-left']"
                  class="text-xs"
                />
              </button>
              <div v-else class="flex items-center space-x-2">
                <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25 shadow-sm">
                  <font-awesome-icon :icon="modelType === 'jersey' ? ['fas', 'tshirt'] : ['fas', 'socks']" class="mr-2 text-indigo-500 dark:text-indigo-400 text-sm" />
                  当前编辑：{{ modelType === 'jersey' ? '上衣' : '裤子' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/50 hover:bg-emerald-100/60 dark:bg-emerald-950/15 dark:hover:bg-emerald-950/35 text-emerald-700 dark:text-emerald-400 text-xs font-semibold transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                title="查看定制购买与客服对接导览"
                @click="showPurchaseGuide = true"
              >
                <font-awesome-icon
                  :icon="['fas', 'compass']"
                  class="text-[11px] text-emerald-550 dark:text-emerald-400"
                />
                <span>购买导览</span>
              </button>

              <!-- <button
                class="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all duration-300 shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-95"
                title="查看修改与数量"
                @click="() => setTab('order')"
              >
                <font-awesome-icon
                  :icon="['fas', 'cart-plus']"
                  class="text-xs"
                />
                <span>订单明细</span>
              </button> -->
            </div>
          </div>
          <div
            class="flex items-center justify-center px-5 mt-4"
            v-if="currentTab !== 'order'"
          >
            <!-- <button
              class=""
              title="切换"
              :disabled="currentProduct && currentProduct.clothType !== 'suit'"
            >
              <font-awesome-icon
                :icon="['fas', 'backward']"
                class="text-xl text-white"
              />
            </button> -->
            <div class="flex items-center justify-center gap-2 sm:gap-4 w-full sm:w-[80%] px-2 sm:px-0">
              <TabButton
                title="Edit color"
                type="颜色"
                :active="currentTab === 'color'"
                :icon="['fas', 'palette']"
                @click="() => setTab('color')"
              />
              <TabButton
                title="Edit text"
                type="文字"
                :active="currentTab === 'text'"
                :icon="['fas', 'font']"
                @click="() => setTab('text')"
              />
              <TabButton
                title="Edit Logo"
                type="Logo"
                :active="currentTab === 'logo'"
                :icon="['fas', 'image']"
                @click="() => setTab('logo')"
              />
              <TabButton
                title="Edit Pattern"
                type="图案"
                :active="currentTab === 'pattern'"
                :icon="['fas', 'shapes']"
                @click="() => setTab('pattern')"
              />
              <TabButton
                title="AI Design"
                type="AI设计"
                :active="currentTab === 'ai'"
                :icon="['fas', 'robot']"
                @click="() => setTab('ai')"
              />
            </div>
            <!-- <button
              class=""
              title="切换"
              :disabled="currentProduct && currentProduct.clothType !== 'suit'"
              @click="switchClothType('suit')"
            >
              <font-awesome-icon
                :icon="['fas', 'forward']"
                class="text-xl text-white"
              />
            </button> -->
          </div>
          <div
            v-if="currentRenderData"
            class="flex-1 overflow-y-auto pt-2 px-4 sm:px-8 pb-6 text-slate-500 dark:text-slate-400 text-sm"
          >
            <TextTab
              v-if="currentTab === 'text'"
              :texts="currentRenderData.texts"
              @addText="addText"
              @copyText="copyText"
              @removeText="removeText"
              @selectElement="selectElement"
              @updateFontFamily="updateFontFamily"
              @curveToggled="handleCurveToggled"
            />
            <LogoTab
              v-show="currentTab === 'logo'"
              :logos="currentRenderData.logos"
              :jerseyParts="currentRenderData.colors"
              :defaultLogoVisible="defaultLogoVisible"
              @selectElement="selectElement"
              @uploadLogo="uploadLogo"
              @removeLogo="removeLogo"
              @changeLogoColor="changeLogoColor"
              @toggleLogoBackgroundRemoval="toggleLogoBackgroundRemoval"
              @toggleDefaultLogoVisibility="toggleDefaultLogoVisibility"
              @setLogoClip="handleSetLogoClip"
              @fitLogoToPanel="handleFitLogoToPanel"
            />
            <ColorTab
              v-if="currentTab === 'color'"
              :jerseyParts="currentRenderData.colors"
              :colors="colors"
              @setColor="setColor"
            />
            <PatternTab
              v-if="currentTab === 'pattern'"
              :jersey-parts="currentRenderData.colors"
              :patterns="currentRenderData.patterns"
              :colors="colors"
              @set-pattern="setPattern"
              @remove-pattern="removePattern"
            />
            <OrderTab
              v-if="currentTab === 'order'"
              :players="players"
              @addPlayer="addPlayer"
              @removePlayer="removePlayer"
            />
            <AITab
              v-if="currentTab === 'ai'"
              :currentRenderData="currentRenderData"
              :renderData="renderData"
              :currentProduct="currentProduct"
              :modelType="modelType"
              :world="world"
              :editType="editType"
              @uploadLogo="uploadLogo"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="svgCtn">
      <canvas id="pantCtn"></canvas>
    </div>
    <div class="svgCtn">
      <canvas id="jerseyCtn"></canvas>
    </div>
    
    <!-- Custom Purchase Guide Interactive Modal -->
    <PurchaseGuideModal 
      :isOpen="showPurchaseGuide" 
      @close="showPurchaseGuide = false" 
      @triggerDownload="saveDesign"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, provide, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StyleTab from '../components/Tabs/StyleTab.vue';
import TextTab from '../components/Tabs/TextTab.vue';
import LogoTab from '../components/Tabs/LogoTab.vue';
import ColorTab from '../components/Tabs/ColorTab.vue';
import PatternTab from '../components/Tabs/PatternTab.vue';
import OrderTab from '../components/Tabs/OrderTab.vue';
import AITab from '../components/Tabs/AITab.vue';
import PurchaseGuideModal from '../components/PurchaseGuideModal.vue';
import { World } from '../world/world';
import { StyleManager, fontOptions } from '../utils/StyleManager';
import { makeWhiteBackgroundTransparent, isRasterImageSource } from '../utils/removeBackground';
import _ from 'lodash';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { downloadJSON } from '../utils/util.js'
import TabButton from '../components/common/TabButton.vue';
import RotateMovePanel from '../components/DashBoard/RotateMovePanel.vue';
import { ColorList, DefaultTextItem } from '../configs';
import { useTheme } from '../composables/useTheme';
import { publicPath } from '../utils/publicPath';
import { takeImportedDesign } from '../utils/importDesignTransfer';

// Theme state
const { isDark } = useTheme();

// Props
const props = defineProps({
  productId: {
    type: String,
    required: true
  }
});

const currentProduct = ref(null);
const editType = ref('3D');
// 添加服装类型状态
const clothType = ref('jersey'); // 默认选中上衣
const modelType = ref('jersey'); // 默认选中上衣
const enabledTypes = ref(['jersey', 'suit']); // 示例：只启用上衣和套装
// 状态定义
const route = useRoute();
const router = useRouter();
const glCanvas = ref(null);
const currentTab = ref('text');
const categoryName = ref('Basketball');
const showPurchaseGuide = ref(false);

// 数据定义
const colors = ref(ColorList);

// 设计相关数据
const renderData = ref(null);
const currentRenderData = ref({
  texts: [],
  logos: [],
  patterns: [],
});
const defaultLogoVisible = ref(true);
const pendingPatternUpdates = {};
const patternUpdateRunning = {};
const patternUpdateSeq = {};
const players = ref([{
  name: '',
  number: '',
  size: ''
}]);

// 3D世界相关
let world = null;

// ==================== 撤销与重做历史纪录模块 ====================
const historyStack = ref([]);
const historyIndex = ref(-1);
const isApplyingHistory = ref(false);

const saveHistoryState = (actionName = '') => {
  if (isApplyingHistory.value || !world) return;
  
  const fabrics = {};
  for (const key in world.resource) {
    const editor = world.getSvgEditorByType(key);
    if (editor) {
      fabrics[key] = editor.getJson();
    }
  }
  
  const snapshot = {
    actionName,
    renderData: JSON.parse(JSON.stringify(renderData.value)),
    activeBgColor: activeBgColor.value,
    fabrics
  };
  
  if (historyIndex.value < historyStack.value.length - 1) {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
  }
  
  historyStack.value.push(snapshot);
  if (historyStack.value.length > 50) {
    historyStack.value.shift();
  }
  historyIndex.value = historyStack.value.length - 1;
};

const syncLogoClipStateFromEditors = () => {
  if (!world || !Array.isArray(renderData.value)) return;

  for (const partData of renderData.value) {
    const editor = world.getSvgEditorByType(partData.type);
    if (!editor?.canvas || !Array.isArray(partData.logos)) continue;

    for (const logo of partData.logos) {
      const object = editor.canvas.getObjectById(logo.id);
      logo.clippedPanelId = object?.clippedPanelId || object?.clipPath?.id || '';
    }
  }
};

const applyHistorySnapshot = async (snapshot) => {
  if (!snapshot || !world) return;
  isApplyingHistory.value = true;
  
  try {
    activeBgColor.value = snapshot.activeBgColor;
    renderData.value = JSON.parse(JSON.stringify(snapshot.renderData));
    setCurrentRenderData();
    
    for (const key in snapshot.fabrics) {
      const editor = world.getSvgEditorByType(key);
      const fabricStateObj = snapshot.fabrics[key];
      if (editor && fabricStateObj) {
        await editor.loadCanvasState(fabricStateObj);
      }
    }
    syncLogoClipStateFromEditors();
  } catch (err) {
    console.error('应用历史纪录快照失败:', err);
  } finally {
    setTimeout(() => {
      isApplyingHistory.value = false;
    }, 100);
  }
};

const undo = async () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    await applyHistorySnapshot(historyStack.value[historyIndex.value]);
  }
};

const redo = async () => {
  if (historyIndex.value < historyStack.value.length - 1) {
    historyIndex.value++;
    await applyHistorySnapshot(historyStack.value[historyIndex.value]);
  }
};

const handleKeyDown = (e) => {
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  if (!isCtrlOrCmd) return;
  
  if (e.key === 'z' || e.key === 'Z') {
    e.preventDefault();
    if (e.shiftKey) {
      redo();
    } else {
      undo();
    }
  } else if (e.key === 'y' || e.key === 'Y') {
    e.preventDefault();
    redo();
  }
};
// ================================================================

// 背景色相关的响应式状态
const activeBgColor = ref('#04060a');
const showBgPanel = ref(false);
const showZoomPanel = ref(false);
const customColorInput = ref('#04060a');
const bgPresets = ref([
  { name: '极夜深空', color: '#04060a' },
  { name: '幽黑玄石', color: '#0f1115' },
  { name: '银白棚', color: '#f5f5f7' },
  { name: '泥沙暗灰', color: '#161619' },
  { name: '深谙靛青', color: '#020c11' }
]);

const isColorDark = (hexColor) => {
  if (!hexColor || !hexColor.startsWith('#')) return true;
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 140;
};

const updateBgColor = (color) => {
  activeBgColor.value = color;
};

const deriveMatchingBg = (hexColor) => {
  if (typeof hexColor !== 'string' || !hexColor.startsWith('#')) {
    return isDark.value ? '#04060a' : '#fafafa';
  }
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const toHex = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
  const toSrgb = (value) => {
    const channel = value / 255;
    return channel <= 0.0031308
      ? channel * 12.92
      : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  };
  const mixWithSrgb = (value) => (value / 255 + toSrgb(value)) * 0.5 * 255;

  return `#${toHex(mixWithSrgb(r))}${toHex(mixWithSrgb(g))}${toHex(mixWithSrgb(b))}`;
};

const resetBgToPresetDefault = () => {
  if (currentRenderData.value && currentRenderData.value.colors) {
    const baseColorObj = currentRenderData.value.colors.find(c => c.id === 'COLOUR_BASE');
    if (baseColorObj && baseColorObj.color) {
      activeBgColor.value = deriveMatchingBg(baseColorObj.color);
      return;
    }
  }
  activeBgColor.value = isDark.value ? '#04060a' : '#fafafa';
};

// 监听背景色改变，同步更新 ThreeJS
watch(activeBgColor, (newColor) => {
  if (world && typeof world.setTargetBgColor === 'function') {
    world.setTargetBgColor(newColor);
  }
  if (newColor && newColor.startsWith('#')) {
    customColorInput.value = newColor;
  }
});

// Watch theme to update 3D background color dynamically
watch(isDark, (newVal) => {
  resetBgToPresetDefault();
}, { immediate: true });

// 监听衣服主色，自动进行背景色拾取与融合
watch(
  () => {
    if (!currentRenderData.value || !currentRenderData.value.colors) return null;
    const baseColorObj = currentRenderData.value.colors.find(c => c.id === 'COLOUR_BASE');
    return baseColorObj ? baseColorObj.color : null;
  },
  (newBaseColor) => {
    if (newBaseColor) {
      activeBgColor.value = deriveMatchingBg(newBaseColor);
    }
  },
  { deep: true }
);
// 当前编辑状态
const editingElement = ref({});
provide('editingElement', editingElement);
provide('modelType', modelType);

let mainSvgEle = null;
const styleManager = new StyleManager();

const getDataForRender = async () => {
  const { productId } = route.params;
  if (!productId) return;

  if (route.query.import === '1') {
    const importedDesign = takeImportedDesign(productId);
    if (importedDesign) {
      try {
        const data = JSON.parse(importedDesign);
        return data;
      } catch (error) {
        console.error('Failed to parse imported design data:', error);
      }
    }
  }

  const data = await fetch(publicPath(`/dataset/${productId}.json`))
    .then((res) => res.json());
  return data;
}

const setTab = (tab) => {
  currentTab.value = tab;
  // isPanelExpanded.value = true;
};

// SVG相关方法
const initVarFromTexture = async (data) => {
  renderData.value = styleManager.getRenderFromJson(data);
  console.log(renderData.value)
  setCurrentRenderData();
};

function setCurrentRenderData () {
  currentRenderData.value = renderData.value.find(v => v.type === modelType.value);
  if (currentRenderData.value) {
    currentRenderData.value.texts ||= [];
    currentRenderData.value.logos ||= [];
    currentRenderData.value.logos = currentRenderData.value.logos.map((logo) => ({
      ...logo,
      originalUrl: logo.originalUrl || logo.url,
      removeBackground: Boolean(logo.removeBackground),
    }));
    currentRenderData.value.patterns ||= [];
  }
}
// 订单相关方法
const addPlayer = () => {
  players.value.push({
    name: '',
    number: '',
    size: '',
  });
}
const removePlayer = (index) => {
  players.value.splice(index, 1);
}
const previewPlayer = (index) => {

}

// 文本相关方法
const addText = () => {
  const newTextOptions = JSON.parse(JSON.stringify(DefaultTextItem));
  const newText = world.getSvgEditorByType(modelType.value)._addText(newTextOptions);
  if (!newText) {
    alert('系统出错！！！');
    return;
  }
  newTextOptions.id = newText.id;
  currentRenderData.value.texts.unshift(newTextOptions);
  saveHistoryState('添加自定义文本');
};
const copyText = async (index) => {
  const newTextOptions = JSON.parse(JSON.stringify(currentRenderData.value.texts[index]));
  const newText = await world.getSvgEditorByType(modelType.value).copyElement(newTextOptions.id);
  newTextOptions.id = newText.id;
  currentRenderData.value.texts.unshift(newTextOptions);
  saveHistoryState('复制自定义文本');
}
const removeText = (index) => {
  world.getSvgEditorByType(modelType.value).removeObjectById(currentRenderData.value.texts[index].id);
  currentRenderData.value.texts.splice(index, 1);
  saveHistoryState('删除文本项');
};
// 监听文本变化
const monitorTextChange = _.debounce((newTexts, oldTexts) => {
  if (isApplyingHistory.value) return;
  if (newTexts.length !== oldTexts.length) return;

  let changed = false;
  newTexts.forEach((newText, index) => {
    const oldText = oldTexts[index];
    if(oldText.isExpanded !== newText.isExpanded) return;
    if(oldText.fontFamily !== newText.fontFamily) return;
    if(oldText.isCurved !== newText.isCurved) {
      return;
    }
    if(_.isEqual(newText, oldText)) return;
    world.getSvgEditorByType(modelType.value).updateText(newText.id, newText);
    changed = true;
  });
  
  if (changed) {
    saveHistoryState('编辑文本内容');
  }
}, 200);
const updateFontFamily = (index, fontType) => {
  const newText = currentRenderData.value.texts[index];
  world.getSvgEditorByType(modelType.value).updateText(newText.id, { fontFamily: fontType });
  saveHistoryState('更改文本字体');
}
const handleCurveToggled = (options) => {
  world.getSvgEditorByType(modelType.value).setNewText(options.id, options);
  saveHistoryState('变换文本弧度');
}
watch(
  () => _.cloneDeep(currentRenderData.value.texts),
  (newTexts, oldTexts) => {
    if (isApplyingHistory.value) {
      if (monitorTextChange && monitorTextChange.cancel) {
        monitorTextChange.cancel();
      }
      return;
    }
    monitorTextChange(newTexts, oldTexts);
  },
  { deep: true, immediate: false }
);

// ==================== 2D 视口缩放与平移模块 ====================
const editContainerRef = ref(null);
const zoom2D = ref(1.0);
const panOffset = ref({ x: 0, y: 0 });
const isPanning = ref(false);
const startPan = ref({ x: 0, y: 0 });

const get2DViewportElement = (editor) => {
  return editor?.canvas?.getElement()?.parentNode?.parentNode || null;
};

const move2DViewportIntoEditContainer = (viewportElement) => {
  const editContainer = editContainerRef.value || document.getElementById('edit-container');
  if (viewportElement && editContainer && viewportElement.parentElement !== editContainer) {
    editContainer.appendChild(viewportElement);
  }
};

const hideAll2DViewportElements = () => {
  if (!world?.resource) return;
  for (let key in world.resource) {
    const viewportElement = get2DViewportElement(world.resource[key].fabricEditor);
    if (viewportElement) {
      viewportElement.style.cssText = 'display: none;';
    }
  }
};

const parkAll2DViewportElementsFor3D = () => {
  if (!world?.resource) return;
  const editContainer = editContainerRef.value || document.getElementById('edit-container');
  for (let key in world.resource) {
    const editor = world.resource[key].fabricEditor;
    const viewportElement = get2DViewportElement(editor);
    if (!viewportElement) continue;

    if (editContainer && viewportElement.parentElement !== editContainer) {
      editContainer.appendChild(viewportElement);
    }

    viewportElement.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      right: auto;
      bottom: auto;
      display: block;
      visibility: hidden;
      pointer-events: none;
      transform-origin: left top;
      transform: none;
      z-index: -1;
    `;

    editor?.canvas?.calcOffset?.();
  }
};

const apply2DViewportTransform = () => {
  if (editType.value !== '2D' || !world) return;
  const editor = world.getSvgEditorByType(modelType.value);
  if (!editor) return;
  
  const parentElement = get2DViewportElement(editor);
  if (!parentElement) return;
  move2DViewportIntoEditContainer(parentElement);
  
  // 暂时重置样式以获取无缩放状态下的 bounding rect
  const originalStyle = parentElement.style.cssText;
  parentElement.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    right: auto;
    bottom: auto;
    display: block;
    visibility: hidden;
    transform: none;
    z-index: 1;
  `;
  const pb = parentElement.getBoundingClientRect();
  parentElement.style.cssText = originalStyle;
  
  const cb = document.getElementById('edit-container').getBoundingClientRect();
  
  let scale = cb.width > cb.height ? cb.height / pb.height : cb.width / pb.width;
  scale = scale > 1 ? 1/scale : scale - 0.01;
  
  const finalScale = scale * zoom2D.value;
  
  // 计算初始居中位置
  let left = cb.width / 2 - (pb.width * finalScale) / 2;
  let top = cb.height / 2 - (pb.height * finalScale) / 2;
  
  // 叠加上平移偏移量
  left += panOffset.value.x;
  top += panOffset.value.y;
  
  parentElement.style.cssText = `
    position: absolute;
    left: ${left}px;
    top: ${top}px;
    right: auto;
    bottom: auto;
    display: block;
    visibility: visible;
    pointer-events: auto;
    transform-origin: left top;
    z-index: 60;
    transform: scale(${finalScale});
  `;
};

const resetZoomAndPan = () => {
  zoom2D.value = 1.0;
  panOffset.value = { x: 0, y: 0 };
  apply2DViewportTransform();
};

const adjustZoom = (amount) => {
  zoom2D.value = Math.max(0.5, Math.min(3.0, zoom2D.value + amount));
  apply2DViewportTransform();
};

const panCanvas = (direction) => {
  const panAmount = 50; // 每次平移 50 像素
  if (direction === 'left') panOffset.value.x -= panAmount;
  if (direction === 'right') panOffset.value.x += panAmount;
  if (direction === 'up') panOffset.value.y -= panAmount;
  if (direction === 'down') panOffset.value.y += panAmount;
  apply2DViewportTransform();
};

const handleWheel = (e) => {
  if (editType.value !== '2D') return;
  const delta = e.deltaY < 0 ? 0.05 : -0.05;
  adjustZoom(delta);
};

const handleBgMouseDown = (e) => {
  if (editType.value !== '2D') return;
  
  // 只有点击背景空白处或其容器边缘，或者使用鼠标右键/中键时，才启动画布视口拖拽
  const isDirectBackground = e.target.id === 'edit-container' || e.target.classList.contains('border-container');
  const isRightOrMiddleClick = e.button === 2 || e.button === 1;
  
  if (isDirectBackground || isRightOrMiddleClick) {
    isPanning.value = true;
    startPan.value = { x: e.clientX - panOffset.value.x, y: e.clientY - panOffset.value.y };
    if (isRightOrMiddleClick) {
      e.preventDefault();
    }
  }
};

const handleBgMouseMove = (e) => {
  if (!isPanning.value) return;
  panOffset.value = {
    x: e.clientX - startPan.value.x,
    y: e.clientY - startPan.value.y
  };
  apply2DViewportTransform();
};

const handleBgMouseUp = () => {
  isPanning.value = false;
};

// 监听服装部件类型变化时，重置画布缩放平移居中
watch(modelType, () => {
  resetZoomAndPan();
  updateDefaultLogoVisibleState();
});
watch(clothType, () => {
  resetZoomAndPan();
});

// 切换2D/3D
const switch2_3D = async (type) => {
  editType.value = type;
  showZoomPanel.value = false;
  const editor = world.getSvgEditorByType(modelType.value);
  if(!editor) return;
  hideAll2DViewportElements();
  for (const key in world.resource) {
    world.resource[key].fabricEditor?.setTextureUpdatesEnabled?.(type === '3D');
  }
  if (type === '2D') {
    if (clothType.value === 'suit') {
      clothType.value = modelType.value;
    }
    move2DViewportIntoEditContainer(get2DViewportElement(editor));
    resetZoomAndPan();
    world.setRenderingEnabled?.(false);
    world.glDom.style.display = 'none';
  } else {
    world.glDom.style.display = 'block';
    world.setRenderingEnabled?.(true);
    await nextTick();
    parkAll2DViewportElementsFor3D();
  }
}

const normalizeLogoPayload = (payload) => {
  if (typeof payload === 'string') {
    return {
      url: payload,
      originalUrl: payload,
      name: '',
      removeBackground: false,
    };
  }

  if (payload && typeof payload === 'object') {
    const url = payload.url || payload.svgUrl || payload.svgContent || payload.imageUrl || '';
    return {
      url,
      originalUrl: payload.originalUrl || url,
      name: payload.name || payload.filename || '',
      removeBackground: Boolean(payload.removeBackground),
    };
  }

  return {
    url: '',
    originalUrl: '',
    name: '',
    removeBackground: false,
  };
};

// Logo相关方法
const uploadLogo = async (payload) => {
  const logoData = normalizeLogoPayload(payload);
  if (!logoData.url) return;

  const editor = world.getSvgEditorByType(modelType.value);
  if (!editor) return;

  const sourceUrl = logoData.originalUrl || logoData.url;
  const shouldTrimBackground = logoData.removeBackground && isRasterImageSource(sourceUrl);
  const finalUrl = shouldTrimBackground ? await makeWhiteBackgroundTransparent(sourceUrl) : logoData.url;

  const imgObj = await editor.addLogo(finalUrl, { logoName: logoData.name });
  currentRenderData.value.logos.unshift({
    id: imgObj.id,
    url: finalUrl,
    originalUrl: sourceUrl,
    name: logoData.name,
    color: '#000000',
    removeBackground: shouldTrimBackground,
    clippedPanelId: '',
  });
  saveHistoryState('添加 Logo 图章');
};

const handleSetLogoClip = async ({ logoId, panelId }) => {
  if (!window.world || !logoId) return;

  const editor = world.getSvgEditorByType(modelType.value);
  if (!editor || typeof editor.setLogoClipPanel !== 'function') return;

  const updated = await editor.setLogoClipPanel(logoId, panelId);
  if (!updated) return;

  const logo = currentRenderData.value.logos.find((item) => item.id === logoId);
  if (logo) {
    logo.clippedPanelId = panelId || '';
  }
  saveHistoryState(`设置裁片剪贴蒙版: ${panelId || '无'}`);
};

const handleFitLogoToPanel = async ({ logoId, panelId }) => {
  if (!window.world || !logoId) return;

  const editor = world.getSvgEditorByType(modelType.value);
  if (!editor || typeof editor.fitLogoToPanel !== 'function') return;

  const updated = await editor.fitLogoToPanel(logoId, panelId);
  if (!updated) return;

  saveHistoryState('自适应并居中铺满板片');
};

const toggleLogoBackgroundRemoval = async ({ id, enabled }) => {
  if (!id || typeof enabled !== 'boolean') return;

  const logo = currentRenderData.value.logos.find((item) => item.id === id);
  if (!logo) return;

  const editor = world.getSvgEditorByType(modelType.value);
  if (!editor) return;

  const sourceUrl = logo.originalUrl || logo.url;
  if (!isRasterImageSource(sourceUrl)) return;
  if (logo.removeBackground === enabled) return;

  const nextUrl = enabled
    ? await makeWhiteBackgroundTransparent(sourceUrl)
    : sourceUrl;

  const updated = await editor.updateLogoSource(id, nextUrl);
  if (!updated) return;

  logo.url = nextUrl;
  logo.originalUrl = sourceUrl;
  logo.removeBackground = enabled;
  saveHistoryState(enabled ? '去除 Logo 背景' : '恢复 Logo 背景');
};
const removeLogo = (index) => {
  const logo = currentRenderData.value.logos[index];
  world.getSvgEditorByType(modelType.value).removeObjectById(logo.id);
  currentRenderData.value.logos.splice(index, 1);
  saveHistoryState('移除 Logo 图章');
};


const saveLogoColorHistory = _.debounce(() => {
  saveHistoryState('修改 Logo 颜色');
}, 500);

const changeLogoColor = ({ id, color }) => {
  const logo = currentRenderData.value.logos.find((item) => item.id === id);
  if (logo) {
    logo.color = color;
  }

  const changed = world.getSvgEditorByType(modelType.value).setLogoColor(id, color);
  if (changed) {
    saveLogoColorHistory();
  }
};

const updateDefaultLogoVisibleState = () => {
  const editor = world?.getSvgEditorByType(modelType.value);
  if (!editor?.canvas) return;

  const ids = ['logoFront-0', 'logoBack-1'];
  const objects = ids.map((id) => editor.canvas.getObjectById(id)).filter(Boolean);
  if (objects.length > 0) {
    defaultLogoVisible.value = objects.every((obj) => obj.visible !== false);
  }
};

const toggleDefaultLogoVisibility = ({ ids, visible }) => {
  const editor = world?.getSvgEditorByType(modelType.value);
  if (!editor) return;

  const changed = editor.setObjectsVisible(ids, visible);
  if (changed) {
    saveHistoryState(visible ? '显示默认Logo' : '隐藏默认Logo');
  }
};

const setColor = (index, color) => {
  const curItem = currentRenderData.value.colors[index];
  if (!curItem) return;
  curItem.color = color;
  world.getSvgEditorByType(modelType.value).setColor(curItem.id, color);

  // Keep the 3D ground and renderer background in sync with the base fabric color.
  if (curItem.id === 'COLOUR_BASE') {
    updateBgColor(deriveMatchingBg(color));
  }

  saveHistoryState(`更改配色: ${curItem.name}`);
};

// 元素选择相关
const applyPatternStateRecord = (partId, options) => {
  currentRenderData.value.patterns ||= [];
  const targetMode = partId === 'ALL' ? 'all' : 'parts';
  const targetPartIds = partId === 'ALL' ? [] : [partId];
  const matchIndex = currentRenderData.value.patterns.findIndex((pattern) => {
    if (partId === 'ALL') {
      return pattern.targetMode === 'all' || !pattern.targetPartIds?.length;
    }
    return pattern.targetMode === 'parts' && pattern.targetPartIds?.includes(partId);
  });

  const patternRecord = {
    id: options.patternId || options.url || `pattern_${partId}`,
    patternId: options.patternId || options.url || `pattern_${partId}`,
    name: options.name || 'Custom Pattern',
    category: options.category || 'Artwork',
    source: options.source || 'preset',
    url: options.url,
    targetMode,
    targetPartIds,
    scale: options.scale ?? 1,
    angle: options.angle ?? 0,
    opacity: options.opacity ?? 1,
    offsetX: options.offsetX ?? 0,
    offsetY: options.offsetY ?? 0,
    patternColor: options.patternColor ?? null,
    bgColor: options.bgColor ?? null,
    bgColorMode: 'use_part_color',
  };

  if (matchIndex >= 0) {
    currentRenderData.value.patterns.splice(matchIndex, 1, patternRecord);
  } else {
    currentRenderData.value.patterns.unshift(patternRecord);
  }
};

const flushPatternUpdate = async (partId) => {
  if (patternUpdateRunning[partId]) return;

  const editor = world?.getSvgEditorByType(modelType.value);
  if (!editor) return;

  patternUpdateRunning[partId] = true;

  try {
    while (pendingPatternUpdates[partId]) {
      const { options, seq } = pendingPatternUpdates[partId];
      pendingPatternUpdates[partId] = null;

      await editor.setPattern(partId, options);

      if (seq !== patternUpdateSeq[partId]) {
        continue;
      }

      applyPatternStateRecord(partId, options);
      saveHistoryState(`Apply pattern: ${partId}`);
    }
  } finally {
    patternUpdateRunning[partId] = false;
  }
};

const setPattern = ({ partId, options }) => {
  patternUpdateSeq[partId] = (patternUpdateSeq[partId] || 0) + 1;
  pendingPatternUpdates[partId] = {
    options: { ...options },
    seq: patternUpdateSeq[partId],
  };

  flushPatternUpdate(partId);
};

const clearPatternUpdateTask = (partId) => {
  patternUpdateSeq[partId] = (patternUpdateSeq[partId] || 0) + 1;
  pendingPatternUpdates[partId] = null;
};

const removePattern = ({ partId, resetColor }) => {
  const editor = world?.getSvgEditorByType(modelType.value);
  if (!editor) return;
  clearPatternUpdateTask(partId);
  editor.removePattern(partId, resetColor);
  currentRenderData.value.patterns ||= [];

  if (partId !== 'ALL') {
    const allPattern = currentRenderData.value.patterns.find(
      (pattern) => pattern.targetMode === 'all' || !pattern.targetPartIds?.length
    );

    if (allPattern) {
      const partIds = (currentRenderData.value.colors || [])
        .map((item) => item.id)
        .filter((id) => id && id !== partId);

      const expandedPatterns = partIds.map((id) => ({
        ...allPattern,
        id: `${allPattern.patternId || allPattern.id || 'pattern'}_${id}`,
        targetMode: 'parts',
        targetPartIds: [id],
      }));

      currentRenderData.value.patterns = currentRenderData.value.patterns
        .filter((pattern) => !(pattern.targetMode === 'all' || !pattern.targetPartIds?.length))
        .filter((pattern) => !(pattern.targetMode === 'parts' && pattern.targetPartIds?.includes(partId)));

      currentRenderData.value.patterns.unshift(...expandedPatterns);
      saveHistoryState(`Remove pattern: ${partId}`);
      return;
    }
  }

  currentRenderData.value.patterns = currentRenderData.value.patterns.filter((pattern) => {
    if (partId === 'ALL') {
      return !(pattern.targetMode === 'all' || !pattern.targetPartIds?.length);
    }
    return !(pattern.targetMode === 'parts' && pattern.targetPartIds?.includes(partId));
  });
  saveHistoryState(`Remove pattern: ${partId}`);
};

const selectElement = (id) => {
  if (window.world) {
    const obj = world.getSvgEditorByType(modelType.value).selectObjectById(id);
    // fit to object
    if (obj) {
      const isFrontSide = obj.left + obj.width / 2 > world.getSvgEditorByType(modelType.value).canvas.width / 2;
      world.switchClothType(modelType.value, isFrontSide ? 'front' : 'back');
    }
  }
};

const viewSelectionToGui = (selected) => {
  editingElement.value = {
    type: selected.type,
    id: selected.id
  };
};

const saveDesign = async () => {
  if (!window.world) return;
  const data = currentProduct.value;

  const zip = new JSZip();
  data.scene.model.forEach(v => {
    v.texture.main = world.getSvgEditorByType(v.type).getJson();
  });
  // downloadJSON(data);
  zip.file(data.id + '.json', JSON.stringify(data));
  for(const key in world.resource) {
    const design = world.resource[key];
    const fabricJson = await design.fabricEditor.toSVG(`${data.id}.svg`, 1, { isDownload: false });
    zip.file(`${data.id}_${key}.svg`, fabricJson);
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `${data.id}.zip`);
  });
};

const takeSnapshot = () => {
  if (!world) return;
  
  let dataURL = null;
  if (editType.value === '3D') {
    // 3D mode: get snapshot from WebGL renderer
    dataURL = world.get3DModelSnapshot();
  } else {
    // 2D mode: get snapshot from active fabric canvas
    const editor = world.getSvgEditorByType(modelType.value);
    if (editor && editor.canvas) {
      try {
        dataURL = editor.canvas.toDataURL({ format: 'png', multiplier: 2 });
      } catch (err) {
        console.error('Failed to capture 2D model snapshot:', err);
        const upperCanvas = document.querySelector(`#edit-container canvas`);
        if (upperCanvas) {
          dataURL = upperCanvas.toDataURL('image/png');
        }
      }
    }
  }

  if (dataURL) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `sports_customizer_screenshot_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('截图捕获失败，请确保场景已正常载入！');
  }
};

// 生命周期钩子
onMounted(async () => {
  // 绑定非被动(non-passive)的 wheel 事件，以在 2D 视图下彻底防止滚动鼠标滚轮时页面发生滚动
  if (editContainerRef.value) {
    editContainerRef.value.addEventListener('wheel', (e) => {
      if (editType.value === '2D') {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        adjustZoom(delta);
      }
    }, { passive: false });
  }

  const data = await getDataForRender();
  if (!data) return;
  currentProduct.value = data;
  clothType.value = data.clothType;
  modelType.value = data.clothType === 'suit' ? 'jersey' : data.clothType;;
  enabledTypes.value = data.clothType === 'suit' ? ['suit', 'jersey', 'pant'] : [data.clothType];

  initVarFromTexture(currentProduct.value);

  const sceneOptions = {
    ...(data.scene || {}),
    backgroundColor: activeBgColor.value,
    sportType: data.sportType
  };
  world = new World(glCanvas.value, sceneOptions);
  world.setTargetBgColor(activeBgColor.value);
  window.world = world;

  world.addEventListener('model_loaded', async () => {
    const loadingPromises = [];
    for (let key in world.resource) {
      const editor = world.getSvgEditorByType(key);
      if (editor && editor.loadingPromise) {
        loadingPromises.push(editor.loadingPromise);
      }
    }
    
    try {
      await Promise.all(loadingPromises);
    } catch (e) {
      console.error('Failed loading templates in fabric editor:', e);
    }
    syncLogoClipStateFromEditors();
    updateDefaultLogoVisibleState();

    for (let key in world.resource) {
      const editor = world.getSvgEditorByType(key);
      if (!editor) continue;

      editor.canvas.on('selection:created', (e) => {
        viewSelectionToGui(e.selected[0]);
      });
      editor.canvas.on('selection:updated', (e) => {
        viewSelectionToGui(e.selected[0]);
      });
      editor.canvas.on('object:modified', (e) => {
        if (isApplyingHistory.value) return;
        const obj = e.target;
        if (!obj || !obj.id) return;
        
        // Find matching text item in that editor's dataset and update coordinates/scales
        const partData = renderData.value ? renderData.value.find(v => v.type === key) : null;
        if (partData && partData.texts) {
          const textItem = partData.texts.find(t => t.id === obj.id);
          if (textItem) {
            textItem.left = obj.left;
            textItem.top = obj.top;
            if (obj.scaleX !== undefined) textItem.scaleX = obj.scaleX;
            if (obj.scaleY !== undefined) textItem.scaleY = obj.scaleY;
            if (obj.angle !== undefined) textItem.angle = obj.angle;
          }
        }
        
        // Save manual transformations to history stack
        saveHistoryState('调整位置/尺寸');
      });
    }
    
    // Save the baseline design as first index of history with a small delay for async enlivening to finish
    setTimeout(() => {
      saveHistoryState('初始设计');
    }, 500);
  });
  
  // Register keyboard shortcut listeners for Undo/Redo
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (world) {
    world.destroy();
    world = null;
    window.world = null;
  }
});

// History capabilities integrated seamlessly into custom undo/redo stream

// 切换服装类型
const switchClothType = (type) => {
  if (enabledTypes.value.includes(type)) {
    clothType.value = type;
    if(type !== 'suit') {
      modelType.value = type;
      setCurrentRenderData()
    }
    world.switchClothType(type);
    if (editType.value === '2D') {
      switch2_3D(editType.value);
    }
  }
};

</script>

<style scoped>
.design-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.svgCtn {
  position: absolute;
  top: 0;
  right: 100%;
  opacity: 1;
  z-index: -99;
}

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.border-container {
  @apply bg-white dark:bg-darker border border-solid border-slate-200 dark:border-dark rounded-2xl shadow-sm transition-all duration-300;
}

/* 添加按钮悬停效果 */
.group:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

/* 添加按钮激活效果 */
.group:active {
  transform: scale(0.95);
}

/* 添加禁用状态的样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.bookmark {
  width: 8rem;
  height: 2rem;
  margin: 1.5rem 0 0.5rem -0.2rem;
  line-height: 2rem;
}
.bookmarkBg {
  background: url("/images/assets/1.svg");
  background-size: 100% 100%;
}
</style>
