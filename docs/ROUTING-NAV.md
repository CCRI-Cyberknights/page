# Routing and Navigation

## Hash Routing

- URLs use `#/page` (e.g., `#/home`, `#/cybersecurity`, `#/linux`, `#/calendar`, `#/resources`).
- Resources supports optional subpaths for preselected filters: `#/resources/<filter>` where `<filter>` is one of `all`, `code-breaking`, `ctf-tools`, `ctf-competitions`, `ccri`, `cyberknights`, `stem`.
- Maps use campus-specific routes: `#/map-{campus}-{room}` (e.g., `#/map-warwick-4080`).
- On load, a normalizer converts legacy `?page=` URLs to hash routes via `history.replaceState`.
- Router logic lives in `index.html` and re-renders on `hashchange`.

## Navigation Design

- Simplified direct navigation with no hamburger menu.
- Navigation is always visible and responsive across all screen sizes.
- Clean header design featuring only the CyberKnights logo and navigation links.

## Adding a Route

1. Add a `<template id="page-yourid">`.
2. Register it in the `routes` map in `index.html`.
3. Link using `#/yourid` (avoid modifying the primary header nav unless essential).
