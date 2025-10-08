# Contributing to QR Code Landing Pages

Thanks for helping improve the CCRI Cybersecurity Club website!

## How to contribute

1. Fork the repo and create a branch from `main`.
2. Make your changes locally. Keep the site single-file (`index.html`) when possible.
3. Test locally by opening `index.html` in a browser and verify:
   - Navigation works via `#/` hash routes
   - External links open correctly
   - Layout looks good on mobile and desktop
   - CI/CD workflows reference valid scripts: `node tests/ci-validation/validate-workflow-scripts.js`
4. Commit with a clear message and open a pull request.

## Coding guidelines

- **Tailwind CSS**: Use utility classes with JIT configuration (see `docs/TAILWIND-IDIOMS.md`)
  - Guides/Blogs: JIT config + @layer directives (required pattern)
  - index.html: JIT config + @layer organization
  - Use custom colors: `text-ember-spark`, `bg-neon-surge`, etc.
- **Content**: Keep accessible and concise; prefer simple language
- **Build**: No build step required; uses Tailwind CDN
- **Images**: Optimize as WebP; lowercase filenames with hyphens
- **Testing**: Run `npm run test:baseline` before submitting PRs

## Commit message conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/) for consistent, automated versioning:

- `feat:` - New features or functionality
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks, dependencies, tooling
- `refactor:` - Code refactoring without changing functionality
- `test:` - Adding or updating tests
- `style:` - Code style changes (formatting, etc.)

**Examples:**
- `feat: add Linux Cheatsheet 3 with file operations guide`
- `fix: resolve mobile footer clipping issue`
- `docs: update API documentation for new endpoints`
- `chore: update dependencies to latest versions`

**Why this matters:** These prefixes enable automatic version bumping and changelog generation based on commit types.

## Content additions

- Add new pages by creating a new `<template id="page-name">` in `index.html` and extending the router object.
- Add a corresponding nav link if needed using `#/name`.
- When modifying npm scripts, validate CI/CD workflows: `node tests/ci-validation/validate-workflow-scripts.js`

## CI/CD Pipeline Validation

This project includes automated CI/CD pipeline drift prevention to ensure GitHub Actions workflows reference only existing npm scripts.

**Before committing changes to npm scripts:**
1. Update `package.json` scripts
2. Run validation: `node tests/ci-validation/validate-workflow-scripts.js`
3. Fix any workflow references if validation fails
4. Commit changes (pre-commit hook validates automatically)

**Documentation:**
- **`tests/ci-validation/README.md`** - Complete system documentation
- **`tests/ci-validation/validate-workflow-scripts.js`** - Main validation tool
- **`tests/ci-validation/pre-commit-validation.sh`** - Pre-commit hook script

## Reporting issues

Open an issue with a clear title, steps to reproduce (if applicable), and a screenshot.

## Links

- Club signup form: https://forms.cloud.microsoft/r/U26WUVJGgp
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- QR Code Standards: [docs/QR-CODE-STANDARDS.md](docs/QR-CODE-STANDARDS.md)
- Tailwind Idioms: [docs/TAILWIND-IDIOMS.md](docs/TAILWIND-IDIOMS.md)
- Calendar Integration: See ARCHITECTURE.md - Calendar Integration section
