# Routing and Navigation

## Hash Routing

- URLs use `#/page` (e.g., `#/home`, `#/cybersecurity`, `#/linux`, `#/calendar`, `#/resources`).
- On load, a normalizer converts legacy `?page=` URLs to hash routes via `history.replaceState`.
- Router logic lives in `index.html` and re-renders on `hashchange`.

## Mobile Navigation

- A hamburger button toggles a mobile nav (`#site-nav-mobile`).
- `aria-expanded` is updated for accessibility.
- Mobile nav auto-closes on route change.

## Adding a Route

1. Add a `<template id="page-yourid">`.
2. Register it in the `routes` map in `index.html`.
3. Link using `#/yourid` (avoid modifying the primary header nav unless essential).
