(function () {
  "use strict";

  var wrapper = document.querySelector(".author__urls-wrapper");
  if (!wrapper) return;

  var toggle = wrapper.querySelector(".author__urls-toggle");
  if (!toggle) return;

  function setExpanded(expanded) {
    wrapper.classList.toggle("is-open", expanded);
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setExpanded(!wrapper.classList.contains("is-open"));
  });

  document.addEventListener("click", function (event) {
    if (!wrapper.contains(event.target)) setExpanded(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setExpanded(false);
      toggle.focus();
    }
  });
}());
