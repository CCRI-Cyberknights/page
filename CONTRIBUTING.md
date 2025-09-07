# Contributing to QR Code Landing Pages

Thanks for helping improve the CCRI Cybersecurity Club website!

## How to contribute

1. Fork the repo and create a branch from `main`.
2. Make your changes locally. Keep the site single-file (`index.html`) when possible.
3. Test locally by opening `index.html` in a browser and verify:
   - Navigation works via `?page=` query parameters
   - External links open correctly
   - Layout looks good on mobile and desktop
4. Commit with a clear message and open a pull request.

## Coding guidelines

- Use Tailwind CSS utility classes (CDN) for styling.
- Keep content accessible and concise; prefer simple language.
- Avoid adding a build step; keep GitHub Pages simple.
- Optimize images (PNG/JPG/WebP) and keep filenames lowercase with hyphens.

## Content additions

- Add new pages by creating a new `<template id="page-name">` in `index.html` and extending the router object.
- Add a corresponding nav link if needed using `?page=name`.

## Reporting issues

Open an issue with a clear title, steps to reproduce (if applicable), and a screenshot.

## Links

- Club signup form: https://forms.cloud.microsoft/r/U26WUVJGgp
- Architecture: ./docs/ARCHITECTURE.md
- QR Codes: ./docs/QR-CODES.md
- Calendar (maintainers): ./CALENDAR-UPDATING.md
