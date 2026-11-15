/* The Standard: colour theme for pages that have no theme code of their own.
   Same storage key and the same three states (auto, light, dark) as Route map and Self study,
   so the choice follows the learner from page to page. Auto follows the device setting. */
(function () {
  var KEY = "standardRouteMap.v1.theme", root = document.documentElement;
  var ICON = {
    auto: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.2" fill="currentColor"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3"/></g></svg>',
    dark: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7z" fill="currentColor"/></svg>'
  };
  var TEXT = { vi: { auto: "Tự động", light: "Sáng", dark: "Tối", label: "Giao diện" }, en: { auto: "Auto", light: "Light", dark: "Dark", label: "Colour theme" } };
  var theme;
  function read() { try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : "auto"; } catch (e) { return "auto"; } }
  function apply() { if (theme === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", theme); }
  function paint() {
    var t = TEXT[(root.lang || "vi").slice(0, 2) === "en" ? "en" : "vi"];
    [].forEach.call(document.querySelectorAll("[data-theme-btn]"), function (b) {
      b.innerHTML = ICON[theme] + '<span class="tb-t">' + t[theme] + "</span>";
      b.setAttribute("aria-label", t.label + ": " + t[theme]);
    });
  }
  theme = read(); apply();
  document.addEventListener("DOMContentLoaded", function () {
    paint();
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-theme-btn]"); if (!b) return;
      theme = { auto: "light", light: "dark", dark: "auto" }[theme];
      try { localStorage.setItem(KEY, theme); } catch (x) {}
      apply(); paint();
    });
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["lang"] });
  });
})();
