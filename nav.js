/**
 * <site-nav>          — full navigation bar with links + dark mode toggle
 * <site-nav back>     — simple logo + "Back to home" bar (for legal/sub-pages)
 *
 * Edit this one file to update the nav across every page on the site.
 */
(function () {

  // ── Apply saved / preferred theme immediately (anti-FOUC) ─────────────────
  (function () {
    if (typeof localStorage === 'undefined') return;
    var t = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
  })();

  // ── Links ────────────────────────────────────────────────────────────────
  const LINKS = [
    { href: '/#about',       label: 'about' },
    { href: '/#experience',  label: 'experience' },
    { href: '/#oss',         label: 'open source' },
    { href: '/tools.html',   label: 'tools' },
    { href: '/survey.html',  label: 'survey' },
    { href: '/#contact',     label: 'contact' },
  ];

  const BACK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m15 18-6-6 6-6"/></svg>`;

  const MOON_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`;

  const SUN_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

  // ── Shared CSS (injected once) ────────────────────────────────────────────
  const CSS = `
    site-nav {
      display: block;
    }
    site-nav nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 73px;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      background: rgba(250, 250, 250, 0.92);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 200;
      transition: background 0.3s, border-color 0.3s;
    }
    [data-theme="dark"] site-nav nav {
      background: rgba(13, 17, 23, 0.92);
      border-bottom-color: #21262d;
    }
    .sn-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      text-decoration: none;
      letter-spacing: -0.02em;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    [data-theme="dark"] .sn-logo { color: #e6edf3; }
    .sn-logo span { color: #2563eb; }
    [data-theme="dark"] .sn-logo span { color: #58a6ff; }
    .sn-links {
      display: flex;
      gap: 28px;
      list-style: none;
    }
    .sn-links a {
      font-size: 14px;
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s;
    }
    .sn-links a:hover   { color: #111111; }
    .sn-links a.sn-active { color: #111111; }
    [data-theme="dark"] .sn-links a         { color: #8b949e; }
    [data-theme="dark"] .sn-links a:hover   { color: #e6edf3; }
    [data-theme="dark"] .sn-links a.sn-active { color: #e6edf3; }
    .sn-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sn-theme-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 7px;
      border-radius: 7px;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s;
      flex-shrink: 0;
      line-height: 1;
    }
    .sn-theme-btn:hover {
      color: #111111;
      background: rgba(0, 0, 0, 0.06);
    }
    [data-theme="dark"] .sn-theme-btn       { color: #8b949e; }
    [data-theme="dark"] .sn-theme-btn:hover { color: #e6edf3; background: rgba(255,255,255,0.07); }
    .sn-back {
      font-size: 13px;
      color: #6b7280;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
    }
    .sn-back:hover { color: #111111; }
    [data-theme="dark"] .sn-back       { color: #8b949e; }
    [data-theme="dark"] .sn-back:hover { color: #e6edf3; }
    @media (max-width: 600px) {
      site-nav nav { padding: 0 16px; height: auto; min-height: 64px; }
      .sn-links { gap: 14px; flex-wrap: wrap; }
      .sn-links a { font-size: 13px; }
    }
  `;

  function injectStyles() {
    if (document.getElementById('site-nav-css')) return;
    const el = document.createElement('style');
    el.id = 'site-nav-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  // ── Theme toggle logic ─────────────────────────────────────────────────
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (_) {}
    // Update all toggle buttons on the page
    document.querySelectorAll('.sn-theme-btn').forEach(function (btn) {
      btn.innerHTML = next === 'dark' ? SUN_ICON : MOON_ICON;
      btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // ── Detect which link is active ───────────────────────────────────────────
  function activeHref() {
    const p = window.location.pathname;
    if (p.startsWith('/tools')) return '/tools.html';
    if (p.startsWith('/survey')) return '/survey.html';
    return null;
  }

  // ── Web Component ─────────────────────────────────────────────────────────
  class SiteNav extends HTMLElement {
    connectedCallback() {
      injectStyles();

      const logo = `<a href="/" class="sn-logo">adiltirur<span>.dev</span></a>`;
      const isDark = currentTheme() === 'dark';
      const themeBtn = `<button class="sn-theme-btn" aria-label="${isDark ? 'Switch to light mode' : 'Switch to dark mode'}">${isDark ? SUN_ICON : MOON_ICON}</button>`;

      if (this.hasAttribute('back')) {
        this.innerHTML = `
          <nav>
            ${logo}
            <div class="sn-right">
              <a href="/" class="sn-back">${BACK_ICON} Back to home</a>
              ${themeBtn}
            </div>
          </nav>`;
      } else {
        const active = activeHref();
        const items = LINKS.map(({ href, label }) =>
          `<li><a href="${href}"${href === active ? ' class="sn-active"' : ''}>${label}</a></li>`
        ).join('');

        this.innerHTML = `
          <nav>
            ${logo}
            <ul class="sn-links">${items}</ul>
            ${themeBtn}
          </nav>`;
      }

      this.querySelector('.sn-theme-btn').addEventListener('click', toggleTheme);
    }
  }

  customElements.define('site-nav', SiteNav);

})();
