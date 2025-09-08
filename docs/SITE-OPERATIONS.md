# Site Operations

## GitHub Pages

- Source: Deploy from a branch → `main` → `/ (root)`
- `.nojekyll` present at repo root
- Public URL after rename: `https://ccri-cyberknights.github.io/page/`

## Repository Rename

- Repo renamed to `page` (from `qr-code-landing-pages`)
- GitHub provides redirects for the repo URL; update docs/links proactively

## Local Preview

- Open `index.html` directly in a browser, or
- Serve statically with `python -m http.server` to test hash routes

## Maintenance Checklist

- After moving/renaming a doc, update links in:
  - `index.html` constants
  - README and docs indices
- Prefer hash routes; avoid `?page=` style links
- Keep assets as WebP; remove older PNGs
