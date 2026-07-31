# Shiyu Hu — Academic Homepage

Source repository for [hushiyu1995.com](https://hushiyu1995.com), the academic
homepage of Shiyu Hu. The site presents research interests, publications,
projects, academic background, honors, professional service, and contact
information.

The website is built with Jekyll and deployed through GitHub Pages. Its visual
foundation is derived from
[Academic Pages](https://github.com/academicpages/academicpages.github.io) and
[Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes), with a
custom homepage design and a privacy-conscious visitor counter backed by a
Cloudflare Worker and D1.

## Live site

- Canonical domain: [https://hushiyu1995.com](https://hushiyu1995.com)
- GitHub Pages domain:
  [https://huuuuusy.github.io](https://huuuuusy.github.io)

## Repository structure

| Path | Purpose |
| --- | --- |
| `_pages/about.md` | Homepage composition and section order |
| `_pages/includes/` | Maintainable content modules for the homepage |
| `_pages/terms.md` | Privacy policy |
| `_data/navigation.yml` | Header navigation |
| `_config.yml` | Production Jekyll configuration and author metadata |
| `_config.dev.yml` | Local-development overrides |
| `assets/css/main.scss` | Site-specific visual design and responsive styles |
| `_sass/_academic-template.scss` | Reusable academic design tokens and final visual refinements |
| `assets/js/news-toggle.js` | Collapsible News and Honors interactions |
| `assets/js/publications-toggle.js` | Selected-versus-complete publication browsing |
| `assets/js/visitor-counter.js` | Public visitor statistics UI |
| `images/` | Publication figures, profile image, and institutional assets |
| `files/` | Public CV, papers, posters, and presentation downloads |
| `scripts/` | Dependency-free repository validation utilities |
| `cloudflare/visitor-counter/` | Cloudflare Worker, D1 schema, and deployment notes |

The homepage is intentionally assembled from small content files:

- `intro.md` — research identity and primary profile links;
- `news.md` — dated research and professional updates;
- `background.md` — work and education timeline;
- `interests.md` — research questions and directions;
- `publications.md` — publication cards and preprints;
- `projects.md` — software, platforms, challenges, and funded projects;
- `honors.md` — awards and honors;
- `activity.md` — tutorials, talks, editorial work, reviewing, and service;
- `contact.md` — current contact channels.

The legacy `package.json`, `assets/js/_main.js`, and the source files under
`assets/js/plugins/` and `assets/js/vendor/` are retained only to reproduce the
theme bundle in `assets/js/main.min.js`. Homepage-specific behavior remains in
separate, readable JavaScript files.

## Reuse as an academic template

The homepage is designed to remain personal while exposing a small,
fork-friendly customization surface. To adapt it for another researcher:

1. replace the site and author metadata in `_config.yml`;
2. replace `profile.jpg`, the CV, and the content modules under
   `_pages/includes/`;
3. update the main navigation in `_data/navigation.yml`;
4. customize the `--academic-*` design tokens at the top of
   `_sass/_academic-template.scss`;
5. replace or remove the visitor-counter configuration and privacy disclosure.

The default information hierarchy follows common academic browsing priorities:
identity and research agenda first, selected publications next, then projects,
background, honors, service, and contact details. The publication browser keeps
the initial page concise while preserving the complete record in the document.
Its visible-item limits are intentionally centralized in
`assets/js/publications-toggle.js`.

When making a public fork, also replace `CNAME`, repository metadata, analytics,
social links, downloadable files, images, and all personal or institutional
identifiers. Do not publish Shiyu Hu's CV, visitor data, or research assets as
part of another person's site.

## Local development

Prerequisites:

- Ruby and Bundler;
- the dependency versions provided by the `github-pages` gem.

Install dependencies:

```bash
bundle install
```

Run the local site:

```bash
bundle exec jekyll serve --config _config.yml,_config.dev.yml
```

Then open [http://localhost:4000](http://localhost:4000).

Build the production site without serving it:

```bash
bundle exec jekyll build
```

If the local environment does not have the required GitHub Pages gems, use the
source-level checks below and verify the deployed GitHub Pages build before
publishing.

## Content maintenance

### Update the homepage

1. Edit the relevant file under `_pages/includes/`.
2. Keep `_pages/about.md` limited to section composition and shared scripts.
3. Update the `Last updated` month in `_pages/about.md` when public content
   changes materially.
4. Verify desktop and mobile layouts, especially publication cards, timelines,
   and expandable sections.

### Add a publication

1. Add its card or list entry to `_pages/includes/publications.md`.
2. Store the display figure in `images/`.
3. Store only intentionally public downloads in `files/`.
4. Use a stable, unique HTML anchor and update related News links to the same
   anchor.
5. Confirm that title, venue, authorship, links, and status match the current CV.

### Add a news item

Add the newest item at the top of `_pages/includes/news.md` using the
`YYYY.MM` date format. The homepage automatically keeps the most recent six
calendar months visible and places older entries behind the shared toggle.

### Add an honor or award

Add the newest item at the top of `_pages/includes/honors.md`. The first seven
items remain visible by default; older entries are handled by the same
expand/collapse interaction used for News.

### Manage public assets

- Use descriptive, stable filenames.
- Avoid duplicate copies such as `file copy.pdf`.
- Do not keep local working drafts, private material, or superseded exports in
  `files/`.
- Before deleting an asset, search the entire repository for its filename.
- Large binary files remain recoverable from Git history, but removing them
  from the latest commit does not reduce historical repository size.

## Visitor statistics

The homepage combines:

- an estimated historical total reconstructed from earlier third-party
  counters; and
- first-party page-view aggregates recorded by the Cloudflare Worker.

The Worker stores aggregate totals, aggregate country-or-region counts, daily
country-or-region totals, and only the latest page view's country-or-region
code and timestamp. It does not store IP addresses, user agents, profiles, or a
row-by-row visit history.

Worker implementation and deployment requirements are documented in
[`cloudflare/visitor-counter/README.md`](cloudflare/visitor-counter/README.md).

## Validation checklist

Run the checks relevant to the files changed:

```bash
bundle exec jekyll build
ruby scripts/validate_local_references.rb
node --check assets/js/news-toggle.js
node --check assets/js/publications-toggle.js
node --check assets/js/visitor-counter.js
node --check cloudflare/visitor-counter/src/index.js
git diff --check
```

Before pushing a public update:

1. confirm that all local image and download links resolve;
2. inspect the homepage at desktop width and at approximately `390 × 844`;
3. test News, Publications, Honors, Background details, and visitor-statistics
   controls;
4. confirm that no unpublished or private files are included;
5. after pushing, wait for the GitHub Pages build to finish and verify the
   canonical domain with a cache-busting query.

## Deployment

GitHub Pages deploys the `master` branch automatically. The `CNAME` file binds
the deployment to `hushiyu1995.com`.

The visitor counter is deployed separately from
`cloudflare/visitor-counter/`; updating the static website does not deploy the
Worker.

## License and attribution

Theme code retains the upstream
[MIT License](LICENSE). Site content, research materials, publications, and
personal assets remain the property of their respective authors and rights
holders unless explicitly stated otherwise.
