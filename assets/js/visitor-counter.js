(function () {
  "use strict";

  var countElement = document.getElementById("visitor-count");
  if (!countElement) return;

  var endpoint = "https://counter.hushiyu1995.com/";
  var today = new Date().toISOString().slice(0, 10);
  var storageKey = "shiyu-homepage-visit-date";
  var shouldIncrement = true;

  try {
    shouldIncrement = window.localStorage.getItem(storageKey) !== today;
  } catch (error) {
    shouldIncrement = true;
  }

  fetch(endpoint, {
    method: shouldIncrement ? "POST" : "GET",
    headers: { "Accept": "application/json" },
    mode: "cors"
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Counter request failed");
      return response.json();
    })
    .then(function (data) {
      countElement.textContent = Number(data.count || 0).toLocaleString("en-US");
      if (shouldIncrement) {
        try {
          window.localStorage.setItem(storageKey, today);
        } catch (error) {
          // The counter still works when browser storage is unavailable.
        }
      }
    })
    .catch(function () {
      countElement.textContent = "—";
      countElement.setAttribute("title", "Visitor count is temporarily unavailable");
    });
}());
