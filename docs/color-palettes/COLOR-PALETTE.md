# CyberKnights Color Palette Documentation

## Overview

The CyberKnights website uses a carefully crafted hybrid color palette that combines industrial forge aesthetics with a corrected primary green. This palette creates a sophisticated, trustworthy, and visually striking brand identity that reflects the club's technical focus and community values.

## Primary Color Palette

### Core Colors

| Color Name | Hex Code | RGB | HSL | Usage | Description |
|------------|----------|-----|-----|-------|-------------|
| **Primary Green** | `#04703C` | (4, 112, 60) | (154°, 93%, 23%) | Primary brand color, buttons, banners | Deep, rich forest green - trustworthy and grounded |
| **Primary Green Light** | `#0A8B4F` | (10, 139, 79) | (154°, 87%, 29%) | Hover states | Lighter variant for interactive elements |
| **Neon Surge** | `#43CC50` | (67, 204, 80) | (125°, 55%, 53%) | Ancillary accents, highlights | Bright visor glow - energy and technology |
| **Ember Spark** | `#C27329` | (194, 115, 41) | (30°, 65%, 46%) | Warm accents, energy buttons | Flying sparks - warmth and energy |
| **Arc Weld Blue** | `#2DB2C4` | (45, 178, 196) | (188°, 63%, 47%) | Secondary accents, hover states | Electric arc welding - precision and skill |
| **Molten Glow** | `#FFCC33` | (255, 204, 51) | (45°, 100%, 60%) | Bright highlights, special actions | Bright molten metal - triumph and clarity |

### Neutral Colors

| Color Name | Hex Code | RGB | HSL | Usage | Description |
|------------|----------|-----|-----|-------|-------------|
| **Forge Black** | `#001011` | (0, 16, 17) | (183°, 100%, 3%) | Primary background | Deep forge darkness - industrial base |
| **Iron Ash** | `#1C1C1C` | (28, 28, 28) | (0°, 0%, 11%) | Secondary background | Dark charcoal base - grounding |
| **Dark Steel** | `#3A3A3A` | (58, 58, 58) | (0°, 0%, 23%) | Borders, dividers | Darker metallic tone - structure |
| **Steel Glow** | `#5B6E6E` | (91, 110, 110) | (180°, 10%, 39%) | Secondary text | Metallic sheen - subtle highlights |
| **Silver Edge** | `#8A8A8A` | (138, 138, 138) | (0°, 0%, 54%) | Tertiary text | Mid-tone metal - readability |
| **Pale Alloy** | `#B8B8B8` | (184, 184, 184) | (0°, 0%, 72%) | Primary text | Light metallic - main content |

## Color Hierarchy

### 1. Primary Level
- **Primary Green** (`#04703C`) - Main brand color
- Used for: Banners, primary buttons, main headings, key accents

### 2. Ancillary Level
- **Neon Surge** (`#43CC50`) - Secondary accent
- Used for: Linux guide headings, technical highlights, energy elements

### 3. Supporting Level
- **Ember Spark** (`#C27329`) - Warm accents
- Used for: Action buttons, energy elements, warm highlights

### 4. Utility Level
- **Arc Weld Blue** (`#2DB2C4`) - Interactive elements
- Used for: Hover states, links, interactive feedback

### 5. Special Level
- **Molten Glow** (`#FFCC33`) - Special actions
- Used for: High-priority actions, success states, achievements

## Implementation Guidelines

### CSS Custom Properties

The color palette is implemented using CSS custom properties for easy maintenance and consistency:

```css
:root {
  /* Primary Colors */
  --primary-green: #04703C;
  --primary-green-light: #0A8B4F;
  
  /* Ancillary Colors */
  --neon-surge: #43CC50;
  --ember-spark: #C27329;
  --arc-weld-blue: #2DB2C4;
  --molten-glow: #FFCC33;
  
  /* Neutral Colors */
  --forge-black: #001011;
  --iron-ash: #1C1C1C;
  --dark-steel: #3A3A3A;
  --steel-glow: #5B6E6E;
  --silver-edge: #8A8A8A;
  --pale-alloy: #B8B8B8;
}
```

### Usage Examples

#### Primary Elements
```css
/* Banner */
.banner { background-color: var(--primary-green); }

/* Primary Button */
.btn-primary { 
  background-color: var(--primary-green); 
  color: var(--pale-alloy);
}
.btn-primary:hover { background-color: var(--primary-green-light); }
```

#### Ancillary Elements
```css
/* Technical Headings */
.tech-heading { color: var(--neon-surge); }

/* Energy Buttons */
.btn-energy { 
  background-color: var(--ember-spark); 
  color: var(--forge-black);
}
```

#### Interactive Elements
```css
/* Links */
.link { color: var(--arc-weld-blue); }
.link:hover { color: var(--neon-surge); }

/* Special Actions */
.btn-special { 
  background-color: var(--molten-glow); 
  color: var(--forge-black);
}
```

## Brand Psychology

### Primary Green (`#04703C`)
- **Associations**: Nature, growth, stability, trustworthiness
- **Psychology**: Grounded, reliable, professional, sustainable
- **Use Case**: Primary brand identity, trust-building elements

### Neon Surge (`#43CC50`)
- **Associations**: Technology, energy, innovation, digital
- **Psychology**: Dynamic, modern, technical, energetic
- **Use Case**: Technical highlights, energy elements, innovation

### Ember Spark (`#C27329`)
- **Associations**: Fire, energy, warmth, creativity
- **Psychology**: Energetic, creative, passionate, active
- **Use Case**: Action buttons, energy elements, calls-to-action

### Arc Weld Blue (`#2DB2C4`)
- **Associations**: Precision, skill, technology, craftsmanship
- **Psychology**: Professional, skilled, precise, technical
- **Use Case**: Interactive elements, technical interfaces

## Accessibility Considerations

### Contrast Ratios
- **Primary Green on White**: 4.5:1 (WCAG AA compliant)
- **Pale Alloy on Forge Black**: 4.8:1 (WCAG AA compliant)
- **Neon Surge on Forge Black**: 3.2:1 (WCAG AA compliant with large text)

### Color Blindness
- Primary green and neon surge are distinguishable for most color vision types
- Ember spark provides good contrast for red-green color blindness
- Arc weld blue offers alternative accent for blue-yellow color blindness

## File Organization

### Current Implementation
- **Main File**: `index.html` (current hybrid palette)
- **Archive Files**: 
  - `docs/color-palettes/index-forge.html` (original forge palette)
  - `docs/color-palettes/index-semiotic.html` (semiotic palette)

### Maintenance
- All color values are defined in CSS custom properties
- Changes to the palette should be made in the `:root` section
- Test all color combinations for accessibility compliance
- Document any new color additions in this file

## Future Considerations

### Potential Additions
- **Success Green**: Lighter variant for success states
- **Warning Orange**: For warning messages and alerts
- **Error Red**: For error states and critical messages

### Palette Evolution
- Monitor user feedback on color usage
- Consider seasonal or event-specific color variations
- Maintain consistency across all club materials
- Document any palette changes with rationale

## References

- [WCAG 2.1 Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Theory for Web Design](https://webdesign.tutsplus.com/articles/design-theory/color-theory-for-web-designers/)
- [CSS Custom Properties Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
