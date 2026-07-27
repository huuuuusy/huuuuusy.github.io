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
      const row = await env.DB.prepare(
        "INSERT INTO counters (name, value) VALUES ('homepage', 1) " +
        "ON CONFLICT(name) DO UPDATE SET value = value + 1 " +
        "RETURNING value"
      ).first();
      return new Response(JSON.stringify({ count: row.value }), { headers });
    }

    if (request.method === "GET") {
      const row = await env.DB.prepare(
        "SELECT value FROM counters WHERE name = 'homepage'"
      ).first();
      return new Response(JSON.stringify({ count: row ? row.value : 0 }), {
        headers
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers
    });
  }
};
