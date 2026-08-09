# Contributing

This repository is both a personal academic homepage and a reusable template.
Pull requests should improve the shared code, documentation, accessibility,
responsive behavior, or maintenance checks.

Do not include another person's biography, publication list, CV, analytics
token, visitor data, or private files in a pull request to this repository.
Profile-specific changes belong in the contributor's fork.

## Before opening a pull request

1. Keep content changes separate from reusable template changes when possible.
2. Preserve the content, template, and style boundaries documented in the
   README.
3. Add no generated `_site/`, Bundler cache, or Playwright artifacts.
4. Run:

   ```bash
   ruby scripts/validate_site.rb --build
   ```

5. Check the homepage at desktop and mobile widths if layout or interaction
   code changed.

Describe the user-visible result and the validation performed. Link an issue
when the change addresses an existing report.

## Theme attribution

Changes to inherited Academic Pages or Minimal Mistakes code must remain
compatible with the repository's MIT license and preserve required notices.
Do not add third-party assets unless their redistribution terms are clear.
