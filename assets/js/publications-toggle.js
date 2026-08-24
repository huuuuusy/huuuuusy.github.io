(function () {
  "use strict";

  var publicationGroups = [
    {
      name: "collaborative",
      startSelector: "#collaborative-publications",
      stopSelector: "#preprints",
      visiblePaperCount: 5,
      collapsedLabel: "Show all collaborative publications",
      expandedLabel: "Show selected collaborative publications"
    },
    {
      name: "preprints",
      startSelector: "#preprints",
      stopSelector: null,
      visiblePaperCount: 3,
      collapsedLabel: "Show all preprints",
      expandedLabel: "Show selected preprints"
    }
  ];

  function collectAdditionalItems(section, config, browser) {
    var start = section.querySelector(config.startSelector);
    var stop = config.stopSelector
      ? section.querySelector(config.stopSelector)
      : browser;

    if (!start || !stop) {
      return [];
    }

    var paperCount = 0;
    var hideFollowingItems = false;
    var additionalItems = [];
    var element = start.nextElementSibling;

    while (element && element !== stop && element !== browser) {
      if (element.classList.contains("paper-box")) {
        paperCount += 1;
        hideFollowingItems = paperCount > config.visiblePaperCount;
      }

      if (hideFollowingItems) {
        element.classList.add(
          "publication-item--additional",
          "publication-item--" + config.name
        );
        element.hidden = true;
        additionalItems.push(element);
      }

      element = element.nextElementSibling;
    }

    return additionalItems;
  }

  function initialisePublicationGroup(section, config) {
    var browser = section.querySelector(
      '.publication-browser[data-publication-group="' + config.name + '"]'
    );
    var toggle = section.querySelector(
      '.publication-toggle[data-publication-toggle="' + config.name + '"]'
    );

    if (!browser || !toggle) {
      return;
    }

    var additionalItems = collectAdditionalItems(section, config, browser);

    if (!additionalItems.length) {
      return;
    }

    browser.classList.add("is-ready");
    toggle.hidden = false;

    function updateLabel(expanded) {
      var label = toggle.querySelector(".publication-toggle__label");
      label.textContent = expanded
        ? config.expandedLabel
        : config.collapsedLabel;
    }

    function setExpanded(expanded) {
      var icon = toggle.querySelector(".publication-toggle__icon");

      additionalItems.forEach(function (item) {
        item.hidden = !expanded;
      });

      toggle.setAttribute("aria-expanded", String(expanded));
      updateLabel(expanded);
      icon.textContent = expanded ? "↑" : "↓";
    }

    function revealHashTarget(hash) {
      if (!hash || hash.charAt(0) !== "#") {
        return;
      }

      var target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) {
        return;
      }

      var additionalItem = target.closest(
        ".publication-item--additional.publication-item--" + config.name
      );
      if (!additionalItem) {
        return;
      }

      setExpanded(true);
      window.requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start" });
      });
    }

    setExpanded(false);

    toggle.addEventListener("click", function () {
      setExpanded(toggle.getAttribute("aria-expanded") !== "true");
    });

    window.addEventListener("hashchange", function () {
      revealHashTarget(window.location.hash);
    });

    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }

      window.setTimeout(function () {
        revealHashTarget(link.getAttribute("href"));
      }, 0);
    });

    revealHashTarget(window.location.hash);
  }

  function initialisePublicationBrowser() {
    var section = document.querySelector(".home-section--publications");

    if (!section) {
      return;
    }

    publicationGroups.forEach(function (config) {
      initialisePublicationGroup(section, config);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialisePublicationBrowser);
  } else {
    initialisePublicationBrowser();
  }
})();
