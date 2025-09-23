# Resources Page – Maintainers

## Data Model

Resources are defined in `index.html` inside `renderResourcesPage()` as:

```js
{ 
  name: 'CyberChef', 
  url: 'https://cyberchef.io/', 
  cat: 'ctf-tools',
  desc: 'Optional short description',
  summary: 'One-sentence summary for card display',
  detailedSummary: 'Comprehensive paragraph description for modal'
}
```

Category keys map to labels (in display order):
- `cyberknights` → Cyberknights (default filter)
- `ccri` → CCRI
- `ctf-competitions` → CTF Competitions
- `ctf-tools` → CTF & Code Breaking Tools
- `stem` → STEM Day
- `career` → Career
- `linux` → Linux

## How to Add/Edit

1. Append/update entries in the `data` array.
2. Keep names short and recognizable.
3. Use official URLs; avoid trackers when possible.
4. Include `summary` and `detailedSummary` fields for enhanced user experience.
5. If you add a new `cat`, update the chips and `catNames` mapping.

## Enhanced Resource Cards

Resources now support comprehensive descriptions with:
- **Summary**: One-sentence description visible on cards (12px font)
- **Detailed Summary**: Comprehensive description accessible via modal (16px font)
- **Modal System**: Click any card to open enlarged view with better readability
- **Action Buttons**: Dynamic button text based on resource type (Visit Site, View Repository, etc.)

### Recent Enhancements

All major resources now include detailed descriptions covering:
- **Cyberknights Resources**: GitHub organization details, Discord community aspects, student club information
- **CCRI Resources**: Program overviews, credit awards with specific CompTIA examples and cost savings
- **CTF Competitions**: NCL and NCAE detailed competition information and preparation support
- **Career Resources**: Certification roadmaps and professional development pathways

These descriptions provide users with comprehensive context about each resource's purpose, benefits, and practical applications.

## UI and Behavior

- Chips filter the grid by category; a simple input filters by name, URL, or category label.
- A `<details>` block renders the full table for copy/paste.
- CTAs exist on Home, Club, and Linux pages to reach `#/resources`.
- Deep-linking: the page reads `#/resources/<filter>` on load to preselect a chip; chip clicks update the hash (e.g., `#/resources/ctf-tools`).

## Rationale

- Quick-access reference for CTF tools/competitions and credential paths.
- Single source of truth reduces upkeep and avoids content drift.
