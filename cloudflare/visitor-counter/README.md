# First-party visitor counter

This Cloudflare Worker provides the public page-view total shown on the
homepage. Each page load or refresh increments the counter. D1 stores the
aggregate total, aggregate country counts, and only the latest page view's
country code and timestamp. It does not store visitor IP addresses, user
agents, individual profiles, or a row-by-row visit history.

Deployment requires:

1. A D1 database with `schema.sql` applied.
2. A Worker with the D1 binding named `DB`.
3. The custom hostname `counter.hushiyu1995.com`.
4. A Cloudflare Web Analytics site token added separately for private traffic
   trends; it is not required for the public count.
