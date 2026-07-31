(function () {
  "use strict";

  var countElement = document.getElementById("visitor-count");
  if (!countElement) return;

  var countriesElement = document.getElementById("visitor-countries");
  var latestElement = document.getElementById("visitor-latest");
  var periodTotalElement = document.getElementById("visitor-period-total");
  var periodCountryCountElement = document.getElementById(
    "visitor-period-country-count"
  );
  var periodRangeElement = document.getElementById("visitor-period-range");
  var periodCountriesElement = document.getElementById(
    "visitor-period-countries"
  );
  var periodToggleElement = document.getElementById("visitor-period-toggle");
  var periodTabs = document.querySelectorAll(".visitor-period-tab");
  var activePeriod = "today";
  var periodExpanded = false;
  var recentSnapshot = null;
  var endpoints = [
    "https://counter.hushiyu1995.com/",
    "https://shiyu-homepage-counter.hushiyu199510.workers.dev/"
  ];
  var legacyCount = 15000;
  var legacyRegions = [
    {
      code: "ESEA",
      label: "East & Southeast Asia",
      value: 5550,
      flags: "🇸🇬 🇨🇳 🇭🇰 🇲🇴 🇯🇵 🇰🇷 🇹🇼 🇲🇾 🇮🇩 🇹🇭 🇻🇳 🇵🇭 🇧🇳 🇰🇭 🇲🇲"
    },
    {
      code: "NA",
      label: "North America",
      value: 4200,
      flags: "🇺🇸 🇨🇦 🇧🇲"
    },
    {
      code: "EU",
      label: "Europe",
      value: 3450,
      flags: "🇬🇧 🇮🇪 🇫🇷 🇩🇪 🇮🇹 🇪🇸 🇵🇹 🇳🇱 🇧🇪 🇨🇭 🇦🇹 🇸🇪 🇳🇴 🇩🇰 🇫🇮 🇵🇱"
    },
    {
      code: "SAME",
      label: "South Asia & Middle East",
      value: 1100,
      flags: "🇮🇳 🇵🇰 🇧🇩 🇱🇰 🇳🇵 🇦🇪 🇸🇦 🇶🇦 🇰🇼 🇮🇱 🇯🇴 🇹🇷"
    },
    {
      code: "LAC",
      label: "Latin America & Caribbean",
      value: 350,
      flags: "🇧🇷 🇦🇷 🇨🇱 🇨🇴 🇵🇪 🇺🇾 🇲🇽 🇨🇷 🇵🇦 🇬🇹 🇩🇴 🇯🇲"
    },
    {
      code: "OCE",
      label: "Oceania",
      value: 200,
      flags: "🇦🇺 🇳🇿 🇫🇯 🇵🇬"
    },
    {
      code: "AF",
      label: "Africa",
      value: 150,
      flags: "🇿🇦 🇪🇬 🇲🇦 🇹🇳 🇰🇪 🇳🇬 🇬🇭 🇪🇹"
    },
    {
      code: "OTHER",
      label: "Other / Unclassified",
      value: 0,
      flags: ""
    }
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
      "BM", "CA", "GL", "US"
    ]),
    SAME: new Set([
      "AE", "AF", "AM", "AZ", "BD", "BH", "BT", "GE", "IL", "IN", "IQ",
      "IR", "JO", "KG", "KW", "KZ", "LB", "LK", "MV", "NP", "OM", "PK",
      "PS", "QA", "SA", "SY", "TJ", "TM", "TR", "UZ", "YE"
    ]),
    LAC: new Set([
      "AG", "AI", "AR", "AW", "BB", "BO", "BQ", "BR", "BS", "BZ", "CL",
      "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GP", "GT",
      "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MQ", "MS", "MX", "NI",
      "PA", "PE", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "UY", "VC",
      "VE", "VG", "VI"
    ]),
    OCE: new Set([
      "AS", "AU", "CK", "FJ", "FM", "GU", "KI", "MH", "MP", "NC", "NF",
      "NR", "NU", "NZ", "PF", "PG", "PN", "PW", "SB", "TK", "TO", "TV",
      "VU", "WF", "WS"
    ]),
    AF: new Set([
      "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV",
      "DJ", "DZ", "EG", "EH", "ER", "ET", "GA", "GH", "GM", "GN", "GQ",
      "GW", "KE", "KM", "LR", "LS", "LY", "MA", "MG", "ML", "MR", "MU",
      "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SD", "SH", "SL",
      "SN", "SO", "SS", "ST", "SZ", "TD", "TG", "TN", "TZ", "UG", "YT",
      "ZA", "ZM", "ZW"
    ])
  };
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
    var regions = ["EU", "ESEA", "NA", "SAME", "LAC", "OCE", "AF"];
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
        value: region.value,
        flags: region.flags
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
    if (!countriesElement) return;

    var maximum = Number(regions[0].value) || 1;

    countriesElement.textContent = "";
    regions.forEach(function (region) {
      var row = document.createElement("div");
      var identity = document.createElement("span");
      var label = document.createElement("span");
      var flags = document.createElement("span");
      var bar = document.createElement("span");
      var fill = document.createElement("span");
      var value = document.createElement("span");

      row.className = "visitor-country";
      identity.className = "visitor-country__identity";
      label.className = "visitor-country__label";
      label.textContent = region.label;
      flags.className = "visitor-country__flags";
      flags.textContent = region.flags;
      flags.setAttribute(
        "aria-label",
        "Representative countries and regions in " + region.label
      );
      bar.className = "visitor-country__bar";
      fill.className = "visitor-country__fill";
      fill.style.width =
        Math.max(8, (Number(region.value) / maximum) * 100) + "%";
      value.className = "visitor-country__value";
      value.textContent =
        "\u2248" + Number(region.value || 0).toLocaleString("en-US");

      identity.appendChild(label);
      if (region.flags) identity.appendChild(flags);
      bar.appendChild(fill);
      row.appendChild(identity);
      row.appendChild(bar);
      row.appendChild(value);
      countriesElement.appendChild(row);
    });
  }

  function countryFlag(code) {
    if (!/^[A-Z]{2}$/.test(code) || code === "XX") return "\uD83C\uDF10";
    return String.fromCodePoint(
      code.charCodeAt(0) + 127397,
      code.charCodeAt(1) + 127397
    );
  }

  function countryName(code) {
    if (!/^[A-Z]{2}$/.test(code) || code === "XX") return "Unknown region";

    var chinaRegionNames = {
      CN: "China",
      HK: "Hong Kong (China)",
      MO: "Macao (China)",
      TW: "Taiwan (China)"
    };

    if (chinaRegionNames[code]) return chinaRegionNames[code];

    try {
      return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
    } catch (error) {
      return code;
    }
  }

  function visitTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    try {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
      }).format(date);
    } catch (error) {
      return "";
    }
  }

  function renderLatest(data) {
    if (!latestElement) return;

    var latest = data.latestVisit;
    if (!latest) {
      latestElement.textContent =
        "Latest page-view location will appear after the next visit.";
      return;
    }

    var code = String(latest.countryCode || "XX").toUpperCase();
    var label = document.createElement("span");
    var location = document.createElement("span");
    var time = document.createElement("span");

    latestElement.textContent = "";
    label.className = "visitor-insights__latest-label";
    label.textContent = "Latest page view";
    location.className = "visitor-insights__latest-location";
    location.textContent = countryFlag(code) + " " + countryName(code);
    time.className = "visitor-insights__latest-time";
    time.textContent = visitTime(latest.visitedAt);

    latestElement.appendChild(label);
    latestElement.appendChild(location);
    if (time.textContent) latestElement.appendChild(time);
  }

  function periodDate(value) {
    if (!value) return "";

    try {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Singapore"
      }).format(new Date(value + "T00:00:00+08:00"));
    } catch (error) {
      return value;
    }
  }

  function periodName(period) {
    if (period === "week") return "This week";
    if (period === "month") return "This month";
    return "Today";
  }

  function renderPeriodTabs() {
    Array.prototype.forEach.call(periodTabs, function (tab) {
      var selected = tab.getAttribute("data-period") === activePeriod;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function renderRecentPeriod() {
    if (
      !periodCountriesElement ||
      !periodTotalElement ||
      !periodCountryCountElement
    ) {
      return;
    }

    var recent = recentSnapshot;
    var period = recent && recent[activePeriod];

    periodCountriesElement.textContent = "";
    renderPeriodTabs();

    if (!period) {
      var unavailable = document.createElement("span");
      unavailable.className = "visitor-insights__empty";
      unavailable.textContent =
        "Exact period statistics will begin with the next recorded page view.";
      periodCountriesElement.appendChild(unavailable);
      periodTotalElement.textContent = "—";
      periodCountryCountElement.textContent = "—";
      if (periodToggleElement) periodToggleElement.hidden = true;
      return;
    }

    var countries = Array.isArray(period.countries)
      ? period.countries.slice()
      : [];
    var total = Number(period.total || 0);
    var visibleCountries = periodExpanded ? countries : countries.slice(0, 5);

    periodTotalElement.textContent = total.toLocaleString("en-US");
    periodCountryCountElement.textContent = Number(
      period.countryCount || 0
    ).toLocaleString("en-US");

    if (periodRangeElement) {
      var range = periodDate(period.from);
      if (period.to && period.to !== period.from) {
        range += "–" + periodDate(period.to);
      }
      var trackingStart = periodDate(recent.trackingStartedOn);
      periodRangeElement.textContent =
        periodName(activePeriod) +
        (range ? " · " + range : "") +
        " · Singapore Time (UTC+8)" +
        (trackingStart ? " · recorded since " + trackingStart : "");
    }

    if (!visibleCountries.length) {
      var empty = document.createElement("span");
      empty.className = "visitor-insights__empty";
      empty.textContent = "No page views have been recorded in this period.";
      periodCountriesElement.appendChild(empty);
    }

    visibleCountries.forEach(function (country) {
      var code = String(country.code || "XX").toUpperCase();
      var value = Number(country.value || 0);
      var row = document.createElement("div");
      var identity = document.createElement("span");
      var flag = document.createElement("span");
      var name = document.createElement("span");
      var bar = document.createElement("span");
      var fill = document.createElement("span");
      var metric = document.createElement("span");
      var count = document.createElement("strong");
      var share = document.createElement("small");

      row.className = "visitor-period-country";
      identity.className = "visitor-period-country__identity";
      flag.className = "visitor-period-country__flag";
      flag.textContent = countryFlag(code);
      name.className = "visitor-period-country__name";
      name.textContent = countryName(code);
      bar.className = "visitor-period-country__bar";
      fill.className = "visitor-period-country__fill";
      fill.style.width =
        Math.max(6, total ? (value / total) * 100 : 0) + "%";
      metric.className = "visitor-period-country__metric";
      count.textContent = value.toLocaleString("en-US");
      share.textContent =
        total ? Math.round((value / total) * 100) + "%" : "0%";

      identity.appendChild(flag);
      identity.appendChild(name);
      bar.appendChild(fill);
      metric.appendChild(count);
      metric.appendChild(share);
      row.appendChild(identity);
      row.appendChild(bar);
      row.appendChild(metric);
      periodCountriesElement.appendChild(row);
    });

    if (periodToggleElement) {
      periodToggleElement.hidden = countries.length <= 5;
      periodToggleElement.textContent = periodExpanded
        ? "Show top 5"
        : "Show all countries and regions";
      periodToggleElement.setAttribute(
        "aria-expanded",
        periodExpanded ? "true" : "false"
      );
    }
  }

  function renderRecent(data) {
    recentSnapshot = data && data.recent ? data.recent : null;
    renderRecentPeriod();
  }

  Array.prototype.forEach.call(periodTabs, function (tab) {
    tab.addEventListener("click", function () {
      activePeriod = tab.getAttribute("data-period") || "today";
      periodExpanded = false;
      renderRecentPeriod();
    });
  });

  if (periodToggleElement) {
    periodToggleElement.addEventListener("click", function () {
      periodExpanded = !periodExpanded;
      renderRecentPeriod();
    });
  }

  countElement.textContent = legacyCount.toLocaleString("en-US");
  renderRegions({ count: 0, countries: [] });
  renderLatest({});
  renderRecent({});

  findAvailableEndpoint(0)
    .then(function (available) {
      return request(available.endpoint, "POST");
    })
    .then(function (data) {
      countElement.textContent =
        (legacyCount + Number(data.count || 0)).toLocaleString("en-US");
      renderRegions(data);
      renderLatest(data);
      renderRecent(data);
    })
    .catch(function () {
      countElement.textContent = legacyCount.toLocaleString("en-US");
      countElement.setAttribute(
        "title",
        "Live visitor count is temporarily unavailable; the legacy estimate is still shown"
      );
    });
}());
