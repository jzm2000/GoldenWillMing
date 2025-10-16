<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <h3>心情日记网</h3>
          <p>分享我的心情日记</p>
        </div>
        
        <div class="footer-links">
          <h4>快速链接</h4>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/articles">日记</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
          </ul>
        </div>
        
        <div class="footer-contact">
          <h4>联系方式</h4>
          <p>邮箱: 2842688813@qq.com</p>
          <p>微信: jin12276594</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p><a href="/file/disclaimer.html" target="_blank">| 免责声明 |</a></p>
        <p>本网站部分内容来源于网络，仅供学习和参考之用。</p>
        <p>本网站一切内容不代表本网站的立场，不承担任何责任。</p>
        <p>如无意中侵犯了您的权益，请及时通过电子邮件(2842688813@qq.com)告知我们，本网站将立即删除。</p>
        <p><a href="https://beian.miit.gov.cn" target="_blank">赣ICP备2025074131号</a></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #35495e;
  color: white;
  padding: 3rem 0 1.5rem;
  /* margin-top: 3rem; */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-logo h3 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: var(--font-size-xl);
}

.footer-logo p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0;
}

.footer-links h4,
.footer-contact h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: var(--font-size-lg);
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-contact p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p,
.footer-bottom a {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
  font-size: var(--font-size-sm);
  transition: color 0.3s ease;
}
.footer-bottom a:hover {
  color: white;
}
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>