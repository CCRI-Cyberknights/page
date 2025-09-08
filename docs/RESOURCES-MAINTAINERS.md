# Resources Page – Maintainers

## Data Model

Resources are defined in `index.html` inside `renderResourcesPage()` as:

```js
{ name: 'CyberChef', url: 'https://cyberchef.io/', cat: 'ctf-tools' }
```

Category keys map to labels:
- `code-breaking` → Code Breaking Tools
- `ctf-tools` → CTF Tools
- `ctf-competitions` → CTF Competitions
- `ccri` → CCRI & Certs
- `cyberknights` → Cyberknights
- `stem` → STEM Day

## How to Add/Edit

1. Append/update entries in the `data` array.
2. Keep names short and recognizable.
3. Use official URLs; avoid trackers when possible.
4. If you add a new `cat`, update the chips and `catNames` mapping.

## UI and Behavior

- Chips filter the grid by category; a simple input filters by name, URL, or category label.
- A `<details>` block renders the full table for copy/paste.
- CTAs exist on Home, Club, and Linux pages to reach `#/resources`.
- Deep-linking: the page reads `#/resources/<filter>` on load to preselect a chip; chip clicks update the hash (e.g., `#/resources/ctf-tools`).

## Rationale

- Quick-access reference for CTF tools/competitions and credential paths.
- Single source of truth reduces upkeep and avoids content drift.
