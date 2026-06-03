/* enhance.js — shared progressive enhancements (motion & interaction).
   Loaded on every page with `defer`. Everything here is additive:
   if this file fails to load, the per-page inline handlers and the
   static layout still work. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* ------------------------------------------------------------------
     Theme toggle with a circular "reveal" view transition.
     Uses a capture-phase delegated listener so it transparently takes
     over the per-page inline theme handlers (which stay as a fallback).
     ------------------------------------------------------------------ */
  function rawApplyTheme(theme) {
    if (theme === 'system') {
      document.documentElement.setAttribute(
        'data-theme', prefersDark.matches ? 'dark' : 'light'
      );
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  function setActiveButton(theme) {
    var buttons = document.querySelectorAll('.theme-option');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('active', buttons[i].dataset.theme === theme);
    }
  }

  function applyTheme(theme, originX, originY) {
    setActiveButton(theme);

    var canTransition = document.startViewTransition &&
      !reduce.matches &&
      document.visibilityState === 'visible';
    if (!canTransition) {
      rawApplyTheme(theme);
      return;
    }

    var root = document.documentElement;
    root.style.setProperty('--vt-x', originX + 'px');
    root.style.setProperty('--vt-y', originY + 'px');
    root.classList.add('theme-vt');

    var transition = document.startViewTransition(function () {
      rawApplyTheme(theme);
    });
    transition.finished.then(cleanup, cleanup);
    function cleanup() { root.classList.remove('theme-vt'); }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.theme-option');
    if (!btn) return;
    // Override the inline per-page handler so the reveal owns the change.
    e.preventDefault();
    e.stopImmediatePropagation();
    var r = btn.getBoundingClientRect();
    applyTheme(btn.dataset.theme, r.left + r.width / 2, r.top + r.height / 2);
  }, true);

  /* ------------------------------------------------------------------
     Scroll reveal for elements tagged `.reveal-on-scroll`.
     ------------------------------------------------------------------ */
  function initReveal() {
    var els = document.querySelectorAll('.reveal-on-scroll');
    if (!els.length) return;

    if (reduce.matches || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('revealed');
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    els.forEach(function (el, i) {
      // Subtle cascade when several reveal together.
      el.style.transitionDelay = Math.min(i, 8) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Headshot pointer tilt (homepage only). Composes with the existing
     hover spin: while the cursor is over the headshot the spin owns the
     transform, otherwise the wrapper tilts toward the cursor.
     ------------------------------------------------------------------ */
  function initTilt() {
    var tilt = document.querySelector('.headshot-tilt');
    if (!tilt || reduce.matches) return;

    var MAX = 10;
    var hovering = false;
    var queued = false;
    var lastX = 0, lastY = 0;

    function render() {
      queued = false;
      if (hovering) return;
      var r = tilt.getBoundingClientRect();
      var dx = (lastX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      var dy = (lastY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));
      tilt.style.transform =
        'perspective(400px) rotateY(' + (dx * MAX) + 'deg) rotateX(' + (-dy * MAX) + 'deg)';
    }

    window.addEventListener('mousemove', function (e) {
      lastX = e.clientX; lastY = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(render); }
    });
    tilt.addEventListener('mouseenter', function () {
      hovering = true;
      tilt.style.transform = '';
    });
    tilt.addEventListener('mouseleave', function () { hovering = false; });
  }

  function init() {
    initReveal();
    initTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
