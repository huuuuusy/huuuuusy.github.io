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

async function readSnapshot(env) {
  const [counter, countries, countryTotal, latestVisit] = await env.DB.batch([
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
    )
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
      : null
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
