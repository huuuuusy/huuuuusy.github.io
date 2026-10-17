(function () {
  "use strict";

  // Rail colour at position t within a year (0 = newest, 1 = oldest):
  // NTU blue fading to a pale blue.
  function railColour(t) {
    var from = [24, 28, 98];
    var to = [214, 219, 240];
    var mix = from.map(function (value, index) {
      return Math.round(value + (to[index] - value) * Math.min(1, Math.max(0, t)));
    });
    return "rgb(" + mix.join(", ") + ")";
  }

  // Give each year's bar the same fade, from NTU blue at the year's newest
  // shown item to a pale blue at its oldest; each item gets its slice of it.
  function paintRail(items) {
    var groups = {};

    items.forEach(function (item) {
      var year = item.getAttribute("data-year");
      (groups[year] = groups[year] || []).push(item);
    });

    Object.keys(groups).forEach(function (year) {
      // Split the fade by each item's height so it runs evenly down the bar.
      var group = groups[year];
      var heights = group.map(function (item) {
        return Math.max(1, item.offsetHeight);
      });
      var total = heights.reduce(function (sum, height) {
        return sum + height;
      }, 0);
      var offset = 0;

      group.forEach(function (item, index) {
        item.style.setProperty("--rail-top", railColour(offset / total));
        offset += heights[index];
        item.style.setProperty("--rail-bottom", railColour(offset / total));
      });
    });
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
    // Keep the current month and the previous two calendar months visible,
    // and never fewer than MIN_VISIBLE items, so a quiet stretch still shows
    // the latest news.
    var MIN_VISIBLE = 6;
    var cutoff = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    var olderItems = [];
    var shown = 0;

    items.forEach(function (item) {
      var dateLabel = item.querySelector("strong");
      var match = dateLabel && dateLabel.textContent.match(/^(\d{4})\.(\d{2})$/);

      if (!match) {
        return;
      }

      var itemDate = new Date(Number(match[1]), Number(match[2]) - 1, 1);
      if (itemDate < cutoff && shown >= MIN_VISIBLE) {
        item.classList.add("news-item--older");
        olderItems.push(item);
      } else {
        shown += 1;
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
        ? "Show recent news"
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
    var dated = [];

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
      dated.push(item);
    });

    if (!dated.length) {
      return;
    }

    // Repaint over the items now shown, so each visible year has the full
    // fade in both the recent-news view and the full list.
    function repaint() {
      paintRail(dated.filter(function (item) {
        return item.offsetParent !== null;
      }));
    }

    timeline.classList.add("has-year-rail");
    repaint();

    var toggle = document.querySelector(".news-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        window.setTimeout(repaint, 0);
      });
    }

    return repaint;
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
    var repaintNewsRail = initialiseNewsYears();
    initialiseNewsTimeline();
    if (repaintNewsRail) {
      repaintNewsRail();
    }
    initialiseHonorsList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseCollapsibleSections);
  } else {
    initialiseCollapsibleSections();
  }
})();
