(function () {
  "use strict";

  var countElement = document.getElementById("visitor-count");
  if (!countElement) return;

  var countriesElement = document.getElementById("visitor-countries");
  var countryTotalElement = document.getElementById("visitor-country-total");
  var endpoints = [
    "https://counter.hushiyu1995.com/",
    "https://shiyu-homepage-counter.hushiyu199510.workers.dev/"
  ];
  var today = new Date().toISOString().slice(0, 10);
  var storageKey = "shiyu-homepage-visit-date";
  var shouldIncrement = true;

  try {
    shouldIncrement = window.localStorage.getItem(storageKey) !== today;
  } catch (error) {
    shouldIncrement = true;
  }

  function request(endpoint, method) {
    return fetch(endpoint, {
      method: method,
      headers: { "Accept": "application/json" },
      mode: "cors"
    }).then(function (response) {
      if (!response.ok) throw new Error("Counter request failed");
      return response.json();
    });
  }

  function findAvailableEndpoint(index) {
    return request(endpoints[index], "GET")
      .then(function (data) {
        return { endpoint: endpoints[index], data: data };
      })
      .catch(function () {
        if (index + 1 >= endpoints.length) throw new Error("Counter unavailable");
        return findAvailableEndpoint(index + 1);
      });
  }

  function countryName(code) {
    try {
      return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    } catch (error) {
      return code;
    }
  }

  function countryFlag(code) {
    return code.replace(/./g, function (character) {
      return String.fromCodePoint(127397 + character.charCodeAt(0));
    });
  }

  function renderCountries(data) {
    var countries = Array.isArray(data.countries) ? data.countries : [];
    if (!countriesElement || !countryTotalElement) return;

    if (!countries.length) {
      countryTotalElement.textContent = "Collecting geographic distribution";
      return;
    }

    var maximum = Number(countries[0].value) || 1;
    var countryTotal = Number(data.countryTotal || countries.length);
    countryTotalElement.textContent =
      countryTotal.toLocaleString("en-US") +
      (countryTotal === 1 ? " country or region" : " countries and regions");

    countriesElement.textContent = "";
    countries.forEach(function (country) {
      var row = document.createElement("div");
      var label = document.createElement("span");
      var bar = document.createElement("span");
      var fill = document.createElement("span");
      var value = document.createElement("span");
      var code = String(country.code || "").toUpperCase();

      row.className = "visitor-country";
      label.className = "visitor-country__label";
      label.textContent = countryFlag(code) + " " + countryName(code);
      bar.className = "visitor-country__bar";
      fill.className = "visitor-country__fill";
      fill.style.width = Math.max(8, (Number(country.value) / maximum) * 100) + "%";
      value.className = "visitor-country__value";
      value.textContent = Number(country.value || 0).toLocaleString("en-US");

      bar.appendChild(fill);
      row.appendChild(label);
      row.appendChild(bar);
      row.appendChild(value);
      countriesElement.appendChild(row);
    });
  }

  findAvailableEndpoint(0)
    .then(function (available) {
      if (!shouldIncrement) return available.data;
      return request(available.endpoint, "POST");
    })
    .then(function (data) {
      countElement.textContent = Number(data.count || 0).toLocaleString("en-US");
      renderCountries(data);
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
