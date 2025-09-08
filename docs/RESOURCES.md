# Resources Page (#/resources)

## Purpose and Rationale

The Resources page is a quick-access reference for students and club members. It centralizes links we trust for:

- Code breaking tools and CTF utilities
- CTF competitions and club/community touchpoints
- Cybersecurity and networking certifications and CCRI-specific guidance

Design goals:
- Fast scanning: a compact grid of cards grouped by category
- Progressive disclosure: a collapsible full table for power users
- Single source of truth: one in-page data array drives both views
- Low impact: no new header tabs; deep-linkable at `#/resources`

## How to Access

- Direct link: `#/resources`
- From Home: small “Resources” CTA under the hero
- From Club page (`#/cybersecurity`): “View Resources” CTA near the top
- From Linux page (`#/linux`): “Further reading” link

## Categories

- Code Breaking Tools: cipher solvers and classical crypto aids (e.g., quipqiup, Boxentriq)
- CTF Tools: multitool utilities for format conversions and light transforms (e.g., CyberChef)
- CTF Competitions: common competitions and leagues (e.g., NCL, NCAE CyberGames)
- CCRI & Certs: CCRI pages, standardized credit policies, vendor training, certification roadmaps
- Cyberknights: club presence and community links (Discord, GitHub)
- STEM Day: special short-term resources (e.g., “STEM Day 2025 Cyber Game” repo)

## Page Structure

- Search/filter: one input filters by name, category label, or URL
- Category chips: quick filters; “All” selected by default
- Cards grid: minimal cards with name and category
- Full list: `<details>`/`<summary>` reveals a complete table (Name, Category, URL)
- Back link: returns to `#/cybersecurity`

## Maintenance

- Data lives inline in `index.html` in `renderResourcesPage()` as an array of objects `{ name, url, cat }`
- To add a resource: append to the array and pick a category key that maps to a label
- Category labels map:
  - `code-breaking` → “Code Breaking Tools”
  - `ctf-tools` → “CTF Tools”
  - `ctf-competitions` → “CTF Competitions”
  - `ccri` → “CCRI & Certs”
  - `clubs` → “Cyberknights”
  - `stem` → “STEM Day”

Keep links stable and descriptive, avoid URL tracking parameters when possible. Prefer official sources and club-owned repos.
