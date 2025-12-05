# Card Interaction Enhancement Plan

**Status**: PLANNING
**Priority**: P2
**Created**: 2025-10-10
**Last Updated**: 2025-10-10
**Target Consolidation**: `docs/UI.md`

## Overview

This document outlines the plan for implementing comprehensive card interaction enhancements including visual history indicators, color-based categorization, universal tagging, and improved mobile responsiveness.

## Current State Analysis

### Existing Features
1. **Card System**: Resource cards with hover effects
2. **Categories**: `cat` property (ctf-tools, ccri, linux, blog)
3. **Tagging**: Only implemented for blog posts with clickable hashtags
4. **Modal System**: `expandElement()` and `openResourceModal()` for card expansion
5. **Search**: Resource search with filtering

### Current Issues
1. No visual indicator for recently viewed cards
2. No color-based categorization system
3. Tags only work for blogs, not guides/resources
4. Blog view mobile layout issues
5. Tags in blog listing view aren't clickable
6. Inconsistent tagging behavior across different views

---

## Implementation Plan

### 1. Visual History Indicator System

**Goal**: Show which card was most recently viewed using a visual indicator (border glow effect)

**Implementation**:
```javascript
// Card History Manager
class CardHistoryManager {
  constructor() {
    this.lastViewedCard = null;
    this.historyKey = 'card-history';
  }
  
  // Mark card as viewed
  markAsViewed(resourceName) {
    // Remove previous indicator
    if (this.lastViewedCard) {
      this.lastViewedCard.classList.remove('card-recently-viewed');
    }
    
    // Find and mark new card
    const cards = document.querySelectorAll('[data-resource-name]');
    const targetCard = Array.from(cards).find(card => 
      card.dataset.resourceName === resourceName
    );
    
    if (targetCard) {
      targetCard.classList.add('card-recently-viewed');
      this.lastViewedCard = targetCard;
      
      // Fade out after 3 seconds
      setTimeout(() => {
        targetCard.classList.add('card-history-fade');
      }, 3000);
    }
    
    // Persist to localStorage
    localStorage.setItem(this.historyKey, resourceName);
  }
  
  // Restore history on page load
  restoreHistory() {
    const lastViewed = localStorage.getItem(this.historyKey);
    if (lastViewed) {
      this.markAsViewed(lastViewed);
    }
  }
}
```

**CSS**:
```css
/* Recently viewed indicator */
.card-recently-viewed {
  border-color: #3b82f6 !important; /* Blue */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  animation: pulse-once 0.5s ease-out;
}

.card-recently-viewed.card-history-fade {
  animation: fade-history 1s ease-out forwards;
}

@keyframes pulse-once {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes fade-history {
  to {
    border-color: inherit;
    box-shadow: none;
  }
}
```

**Integration**:
- Initialize `CardHistoryManager` on page load
- Call `markAsViewed()` when `openResourceModal()` is triggered
- Restore history on resources page render

---

### 2. Color-Based Categorization System

**Goal**: Assign colors to topic categories (AI, cryptography, forensics, etc.)

**Data Structure**:
```javascript
// Topic color mapping
const TOPIC_COLORS = {
  // Primary topics
  'ai': {
    primary: '#8b5cf6',    // Purple
    border: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.5)',
    label: 'AI & Machine Learning'
  },
  'cryptography': {
    primary: '#f59e0b',    // Amber
    border: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.5)',
    label: 'Cryptography'
  },
  'forensics': {
    primary: '#ef4444',    // Red
    border: '#f87171',
    glow: 'rgba(239, 68, 68, 0.5)',
    label: 'Digital Forensics'
  },
  'web-security': {
    primary: '#06b6d4',    // Cyan
    border: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.5)',
    label: 'Web Security'
  },
  'networking': {
    primary: '#10b981',    // Emerald
    border: '#34d399',
    glow: 'rgba(16, 185, 129, 0.5)',
    label: 'Networking'
  },
  'linux': {
    primary: '#14b8a6',    // Teal
    border: '#2dd4bf',
    glow: 'rgba(20, 184, 166, 0.5)',
    label: 'Linux'
  },
  'default': {
    primary: '#10b981',    // Emerald (default)
    border: '#34d399',
    glow: 'rgba(16, 185, 129, 0.5)',
    label: 'General'
  }
};

// Function to get topic from resource
function getResourceTopic(resource) {
  // Check explicit topic field first
  if (resource.topic) return resource.topic;
  
  // Infer from category
  if (resource.cat === 'ctf-tools') {
    // Check name/description for topic hints
    const text = `${resource.name} ${resource.desc}`.toLowerCase();
    if (/crypt|cipher|encode|decode/.test(text)) return 'cryptography';
    if (/forensic|memory|disk|artifact/.test(text)) return 'forensics';
    if (/web|xss|sqli|injection/.test(text)) return 'web-security';
    if (/network|packet|wireshark|tcpdump/.test(text)) return 'networking';
  }
  
  if (resource.cat === 'linux') return 'linux';
  
  // Default
  return 'default';
}
```

