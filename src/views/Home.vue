<template>
  <main class="home-page">
    <section class="hero">
      <div class="hero-grid"></div>
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>

      <div class="hero-3d-background" aria-hidden="true">
        <cartoon-flag-scene />
      </div>
      <div class="hero-image-shade"></div>

      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-kicker">
            <span class="hero-kicker-dot"></span>
            3D JERSEY DESIGN STUDIO
          </div>

          <p class="header-meta">把创意，穿上身</p>
          <h1 class="hero-title">
            让每一件队服
            <span>都有自己的主场</span>
          </h1>
          <p class="hero-description">
            从配色、号码、队名到 Pattern 图案，在线完成专属设计。实时 3D 预览每个细节，让灵感不止停留在想象。
          </p>

          <div class="hero-actions">
            <button class="hero-primary-btn" @click="$router.push('/products')">
              <span>开始设计</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
            <a class="hero-secondary-link" href="#best-seller">
              探索设计品类
              <font-awesome-icon :icon="['fas', 'arrow-down']" />
            </a>
          </div>

          <div class="hero-highlights">
            <div class="hero-highlight">
              <span class="highlight-icon"><font-awesome-icon :icon="['fas', 'cube']" /></span>
              <span><strong>实时 3D</strong><small>所见即所得</small></span>
            </div>
            <div class="hero-highlight">
              <span class="highlight-icon"><font-awesome-icon :icon="['fas', 'shapes']" /></span>
              <span><strong>自由图案</strong><small>Pattern 创作</small></span>
            </div>
            <div class="hero-highlight">
              <span class="highlight-icon"><font-awesome-icon :icon="['fas', 'download']" /></span>
              <span><strong>设计导出</strong><small>方便生产对接</small></span>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-bottom-note">
        <span>DESIGN WITHOUT LIMITS</span>
        <span class="hero-bottom-line"></span>
        <span>01 / 03</span>
      </div>
    </section>

    <best-seller-section />
    <featured-products />
    <testimonials-section />
  </main>
</template>

<script>
import BestSellerSection from '../components/home/BestSellerSection.vue'
import FeaturedProducts from '../components/home/FeaturedProducts.vue'
import TestimonialsSection from '../components/home/TestimonialsSection.vue'
import CartoonFlagScene from '../components/home/CartoonFlagScene.vue'

export default {
  name: 'Home',
  components: {
    BestSellerSection,
    FeaturedProducts,
    TestimonialsSection,
    CartoonFlagScene
  }
}
</script>

<style scoped>
.home-page {
  overflow: hidden;
  background: #f8fafc;
}

.hero {
  --hero-ink: #f8fafc;
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: min(780px, calc(100vh - 4rem));
  overflow: hidden;
  background:
    radial-gradient(ellipse at 72% 45%, rgba(49, 46, 129, 0.42), transparent 42%),
    linear-gradient(115deg, #070b16 0%, #0b1222 48%, #101a30 100%);
  color: var(--hero-ink);
}

.hero-grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.18;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(90deg, black, transparent 88%);
}

.hero-glow {
  position: absolute;
  z-index: -1;
  width: 28rem;
  height: 28rem;
  border-radius: 9999px;
  filter: blur(100px);
  pointer-events: none;
}

.hero-glow-one {
  top: -15rem;
  left: 8%;
  background: rgba(79, 70, 229, 0.22);
}

.hero-glow-two {
  right: 8%;
  bottom: -20rem;
  background: rgba(6, 182, 212, 0.16);
}

.hero-3d-background {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  width: 66%;
  height: 100%;
  pointer-events: auto;
}

.hero-image-shade {
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, #080d19 0%, rgba(8, 13, 25, 0.96) 28%, rgba(8, 13, 25, 0.62) 49%, rgba(8, 13, 25, 0.08) 78%),
    linear-gradient(0deg, rgba(8, 13, 25, 0.52), transparent 28%, transparent 72%, rgba(8, 13, 25, 0.2));
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 7rem 2rem 6.5rem;
  pointer-events: none;
}

.hero-content {
  max-width: 610px;
  pointer-events: auto;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 2.2rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid rgba(165, 180, 252, 0.24);
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.42);
  color: #c7d2fe;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  backdrop-filter: blur(12px);
}

