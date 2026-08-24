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
  window.addEventListener("hashchange", requestCurrentSectionUpdate);

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
