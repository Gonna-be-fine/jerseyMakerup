<template>
  <div class="space-y-5 w-full relative flex flex-col pb-4">
    <!-- Header Block -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
      <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider uppercase flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'user-friends']" class="text-indigo-500" />
        <span>定制球员名单</span>
      </h3>
      <button 
        @click="emit('addPlayer')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-200 shadow-md shadow-indigo-600/15 active:scale-95 cursor-pointer"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="text-[10px]" />
        <span>新增球员</span>
      </button>
    </div>

    <!-- Players Info Card wrapper -->
    <div class="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl space-y-3 min-h-[140px] max-h-[360px] overflow-y-auto">
      <div 
        v-for="(player, index) in players" 
        :key="index" 
        class="flex gap-2 items-center justify-between bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2 relative shadow-sm"
      >
        <input 
          type="text" 
          placeholder="球员名字" 
          class="input-element flex-1 min-w-0" 
          v-model="player.name"
        >
        <input 
          type="text" 
          placeholder="号码" 
          class="input-element w-12 text-center" 
          v-model="player.number"
        >
        <select 
          placeholder="尺码" 
          class="input-element w-16" 
          v-model="player.size"
        >
          <option :value="size" v-for="size in sizes" :key="size">{{ size }}</option>
        </select>
        
        <button 
          @click="emit('previewPlayer', index)"
          class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-semibold transition-all cursor-pointer"
        >
          预览
        </button>
        <button 
          @click="emit('removePlayer', index)" 
          v-if="players.length > 1"
          class="w-6 h-6 rounded-md hover:bg-red-500/10 hover:text-red-500 text-slate-400 dark:text-slate-500 flex items-center justify-center transition-all cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
        </button>
      </div>
    </div>

    <!-- Price details section -->
    <div class="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 rounded-xl p-3.5 space-y-3">
      <h3 class="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider uppercase flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'receipt']" class="text-indigo-400" />
        <span>阶梯定价参考</span>
      </h3>
      <section class="text-[11px] w-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <header class="flex bg-slate-50 dark:bg-slate-950 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 py-1.5 px-2">
          <div class="w-1/2 text-left">数量档位</div>
          <div class="w-1/2 text-right">单价 (件)</div>
        </header>
        <div class="divide-y divide-slate-150 dark:divide-slate-800">
          <div class="flex py-1.5 px-2 text-slate-700 dark:text-slate-300 transition-colors" v-for="(item, index) in priceTag" :key="index">
            <div class="w-1/2 text-left font-medium">{{ item.quantity }} 件</div>
            <div class="w-1/2 text-right font-semibold text-indigo-600 dark:text-indigo-400">￥{{ item.price }}</div>
          </div>
        </div>
      </section>
    </div>

    <!-- Instructions -->
    <div class="rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/40 p-3 space-y-1">
      <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
        <font-awesome-icon :icon="['fas', 'info-circle']" />
        自定义下单指南
      </span>
      <p class="text-[10px] text-slate-500 dark:text-indigo-300/80 leading-relaxed">
        可在此编辑球员名单与尺码信息。团队订单将根据最终件数自动匹配最优惠的单价折扣。
      </p>
    </div>

    <!-- Bottom shopping/floating badge -->
    <div class="sticky bottom-0 w-full rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-250 dark:border-slate-800 p-3 shadow-lg flex justify-between items-center z-10 backdrop-blur-md">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
          <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-xs" />
        </div>
        <div class="min-w-0">
          <p class="text-slate-800 dark:text-slate-100 font-bold text-xs">
            已备选 {{ players.length }} 件商品
          </p>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate w-24">
            高品质订制球服
          </p>
        </div>
      </div>
      <button 
        @click="handleAddToCart"
        class="text-xs font-bold leading-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg transition-all shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-95 cursor-pointer shrink-0"
      >
        加入购物车 &middot; ￥{{ computeTotalPrice }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useCartStore } from '../../stores/cartStore';
import { useToast } from '../../utils/toast';

const toast = useToast();
const cartStore = useCartStore();
const props = defineProps({
  players: Array,
});
const emit = defineEmits();

const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const priceTag = [
  {
    quantity: '1-2',
    price: 89
  },
  {
    quantity: '3-9',
    price: 81.9
  },
  {
    quantity: '10+',
    price: 75.9
  },
]
const computeTotalPrice = computed(() => {
  let price = 0;
  for(let i = 0; i < priceTag.length; i++) {
    let quantity = priceTag[i].quantity;
    if(typeof quantity === 'string') {
      let quantityArr = quantity.split('-');
      if(quantityArr.length > 0 && quantityArr[0] <= props.players.length && quantityArr[1] >= props.players.length) {
        price = priceTag[i].price;
        break;
      }else {
        let quantityArr = quantity.split('+');
        if(quantityArr.length > 0 && quantityArr[0] <= props.players.length) {
          price = priceTag[i].price;
          break;
        }
      }
    }else if(quantity === props.players.length) {
      price = priceTag[i].price;
      break;
    }
  }
  return (price * props.players.length).toFixed(2);
})

const handleAddToCart = () => {
  // 验证所有必填字段
  const isValid = props.players.every(player => 
    player.name && player.number && player.size
  );
  
  if (!isValid) {
    toast.error('请填写所有球员信息');
    return;
  }

  // 获取当前设计的SVG内容
  const design = {
    editSvg: window.world.svgEditor.svgCanvas.getSvgString(),
    mainSvg: document.querySelector('#mainSvgCtn').outerHTML
  };

  // 添加到购物车
  cartStore.addToCart({
    players: props.players,
    price: computeTotalPrice.value,
    productName: '高品质订制球服',
    design
  });

  // 提示用户
  toast.success('已添加到购物车！');
};
</script>

<style scoped>
.input-element {
  @apply bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-1 dark:focus:ring-indigo-500 transition-all duration-200 outline-none;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>