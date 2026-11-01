<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="MoMoFit 首页">
        <img src="@/assets/logo/marker.svg" alt="" class="brand-mark">
        <img src="@/assets/logo/text.svg" alt="MoMoFit" class="brand-word">
      </router-link>

      <nav class="main-nav" aria-label="主导航">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/products" class="nav-item">商店</router-link>
      </nav>

      <div class="header-tools">
        <div class="desktop-tools">
          <search-bar />
          <user-account />
          <shopping-cart />
        </div>
        <button class="theme-toggle" type="button" aria-label="切换主题" @click="toggleTheme">
          <span v-if="isDark">☾</span>
          <span v-else>☼</span>
        </button>
        <button v-if="canOpenSidebar" class="mobile-menu" type="button" aria-label="打开菜单" @click="$emit('openSidebar')">☰</button>
        <button class="header-cta" type="button" @click="$router.push('/products')">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          开始设计 <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from "@/composables/useTheme.js"
import SearchBar from "../home/SearchBar.vue"
import UserAccount from "../home/UserAccount.vue"
import ShoppingCart from "../home/ShoppingCart.vue"

const { isDark, toggleTheme } = useTheme()
defineProps({ canOpenSidebar: { type: Boolean, default: true } })
</script>

<style scoped>
.site-header { position: relative; z-index: 9998; width: 100%; background: rgba(249,250,255,.88); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(218,225,245,.48); color: #1b2944; }
.header-inner { width: min(1440px,calc(100% - 64px)); height: 66px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
.brand { display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto; }
.brand-mark { width: 34px; height: 34px; object-fit: contain; }
.brand-word { width: 88px; height: 26px; object-fit: contain; }
.main-nav { display: flex; align-items: center; gap: 42px; margin: 0 auto; }
.nav-item { position: relative; color: #8993a9; font-size: 13px; font-weight: 700; transition: color .2s ease; }
.nav-item:hover,.nav-item.router-link-exact-active { color: #6254f4; }
.nav-item.router-link-exact-active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -11px; height: 2px; border-radius: 2px; background: #6254f4; }
.header-tools,.desktop-tools { display: flex; align-items: center; gap: 14px; }
.desktop-tools { gap: 12px; }
.theme-toggle { width: 32px; height: 32px; border: 1px solid #e6e9f4; border-radius: 50%; color: #737f98; background: #fff; cursor: pointer; }
.header-cta { display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 999px; padding: 10px 17px; background: linear-gradient(110deg,#6b5af6,#5145e8); color: #fff; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 6px 16px rgba(93,80,239,.2); }
.mobile-menu { display: none; border: 0; background: transparent; color: #53617c; font-size: 21px; cursor: pointer; }
@media(max-width:900px) { .header-inner { width: calc(100% - 36px); } .main-nav { gap: 22px; } .desktop-tools { display: none; } }
@media(max-width:560px) { .header-inner { height: 60px; gap: 10px; } .brand-mark { width: 30px; } .brand-word { width: 78px; } .main-nav { display: none; } .mobile-menu { display: block; } .header-cta { padding: 9px 12px; font-size: 11px; } .theme-toggle { display: none; } }
</style>