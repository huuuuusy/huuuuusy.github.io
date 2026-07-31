(function () {
  "use strict";

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

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var label = toggle.querySelector(".news-toggle__label");
      var icon = toggle.querySelector(".news-toggle__icon");

      timeline.classList.toggle("is-expanded", !expanded);
      toggle.setAttribute("aria-expanded", String(!expanded));
      label.textContent = expanded ? "Show all news" : "Show recent six months";
      icon.textContent = expanded ? "↓" : "↑";
    });
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

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var label = toggle.querySelector(".honors-toggle__label");
      var icon = toggle.querySelector(".honors-toggle__icon");

      honors.classList.toggle("is-expanded", !expanded);
      toggle.setAttribute("aria-expanded", String(!expanded));
      label.textContent = expanded
        ? "Show all honors and awards"
        : "Show recent honors and awards";
      icon.textContent = expanded ? "↓" : "↑";
    });
  }

  function initialiseCollapsibleSections() {
    initialiseNewsTimeline();
    initialiseHonorsList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseCollapsibleSections);
  } else {
    initialiseCollapsibleSections();
  }
})();
