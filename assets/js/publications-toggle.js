(function () {
  "use strict";

  function groupLimit(sectionHeading, subsectionHeading) {
    var section = sectionHeading.toLowerCase();
    var subsection = subsectionHeading.toLowerCase();

    if (section.indexOf("monograph") !== -1) {
      return 1;
    }

    if (section.indexOf("preprint") !== -1) {
      return 3;
    }

    if (subsection.indexOf("lead") !== -1 ||
        subsection.indexOf("corresponding") !== -1) {
      return 4;
    }

    if (subsection.indexOf("collaborative") !== -1) {
      return 5;
    }

    return Infinity;
  }

  function initialisePublicationBrowser() {
    var section = document.querySelector(".home-section--publications");
    var toggle = section && section.querySelector(".publication-toggle");
    var browser = section && section.querySelector(".publication-browser");

    if (!section || !toggle || !browser) {
      return;
    }

    var sectionHeading = "";
    var subsectionHeading = "";
    var groupCounts = {};
    var additionalItems = [];

    Array.prototype.forEach.call(section.children, function (element) {
      if (element.tagName === "H2") {
        sectionHeading = element.textContent.trim();
        subsectionHeading = "";
        return;
      }

      if (element.tagName === "H3") {
        subsectionHeading = element.textContent.trim();
        return;
      }

      if (!element.classList.contains("paper-box")) {
        return;
      }

      var groupKey = sectionHeading + "::" + subsectionHeading;
      groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;

      if (groupCounts[groupKey] > groupLimit(sectionHeading, subsectionHeading)) {
        element.classList.add("publication-item--additional");
        element.hidden = true;
        additionalItems.push(element);
      }
    });

    if (!additionalItems.length) {
      return;
    }

    browser.classList.add("is-ready");
    toggle.hidden = false;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var nextExpanded = !expanded;
      var label = toggle.querySelector(".publication-toggle__label");
      var icon = toggle.querySelector(".publication-toggle__icon");

      additionalItems.forEach(function (item) {
        item.hidden = !nextExpanded;
      });

      toggle.setAttribute("aria-expanded", String(nextExpanded));
      label.textContent = nextExpanded
        ? "Show selected publications"
        : "Show complete publication list";
      icon.textContent = nextExpanded ? "↑" : "↓";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialisePublicationBrowser);
  } else {
    initialisePublicationBrowser();
  }
})();