**Card Rendering Update**:
```javascript
// In renderResourcesPage, update card creation
const topic = getResourceTopic(r);
const colors = TOPIC_COLORS[topic] || TOPIC_COLORS.default;

card.style.borderColor = colors.border;
card.dataset.topic = topic;

// Add topic indicator
const topicBadge = document.createElement('div');
topicBadge.className = 'topic-badge';
topicBadge.style.backgroundColor = colors.primary;
topicBadge.textContent = colors.label;
card.appendChild(topicBadge);
```

**CSS**:
```css
.topic-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}
```

---

### 3. Universal Tagging System

**Goal**: Extend tagging to all resources, not just blog posts

**Data Structure Update**:
```javascript
// Add tags to all resources in guides.json
{
  "title": "Linux Cheatsheet 1",
  "file": "linux-cheatsheet-1.html",
  "category": "linux",
  "tags": ["linux", "terminal", "commands", "beginner"],
  "topic": "linux"
}

// Add tags to resources in index.html data array
{
  name: 'CyberChef',
  url: 'https://cyberchef.io/',
  cat: 'ctf-tools',
  tags: ['ctf', 'encoding', 'decoding', 'cryptography'],
  topic: 'cryptography'
}
```

**Tag Rendering Function**:
```javascript
function renderTags(tags, compact = false) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return '';
  
  const tagElements = tags.map(tag => {
    const colors = getTagColor(tag); // Determine color from tag content
    return `
      <a href="#/search?q=${encodeURIComponent(tag)}" 
         class="resource-tag ${compact ? 'tag-compact' : ''}"
         data-tag="${tag}"
         style="background-color: ${colors.bg}; color: ${colors.text};"
         onclick="handleTagClick(event, '${tag}')">
        #${tag}
      </a>
    `;
  }).join('');
  
  return `<div class="resource-tags">${tagElements}</div>`;
}

function getTagColor(tag) {
  const lowerTag = tag.toLowerCase();
  
  // Map tags to topic colors
  if (/ai|machine|learning|ml/.test(lowerTag)) {
    return { bg: '#8b5cf6', text: '#ffffff' };
  }
  if (/crypt|cipher|encode|hash/.test(lowerTag)) {
    return { bg: '#f59e0b', text: '#ffffff' };
  }
  if (/forensic|memory|artifact/.test(lowerTag)) {
    return { bg: '#ef4444', text: '#ffffff' };
  }
  if (/web|xss|sqli|security/.test(lowerTag)) {
    return { bg: '#06b6d4', text: '#ffffff' };
  }
  if (/network|packet|tcp/.test(lowerTag)) {
    return { bg: '#10b981', text: '#ffffff' };
  }
  if (/linux|terminal|bash/.test(lowerTag)) {
    return { bg: '#14b8a6', text: '#ffffff' };
  }
  
  // Default
  return { bg: '#64748b', text: '#ffffff' };
}
```

**CSS**:
```css
.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.resource-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.resource-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.resource-tag.tag-compact {
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
}
```

---

### 4. Clickable Tags in All Views

**Goal**: Make tags clickable everywhere they appear

