/* ═══════════════════════════════════════════════════
   HEXBREACH — Shared Header & Footer
   js/layout.js
   ═══════════════════════════════════════════════════ */

'use strict';

(function () {

  /* ── Determine path depth ── */
  const isSubpage = window.location.pathname.includes('/pages/');
  const base = isSubpage ? '../' : './';

  /* ────────────────────────────────────────
     BUILD HEADER
     ──────────────────────────────────────── */
  function buildHeader() {
    return `
<header class="site-header" id="site-header">
  <div class="header-inner">
    <a href="${base}index.html" class="logo">HEX<span>BREACH</span></a>
    <nav class="site-nav">
      <a href="${base}index.html">Home</a>
      <a href="${base}pages/blog.html">Blog</a>
      <a href="${base}pages/write.html">Write</a>
      <a href="${base}pages/about.html">About</a>
      <a href="${base}pages/write.html" class="btn-accent">New Post</a>
    </nav>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mobile-nav" id="mobile-nav">
    <a href="${base}index.html">Home</a>
    <a href="${base}pages/blog.html">Blog</a>
    <a href="${base}pages/write.html">Write</a>
    <a href="${base}pages/about.html">About</a>
    <a href="${base}pages/write.html">New Post</a>
  </div>
</header>`;
  }

  /* ────────────────────────────────────────
     BUILD FOOTER
     ──────────────────────────────────────── */
  function buildFooter() {
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${base}index.html" class="logo">HEX<span>BREACH</span></a>
        <p>A platform for security researchers, red teamers, and threat intelligence analysts. Share findings. Document exploits. Defend the edge.</p>
      </div>
      <div class="footer-col">
        <h4>Navigate</h4>
        <ul>
          <li><a href="${base}index.html">Home</a></li>
          <li><a href="${base}pages/blog.html">All Posts</a></li>
          <li><a href="${base}pages/write.html">Write</a></li>
          <li><a href="${base}pages/about.html">About</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Topics</h4>
        <ul>
          <li><a href="#">Exploit Dev</a></li>
          <li><a href="#">Malware Analysis</a></li>
          <li><a href="#">Penetration Testing</a></li>
          <li><a href="#">Blue Team</a></li>
          <li><a href="#">OSINT</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Connect</h4>
        <ul>
          <li><a href="#">RSS Feed</a></li>
          <li><a href="#">PGP Key</a></li>
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Disclosure Policy</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© ${new Date().getFullYear()} HEXBREACH // All posts are the author's own research</p>
      <p class="footer-pgp">PGP: <span>0xDEADBEEF · C4FE · B00B · 1337</span></p>
    </div>
  </div>
</footer>`;
  }

  /* ────────────────────────────────────────
     INJECT
     ──────────────────────────────────────── */
  const headerEl = document.getElementById('header-placeholder');
  if (headerEl) headerEl.outerHTML = buildHeader();

  const footerEl = document.getElementById('footer-placeholder');
  if (footerEl) footerEl.outerHTML = buildFooter();

  /* ────────────────────────────────────────
     ACTIVE NAV LINK
     ──────────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .mobile-nav a').forEach(function (link) {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ────────────────────────────────────────
     HEADER SCROLL SHADOW
     ──────────────────────────────────────── */
  window.addEventListener('scroll', function () {
    const hdr = document.getElementById('site-header');
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ────────────────────────────────────────
     HAMBURGER TOGGLE
     ──────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('#hamburger');
    if (!btn) return;
    const nav = document.getElementById('mobile-nav');
    btn.classList.toggle('open');
    if (nav) nav.classList.toggle('open');
  });

  /* ────────────────────────────────────────
     LOGO GLITCH HOVER
     ──────────────────────────────────────── */
  document.addEventListener('mouseover', function (e) {
    const logo = e.target.closest('.logo');
    if (!logo) return;
    logo.style.textShadow = '2px 0 var(--accent), -2px 0 var(--glow2)';
    setTimeout(() => { logo.style.textShadow = ''; }, 150);
  });

})();
