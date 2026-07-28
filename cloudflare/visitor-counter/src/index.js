const ALLOWED_ORIGINS = new Set([
  "http://hushiyu1995.com",
  "http://www.hushiyu1995.com",
  "https://hushiyu1995.com",
  "https://www.hushiyu1995.com",
  "https://huuuuusy.github.io"
]);

function responseHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function visitorCountry(request) {
  const country = request.cf && request.cf.country;
  return /^[A-Z]{2}$/.test(country || "") ? country : "XX";
}

function singaporePeriods() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") values[part.type] = Number(part.value);
  });

  const current = new Date(
    Date.UTC(values.year, values.month - 1, values.day)
  );
  const mondayOffset = (current.getUTCDay() + 6) % 7;
  const weekStart = new Date(current);

  weekStart.setUTCDate(current.getUTCDate() - mondayOffset);

  function dateKey(date) {
    return date.toISOString().slice(0, 10);
  }

  return {
    timezone: "Asia/Singapore",
    today: {
      from: dateKey(current),
      to: dateKey(current)
    },
    week: {
      from: dateKey(weekStart),
      to: dateKey(current)
    },
    month: {
      from: dateKey(new Date(Date.UTC(values.year, values.month - 1, 1))),
      to: dateKey(current)
    }
  };
}

function periodResult(rows, range) {
  const countries = rows.map((row) => ({
    code: row.code,
    value: Number(row.value || 0)
  }));

  return {
    from: range.from,
    to: range.to,
    total: countries.reduce((sum, country) => sum + country.value, 0),
    countryCount: countries.filter((country) => country.code !== "XX").length,
    countries
  };
}

async function readSnapshot(env) {
  const periods = singaporePeriods();
  const [
    counter,
    countries,
    countryTotal,
    latestVisit,
    periodStart,
    todayCountries,
    weekCountries,
    monthCountries
  ] = await env.DB.batch([
    env.DB.prepare("SELECT value FROM counters WHERE name = 'homepage'"),
    env.DB.prepare(
      "SELECT code, value FROM country_counts " +
      "WHERE code != 'XX' ORDER BY value DESC, code ASC"
    ),
    env.DB.prepare(
      "SELECT COUNT(*) AS value FROM country_counts WHERE code != 'XX'"
    ),
    env.DB.prepare(
      "SELECT country_code, visited_at FROM latest_visit WHERE id = 1"
    ),
    env.DB.prepare(
      "SELECT MIN(visit_date) AS value FROM daily_country_counts"
    ),
    env.DB.prepare(
      "SELECT country_code AS code, SUM(value) AS value " +
      "FROM daily_country_counts WHERE visit_date BETWEEN ? AND ? " +
      "GROUP BY country_code ORDER BY value DESC, country_code ASC"
    ).bind(periods.today.from, periods.today.to),
    env.DB.prepare(
      "SELECT country_code AS code, SUM(value) AS value " +
      "FROM daily_country_counts WHERE visit_date BETWEEN ? AND ? " +
      "GROUP BY country_code ORDER BY value DESC, country_code ASC"
    ).bind(periods.week.from, periods.week.to),
    env.DB.prepare(
      "SELECT country_code AS code, SUM(value) AS value " +
      "FROM daily_country_counts WHERE visit_date BETWEEN ? AND ? " +
      "GROUP BY country_code ORDER BY value DESC, country_code ASC"
    ).bind(periods.month.from, periods.month.to)
  ]);

  const latest = latestVisit.results[0];

  return {
    count: counter.results[0] ? counter.results[0].value : 0,
    countries: countries.results,
    countryTotal: countryTotal.results[0] ? countryTotal.results[0].value : 0,
    latestVisit: latest
      ? {
          countryCode: latest.country_code,
          visitedAt: latest.visited_at
        }
      : null,
    recent: {
      timezone: periods.timezone,
      trackingStartedOn: periodStart.results[0]
        ? periodStart.results[0].value
        : null,
      today: periodResult(todayCountries.results, periods.today),
      week: periodResult(weekCountries.results, periods.week),
      month: periodResult(monthCountries.results, periods.month)
    }
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = responseHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: ALLOWED_ORIGINS.has(origin) ? 204 : 403,
        headers
      });
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers
      });
    }

    if (request.method === "POST") {
      await env.DB.batch([
        env.DB.prepare(
          "INSERT INTO counters (name, value) VALUES ('homepage', 1) " +
          "ON CONFLICT(name) DO UPDATE SET value = value + 1"
        ),
        env.DB.prepare(
          "INSERT INTO country_counts (code, value) VALUES (?, 1) " +
          "ON CONFLICT(code) DO UPDATE SET value = value + 1"
        ).bind(visitorCountry(request)),
        env.DB.prepare(
          "INSERT INTO latest_visit (id, country_code, visited_at) " +
          "VALUES (1, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) " +
          "ON CONFLICT(id) DO UPDATE SET " +
          "country_code = excluded.country_code, " +
          "visited_at = excluded.visited_at"
        ).bind(visitorCountry(request)),
        env.DB.prepare(
          "INSERT INTO daily_country_counts " +
          "(visit_date, country_code, value) " +
          "VALUES (date('now', '+8 hours'), ?, 1) " +
          "ON CONFLICT(visit_date, country_code) " +
          "DO UPDATE SET value = value + 1"
        ).bind(visitorCountry(request))
      ]);

      return new Response(JSON.stringify(await readSnapshot(env)), { headers });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify(await readSnapshot(env)), {
        headers
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers
    });
  }
};
