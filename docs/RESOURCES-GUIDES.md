# Resources & Guides System

## Overview

The Resources & Guides system provides quick-access references for students and club members, centralizing trusted links for cybersecurity education, CTF competitions, and professional development. The system features a modern card-based interface with progressive disclosure through modal views.

## User Guide

### Purpose and Rationale

The Resources page is a quick-access reference for students and club members. It centralizes links we trust for:

- Code breaking tools and CTF utilities
- CTF competitions and club/community touchpoints
- Cybersecurity and networking certifications and CCRI-specific guidance

Design goals:
- Fast scanning: a compact grid of cards grouped by category
- Progressive disclosure: a collapsible full table for power users
- Single source of truth: one in-page data array drives both views
- Low impact: no new header tabs; deep-linkable at `#/resources`

### How to Access

- Direct link: `#/resources`
- Deep link to a category: `#/resources/ctf-competitions`, `#/resources/ctf-tools`, `#/resources/ccri`, `#/resources/cyberknights`, `#/resources/linux`, `#/resources/stem`, `#/resources/career`
- From Home: "Resources" button near hero
- From Club page (`#/cybersecurity`): "View Resources" link and tag chips under "What we do"/"Get involved"
- From Linux page (`#/linux`): "Linux Learner's Guide" link

### Categories

- **Cyberknights**: club presence and community links (Discord, GitHub) - **Default filter**
- **CCRI**: CCRI pages, standardized credit policies, vendor training, certification roadmaps
- **CTF Competitions**: common competitions and leagues (e.g., NCL, NCAE CyberGames)
- **CTF & Code Breaking Tools**: Combined category for cipher solvers, classical crypto aids, and multitool utilities (e.g., quipqiup, Boxentriq, CyberChef)
- **STEM Day**: special short-term resources (e.g., "STEM Day 2025 Cyber Game" repo)
- **Career**: professional development resources including certification roadmaps and job platforms
- **Linux**: Linux-related resources, cheat sheets, and guides

### Page Structure

- Search/filter: one input filters by name, category label, or URL
- Category chips: quick filters; "Cyberknights" selected by default; order: Cyberknights, CCRI, CTF Competitions, CTF & Code Breaking Tools, STEM Day, Career, Linux
- Cards grid: cards with name, category, and descriptions for better discoverability
- Beginner guidance: "Getting Started?" section to help new users navigate resources
- Back link: returns to `#/cybersecurity`

### User Experience Features

#### Enhanced Readability
- **Font Size Increases**: 
  - Summary text: 10px → 12px (+20%)
  - "More info" links: 9px → 11px (+22%)
  - Detailed summaries: 9px → 11px (+22%)
  - Action buttons: 10px → 12px (+20%)
- **Modal System**: Click any card to open enlarged view with 16px font for optimal reading
- **Progressive Enhancement**: Quick overview (cards) → detailed reading (modal)

#### Modal Functionality
- Click any card to open enlarged view
- Larger text for detailed reading
- Close button and click-outside-to-close
- Scrollable content for long descriptions
- Smart interaction: Card clicks open modal, button clicks navigate directly

## Maintainer Guide

### Data Model

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

### Category Mapping

Category keys map to labels (in display order):
- `cyberknights` → Cyberknights (default filter)
- `ccri` → CCRI
- `ctf-competitions` → CTF Competitions
- `ctf-tools` → CTF & Code Breaking Tools
- `stem` → STEM Day
- `career` → Career
- `linux` → Linux

### How to Add/Edit Resources

1. Append/update entries in the `data` array in `index.html`
2. Keep names short and recognizable
3. Use official URLs; avoid trackers when possible
4. Include `summary` and `detailedSummary` fields for enhanced user experience
5. If you add a new `cat`, update the chips and `catNames` mapping

### Enhanced Resource Cards

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

### UI and Behavior

- Chips filter the grid by category; a simple input filters by name, URL, or category label
- A `<details>` block renders the full table for copy/paste
- CTAs exist on Home, Club, and Linux pages to reach `#/resources`
- Deep-linking: the page reads `#/resources/<filter>` on load to preselect a chip; chip clicks update the hash (e.g., `#/resources/ctf-tools`)

