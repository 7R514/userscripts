// ==UserScript==
// @name         Amazon Privacy Protector
// @namespace    https://7r514.github.io/userscripts
// @author       7R514
// @version      1.0
// @license      MIT License
// @description  本名とメールアドレスを隠す
// @match        https://www.amazon.co.jp/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
let css = `
    /*住所*/
    #nav-global-location-slot {
        opacity: 0;
        transition-duration: .3s;
    }
    #nav-global-location-slot:hover {
        opacity: 1;
    }

    /*名前*/
    .nav-line-1-container span {
        opacity: 0;
        transition-duration: .3s;
    }
    .nav-line-1-container span:hover {
        opacity: 1;
    }

    /*注文履歴ページのお届け先の名前*/
    span.a-declarative[data-a-popover*="受取人の住所"] {
        display: none;
    }

    /*商品ページの住所（配送先）*/
    #contextualIngressPtLabel {
        display: none !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(css);
} else {
    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
