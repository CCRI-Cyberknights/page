# Mobile UX Guide

## Principles

- Prioritize clear flow: input → settings → preview → action
- Use white space intentionally to focus attention on the QR preview and key CTAs
- Keep controls compact; avoid verbose copy

## Patterns Used

- Hamburger menu toggles mobile nav; closes on route change
- Footer QR panel width ≈ 500px max (≤ 90vw)
- Settings grouped into a small panel above the QR preview
- Cards and chips for compact scanning on `#/resources`
 - Chips support deep-linking (e.g., `#/resources/ctf-competitions`) and update the URL when tapped

## Breakpoints

- `sm:` used to reveal desktop nav and multi-column grids
- Single-column stacking on smaller screens

## Tips

- Prefer centered buttons for primary actions
- Avoid placing two primary CTAs in the same row on small screens
