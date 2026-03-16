/**
 * i18n.js — Text loader for adiltirur.dev
 *
 * Fetches /en.json (swap for any other locale file to translate the site).
 * Applies three data attributes:
 *
 *   data-i18n="a.b.c"          →  element.textContent = value
 *   data-i18n-html="a.b.c"     →  element.innerHTML   = value  (for content with links/bold)
 *   data-i18n-attr="attr:a.b.c" →  element.setAttribute(attr, value)  (placeholder, title…)
 *
 * Array paths are supported: "index.experience.items.0.title" resolves to
 * data["index"]["experience"]["items"][0]["title"].
 *
 * The resolved translations object is stored as window.EN for optional use
 * by inline scripts (e.g. window.EN?.survey?.header?.badge_empty).
 */
(function () {
  'use strict';

  /** Dot-path resolver supporting numeric array indices. */
  function resolve(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      if (acc == null) return undefined;
      var idx = parseInt(key, 10);
      return (!isNaN(idx) && Array.isArray(acc)) ? acc[idx] : acc[key];
    }, obj);
  }

  /** Apply all data-i18n* attributes on the page. */
  function apply(data) {
    // Plain text
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = resolve(data, el.getAttribute('data-i18n'));
      if (v != null) el.textContent = String(v);
    });

    // HTML content (paragraphs that contain <a>, <strong>, <br />, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = resolve(data, el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = String(v);
    });

    // Attributes: data-i18n-attr="placeholder:tools.md.placeholder"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec  = el.getAttribute('data-i18n-attr');
      var colon = spec.indexOf(':');
      if (colon < 0) return;
      var attr = spec.slice(0, colon);
      var key  = spec.slice(colon + 1);
      var v = resolve(data, key);
      if (v != null) el.setAttribute(attr, String(v));
    });
  }

  fetch('/en.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      window.EN = data;
      apply(data);
    })
    .catch(function (err) {
      console.warn('[i18n] Could not load /en.json:', err.message);
    });
})();
