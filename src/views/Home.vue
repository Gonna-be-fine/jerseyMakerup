<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="hero-art" :style="{ backgroundImage: `url(${heroImage})` }" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow"><span></span> 3D JERSEY DESIGNER</p>
          <h1>设计你的专属球衣</h1>
          <p class="hero-lead">从创意到球场，让每一件球衣都独一无二</p>
          <div class="hero-actions">
            <button class="primary-action" type="button" @click="$router.push('/products')">
              开始设计 <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
            <button class="secondary-action" type="button" @click="$router.push('/products')">
              <span class="play-icon"><font-awesome-icon :icon="['fas', 'play']" /></span>
              浏览设计款式
            </button>
          </div>
          <div class="hero-proof">
            <span><font-awesome-icon :icon="['fas', 'cube']" /> 在线 3D 预览</span>
            <i></i>
            <span><font-awesome-icon :icon="['fas', 'palette']" /> 自由配色设计</span>
            <i></i>
            <span><font-awesome-icon :icon="['fas', 'file-export']" /> 生产文件导出</span>
          </div>
        </div>
      </div>
      <div class="hero-scroll-hint"><span></span> SCROLL TO EXPLORE</div>
    </section>

    <best-seller-section />
    <featured-products />
    <testimonials-section />
  </div>
</template>

<script>
import BestSellerSection from '../components/home/BestSellerSection.vue'
import FeaturedProducts from '../components/home/FeaturedProducts.vue'
import TestimonialsSection from '../components/home/TestimonialsSection.vue'
import { publicPath } from '../utils/publicPath'

export default {
  name: 'Home',
  components: { BestSellerSection, FeaturedProducts, TestimonialsSection },
  data() {
    return { heroImage: publicPath('/images/types/bg.jpg') }
  }
}
</script>

<style scoped>
.home-page {
  --home-ink: #14213b;
  --home-muted: #66738b;
  --home-purple: #6254f4;
  color: var(--home-ink);
  background:
    radial-gradient(ellipse at 78% 4%, rgba(199, 213, 255, .48), transparent 36%),
    linear-gradient(180deg, #f7f8ff 0%, #fbfcff 52%, #f8faff 100%);
  overflow: hidden;
}
.home-hero {
  min-height: 350px;
  height: min(700px, 43vw);
  position: relative;
  display: flex;
  align-items: center;
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 78% 40%, rgba(171, 192, 255, .42), transparent 36%),
    linear-gradient(112deg, #f9faff 0%, #f1f3ff 54%, #dce8ff 100%);
}
.hero-art {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  /* inset: 0 0 0 32%; */
  background-image: none;  
  background-position: center center; 
  background-size: cover;
  background-repeat: no-repeat;
  opacity: .98;
  pointer-events: none;
}
.hero-inner {
  width: min(1440px, calc(100% - 64px));
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.hero-copy { max-width: 610px; padding: 26px 0 34px; }
.eyebrow {
  display: flex; align-items: center; gap: 12px;
  margin: 0 0 18px;
  color: #9aa4b8; font-size: 12px; font-weight: 800;
  letter-spacing: .15em;
}
.eyebrow span { width: 3px; height: 14px; border-radius: 4px; background: var(--home-purple); transform: skew(-20deg); }
.hero-copy h1 {
  margin: 0; color: #17243e; font-size: clamp(38px, 4.2vw, 58px);
  line-height: 1.16; letter-spacing: -.045em; font-weight: 900;
}
.hero-lead { margin: 16px 0 25px; color: #68758e; font-size: clamp(15px, 1.35vw, 19px); font-weight: 600; }
.hero-actions { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.primary-action {
  display: inline-flex; align-items: center; gap: 12px;
  border: 0; border-radius: 999px; padding: 13px 25px;
  color: #fff; background: linear-gradient(110deg, #6c5af7, #5145e8);
  font-size: 14px; font-weight: 800; cursor: pointer;
  box-shadow: 0 10px 24px rgba(92, 78, 239, .26);
  transition: transform .2s ease, box-shadow .2s ease;
}
.primary-action:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(92,78,239,.32); }
.secondary-action { display: inline-flex; align-items: center; gap: 10px; border: 0; background: transparent; color: #69758c; font-size: 13px; font-weight: 700; cursor: pointer; }
.play-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; color: #6254f4; background: rgba(255,255,255,.8); box-shadow: 0 5px 18px rgba(54,73,120,.1); font-size: 11px; }
.hero-proof { display: flex; align-items: center; gap: 14px; margin-top: 34px; color: #8792a7; font-size: 11px; font-weight: 700; }
.hero-proof span { display: inline-flex; align-items: center; gap: 7px; }
.hero-proof svg { color: #8177f5; }
.hero-proof i { width: 3px; height: 3px; border-radius: 50%; background: #c2c9d8; }
.hero-scroll-hint { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; color: #a3abc0; font-size: 9px; letter-spacing: .16em; font-weight: 800; }
.hero-scroll-hint span { width: 5px; height: 5px; border-radius: 50%; background: #8e82f7; box-shadow: 0 0 0 4px rgba(142,130,247,.12); }
@media (max-width: 900px) {
  .home-hero { height: auto; min-height: 430px; }
  .hero-art { inset: 0 0 0 24%; opacity: .56; background-position: center right; }
  .hero-inner { width: min(100% - 40px, 720px); }
  .hero-copy { max-width: 540px; padding: 68px 0 74px; }
  .hero-proof { flex-wrap: wrap; gap: 10px; margin-top: 25px; }
}
@media (max-width: 560px) {
  .home-hero { height: 580px; min-height: 580px; align-items: flex-start; }
  .hero-art { top: 175px; right: 0; bottom: auto; left: 0; width: 100%; height: 300px; max-height: 300px; opacity: .65; background-size: auto 300px; background-position: right center; }
  .hero-inner { width: calc(100% - 36px); }
  .hero-copy { padding: 52px 0 160px; }
  .hero-copy h1 { font-size: 36px; }
  .hero-lead { max-width: 290px; line-height: 1.7; }
  .hero-proof { max-width: 300px; font-size: 10px; }
  .hero-scroll-hint { display: none; }
}
</style>