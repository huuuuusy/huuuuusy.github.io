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
  var legacyCount = 15000;
  var legacyRegions = [
    { code: "EU", label: "Europe", value: 4650 },
    { code: "ESEA", label: "East & Southeast Asia", value: 3600 },
    { code: "NA", label: "North America", value: 3450 },
    { code: "SAME", label: "South Asia & Middle East", value: 2850 },
    { code: "OTHER", label: "Oceania & Other Regions", value: 450 }
  ];
  var regionCountries = {
    EU: new Set([
      "AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE",
      "DK", "EE", "ES", "FI", "FO", "FR", "GB", "GI", "GR", "HR", "HU",
      "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK",
      "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SK",
      "SM", "UA", "VA"
    ]),
    ESEA: new Set([
      "BN", "CN", "HK", "ID", "JP", "KH", "KP", "KR", "LA", "MO", "MM",
      "MN", "MY", "PH", "SG", "TH", "TL", "TW", "VN"
    ]),
    NA: new Set([
      "AG", "AI", "AW", "BB", "BM", "BQ", "BS", "BZ", "CA", "CR", "CU",
      "CW", "DM", "DO", "GD", "GL", "GP", "GT", "HN", "HT", "JM", "KN",
      "KY", "LC", "MQ", "MS", "MX", "NI", "PA", "PR", "SV", "SX", "TC",
      "TT", "US", "VC", "VG", "VI"
    ]),
    SAME: new Set([
      "AE", "AF", "AM", "AZ", "BD", "BH", "BT", "GE", "IL", "IN", "IQ",
      "IR", "JO", "KG", "KW", "KZ", "LB", "LK", "MV", "NP", "OM", "PK",
      "PS", "QA", "SA", "SY", "TJ", "TM", "TR", "UZ", "YE"
    ])
  };
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

  function regionCode(countryCode) {
    var regions = ["EU", "ESEA", "NA", "SAME"];
    var index;

    for (index = 0; index < regions.length; index += 1) {
      if (regionCountries[regions[index]].has(countryCode)) {
        return regions[index];
      }
    }

    return "OTHER";
  }

  function estimatedRegions(data) {
    var regions = legacyRegions.map(function (region) {
      return {
        code: region.code,
        label: region.label,
        value: region.value
      };
    });
    var countryRows = Array.isArray(data.countries) ? data.countries : [];
    var representedLiveVisits = 0;

    countryRows.forEach(function (country) {
      var value = Number(country.value || 0);
      var code = regionCode(String(country.code || "").toUpperCase());
      var region = regions.find(function (item) {
        return item.code === code;
      });

      representedLiveVisits += value;
      region.value += value;
    });

    var unclassifiedLiveVisits = Math.max(
      0,
      Number(data.count || 0) - representedLiveVisits
    );
    regions[regions.length - 1].value += unclassifiedLiveVisits;

    return regions.sort(function (a, b) {
      return b.value - a.value;
    });
  }

  function renderRegions(data) {
    var regions = estimatedRegions(data);
    if (!countriesElement || !countryTotalElement) return;

    var maximum = Number(regions[0].value) || 1;
    countryTotalElement.textContent = "5 estimated global regions";

    countriesElement.textContent = "";
    regions.forEach(function (region) {
      var row = document.createElement("div");
      var label = document.createElement("span");
      var bar = document.createElement("span");
      var fill = document.createElement("span");
      var value = document.createElement("span");

      row.className = "visitor-country";
      label.className = "visitor-country__label";
      label.textContent = region.label;
      bar.className = "visitor-country__bar";
      fill.className = "visitor-country__fill";
      fill.style.width =
        Math.max(8, (Number(region.value) / maximum) * 100) + "%";
      value.className = "visitor-country__value";
      value.textContent =
        "\u2248" + Number(region.value || 0).toLocaleString("en-US");

      bar.appendChild(fill);
      row.appendChild(label);
      row.appendChild(bar);
      row.appendChild(value);
      countriesElement.appendChild(row);
    });
  }

  countElement.textContent = legacyCount.toLocaleString("en-US");
  renderRegions({ count: 0, countries: [] });

  findAvailableEndpoint(0)
    .then(function (available) {
      if (!shouldIncrement) return available.data;
      return request(available.endpoint, "POST");
    })
    .then(function (data) {
      countElement.textContent =
        (legacyCount + Number(data.count || 0)).toLocaleString("en-US");
      renderRegions(data);
      if (shouldIncrement) {
        try {
          window.localStorage.setItem(storageKey, today);
        } catch (error) {
          // The counter still works when browser storage is unavailable.
        }
      }
    })
    .catch(function () {
      countElement.textContent = legacyCount.toLocaleString("en-US");
      countElement.setAttribute(
        "title",
        "Live visitor count is temporarily unavailable; the legacy estimate is still shown"
      );
    });
}());
