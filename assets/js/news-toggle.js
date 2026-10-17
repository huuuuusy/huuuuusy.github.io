(function () {
  "use strict";

  // Opacity of the NTU blue rail for the nth most recent year.
  function yearTone(rank) {
    return String(Math.max(0.16, 1 - rank * 0.2));
  }

  function initialiseNewsTimeline() {
    var timeline = document.querySelector(".news-timeline");
    var toggle = document.querySelector(".news-toggle");

    if (!timeline || !toggle) {
      return;
    }

    var items = Array.prototype.slice.call(timeline.children).filter(function (item) {
      return item.tagName === "P";
    });
    var today = new Date();
    // Keep the current month and the previous five calendar months visible.
    var cutoff = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    var olderItems = [];

    items.forEach(function (item) {
      var dateLabel = item.querySelector("strong");
      var match = dateLabel && dateLabel.textContent.match(/^(\d{4})\.(\d{2})$/);

      if (!match) {
        return;
      }

      var itemDate = new Date(Number(match[1]), Number(match[2]) - 1, 1);
      if (itemDate < cutoff) {
        item.classList.add("news-item--older");
        olderItems.push(item);
      }
    });

    if (!olderItems.length) {
      return;
    }

    timeline.classList.add("is-collapsible");
    toggle.hidden = false;

    function updateLabel(expanded) {
      var label = toggle.querySelector(".news-toggle__label");
      label.textContent = expanded
        ? "Show recent six months"
        : "Show all news";
    }

    updateLabel(false);

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var icon = toggle.querySelector(".news-toggle__icon");

      timeline.classList.toggle("is-expanded", !expanded);
      toggle.setAttribute("aria-expanded", String(!expanded));
      updateLabel(!expanded);
      icon.textContent = expanded ? "↓" : "↑";
    });

  }

  // Year rail: the news runs newest first, so the first item of each year
  // carries the year label, and each year's stretch of the rail gets a tone
  // that fades from the current year back to the oldest one.
  function initialiseNewsYears() {
    var timeline = document.querySelector(".news-timeline");

    if (!timeline) {
      return;
    }

    var items = Array.prototype.slice.call(timeline.children).filter(function (item) {
      return item.tagName === "P";
    });
    var years = [];

    items.forEach(function (item) {
      var dateLabel = item.querySelector("strong");
      var match = dateLabel && dateLabel.textContent.match(/^(\d{4})\./);

      if (!match) {
        return;
      }

      item.setAttribute("data-year", match[1]);
      if (years.indexOf(match[1]) === -1) {
        years.push(match[1]);
        item.classList.add("news-item--year-start");
      }
      item.style.setProperty("--year-tone", yearTone(years.indexOf(match[1])));
    });

    if (years.length) {
      timeline.classList.add("has-year-rail");
    }
  }

  function initialiseHonorsList() {
    var honors = document.querySelector(".honors-list");
    var toggle = document.querySelector(".honors-toggle");

    if (!honors || !toggle) {
      return;
    }

    var list = honors.querySelector("ul");
    if (!list) {
      return;
    }

    var items = Array.prototype.slice.call(list.children).filter(function (item) {
      return item.tagName === "LI";
    });
    var visibleItemCount = 7;
    var olderItems = items.slice(visibleItemCount);

    if (!olderItems.length) {
      return;
    }

    olderItems.forEach(function (item) {
      item.classList.add("honor-item--older");
    });

    honors.classList.add("is-collapsible");
    toggle.hidden = false;

    function updateLabel(expanded) {
      var label = toggle.querySelector(".honors-toggle__label");
      label.textContent = expanded
        ? "Show recent honors and awards"
        : "Show all honors and awards";
    }

    updateLabel(false);

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var icon = toggle.querySelector(".honors-toggle__icon");

      honors.classList.toggle("is-expanded", !expanded);
      toggle.setAttribute("aria-expanded", String(!expanded));
      updateLabel(!expanded);
      icon.textContent = expanded ? "↓" : "↑";
    });

  }

  function initialiseCollapsibleSections() {
    initialiseNewsYears();
    initialiseNewsTimeline();
    initialiseHonorsList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseCollapsibleSections);
  } else {
    initialiseCollapsibleSections();
  }
})();
