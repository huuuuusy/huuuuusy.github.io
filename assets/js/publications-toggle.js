(function () {
  "use strict";

  var publicationGroups = [
    {
      name: "collaborative",
      startSelector: "#collaborative-publications",
      stopSelector: "#preprints",
      visiblePaperCount: 5,
      collapsedLabel: "Show all collaborative publications",
      expandedLabel: "Show selected collaborative publications",
      collapsedLabelZh: "展开全部合作论文",
      expandedLabelZh: "仅显示部分合作论文"
    },
    {
      name: "preprints",
      startSelector: "#preprints",
      stopSelector: null,
      visiblePaperCount: 3,
      collapsedLabel: "Show all preprints",
      expandedLabel: "Show selected preprints",
      collapsedLabelZh: "展开全部预印本",
      expandedLabelZh: "仅显示部分预印本"
    }
  ];

  function isChinese() {
    return document.documentElement.getAttribute("data-language") === "zh";
  }

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
      if (isChinese()) {
        label.textContent = expanded
          ? config.expandedLabelZh
          : config.collapsedLabelZh;
      } else {
        label.textContent = expanded
          ? config.expandedLabel
          : config.collapsedLabel;
      }
    }

    updateLabel(false);

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var nextExpanded = !expanded;
      var icon = toggle.querySelector(".publication-toggle__icon");

      additionalItems.forEach(function (item) {
        item.hidden = !nextExpanded;
      });

      toggle.setAttribute("aria-expanded", String(nextExpanded));
      updateLabel(nextExpanded);
      icon.textContent = nextExpanded ? "↑" : "↓";
    });

    document.addEventListener("site-language-change", function () {
      updateLabel(toggle.getAttribute("aria-expanded") === "true");
    });
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
