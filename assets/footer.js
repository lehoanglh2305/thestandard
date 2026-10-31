/* Footer language: follows the page's <html lang>, set by each page's own switch. */
(function(){
  var root = document.documentElement;
  function apply(){
    var en = (root.lang || "vi").toLowerCase().indexOf("en") === 0;
    document.querySelectorAll("footer.sf [data-fvi]").forEach(function(el){
      el.textContent = en ? el.getAttribute("data-fen") : el.getAttribute("data-fvi");
    });
    document.querySelectorAll("footer.sf [data-fvl]").forEach(function(el){
      el.setAttribute("aria-label", en ? el.getAttribute("data-fel") : el.getAttribute("data-fvl"));
    });
  }
  apply();
  if (window.MutationObserver) new MutationObserver(apply).observe(root, {attributes:true, attributeFilter:["lang"]});
})();
