# Shiyu Hu Academic Homepage

This repository contains the source for
[hushiyu1995.com](https://hushiyu1995.com). It is also a reusable Jekyll
template for researchers who want a publication-focused homepage without a
database or a JavaScript framework.

The site runs on GitHub Pages. Its original structure came from
[Academic Pages](https://github.com/academicpages/academicpages.github.io) and
[Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes), but unused
blog, archive, comment, taxonomy, lightbox, and jQuery features have been
removed. The remaining layouts, academic content model, responsive styles,
publication browser, and visitor-statistics interface are maintained here.

## Use this repository as a template

The safest route is to publish the fork as a GitHub user site:

1. Fork this repository and rename the fork to `<your-username>.github.io`.
2. Open **Settings**, then **Pages**, and publish the `main`
   branch from the repository root.
3. Follow [the fork guide](docs/FORKING.md) before making the repository public.
4. Replace the profile image, CV, site metadata, content files, and links.
5. Run the fork identity audit and the normal validation suite:

   ```bash
   ruby scripts/audit_fork_identity.rb
   ruby scripts/validate_site.rb --build
   ```

The identity audit intentionally fails in this original repository. In a fork,
it identifies any remaining Shiyu-specific name, email, domain, analytics, or
visitor-counter configuration.

Do not publish a fork before replacing the files under `files/` and `images/`.
They include personal and research assets, not generic template data.

## What the homepage includes

- a compact author profile and research introduction;
- dated news with automatic six-month collapsing;
- work and education timelines with optional details;
- a research narrative, project cards, honors, and service records;
- publication sections organized by authorship and output type;
- independent controls for collaborative papers and preprints;
- optional Cloudflare Web Analytics and first-party visitor statistics;
- responsive desktop and mobile layouts.

The public site is English-only. Paper titles, venue names, author lists, and
download links remain ordinary Markdown or HTML, so they can be updated without
changing the templates.

## Repository map

| Path | What to edit there |
| --- | --- |
| `_config.yml` | Site metadata, author profile, analytics, visitor settings, and update month |
| `_data/navigation.yml` | Header navigation |
| `_pages/about.md` | Minimal homepage entry point; usually no edits are needed |
| `_includes/home/homepage.html` | Homepage section order |
| `_includes/home/content/` | Public biography, news, background, projects, honors, service, and contact details |
| `_includes/home/content/publications/` | Publication records grouped by authorship and output type |
| `_includes/home/` | Shared section, publication, statistics, footer, and script templates |
| `images/` | Profile image, institutional emblems, and publication figures |
| `files/` | Public CV, papers, posters, slides, and other downloads |
| `assets/css/main.scss` | Ordered stylesheet entry point |
| `_sass/_homepage-*.scss` | Homepage foundation, layout, polish, and section rules |
| `_sass/_academic-template.scss` | Design tokens and final visual refinements |
| `assets/js/` | News, publication, and visitor interactions |
| `cloudflare/visitor-counter/` | Optional Cloudflare Worker and D1 counter |
| `scripts/` | Source, asset, fork, and production-build checks |

The nine content files under `_includes/home/content/` map directly to the
homepage sections:

```text
intro.md          identity and primary links
news.md           dated updates
background.md     work and education
research.md       research trajectory and directions
publications.md   publication section composition
projects.md       software, platforms, and funded work
honors.md         awards and honors
activity.md       talks, tutorials, reviewing, and service
contact.md        public contact channels
```

Detailed publication records live in:

```text
publications/monograph.md
publications/lead-author.md
publications/collaborative.md
publications/workshop.md
publications/preprints.md
```

This separation keeps prose and academic records out of the shared templates.
It also lets a fork remove an unused section without rewriting the rest of the
page.

## Local development

The GitHub Actions workflow uses Ruby 3.3. Use the same major version locally
when possible.

```bash
bundle install
bundle exec jekyll serve --config _config.yml,_config.dev.yml
```

Open [http://localhost:4000](http://localhost:4000). The development config
disables analytics and visitor requests, then expands CSS output for debugging.

Run a production build with all repository checks:

```bash
ruby scripts/validate_site.rb --build
```

The command checks homepage composition, local file references, public assets,
JavaScript syntax, Git whitespace, the Jekyll build, rendered section order,
and duplicate HTML IDs.

Node packages are not required. Homepage behavior is implemented in five
small, dependency-free scripts under `assets/js/`; the obsolete jQuery theme
bundle and its build toolchain are intentionally not retained.

## Common updates

### Change the profile

Edit `_config.yml`, replace `images/profile.jpg`, and replace
`files/CV-EN.pdf`. Update `_includes/home/content/intro.md` and `contact.md` for
the longer biography and public email addresses.

### Add a publication

1. Choose the appropriate file under
   `_includes/home/content/publications/`.
2. Give the record a stable, unique HTML `id`.
3. Put figures in `images/` and public downloads in `files/`.
4. Link related news entries to the same publication ID.
5. Confirm the title, status, venue, author order, and links against the CV.

The lead-author and corresponding-author section remains fully visible.
Collaborative papers and preprints use their own independent controls.

### Add news or an honor

Add the newest news entry at the top of `news.md` using `YYYY.MM`. The script
keeps the latest six calendar months visible. Add new honors at the top of
`honors.md`; the first seven remain visible by default.

### Change the section order

Reorder the capture/include blocks in `_includes/home/homepage.html`, then
update the expected order in `scripts/validate_site.rb`. Keep section headings
in the shared template rather than duplicating them in content files.

### Change the visual style

Start with the `--academic-*` tokens in `_sass/_academic-template.scss`.
Homepage styles load in this order:

```scss
@import "homepage-foundation";
@import "homepage-layout";
@import "homepage-polish";
@import "homepage-sections";
@import "academic-template";
```

Later layers intentionally refine earlier rules. Keep the import order stable.

## Optional analytics and visitor statistics

Cloudflare Web Analytics and the public visitor panel are independent.

To disable Web Analytics, set:

```yaml
analytics:
  provider: false
```

To disable the visitor panel and its JavaScript request, set:

```yaml
visitor_insights:
  enabled: false
```

To use the visitor panel, replace its endpoints, legacy count, and explanatory
note under `visitor_insights` in `_config.yml`. Deploy your own Worker and D1
database by following
[cloudflare/visitor-counter/README.md](cloudflare/visitor-counter/README.md).
Never reuse this site's endpoint, database identifier, or analytics token in a
fork.

## Public assets

- Keep only files that visitors should be able to download.
- Use stable, descriptive filenames and update every reference when renaming.
- Avoid duplicate exports and copy-style names such as `paper copy.pdf`.
- Keep individual files below 95 MiB. Files above 50 MiB produce a warning.
- Removing a large file from the current tree does not remove it from Git
  history.

The asset validator checks local references and exact duplicate files. It does
not decide whether a document is private or licensed for redistribution.

## Deployment

This repository publishes the `main` branch through GitHub Pages. The
`CNAME` file assigns the custom domain. Delete `CNAME` if the fork will use only
its `github.io` address, or replace it before configuring another custom domain.

GitHub Actions runs the validation suite on pushes to `main`, pull requests,
and manual workflow dispatches. After a successful push, verify the Pages
deployment and test the canonical URL in a private browser window.

For project sites that are not named `<username>.github.io`, set `url` and
`baseurl` according to the repository path and prefer `relative_url` for local
assets. The user-site naming scheme requires fewer changes and is the supported
fork path in this guide.

## Contributing

Bug fixes and reusable template improvements are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Do not submit
personal profile content, private documents, or unrelated publication updates
to the upstream repository.

## License and attribution

The inherited theme code remains available under the
[MIT License](LICENSE). Personal content, publication files, research figures,
institutional marks, and other third-party assets retain their original rights.
Forking the code does not grant permission to republish those assets.
