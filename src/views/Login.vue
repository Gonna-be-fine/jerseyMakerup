<template>
  <div class="text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        登录您的账户
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        或者
        <router-link to="/register" class="font-medium text-primary hover:text-secondary">
          注册新账户
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              邮箱地址
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                v-model="form.email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                v-model="form.password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                v-model="form.remember"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <router-link to="/forgot-password" class="font-medium text-primary hover:text-secondary">
                忘记密码?
              </router-link>
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
              {{ isSubmitting ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import request from '../utils/request';
import { useToast } from '../utils/toast';
import { useUserStore } from '../stores/userStore';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const toast = useToast();

const form = {
  email: '',
  password: '',
  remember: false
};
const isSubmitting = ref(false);
const error = ref(null);

const handleLogin = async () => {
  error.value = null;

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    error.value = '请输入正确的邮箱地址';
    return;
  }

  try {
    isSubmitting.value = true;
    
    const response = await request.post('/users/login/email', {
      email: form.email,
      password: form.password,
    });

    if (response.status === 200) {
      // 保存token和过期时间
      userStore.setToken(
        response.data.access_token,
        response.data.expires_in
      );
      userStore.setUserInfo(response.data.user);
      
      toast.success('登录成功');
      
      // 如果有重定向地址，则跳转回去
      const redirect = route.query.redirect || '/';
      router.push(redirect);
    } else {
      error.value = response.message || '登录失败';
    }
  } catch (error) {
    error.value = error.message || '登录失败，请稍后重试';
    toast.error(error.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script> 