## Technical Implementation

### DRY Code Implementation

#### Extracted Functions
- `getButtonText(resourceName)`: Centralized button text logic
- `getCategoryLabel(category)`: Centralized category label logic
- `getEmeraldLinkClasses()`: Reusable CSS class generator
- `getCalendarButtonClasses()`: Reusable calendar button styling
- `getExternalLinkAttributes()`: Reusable external link attributes
- `getExternalLinkIcon()`: Reusable SVG icon generator
- `getCloseIcon()`: Reusable close button icon

#### Constants
- `BASE_URL`: Centralized base URL constant
- `ROOM_4080`: Centralized room reference

#### Benefits
- ~30+ lines of duplicated code eliminated
- Easier maintenance
- Consistent behavior across all resources

### DRY Functions

```javascript
// Button text determination
function getButtonText(resourceName) {
  const name = resourceName.toLowerCase();
  if (name.includes('github')) return 'View Repository';
  if (name.includes('discord')) return 'Visit Site';
  if (name.includes('handshake')) return 'Access Handshake';
  if (name.includes('cheat sheet')) return 'View Guide';
  if (name.includes('competition')) return 'Join Competition';
  return 'Visit Site';
}

// Category label mapping
function getCategoryLabel(category) {
  return catNames[category] || category;
}
```

### Modal System

```javascript
// Modal creation and management
function openResourceModal(resource) {
  // Creates modal with enlarged content
  // Handles event propagation
  // Manages body scroll lock
}

function closeResourceModal() {
  // Cleans up modal
  // Restores scrolling
}
```

## Maintenance Guidelines

### Adding New Resources
1. Include `summary` and `detailedSummary` fields
2. Use appropriate category key
3. Button text will be determined automatically
4. Test both card and modal views

### Updating Button Text Logic
- Modify `getButtonText()` function
- Changes apply to both cards and modals
- Test with different resource types

### Font Size Adjustments
- Card summaries: `.text-[12px]` class
- Modal content: `.text-slate-300` (16px) and `.text-slate-400` (14px)
- Maintain visual hierarchy

### Data Maintenance
- Data lives inline in `index.html` in `renderResourcesPage()` as an array of objects `{ name, url, cat, desc }`
- To add a resource: append to the array and pick a category key that maps to a label
- Include optional `desc` field for resource descriptions to improve discoverability
- Keep links stable and descriptive, avoid URL tracking parameters when possible
- Prefer official sources and club-owned repos

## Testing

### Manual Testing
- [ ] Card summaries display correctly
- [ ] Modal opens on card click
- [ ] Button clicks navigate directly
- [ ] Modal closes properly
- [ ] Font sizes are readable
- [ ] All resource types work correctly

### Automated Testing
```bash
# Test resource card functionality
python tests/test_resource_cards.py

# Test modal system
python tests/test_modal_functionality.py
```

## Future Considerations

- Monitor user feedback on readability improvements
- Consider additional accessibility enhancements
- Evaluate modal usage patterns
- Maintain DRY principles for new features

## Rationale

- Quick-access reference for CTF tools/competitions and credential paths
- Single source of truth reduces upkeep and avoids content drift
- Progressive disclosure allows both quick scanning and detailed reading
- Modern card-based interface improves user experience

---

*Last Updated: 2025-09-26*  
*Related Files: `index.html`, `docs/ARCHITECTURE.md`*

## Related Documentation

- **Campus Maps**: See `docs/ARCHITECTURE.md` - Campus Maps section for building navigation and meeting location details

## Legacy Documentation

The following files were consolidated into this document:
- **`docs/RESOURCES.md`** - User-facing documentation (last updated: commit `860e9ad`)
- **`docs/RESOURCES-MAINTAINERS.md`** - Technical implementation details (last updated: commit `79c6910`)
- **`docs/RESOURCE-CARDS-ENHANCEMENT.md`** - Enhancement history (last updated: commit `922ece1`)
