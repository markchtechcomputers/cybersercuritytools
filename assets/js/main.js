/**
 * Meridian Cyber — core front-end behavior
 * Vanilla ES6+, no build step required.
 */
(() => {
  'use strict';

  /* ---------------------------------------------------------------------
   * Theme toggle (persisted in localStorage is NOT used here per app
   * policy on this build — we use a first-party cookie instead so theme
   * preference survives without relying on client storage assumptions).
   * ------------------------------------------------------------------- */
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('themeIconSun');
  const moonIcon = document.getElementById('themeIconMoon');

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      toggleBtn?.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      toggleBtn?.setAttribute('aria-pressed', 'false');
    }
  }

  const savedTheme = getCookie('mc_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  toggleBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setCookie('mc_theme', next, 365);
  });

  /* ---------------------------------------------------------------------
   * Cookie consent banner
   * ------------------------------------------------------------------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const consent = getCookie('mc_cookie_consent');

  if (cookieBanner && !consent) {
    cookieBanner.classList.add('show');
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    setCookie('mc_cookie_consent', 'all', 180);
    cookieBanner?.classList.remove('show');
  });

  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    setCookie('mc_cookie_consent', 'essential', 180);
    cookieBanner?.classList.remove('show');
  });

  /* ---------------------------------------------------------------------
   * Back-to-top button
   * ------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop?.classList.add('show');
    } else {
      backToTop?.classList.remove('show');
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------------
   * Client-side form validation helper (progressive enhancement —
   * server-side validation in PHP is the source of truth).
   * ------------------------------------------------------------------- */
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });
      if (!valid) event.preventDefault();
    });
  });

  /* ---------------------------------------------------------------------
   * Training catalog filter (used on training.php)
   * ------------------------------------------------------------------- */
  const catalogSearch = document.getElementById('catalogSearch');
  const catalogLevel = document.getElementById('catalogLevel');
  const catalogCards = document.querySelectorAll('[data-catalog-card]');

  function filterCatalog() {
    const term = (catalogSearch?.value || '').toLowerCase();
    const level = catalogLevel?.value || 'all';

    catalogCards.forEach((card) => {
      const title = (card.dataset.title || '').toLowerCase();
      const cardLevel = card.dataset.level || 'all';
      const matchesTerm = !term || title.includes(term);
      const matchesLevel = level === 'all' || cardLevel === level;
      card.style.display = matchesTerm && matchesLevel ? '' : 'none';
    });
  }

  catalogSearch?.addEventListener('input', filterCatalog);
  catalogLevel?.addEventListener('change', filterCatalog);
})();
