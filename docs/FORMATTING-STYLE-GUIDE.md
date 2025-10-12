# Linux Cheatsheets Formatting Style Guide

## Overview

This document establishes consistent formatting patterns for all Linux cheatsheets to ensure visual coherence and improve user experience.

## Core Principles

### 1. **Semantic Consistency**
- Similar content types should always use identical formatting
- Users should be able to predict formatting based on content type
- Formatting should reinforce the hierarchy of information

### 2. **Visual Hierarchy**
- **Primary Emphasis** (Orange): Key concepts, command acronyms, important warnings
- **Secondary Emphasis** (White Bold): Important but secondary information
- **Code Elements** (Monospace): Commands, file paths, technical terms

## Formatting Rules

### Command Acronyms
**Pattern**: All parts of command acronyms must use `emphasis-text` class (orange)

✅ **Correct Examples:**
```html
<strong class="emphasis-text">CH</strong>ange <strong class="emphasis-text">MOD</strong>e
<strong class="emphasis-text">CH</strong>ange <strong class="emphasis-text">OWN</strong>er
<strong class="emphasis-text">S</strong>uper <strong class="emphasis-text">U</strong>ser <strong class="emphasis-text">Do</strong>
```

❌ **Incorrect Examples:**
```html
<strong class="emphasis-text">CH</strong>ange <strong>OWN</strong>er  <!-- OWN should be orange -->
<strong>CH</strong>ange <strong>MOD</strong>e  <!-- Both should be orange -->
```

### Technical Terms
**Pattern**: Important technical concepts use `emphasis-text` class (orange)

✅ **Correct Examples:**
```html
<strong class="emphasis-text">effective username</strong>
<strong class="emphasis-text">root (administrator) privileges</strong>
<strong class="emphasis-text">GUI program</strong>
<strong class="emphasis-text">Requires `sudo`</strong>
```

### Secondary Emphasis
**Pattern**: Less critical emphasis uses plain `<strong>` (white bold)

✅ **Correct Examples:**
```html
<strong>Owner only</strong>  <!-- In context where it's secondary info -->
<strong>None</strong>  <!-- In permission context -->
```

### Code Elements
**Pattern**: Commands, file paths, and technical terms use `command-code` class

✅ **Correct Examples:**
```html
<code class="command-code">chmod 666 file.txt</code>
<code class="command-code">sudo adduser bob</code>
<code class="command-code">whoami</code>
```

## CSS Classes Reference

### `.emphasis-text`
- **Color**: Orange (`text-ember-spark` - #f97316)
- **Weight**: Semibold (`font-semibold`)
- **Usage**: Command acronyms, key technical terms, important warnings

### `.command-code`
- **Font**: Monospace
- **Usage**: Commands, file paths, technical terms in code context

### Plain `<strong>`
- **Color**: White (default text color)
- **Weight**: Bold
- **Usage**: Secondary emphasis, less critical information

### Key Takeaways Sections
**Pattern**: Follow consistent formatting rules for summary content

✅ **Correct Examples:**
```html
<li>The <strong class="emphasis-text">Owner</strong> of a file has the power to change its permissions with <code class="command-code">chmod</code>.</li>
<li>A non-owner user, like <code class="command-code">bob</code>, cannot change permissions using <code class="command-code">chmod</code> without <code class="command-code">sudo</code>.</li>
<li><strong class="emphasis-text">Folder permissions</strong> (<code class="command-code">rwx</code> on a directory) control the ability to list contents (<code class="command-code">r</code>).</li>
```

❌ **Incorrect Examples:**
```html
<li>The <strong>Owner</strong> of a file has the power to change its permissions with <strong>chmod</strong>.</li>
<li>A non-owner user, like <strong>bob</strong>, cannot change permissions using <strong>chmod</strong>.</li>
```

## Quality Assurance Checklist

Before publishing any cheatsheet, verify:

- [ ] All command acronym parts use `emphasis-text` class
- [ ] Important technical terms use `emphasis-text` class
- [ ] Code elements use `command-code` class
- [ ] No mixed formatting within the same command explanation
- [ ] Consistent formatting across similar content types
- [ ] Key Takeaways sections follow established formatting patterns
- [ ] Commands and file names use `command-code` class in summaries

## Examples from Existing Cheatsheets

### ✅ Good Examples

**Cheatsheet 1 - pwd command:**
```html
<strong class="emphasis-text">P</strong>rint <strong class="emphasis-text">W</strong>orking <strong class="emphasis-text">D</strong>irectory
```

**Cheatsheet 3 - rmdir command:**
```html
<strong class="emphasis-text">R</strong>e<strong class="emphasis-text">m</strong>ove <strong class="emphasis-text">dir</strong>ectory
```

**Cheatsheet 5 - chmod command:**
```html
<strong class="emphasis-text">CH</strong>ange <strong class="emphasis-text">MOD</strong>e
```

**Cheatsheet 5 - chown command (FIXED):**
```html
<strong class="emphasis-text">CH</strong>ange <strong class="emphasis-text">OWN</strong>er
```

## Implementation Notes

1. **Consistency Over Creativity**: Always follow established patterns
2. **User Experience**: Consistent formatting helps users scan and understand content
3. **Maintainability**: Clear rules make it easier to maintain consistency across updates
4. **Accessibility**: Consistent formatting improves readability for all users

## Future Considerations

- Consider creating semantic CSS classes for different content types
- Document any new formatting patterns that emerge
- Regular audits to ensure consistency across all cheatsheets
- Consider automated linting to catch formatting inconsistencies

---

*This style guide should be referenced whenever creating or updating Linux cheatsheets to maintain visual and semantic consistency.*
