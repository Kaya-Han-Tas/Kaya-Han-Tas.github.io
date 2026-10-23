(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Navigation: background on scroll, mobile menu, active link ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  if ('IntersectionObserver' in window) {
    var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]'));
    var byId = {};
    navAnchors.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) { a.classList.remove('active'); });
        var a = byId[entry.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    /* ---------- Reveal on scroll ---------- */
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Starfield (hero background) ---------- */
  var canvas = document.getElementById('starfield');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var w = 0, h = 0, dpr = 1, running = true, raf = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((w * h) / 5200);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() < 0.08 ? 1.3 + Math.random() * 0.7 : 0.4 + Math.random() * 0.8,
          a: 0.25 + Math.random() * 0.65,
          s: 0.4 + Math.random() * 1.6,
          p: Math.random() * Math.PI * 2,
          warm: Math.random() < 0.12
        });
      }
      draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(t / 1000 * s.s + s.p);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.warm ? '#ffd2a8' : '#dfe6ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      if (!running) { raf = null; return; }
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    resize();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    if (!reduceMotion) {
      // Only animate while the hero is on screen.
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          running = entries[0].isIntersecting;
          if (running && !raf) raf = requestAnimationFrame(loop);
        }).observe(canvas);
      } else {
        raf = requestAnimationFrame(loop);
      }
    }
  }

  /* ---------- Lightbox for figures & photos ---------- */
  var dialog = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCap = document.getElementById('lightbox-caption');
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var thumb = btn.querySelector('img');
        lbImg.src = btn.getAttribute('data-lightbox');
        lbImg.alt = thumb ? thumb.alt : '';
        lbImg.classList.toggle('on-white', btn.hasAttribute('data-white'));
        lbCap.textContent = btn.getAttribute('data-caption') || '';
        dialog.showModal();
      });
    });
    document.getElementById('lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog || e.target === lbImg) dialog.close(); });
  } else {
    // Old browsers: open the image directly.
    document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.open(btn.getAttribute('data-lightbox'), '_blank'); });
    });
  }

  /* ---------- Instagram reels: load the embed only when the visitor presses play ---------- */
  var igScriptLoading = false;
  function processEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
  }
  function loadInstagram() {
    if (window.instgrm) { processEmbeds(); return; }
    if (igScriptLoading) return;
    igScriptLoading = true;
    var s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    s.onload = processEmbeds;
    document.body.appendChild(s);
  }
  document.querySelectorAll('.video-play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-reel');
      var url = 'https://www.instagram.com/reel/' + id + '/';
      var frame = btn.parentNode;
      frame.classList.add('loaded');
      frame.innerHTML =
        '<blockquote class="instagram-media" data-instgrm-permalink="' + url + '?utm_source=ig_embed" data-instgrm-version="14">' +
        '<a href="' + url + '" target="_blank" rel="noopener" style="display:block;padding:24px;color:#333;font:14px Inter,sans-serif;">Loading video… or watch it on Instagram</a>' +
        '</blockquote>';
      loadInstagram();
    });
  });
})();