.hero-kicker-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #67e8f9;
  box-shadow: 0 0 14px rgba(103, 232, 249, 0.9);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
  color: #a5b4fc;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.header-meta::before {
  content: '';
  width: 1.7rem;
  height: 2px;
  border-radius: 99px;
  background: #818cf8;
}

.hero-title {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(2.8rem, 5.3vw, 4.65rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.055em;
}

.hero-title span {
  display: block;
  color: transparent;
  background: linear-gradient(95deg, #a5b4fc 8%, #67e8f9 92%);
  background-clip: text;
  -webkit-background-clip: text;
}

.hero-description {
  max-width: 510px;
  margin-top: 1.6rem;
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.95;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2.2rem;
}

.hero-primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  min-width: 158px;
  padding: 1rem 1.4rem;
  border: 0;
  border-radius: 0.9rem;
  background: linear-gradient(110deg, #6366f1, #4f46e5);
  color: white;
  box-shadow: 0 12px 32px rgba(79, 70, 229, 0.3);
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hero-primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 38px rgba(79, 70, 229, 0.42);
}

.hero-primary-btn svg {
  transition: transform 0.25s ease;
}

.hero-primary-btn:hover svg {
  transform: translateX(4px);
}

.hero-secondary-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.hero-secondary-link:hover {
  color: #67e8f9;
}

.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 1.7rem;
  margin-top: 3.2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.hero-highlight {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.highlight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  border: 1px solid rgba(165, 180, 252, 0.2);
  border-radius: 0.7rem;
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  font-size: 0.9rem;
}

.hero-highlight strong,
.hero-highlight small {
  display: block;
}

.hero-highlight strong {
  color: #f1f5f9;
  font-size: 0.76rem;
  font-weight: 800;
}

.hero-highlight small {
  margin-top: 0.15rem;
  color: #94a3b8;
  font-size: 0.65rem;
}

.hero-bottom-note {
  position: absolute;
  z-index: 2;
  right: 2rem;
  bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(203, 213, 225, 0.65);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.hero-bottom-line {
  width: 3rem;
  height: 1px;
  background: rgba(203, 213, 225, 0.45);
}

@media (max-width: 992px) {
  .hero {
    min-height: 720px;
  }

  .hero-3d-background {
    width: 78%;
    opacity: 0.78;
  }

  .hero-image-shade {
    background:
      linear-gradient(90deg, #080d19 0%, rgba(8, 13, 25, 0.92) 38%, rgba(8, 13, 25, 0.42) 100%),
      linear-gradient(0deg, rgba(8, 13, 25, 0.65), transparent 35%);
  }

  .hero-container {
    padding: 6rem 2rem;
  }

  .hero-content {
    max-width: 560px;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 760px;
    align-items: flex-start;
  }

  .hero-3d-background {
    top: auto;
    bottom: 0;
    width: 100%;
    height: 58%;
    opacity: 0.65;
  }

  .hero-image-shade {
    background:
      linear-gradient(180deg, #080d19 0%, rgba(8, 13, 25, 0.97) 37%, rgba(8, 13, 25, 0.38) 76%, rgba(8, 13, 25, 0.65) 100%);
  }

  .hero-container {
    padding: 4.5rem 1.25rem 7rem;
  }

  .hero-kicker {
    margin-bottom: 1.5rem;
    font-size: 0.56rem;
  }

  .hero-title {
    font-size: clamp(2.55rem, 12vw, 3.45rem);
  }

  .hero-description {
    max-width: 100%;
    margin-top: 1.2rem;
    font-size: 0.9rem;
  }

  .hero-actions {
    gap: 1.1rem;
    margin-top: 1.7rem;
  }

  .hero-highlights {
    gap: 1rem;
    margin-top: 2.1rem;
    padding-top: 1.2rem;
  }

  .hero-highlight {
    gap: 0.45rem;
  }

  .highlight-icon {
    width: 1.95rem;
    height: 1.95rem;
    font-size: 0.75rem;
  }

  .hero-highlight strong {
    font-size: 0.68rem;
  }

  .hero-highlight small {
    font-size: 0.58rem;
  }

  .hero-bottom-note {
    right: 1.25rem;
    bottom: 1rem;
  }
}
</style>
