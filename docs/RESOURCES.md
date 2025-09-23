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
- Deep link to a category: `#/resources/ctf-competitions`, `#/resources/ctf-tools`, `#/resources/code-breaking`, `#/resources/ccri`, `#/resources/cyberknights`, `#/resources/linux`, `#/resources/stem`
- From Home: “Resources” button near hero
- From Club page (`#/cybersecurity`): “View Resources” link and tag chips under “What we do”/“Get involved”
- From Linux page (`#/linux`): "Linux Learner's Guide" link

## Categories

- CTF & Code Breaking Tools: Combined category for cipher solvers, classical crypto aids, and multitool utilities (e.g., quipqiup, Boxentriq, CyberChef)
- CTF Competitions: common competitions and leagues (e.g., NCL, NCAE CyberGames)
- CCRI & Certs: CCRI pages, standardized credit policies, vendor training, certification roadmaps
- Cyberknights: club presence and community links (Discord, GitHub) - **Default filter**
- Linux: Linux-related resources, cheat sheets, and guides
- STEM Day: special short-term resources (e.g., "STEM Day 2025 Cyber Game" repo)

## Page Structure

- Search/filter: one input filters by name, category label, or URL
- Category chips: quick filters; "Cyberknights" selected by default; order: Cyberknights, CCRI & Certs, CTF Competitions, CTF & Code Breaking Tools, STEM Day, Linux
- Cards grid: cards with name, category, and descriptions for better discoverability
- Beginner guidance: "Getting Started?" section to help new users navigate resources
- Back link: returns to `#/cybersecurity`

## Maintenance

- Data lives inline in `index.html` in `renderResourcesPage()` as an array of objects `{ name, url, cat, desc }`
- To add a resource: append to the array and pick a category key that maps to a label
- Include optional `desc` field for resource descriptions to improve discoverability
- Category labels map:
  - `ctf-tools` → "CTF & Code Breaking Tools"
  - `ctf-competitions` → "CTF Competitions"
  - `ccri` → "CCRI & Certs"
  - `cyberknights` → "Cyberknights" (default filter)
  - `linux` → "Linux"
  - `stem` → "STEM Day"

Keep links stable and descriptive, avoid URL tracking parameters when possible. Prefer official sources and club-owned repos.
