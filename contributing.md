# Contributing

Thanks for helping improve this site. This is a static HTML/CSS/JS project with Markdown docs.

## Formatting & Linting

- EditorConfig and markdownlint are configured at the repo root.
- Install the recommended VS Code extensions when prompted:
  - markdownlint (DavidAnson.vscode-markdownlint)
  - EditorConfig (EditorConfig.EditorConfig)
- Defaults:
  - LF line endings
  - 2 spaces indentation
  - Markdown: keep trailing double-spaces, blank lines around headings/lists

## Content Guidelines

- Public messaging: “Sample of 10 verified use cases” and one sales-focused guide.
- Hidden pages must be both `noindex` and disallowed in `robots.txt`.
- Only public pages should be listed in `sitemap.xml`.
- Use canonical URLs and consistent Open Graph/Twitter metadata.

## Redirects & Hidden Content

- Keep `_redirects` accurate. Removed guides should 301 to `/implementation-guides/professional-sales-teams.html`.
- Do not link to hidden pages from public pages (even in comments).

## PR Checklist

- [ ] Markdown passes linting (spacing around headings/lists, no tabs)
- [ ] No references to removed/hidden pages on public surfaces
- [ ] JSON-LD valid and not duplicated
- [ ] Sitemap and robots reflect current public pages

## Local verification (optional)

- Open changed Markdown files in VS Code to see lint underlines.
- Preview HTML in a local server or the browser.
