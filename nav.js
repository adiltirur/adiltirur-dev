/**
 * <site-nav>          — full navigation bar with links
 * <site-nav back>     — simple logo + "Back to home" bar (for legal/sub-pages)
 *
 * Edit this one file to update the nav across every page on the site.
 */
(function () {

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
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 200;
    }
    .sn-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 500;
      color: #111111;
      text-decoration: none;
      letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .sn-logo span { color: #2563eb; }
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
    @media (max-width: 600px) {
      site-nav nav { padding: 0 20px; height: auto; min-height: 64px; }
      .sn-links { gap: 16px; flex-wrap: wrap; }
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

      if (this.hasAttribute('back')) {
        this.innerHTML = `
          <nav>
            ${logo}
            <a href="/" class="sn-back">${BACK_ICON} Back to home</a>
          </nav>`;
        return;
      }

      const active = activeHref();
      const items = LINKS.map(({ href, label }) =>
        `<li><a href="${href}"${href === active ? ' class="sn-active"' : ''}>${label}</a></li>`
      ).join('');

      this.innerHTML = `
        <nav>
          ${logo}
          <ul class="sn-links">${items}</ul>
        </nav>`;
    }
  }

  customElements.define('site-nav', SiteNav);

})();