**Unified Tag Click Handler**:
```javascript
function handleTagClick(event, tag) {
  event.preventDefault();
  event.stopPropagation(); // Prevent card onclick from firing
  
  // Navigate to resources with search query
  window.location.hash = `#/resources?search=${encodeURIComponent(tag)}`;
  
  // Trigger search
  setTimeout(() => {
    const searchInput = document.querySelector('#resource-search');
    if (searchInput) {
      searchInput.value = tag;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, 100);
}
```

**Blog Post Tags Update**:
```javascript
// Update makeHashtagsClickable to use unified handler
function makeHashtagsClickable() {
  const blogContainer = document.getElementById('blogs-content');
  if (!blogContainer) return;
  
  const hashtags = blogContainer.querySelectorAll('span');
  
  hashtags.forEach(hashtag => {
    if (hashtag.textContent && hashtag.textContent.startsWith('#')) {
      const tagText = hashtag.textContent.replace('#', '');
      
      const link = document.createElement('a');
      link.href = `#/resources?search=${encodeURIComponent(tagText)}`;
      link.className = hashtag.className + ' cursor-pointer hover:bg-slate-600 transition-colors';
      link.textContent = hashtag.textContent;
      link.onclick = (e) => {
        e.preventDefault();
        handleTagClick(e, tagText);
      };
      
      hashtag.parentNode.replaceChild(link, hashtag);
    }
  });
}
```

---

### 5. Mobile Blog Layout Fix

**Goal**: Fix blog listing view on mobile

**Issues**:
- Cards too wide on mobile
- Tags not displaying properly
- Spacing issues

**CSS Updates**:
```css
/* Mobile blog listing improvements */
@media (max-width: 767px) {
  #blogs-content .blog-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  #blogs-content .blog-card-title {
    font-size: 1.125rem;
    line-height: 1.5;
  }
  
  #blogs-content .blog-card-description {
    font-size: 0.875rem;
    line-height: 1.5;
    margin-top: 0.5rem;
  }
  
  #blogs-content .resource-tags {
    margin-top: 0.75rem;
  }
  
  #blogs-content .resource-tag {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
  }
}
```

---

## Testing Strategy

### 1. Visual History Tests
```typescript
// tests/card-history-indicator.spec.ts
test('shows blue border on recently viewed card', async ({ page }) => {
  await page.goto('http://localhost:8000/#/resources');
  
  // Click a card
  await page.click('[data-resource-name="CyberChef"]');
  await page.click('.close-button'); // Close modal
  
  // Verify blue border appears
  const card = page.locator('[data-resource-name="CyberChef"]');
  await expect(card).toHaveClass(/card-recently-viewed/);
  
  // Verify it fades after 3 seconds
  await page.waitForTimeout(3500);
  await expect(card).toHaveClass(/card-history-fade/);
});

test('persists history across page reloads', async ({ page }) => {
  await page.goto('http://localhost:8000/#/resources');
  await page.click('[data-resource-name="CyberChef"]');
  await page.click('.close-button');
  
  // Reload page
  await page.reload();
  
  // Verify history restored
  const card = page.locator('[data-resource-name="CyberChef"]');
  await expect(card).toHaveClass(/card-recently-viewed/);
});
```

### 2. Color Categorization Tests
```typescript
// tests/card-color-categorization.spec.ts
test('assigns correct colors to different topics', async ({ page }) => {
  await page.goto('http://localhost:8000/#/resources');
  
  // Verify AI resource has purple border
  const aiCard = page.locator('[data-topic="ai"]').first();
  const borderColor = await aiCard.evaluate(el => 
    window.getComputedStyle(el).borderColor
  );
  expect(borderColor).toContain('139, 92, 246'); // Purple RGB
});

test('shows topic badge on cards', async ({ page }) => {
  await page.goto('http://localhost:8000/#/resources');
  
  const badge = page.locator('.topic-badge').first();
  await expect(badge).toBeVisible();
  await expect(badge).toContainText(/AI|Cryptography|Forensics|Linux/);
});
```

### 3. Universal Tagging Tests
```typescript
// tests/universal-tagging.spec.ts
test('all resource types show tags', async ({ page }) => {
  await page.goto('http://localhost:8000/#/resources');
  
  // Check CTF tools have tags
  const ctfCard = page.locator('[data-resource-name="CyberChef"]');
  await expect(ctfCard.locator('.resource-tags')).toBeVisible();
  
  // Check guides have tags
  await page.click('[data-filter="linux"]');
  const guideCard = page.locator('[data-resource-name*="Linux"]').first();
  await expect(guideCard.locator('.resource-tags')).toBeVisible();
});

