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
    var cutoff = new Date(today.getFullYear() - 1, today.getMonth(), 1);
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
      label.textContent = expanded ? "Show all news" : "Show recent news";
      icon.textContent = expanded ? "↓" : "↑";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseNewsTimeline);
  } else {
    initialiseNewsTimeline();
  }
})();
