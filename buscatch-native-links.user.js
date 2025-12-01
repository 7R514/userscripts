// ==UserScript==
// @name         BusCatch Native Links
// @namespace    https://7r514.github.io/userscripts
// @author       7R514
// @version      1.0
// @description  nativeスキームのリンクをブラウザで開けるようにする
// @match        https://buscatch.jp/dtod/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  function transformAnchor(a) {
    if (!a || !a.getAttribute) return;
    const href = a.getAttribute('href');
    if (!href) return;

    const prefix = 'native://newBrowser/?';
    if (href.indexOf(prefix) !== 0) return;

    const raw = href.slice(prefix.length);
    if (!raw) return;

    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch (e) {
      decoded = raw;
    }

    // target=_blank を付与
    a.setAttribute('target', '_blank');

    try {
      a.setAttribute('href', decoded);
    } catch (e) {
      console.error('Failed to set href for anchor', a, e);
    }

    // ログ出力
    console.log('[BusCatch Native Links] href converted:', href, '=>', decoded);

    a.dataset._nativeConverted = '1';
  }

  function transformAllExisting() {
    const anchors = document.querySelectorAll('a[href^="native://newBrowser/?"]');
    anchors.forEach(a => {
      if (a.dataset._nativeConverted === '1') return;
      transformAnchor(a);
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('a[href^="native://newBrowser/?"]')) {
              if (node.dataset._nativeConverted !== '1') transformAnchor(node);
            }
            const inner = node.querySelectorAll ? node.querySelectorAll('a[href^="native://newBrowser/?"]') : [];
            inner.forEach(a => {
              if (a.dataset._nativeConverted !== '1') transformAnchor(a);
            });
          }
        });
      }

      if (m.type === 'attributes' && m.target && m.target.matches && m.target.matches('a')) {
        if (m.attributeName === 'href') {
          const a = m.target;
          if (a.dataset._nativeConverted !== '1') transformAnchor(a);
        }
      }
    }
  });

  observer.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', transformAllExisting, { once: true });
  } else {
    transformAllExisting();
  }

  window.addEventListener('beforeunload', () => {
    try { observer.disconnect(); } catch (e) {}
  });
})();
