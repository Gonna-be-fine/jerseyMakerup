<template>
  <div class="text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        重置密码
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        想起密码了?
        <router-link to="/login" class="font-medium text-primary hover:text-secondary">
          返回登录
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleResetPassword">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              邮箱地址
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              新密码
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                maxlength="32"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">密码长度需要在8-32位之间</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              确认新密码
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                maxlength="32"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="captchaAnswer" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              验证问题：{{ captcha.left }} + {{ captcha.right }} = ?
            </label>
            <div class="mt-1 flex gap-4">
              <input
                id="captchaAnswer"
                v-model="form.captchaAnswer"
                name="captchaAnswer"
                type="number"
                required
                inputmode="numeric"
                placeholder="请输入答案"
                class="appearance-none block flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
              <button
                type="button"
                @click="refreshCaptcha"
                class="shrink-0 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                换一题
              </button>
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '提交中...' : '重置密码' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '../utils/request';
import { useToast } from '../utils/toast';

const router = useRouter();
const toast = useToast();

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  captchaAnswer: '',
});

const captcha = reactive({
  left: 1,
  right: 1,
});

const error = ref(null);
const isSubmitting = ref(false);

const refreshCaptcha = () => {
  captcha.left = Math.floor(Math.random() * 9) + 1;
  captcha.right = Math.floor(Math.random() * 9) + 1;
  form.captchaAnswer = '';
};

refreshCaptcha();

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    error.value = '请输入正确的邮箱地址';
    return false;
  }
  return true;
};

const handleResetPassword = async () => {
  error.value = null;
  if (!validateEmail()) return;

  if (form.password !== form.confirmPassword) {
    error.value = '两次输入的密码不一致';
    return;
  }

  if (Number(form.captchaAnswer) !== captcha.left + captcha.right) {
    error.value = '验证问题答案不正确';
    refreshCaptcha();
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await request.post('/users/email/reset-password', {
      email: form.email,
      password: form.password,
      captchaLeft: captcha.left,
      captchaRight: captcha.right,
      captchaAnswer: Number(form.captchaAnswer),
    });

    if (response.status !== 200) {
      throw new Error(response.message || '重置密码失败');
    }

    toast.success('密码重置成功，请重新登录');
    router.push('/login');
  } catch (err) {
    error.value = err.message || '重置密码失败，请稍后重试';
    toast.error(error.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
