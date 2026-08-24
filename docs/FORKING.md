# Forking checklist

This guide turns a fork into a separate academic homepage. Complete the
identity and asset steps before enabling GitHub Pages, especially if the fork
is public.

## 1. Create the GitHub Pages repository

Fork the repository, then rename the fork to `<your-username>.github.io`.
GitHub Pages treats that name as your user site and publishes it at
`https://<your-username>.github.io`.

In **Settings**, open **Pages**, choose **Deploy from a branch**, select
`main`, and use the repository root. GitHub documents the current Pages setup in
[Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

If you keep a different repository name, the site becomes a project site. Set
`baseurl` to `/<repository-name>` and review all absolute links before
publishing.

## 2. Replace site and author metadata

Edit `_config.yml` first:

```yaml
title: "Your Name"
name: "Your Name"
description: "A concise description of your current research."
url: "https://your-username.github.io"
baseurl: ""
repository: "your-username/your-username.github.io"
timezone: "Your/Timezone"

homepage:
  last_updated: "YYYY-MM"

author:
  name: "Your Name"
  avatar: "profile.jpg"
  bio: "Your short sidebar biography."
  location: "City or country"
  email: "you@example.edu"
  github: "your-username"
```

Remove social fields that you do not use. Empty or obsolete accounts should
not remain in the public profile.

Then update:

- `_data/navigation.yml` for the header;
- `_includes/home/content/intro.md` for the main biography;
- `_includes/home/content/contact.md` for public contact channels;
- `_includes/home/footer.html` for footer text if needed;
- `_pages/terms.md` if analytics or visitor data practices change.

## 3. Replace personal and research assets

Replace `images/profile.jpg` and `files/CV-EN.pdf`. Review every remaining file
under `images/` and `files/`. Delete publications, slides, posters, CVs,
institutional emblems, or photographs that you do not have permission to
republish.

The template does not require a fixed set of publication images. Remove an
image and its corresponding card together.

Run:

```bash
ruby scripts/audit_fork_identity.rb
```

The audit reports remaining references to Shiyu Hu's name, email addresses,
domains, GitHub account, Cloudflare token, and visitor-counter identifiers. A
completed fork should pass with no matches.

The script checks text configuration and content. It cannot recognize personal
information embedded inside PDFs or images, so those assets still require
manual review.

## 4. Replace the academic content

Edit the files in `_includes/home/content/`. Each file owns one homepage
section. Publication records are divided further under
`_includes/home/content/publications/`.

You may remove a section by deleting its capture/include block from
`_includes/home/homepage.html`. Also remove its navigation link and update the
expected section order in `scripts/validate_site.rb`.

Keep publication IDs unique and stable. News links such as `/#paper-id` depend
on those IDs.

## 5. Choose a domain

Delete `CNAME` if you will use only the default `github.io` address. For a
custom domain, replace its contents with your domain and follow GitHub's
[custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

Configure DNS only after the GitHub Pages repository is under your control.
Do not leave `hushiyu1995.com` in a fork.

## 6. Choose analytics and visitor features

The simplest privacy-preserving fork disables both optional services:

```yaml
analytics:
  provider: false

visitor_insights:
  enabled: false
```

If you use Cloudflare Web Analytics, replace `analytics.cloudflare_token` with
your token. If you use the public visitor panel, deploy a separate Worker and
D1 database, then replace all fields under `visitor_insights`.

The public panel can operate without historical data. Set `legacy_count: 0`
and write a note that describes only your own counting period. The JavaScript
scales the estimated legacy regional values to zero in that configuration.

Review `_pages/terms.md` after changing either service.

## 7. Install and validate

Use Ruby 3.3 when possible because it matches the CI workflow and the secure
dependency floors in `Gemfile`.

```bash
bundle install
bundle exec jekyll serve --config _config.yml,_config.dev.yml
```

Before publishing:

```bash
ruby scripts/audit_fork_identity.rb
ruby scripts/validate_site.rb --build
```

Inspect the homepage at a desktop width and near `390 × 844`. Test the mobile Menu, profile Links, News,
Publications, Honors, education-details, and visitor-statistics controls that
remain enabled.

## 8. Publish

Commit the personalized content and push `main`. Wait for both the validation
workflow and the GitHub Pages deployment to finish. Check the public URL in a
private browser window so a cached local build does not hide missing assets.

If GitHub Pages fails, inspect the Actions log first. Common causes include an
invalid YAML value, a missing local file, a duplicate publication ID, or a
project-site `baseurl` that does not match the repository name.
