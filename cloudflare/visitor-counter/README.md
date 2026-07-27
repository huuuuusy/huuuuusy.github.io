# First-party visitor counter

This Cloudflare Worker provides the public visit total shown on the homepage.
It stores only one aggregate integer in D1 and does not store visitor IP
addresses, user agents, or individual profiles.

Deployment requires:

1. A D1 database with `schema.sql` applied.
2. A Worker with the D1 binding named `DB`.
3. The custom hostname `counter.hushiyu1995.com`.
4. A Cloudflare Web Analytics site token added separately for private traffic
   trends; it is not required for the public count.
