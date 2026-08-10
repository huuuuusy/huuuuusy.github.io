(function () {
  "use strict";

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