test('tags are clickable and trigger search', async ({ page }) => {
  await page.goto('http://localhost:8000/#/resources');
  
  // Click a tag
  await page.click('.resource-tag[data-tag="cryptography"]');
  
  // Verify search triggered
  await expect(page).toHaveURL(/#\/resources\?search=cryptography/);
  
  // Verify search input populated
  const searchInput = page.locator('#resource-search');
  await expect(searchInput).toHaveValue('cryptography');
});
```

### 4. Blog Layout Tests
```typescript
// tests/blog-mobile-layout.spec.ts
test('blog listing displays correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:8000/#/blogs');
  
  // Verify cards fit viewport
  const card = page.locator('.blog-card').first();
  const box = await card.boundingBox();
  expect(box.width).toBeLessThan(375);
  
  // Verify tags visible
  await expect(card.locator('.resource-tags')).toBeVisible();
});
```

---

## Implementation Phases

### Phase 1: Foundation (Priority: High)
1. ✅ Create planning document
2. Add data-attributes to all cards (`data-resource-name`, `data-topic`)
3. Implement `CardHistoryManager` class
4. Add topic color mapping
5. Create unified tag click handler

### Phase 2: Visual Features (Priority: High)
1. Implement visual history indicator
2. Add color-based card borders
3. Add topic badges to cards
4. Style improvements

### Phase 3: Tagging System (Priority: High)
1. Add tags to guides.json
2. Add tags to blogs-posts.json
3. Add tags to inline resources
4. Implement universal tag rendering
5. Update blog hashtag system to use unified handler

### Phase 4: Mobile Improvements (Priority: Medium)
1. Fix blog listing mobile layout
2. Improve tag display on mobile
3. Test card interactions on mobile

### Phase 5: Testing (Priority: High)
1. Write visual history tests
2. Write color categorization tests
3. Write universal tagging tests
4. Write blog layout tests
5. Document all tests

---

## Success Criteria

### Visual History
- [ ] Blue border appears when card is clicked
- [ ] Border fades after 3 seconds
- [ ] History persists across page reloads
- [ ] Only one card shows history indicator at a time

### Color Categorization
- [ ] All cards have topic-based border colors
- [ ] Topic badges display correctly
- [ ] Colors are consistent with topic mapping
- [ ] Default color applies when topic unknown

### Universal Tagging
- [ ] All resources have tags
- [ ] Tags display on all card types
- [ ] Tags are clickable everywhere
- [ ] Tag clicks trigger search correctly

### Mobile Layout
- [ ] Blog listing displays correctly on mobile viewports
- [ ] Tags are visible and clickable on mobile
- [ ] No horizontal scrolling
- [ ] Card spacing appropriate for mobile

### Testing
- [ ] All tests pass
- [ ] Test coverage > 80%
- [ ] Tests are declarative and maintainable
- [ ] Tests document expected behavior

---

## Documentation Updates

### Files to Update
1. `docs/UI.md` - Document color system and tagging
2. `docs/TESTING.md` - Document new test suites
3. `docs/ARCHITECTURE.md` - Document card interaction system
4. `README.md` - Update features list

### New Documentation
1. `docs/COLOR-SYSTEM.md` - Color categorization guide
2. `docs/TAGGING-SYSTEM.md` - Tagging implementation guide

---

## Rollback Plan

If issues arise:
1. Feature flags for each system
2. localStorage clear for history
3. CSS fallbacks for colors
4. Tag rendering optional

---

## Notes

- Keep backwards compatibility with existing card system
- Ensure all features work without JavaScript (graceful degradation)
- Consider accessibility (ARIA labels, keyboard navigation)
- Performance: avoid unnecessary DOM queries
- Mobile-first approach for all new features

