import { createApp } from 'vue'
import './style.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MotionPlugin } from '@vueuse/motion'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { publicPath } from './utils/publicPath'

import App from './components/layout/DefaultLayout.vue'
import * as THREE from 'three';

library.add(fas);

window.THREE = THREE;

const loadPublicScript = (src) => {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
};

const loadPublicStyle = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};

loadPublicScript(publicPath('/lib/dat.gui.min.js'));
loadPublicStyle(publicPath('/fonts/css/American_Captain.css'));

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
.use(router)
.component('font-awesome-icon', FontAwesomeIcon)
.use(MotionPlugin)
.use(pinia)
.mount('#app')
