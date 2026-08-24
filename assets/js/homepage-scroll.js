(function () {
  "use strict";

  var controls = document.querySelector(".home-scroll-controls");
  if (!controls) return;

  var topButton = controls.querySelector('[data-scroll-target="top"]');
  var bottomButton = controls.querySelector('[data-scroll-target="bottom"]');
  if (!topButton || !bottomButton) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var updateQueued = false;

  function pageBottom() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  function updateState() {
    var top = window.scrollY || document.documentElement.scrollTop;
    var viewportBottom = top + window.innerHeight;
    var bottom = pageBottom();

    topButton.disabled = top <= 1;
    bottomButton.disabled = viewportBottom >= bottom - 1;
    updateQueued = false;
  }

  function queueStateUpdate() {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(updateState);
  }

  function scrollToEdge(edge) {
    window.scrollTo({
      top: edge === "top" ? 0 : pageBottom(),
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  }

  topButton.addEventListener("click", function () {
    scrollToEdge("top");
  });

  bottomButton.addEventListener("click", function () {
    scrollToEdge("bottom");
  });

  window.addEventListener("scroll", queueStateUpdate, { passive: true });
  window.addEventListener("resize", queueStateUpdate);
  if ("ResizeObserver" in window) {
    var pageResizeObserver = new ResizeObserver(queueStateUpdate);
    pageResizeObserver.observe(document.body);
  }
  controls.classList.add("is-ready");
  updateState();
}());
