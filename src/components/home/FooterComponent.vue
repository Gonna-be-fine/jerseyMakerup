<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section brand-section">
        <h3 class="footer-title">MoMoFit</h3>
        <p class="footer-description">
          用 AI 灵感生成、在线 3D 预览和设计包导出，快速完成球队服、训练服、团体活动服的个性化定制。
        </p>
        <p class="footer-description">
          从配色、号码、队名到印花图案，都可以在浏览器里直接调整，确认方案后再交给客服进入生产对接。
        </p>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">快速入口</h3>
        <nav class="footer-nav" aria-label="快速入口">
          <ul>
            <li><router-link to="/products">选择款式</router-link></li>
            <li><router-link to="/recharge">积分充值</router-link></li>
            <li><a href="#best-seller">热门推荐</a></li>
            <li><a href="#featured-products">定制案例</a></li>
          </ul>
        </nav>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">服务支持</h3>
        <nav class="footer-nav" aria-label="服务支持">
          <ul>
            <li><a href="#">设计包导出</a></li>
            <li><a href="#">尺码与面料确认</a></li>
            <li><a href="#">订单生产对接</a></li>
            <li><a href="#">售后与修改建议</a></li>
          </ul>
        </nav>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">联系客服</h3>
        <div class="contact-info">
          <div class="wechat-card">
            <img src="/images/link.jpg" alt="客服微信二维码" class="wechat-qr" />
            <div>
              <p class="contact-title">微信客服</p>
              <p class="contact-desc">扫码发送注册邮箱、设计包或定制需求，我们会协助完成充值和生产对接。</p>
            </div>
          </div>
          <div class="email-card">
            <p class="contact-title">技术服务</p>
            <a href="mailto:ggbone0917@163.com">ggbone0917@163.com</a>
            <a href="mailto:xiaoc2658@gmail.com">xiaoc2658@gmail.com</a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="copyright">
        <p>Copyright © 2026 AI Jersey. All rights reserved.</p>
      </div>
      <nav class="footer-bottom-nav" aria-label="底部链接">
        <a href="#">用户协议</a>
        <a href="#">隐私政策</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
  background: var(--background-color);
  color: var(--text-color);
  padding: 4rem 2rem 1rem;
}

.footer-content {
  max-width: var(--container-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 0.9fr 0.9fr 1.2fr;
  gap: 2rem;
}

.footer-title {
  font-size: 1.05rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-weight: 800;
}

.footer-description,
.contact-desc {
  color: var(--text-light);
  font-size: 0.92rem;
  line-height: 1.75;
}

.footer-description + .footer-description {
  margin-top: 0.75rem;
}

.footer-nav ul {
  list-style: none;
  padding: 0;
}

.footer-nav a {
  color: var(--text-light);
  text-decoration: none;
  display: block;
  padding: 0.42rem 0;
  transition: color 0.3s;
}

.footer-nav a:hover {
  color: var(--primary-color);
}

.contact-info {
  color: var(--text-light);
}

.wechat-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 1rem;
  align-items: center;
}

.wechat-qr {
  width: 96px;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: #fff;
  padding: 0.35rem;
}

.contact-title {
  color: var(--text-color);
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.email-card {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.email-card a {
  color: var(--text-light);
  display: block;
  font-size: 0.92rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.email-card a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  max-width: var(--container-width);
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  color: var(--text-light);
}

.footer-bottom-nav a {
  color: var(--text-light);
  text-decoration: none;
  margin-left: 1.5rem;
}

.footer-bottom-nav a:hover {
  color: var(--primary-color);
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 1rem 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom-nav a {
    margin: 0.5rem;
  }
}
</style>
