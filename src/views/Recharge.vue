<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-6xl px-4 py-8">
      <section class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-black tracking-tight">积分充值</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            如需充值积分，请添加微信客服并提供注册邮箱，我们会为你完成充值。
          </p>
        </div>

        <div class="rounded-lg border border-emerald-200 bg-white px-4 py-3 shadow-sm dark:border-emerald-900/60 dark:bg-slate-900">
          <span class="block text-xs font-bold text-slate-500 dark:text-slate-400">当前余额</span>
          <span class="mt-1 block text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {{ userStore.userInfo.pointsBalance || 0 }} 积分
          </span>
        </div>
      </section>

      <section class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="space-y-6">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="grid gap-6 md:grid-cols-[260px_1fr] md:items-start">
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <img
                  src="/images/link.jpg"
                  alt="客服微信二维码"
                  class="w-full rounded-md object-contain"
                />
              </div>

              <div class="space-y-5">
                <div>
                  <span class="inline-flex rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
                    人工充值
                  </span>
                  <h2 class="mt-3 text-xl font-black">添加微信完成积分充值</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    请扫码添加客服微信，发送你的注册邮箱和想充值的套餐。我们确认后会把积分添加到你的账户。
                  </p>
                </div>

                <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <span class="block text-xs font-bold text-slate-500 dark:text-slate-400">你的注册邮箱</span>
                  <div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span class="min-w-0 flex-1 break-all rounded-md bg-white px-3 py-2 text-sm font-bold dark:bg-slate-900">
                      {{ userEmail || '当前账号未读取到邮箱' }}
                    </span>
                    <button
                      type="button"
                      class="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
                      :disabled="!userEmail"
                      @click="copyEmail"
                    >
                      复制邮箱
                    </button>
                  </div>
                </div>

                <ol class="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                  <li class="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                    <span class="block text-xs font-black text-slate-400">01</span>
                    扫码添加客服微信
                  </li>
                  <li class="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                    <span class="block text-xs font-black text-slate-400">02</span>
                    发送注册邮箱和套餐
                  </li>
                  <li class="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                    <span class="block text-xs font-black text-slate-400">03</span>
                    人工确认后积分到账
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-black">充值套餐</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  选择一个套餐后，把套餐名称和注册邮箱一起发给客服。
                </p>
              </div>
              <span class="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                微信客服充值
              </span>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-4">
              <button
                v-for="pkg in packages"
                :key="pkg.id"
                type="button"
                class="rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:bg-slate-900"
                :class="selectedPackage?.id === pkg.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-800'"
                @click="selectedPackage = pkg"
              >
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="block text-sm font-black">{{ pkg.name }}</span>
                    <span class="mt-1 block text-xs text-slate-500 dark:text-slate-400">{{ pkg.description }}</span>
                  </div>
                  <span class="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                    ￥{{ formatYuan(pkg.amountCents) }}
                  </span>
                </div>
                <div class="mt-4 text-3xl font-black">{{ pkg.points }}</div>
                <div class="mt-1 text-xs text-slate-500">积分</div>
              </button>
            </div>

            <div v-if="selectedPackage" class="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
              请发送：{{ userEmail || '你的注册邮箱' }}，充值 {{ selectedPackage.name }}，{{ selectedPackage.points }} 积分，￥{{ formatYuan(selectedPackage.amountCents) }}。
            </div>
          </section>
        </div>

        <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-black">最近流水</h2>
            <button type="button" class="text-xs font-bold text-indigo-600" @click="loadTransactions">刷新</button>
          </div>
          <div class="mt-4 space-y-2">
            <div
              v-for="item in transactions"
              :key="item.id"
              class="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950"
            >
              <div class="min-w-0">
                <span class="block truncate font-bold">{{ item.remark || item.bizType || item.type }}</span>
                <span class="block text-xs text-slate-500">{{ formatDate(item.createdAt) }}</span>
              </div>
              <span class="font-black" :class="item.amount > 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
              </span>
            </div>
            <div v-if="!transactions.length" class="rounded bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-950">
              暂无积分流水
            </div>
          </div>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { get, post } from '../utils/request';
import { useToast } from '../utils/toast';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

const fallbackPackages = [
  { id: 'starter', name: '体验包', description: '适合少量尝试', amountCents: 990, points: 100 },
  { id: 'standard', name: '标准包', description: '日常设计推荐', amountCents: 2990, points: 350 },
  { id: 'pro', name: '专业包', description: '适合持续创作', amountCents: 5990, points: 800 },
  { id: 'team', name: '团队包', description: '多人项目使用', amountCents: 9990, points: 1500 },
];

const packages = ref([]);
const selectedPackage = ref(null);
const currentOrder = ref(null);
const transactions = ref([]);
const isCreating = ref(false);
const isPaying = ref(false);

const userEmail = computed(() => userStore.userInfo.email || '');
const formatYuan = (amountCents) => (Number(amountCents || 0) / 100).toFixed(2);
const formatDate = (value) => value ? new Date(value).toLocaleString() : '';
const statusLabel = (status) => {
  const labels = {
    pending: '待支付',
    paid: '已支付',
    closed: '已关闭',
    failed: '支付失败',
  };
  return labels[status] || status;
};

const copyEmail = async () => {
  if (!userEmail.value) return;
  await navigator.clipboard.writeText(userEmail.value);
  toast.success('邮箱已复制');
};

const loadBalance = async () => {
  const balance = await get('/points/balance');
  userStore.setPointsBalance(balance.pointsBalance);
};

const loadPackages = async () => {
  try {
    packages.value = await get('/points/recharge/packages');
  } catch (error) {
    packages.value = fallbackPackages;
  }
  selectedPackage.value = packages.value[1] || packages.value[0] || null;
};

const loadTransactions = async () => {
  transactions.value = await get('/points/transactions', { limit: 10 });
};

// Payment order flow is intentionally kept for the later real-payment rollout.
const createOrder = async () => {
  if (!selectedPackage.value) return;
  isCreating.value = true;
  try {
    const result = await post('/points/recharge/orders', {
      packageId: selectedPackage.value.id,
    });
    currentOrder.value = result.order;
    toast.success('充值订单已创建');
  } finally {
    isCreating.value = false;
  }
};

const simulatePay = async () => {
  if (!currentOrder.value) return;
  isPaying.value = true;
  try {
    const result = await post(`/points/recharge/orders/${currentOrder.value.orderNo}/simulate-pay`);
    currentOrder.value = result.order;
    userStore.setPointsBalance(result.pointsBalance);
    await loadTransactions();
    toast.success('模拟支付成功，积分已到账');
  } finally {
    isPaying.value = false;
  }
};

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: '/recharge' } });
    return;
  }

  await Promise.all([loadBalance(), loadPackages(), loadTransactions()]);
});
</script>
