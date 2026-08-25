(function () {
  "use strict";

  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(function (link) {
    link.setAttribute("target", "_self");
  });

  var navigation = document.querySelector(".site-nav");
  if (!navigation) return;

  var toggle = navigation.querySelector(".site-nav__toggle");
  if (!toggle) return;

  function setExpanded(expanded) {
    navigation.classList.toggle("is-open", expanded);
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setExpanded(!navigation.classList.contains("is-open"));
  });

  navigation.addEventListener("click", function (event) {
    if (event.target.closest(".site-nav__links a")) setExpanded(false);
  });

  var sectionLinks = Array.prototype.slice.call(
    navigation.querySelectorAll('.site-nav__links a[href^="/#"]')
  ).map(function (link) {
    var target = document.getElementById(link.getAttribute("href").slice(2));
    return target ? { link: link, target: target } : null;
  }).filter(Boolean);

  var currentFrame = null;

  function updateCurrentSection() {
    currentFrame = null;
    if (!sectionLinks.length) return;

    var marker = window.scrollY + navigation.getBoundingClientRect().height + 96;
    var current = sectionLinks[0];

    sectionLinks.forEach(function (item) {
      var targetTop = item.target.getBoundingClientRect().top + window.scrollY;
      if (targetTop <= marker) current = item;
    });

    sectionLinks.forEach(function (item) {
      var isCurrent = item === current;
      item.link.classList.toggle("is-current", isCurrent);
      if (isCurrent) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  }

  function requestCurrentSectionUpdate() {
    if (currentFrame !== null) return;
    currentFrame = window.requestAnimationFrame(updateCurrentSection);
  }

  updateCurrentSection();
  window.addEventListener("scroll", requestCurrentSectionUpdate, { passive: true });
  window.addEventListener("resize", requestCurrentSectionUpdate);

  function restoreInitialHashPosition() {
    if (!window.location.hash) return;

    var target = document.getElementById(
      decodeURIComponent(window.location.hash.slice(1))
    );
    if (!target) return;

    var scrollTarget = target.closest(".paper-box") || target;

    window.requestAnimationFrame(function () {
      var root = document.documentElement;
      var previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      scrollTarget.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previousScrollBehavior;
      requestCurrentSectionUpdate();
    });
  }

  // Collapsible news, publication, and honors groups change the document
  // height after the browser's native first-pass anchor positioning. Re-align
  // once images and deferred scripts have settled so shared deep links remain
  // reliable on a cold load.
  if (document.readyState === "complete") {
    restoreInitialHashPosition();
  } else {
    window.addEventListener("load", restoreInitialHashPosition, { once: true });
  }

  window.addEventListener("hashchange", restoreInitialHashPosition);

  document.addEventListener("click", function (event) {
    if (!navigation.contains(event.target)) setExpanded(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      setExpanded(false);
      toggle.focus();
    }
  });
}());
