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

  const MOON_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`;

  const SUN_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

  // ── Shared CSS (injected once) ────────────────────────────────────────────
  const CSS = `
    site-nav { display: block; }

    site-nav nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      height: 60px;
      border-bottom: 1px solid var(--border, #1a2030);
      position: sticky;
      top: 0;
      background: rgba(11, 14, 22, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 200;
      transition: background 0.3s, border-color 0.3s;
    }
    [data-theme="light"] site-nav nav,
    :root:not([data-theme="dark"]) site-nav nav {
      background: rgba(248, 250, 252, 0.92);
      border-bottom-color: #e2e8f0;
    }

    /* Logo */
    .sn-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      color: var(--fg, #dce5f5);
      text-decoration: none;
      letter-spacing: -0.01em;
      flex-shrink: 0;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 0;
    }
    .sn-logo .sn-prompt {
      color: var(--accent, #00e599);
      margin-right: 6px;
      font-weight: 600;
    }
    .sn-logo .sn-tld { color: var(--accent, #00e599); }
    .sn-logo:hover .sn-name { opacity: 0.8; }

    /* Nav links */
    .sn-links {
      display: flex;
      gap: 0;
      list-style: none;
      align-items: center;
    }
    .sn-links a {
      font-size: 13px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--muted, #5e6e8a);
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
      display: block;
    }
    .sn-links a:hover   { color: var(--fg, #dce5f5); background: var(--surface-2, #161b27); }
    .sn-links a.sn-active {
      color: var(--accent, #00e599);
    }

    /* Right controls */
    .sn-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sn-theme-btn {
      background: none;
      border: 1px solid var(--border, #1a2030);
      cursor: pointer;
      padding: 6px;
      border-radius: 7px;
      color: var(--muted, #5e6e8a);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s, border-color 0.2s;
      flex-shrink: 0;
      line-height: 1;
      width: 32px;
      height: 32px;
    }
    .sn-theme-btn:hover {
      color: var(--accent, #00e599);
      border-color: var(--accent, #00e599);
      background: var(--accent-dim, rgba(0,229,153,0.08));
    }

    /* Back link variant */
    .sn-back {
      font-size: 13px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--muted, #5e6e8a);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      transition: color 0.2s, background 0.2s;
    }
    .sn-back:hover { color: var(--fg, #dce5f5); background: var(--surface-2, #161b27); }

    @media (max-width: 640px) {
      site-nav nav { padding: 0 20px; }
      .sn-links { gap: 0; }
      .sn-links a { padding: 6px 10px; font-size: 12px; }
    }
    @media (max-width: 500px) {
      .sn-links { display: none; }
    }
  `;

  function injectStyles() {
    if (document.getElementById('site-nav-css')) return;
    const el = document.createElement('style');
    el.id = 'site-nav-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  // ── Theme toggle logic ──────────────────────────────────────────────────
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (_) {}
    document.querySelectorAll('.sn-theme-btn').forEach(function (btn) {
      btn.innerHTML = next === 'dark' ? SUN_ICON : MOON_ICON;
      btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // ── Detect active link ────────────────────────────────────────────────────
  function activeHref() {
    const p = window.location.pathname;
    if (p.startsWith('/tools'))  return '/tools.html';
    if (p.startsWith('/survey')) return '/survey.html';
    return null;
  }

  // ── Web Component ──────────────────────────────────────────────────────────
  class SiteNav extends HTMLElement {
    connectedCallback() {
      injectStyles();

      const logo = `<a href="/" class="sn-logo">
        <span class="sn-prompt">&gt;</span>
        <span class="sn-name">adiltirur</span><span class="sn-tld">.dev</span>
      </a>`;

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
            <div class="sn-right">${themeBtn}</div>
          </nav>`;
      }

      this.querySelector('.sn-theme-btn').addEventListener('click', toggleTheme);
    }
  }

  customElements.define('site-nav', SiteNav);

})();
