<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-3d-background">
        <cartoon-flag-scene />
      </div>
      <div class="hero-container lg:top-40">
        <div class="hero-content">
          <p class="header-meta">遇见属于你的独特风格</p>
          <h1 class="hero-title">
            <span class="highlight">个性化定制</span>
            <span class="studio-text">
              设计你的专属服饰
            </span>
          </h1>
          <p class="hero-description">利用AI与创新技术，定制属于你的专属球服与运动装备。多种款式，任你自由挥洒创意</p>
          <div class="button-wrapper" @click="$router.push('/products')">
            <button class="view-more-btn">
              <span>开始定制</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Seller Section -->
    <best-seller-section />

    <!-- Featured Products -->
    <featured-products />

    <!-- Testimonials -->
    <testimonials-section />

    <!-- Latest Products -->
    <!-- <latest-products /> -->
  </div>
</template>

<script>
import BestSellerSection from '../components/home/BestSellerSection.vue'
import FeaturedProducts from '../components/home/FeaturedProducts.vue'
import TestimonialsSection from '../components/home/TestimonialsSection.vue'
import LatestProducts from '../components/home/LatestProducts.vue'
import CartoonFlagScene from '../components/home/CartoonFlagScene.vue'

export default {
  name: 'Home',
  components: {
    BestSellerSection,
    FeaturedProducts,
    TestimonialsSection,
    LatestProducts,
    CartoonFlagScene
  }
}
</script>

<style scoped>

.hero {
  position: relative;
  background-color: var(--secondary-bg-color, #f8fafc);
  padding: 0;
  min-height: 88vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.hero-3d-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 4rem 2rem;
  pointer-events: none;
}

.hero-content {
  max-width: 580px;
  pointer-events: auto;
  padding: 0;
}

.header-meta {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.header-meta::before {
  content: '';
  display: inline-block;
  width: 1.5rem;
  height: 2px;
  background-color: #4f46e5;
  border-radius: 9999px;
}

.hero-title {
  font-family: var(--font-primary);
  font-size: clamp(2.4rem, 4.8vw, 3.4rem);
  line-height: 1.22;
  color: #0f172a;
  margin-bottom: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.highlight {
  color: #4f46e5;
  display: block;
}

.studio-text {
  display: block;
  color: #1e293b;
  margin-top: 0.25rem;
}

.hero-description {
  font-size: 1.05rem;
  color: #475569;
  margin-bottom: 2rem;
  line-height: 1.75;
  max-width: 520px;
}

.button-wrapper {
  margin-top: 2rem;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调�?*/
@media (max-width: 992px) {
  .hero {
    min-height: 80vh;
  }

  .hero-container {
    padding: 3rem 1.5rem;
  }

  .hero-content {
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }
}

.view-more-btn {
  background-color: #4f46e5;
  color: #ffffff;
  border: none;
  padding: 0.9rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.35);
}

.view-more-btn:hover {
  background-color: #4338ca;
  box-shadow: 0 6px 20px -2px rgba(79, 70, 229, 0.45);
  transform: translateY(-2px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.view-more-btn:hover .btn-icon {
  transform: translateX(4px);
}
</style>
