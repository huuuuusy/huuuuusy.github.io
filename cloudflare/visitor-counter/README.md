# First-party visitor counter

This optional Cloudflare Worker supplies the aggregate visitor data used by the
homepage panel. It stores:

- the cumulative page-view total;
- aggregate country-or-region totals;
- daily country-or-region totals;
- only the latest page view's country-or-region code and timestamp.

It does not store IP addresses, user agents, visitor profiles, or a row for
every request. Each page load or refresh counts as one page view.

The static homepage works without this service. Set
`visitor_insights.enabled: false` in the root `_config.yml` to remove the panel
and stop loading its JavaScript.

## Files

| Path | Purpose |
| --- | --- |
| `src/index.js` | Worker request handling, CORS policy, aggregation, and period summaries |
| `schema.sql` | D1 tables and indexes |
| `wrangler.jsonc` | Worker name, route, and D1 binding for the current site |

## Deploy a separate counter for a fork

Do not reuse the database ID, hostname, or Worker name from this repository.

1. Install and authenticate the current
   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/).
2. Create a D1 database for the fork:

   ```bash
   npx wrangler d1 create your-homepage-visits
   ```

3. Replace the `name`, route, `database_name`, and `database_id` values in
   `wrangler.jsonc`. Keep the binding name as `DB` unless you also change the
   Worker source.
4. Apply the schema to the remote database:

   ```bash
   npx wrangler d1 execute your-homepage-visits --remote --file=./schema.sql
   ```

5. Replace `ALLOWED_ORIGINS` at the top of `src/index.js` with the fork's
   `github.io` URL and optional custom domain.
6. Deploy from this directory:

   ```bash
   npx wrangler deploy
   ```

Cloudflare's [D1 getting-started guide](https://developers.cloudflare.com/d1/get-started/)
contains the current account and database setup steps.

## Connect the homepage

Add the deployed Worker URL and optional custom hostname to `_config.yml`:

```yaml
visitor_insights:
  enabled: true
  endpoints:
    - "https://counter.example.com/"
    - "https://your-worker.your-subdomain.workers.dev/"
  legacy_count: 0
  note: "Page views recorded by this site's first-party counter since YYYY-MM-DD."
```

The browser tries the endpoints in order. Use `legacy_count: 0` for a new site.
Do not copy the original homepage's reconstructed historical total into a fork.

## Timezone

The current Worker calculates Today, This Week, and This Month in
`Asia/Singapore`. To use another timezone, update `singaporePeriods()` in
`src/index.js` and the corresponding label in
`_includes/home/visitor-insights.html`. Keep the Worker calculation and visible
label synchronized.

## Privacy and verification

Update `_pages/terms.md` so it describes the fork's actual analytics and
counter behavior. After deployment, test `GET`, `POST`, and browser CORS access
from every allowed public origin. The Worker returns JSON and sends
`Cache-Control: no-store` because a cached response would make recent totals
misleading.
