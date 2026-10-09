(function () {
  "use strict";

  var publicationGroups = [
    {
      name: "lead",
      startSelector: "#lead-author-publications",
      stopSelector: "#collaborative-publications",
      visiblePaperCount: 5,
      collapsedLabel: "Show all lead or corresponding-author publications",
      expandedLabel: "Show selected lead or corresponding-author publications"
    },
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
        additionalItem.scrollIntoView({ block: "start" });
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

  // Line filter: a paper belongs to the research lines whose framework card
  // lists it as a chip, so the chips stay the single source of the mapping.
  var LINE_KEYS = ["conditions", "time", "humans"];
  var ANCHOR_ALIASES = {
    "ECCV26-Temporal": "DASTrack",
    "SOEI-AAAIW": "SOEI",
    "EduVerse-AAAIW": "EduVerse",
    "EduPersona-AAAIW": "EduPersona"
  };

  function readLineMap() {
    var map = {};
    var cards = document.querySelectorAll(".research-framework .crossing");

    Array.prototype.forEach.call(cards, function (card, index) {
      var key = LINE_KEYS[index];
      var chips = card.querySelectorAll('.paper-chip[href^="#"]');

      Array.prototype.forEach.call(chips, function (chip) {
        var id = chip.getAttribute("href").slice(1);
        (map[id] = map[id] || []).push(key);
      });
    });

    return map;
  }

  function entryLines(entry, lineMap) {
    var lines = [];
    var anchors = entry.querySelectorAll(".anchor[id]");

    Array.prototype.forEach.call(anchors, function (anchor) {
      var id = ANCHOR_ALIASES[anchor.id] || anchor.id;
      (lineMap[id] || []).forEach(function (key) {
        if (lines.indexOf(key) === -1) {
          lines.push(key);
        }
      });
    });

    return lines;
  }

  function isCollapsed(entry, section) {
    if (!entry.classList.contains("publication-item--additional")) {
      return false;
    }

    var group = publicationGroups.filter(function (config) {
      return entry.classList.contains("publication-item--" + config.name);
    })[0];
    var toggle = group && section.querySelector(
      '.publication-toggle[data-publication-toggle="' + group.name + '"]'
    );

    return !toggle || toggle.getAttribute("aria-expanded") !== "true";
  }

  function initialiseLineFilter(section) {
    var filter = section.querySelector(".publication-filter");
    var lineMap = readLineMap();

    if (!filter || !Object.keys(lineMap).length) {
      return;
    }

    var entries = Array.prototype.map.call(
      section.querySelectorAll(".paper-box, .workshop-list li"),
      function (element) {
        return { element: element, lines: entryLines(element, lineMap) };
      }
    );
    var headings = Array.prototype.slice.call(section.querySelectorAll("h2, h3"));
    var browsers = section.querySelectorAll(".publication-browser");
    var options = filter.querySelectorAll(".publication-filter__option");

    function headingHasVisibleEntry(heading, index) {
      var level = heading.tagName;
      var next = headings.slice(index + 1).filter(function (other) {
        return level === "H3" || other.tagName === "H2";
      })[0];

      return entries.some(function (entry) {
        var element = entry.element;
        var after = heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
        var before = !next || (next.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_PRECEDING);
        return after && before && !element.hidden;
      });
    }

    function apply(line) {
      // Containers and headings inside a collapsed group (for example the
      // workshop list) open while a line is selected; empty headings are
      // hidden again below.
      Array.prototype.forEach.call(
        section.querySelectorAll(".publication-item--additional"),
        function (element) {
          element.hidden = line === "all" ? isCollapsed(element, section) : false;
        }
      );

      entries.forEach(function (entry) {
        entry.element.hidden = line === "all"
          ? isCollapsed(entry.element, section)
          : entry.lines.indexOf(line) === -1;
      });

      Array.prototype.forEach.call(browsers, function (browser) {
        browser.hidden = line !== "all";
      });

      headings.forEach(function (heading, index) {
        heading.hidden = line === "all"
          ? isCollapsed(heading, section)
          : !headingHasVisibleEntry(heading, index);
      });

      Array.prototype.forEach.call(options, function (option) {
        option.setAttribute("aria-pressed", String(option.getAttribute("data-line") === line));
      });
    }

    filter.addEventListener("click", function (event) {
      var option = event.target.closest(".publication-filter__option");

      if (option) {
        apply(option.getAttribute("data-line"));
      }
    });

    filter.hidden = false;
  }

  function initialisePublicationBrowser() {
    var section = document.querySelector(".home-section--publications");

    if (!section) {
      return;
    }

    publicationGroups.forEach(function (config) {
      initialisePublicationGroup(section, config);
    });

    initialiseLineFilter(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialisePublicationBrowser);
  } else {
    initialisePublicationBrowser();
  }
})();
