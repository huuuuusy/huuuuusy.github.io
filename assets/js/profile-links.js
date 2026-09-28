(function () {
  "use strict";

  var wrapper = document.querySelector(".author__urls-wrapper");
  if (!wrapper) return;

  var toggle = wrapper.querySelector(".author__urls-toggle");
  if (!toggle) return;

  function isOpen() {
    return wrapper.classList.contains("is-open");
  }

  function setExpanded(expanded) {
    wrapper.classList.toggle("is-open", expanded);
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  // The list opens inline below the profile, so it stays open until the
  // visitor closes it; Escape closes it only while focus is inside the list.
  toggle.addEventListener("click", function () {
    setExpanded(!isOpen());
  });

  wrapper.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setExpanded(false);
      toggle.focus();
    }
  });
}());
