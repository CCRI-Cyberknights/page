# Documentation Lifecycle Management Guide

## Overview

**⭐ This is the PRIMARY guide for documentation lifecycle management.** 

This guide establishes best practices for managing documentation throughout its lifecycle, providing clear criteria for deciding when to **archive** versus **consolidate**, and standardized naming conventions for archived documents.

**Relationship to Other Guides**:
- **`docs/README.md`**: Documents the **legacy consolidation pattern** used in earlier consolidations. Existing "Legacy Documentation" sections in consolidated files (e.g., `docs/UI.md`, `docs/TESTING.md`) follow the old pattern and are preserved for historical reference.
- **This guide**: Establishes the **current standard** for archive vs. consolidate decisions going forward.
- **`docs/PLANNING-DOCUMENTATION-GUIDE.md`**: Detailed workflow for planning documents, which follows the lifecycle patterns established here.

---

## Archive vs. Consolidate Decision Framework

The decision between archiving and consolidating documentation depends on several key factors:

### When to **CONSOLIDATE**

Consolidate when documents have **overlapping or redundant content** that can be merged:

✅ **Consolidate if:**
- Documents cover the same functional area
- Content overlaps significantly (70%+)
- Frequently referenced together
- Serve the same audience/purpose
- Information can be merged without losing context
- Reduces maintenance burden (fewer files to update)

**Example**: Multiple testing docs → `docs/TESTING.md`

### When to **ARCHIVE**

Archive when documents need to be **preserved for historical reference** but aren't actively used:

✅ **Archive if:**
- Document is complete/implemented but not actively maintained
- Contains valuable historical context or decision rationale
- Needs to be preserved for compliance/audit purposes
- May be referenced occasionally but not frequently
- Content is self-contained (not overlapping with other docs)
- Preserves unique perspective or implementation details

**Example**: Completed planning documents, deprecated features, historical snapshots

### Decision Matrix

| Factor | Consolidate | Archive |
|--------|-------------|---------|
| **Content Overlap** | High (70%+) | Low (<30%) |
| **Usage Frequency** | High (frequently referenced) | Low (occasional reference) |
| **Maintenance** | Needs ongoing updates | Static/complete |
| **Relationship** | Related to other active docs | Standalone document |
| **Purpose** | Active reference material | Historical record |

---

## Current Project Strategy

Based on research and project needs, our approach:

### **Planning Documents** → Archive (after consolidation)

Planning documents follow this lifecycle:
1. **Active** → `docs/PLANNING/active/`
2. **Implemented** → `docs/PLANNING/implemented/`
3. **Consolidated** → Key info merged into canonical docs
4. **Archived** → Original preserved in `docs/PLANNING/archived/` for historical reference

**Rationale**: Planning docs contain unique implementation details and decision rationale that may be valuable later, even after consolidation.

### **Production Documentation** → Consolidate (when overlapping)

Production docs in root `docs/` should be consolidated when they overlap:
- Merge overlapping content
- Preserve key information
- Reference in "Legacy Documentation" section if needed
- Delete original (Git history preserves it)

**Rationale**: Active production docs benefit from consolidation to reduce maintenance overhead and improve discoverability.

---

## Naming Conventions for Archived Files

### Recommended Pattern: Date Prefix + Descriptive Name

**Format**: `YYYY-MM-DD-descriptive-name.md`

**Benefits:**
- ✅ Chronological sorting (files naturally sort by date)
- ✅ ISO 8601 standard format (widely recognized)
- ✅ Self-documenting (shows when archived)
- ✅ No redundant prefixes needed (folder already indicates archive)

### Current Implementation

We already use this pattern in `docs/PLANNING/archived/`:
- ✅ `2025-10-12-current-state-summary.md`
- ✅ `viewport-consistency-plan.md` (could be: `2025-12-05-viewport-consistency-plan.md`)

### Naming Guidelines

#### ✅ **Good Names**
```
2025-12-05-viewport-consistency-plan.md
2025-10-12-current-state-summary.md
2025-12-15-mobile-keyboard-handling.md
```

#### ❌ **Avoid**
```
ARCHIVED-viewport-consistency-plan.md        # Redundant (folder already indicates archive)
viewport-consistency-plan-ARCHIVED.md        # Suffix breaks chronological sorting
2025-12-05-ARCHIVED-viewport-plan.md         # Unnecessary prefix
Viewport-Consistency-Plan.md                 # Missing date, inconsistent casing
```

### Alternative Patterns (Industry Examples)

Some organizations use different patterns:

1. **Folder-Based Only** (Our Current Approach)
   - Folder: `docs/PLANNING/archived/`
   - Files: `descriptive-name.md` (no prefix needed)
   - ✅ Clean, folder context provides meaning

2. **Date Prefix** (Recommended Enhancement)
   - Format: `YYYY-MM-DD-descriptive-name.md`
   - ✅ Chronological sorting, self-documenting

3. **Suffix Pattern** (Less Common)
   - Format: `descriptive-name.archive.md`
   - ⚠️ Doesn't sort chronologically

4. **Prefix Pattern** (Less Common)
   - Format: `ARCHIVED-descriptive-name.md`
   - ⚠️ Redundant with folder name

**Recommendation**: Use **Date Prefix** pattern for better chronological organization and self-documentation.

---

## Archive Folder Structure

### Current Structure

```
docs/
├── PLANNING/
│   ├── active/              # Currently in progress
│   ├── implemented/         # Completed, awaiting consolidation
│   └── archived/            # Historical reference (date-prefixed)
│       ├── 2025-10-12-current-state-summary.md
│       └── viewport-consistency-plan.md
│
└── *.md                    # Canonical production documentation
```

### Recommended Enhancement

Apply date prefixes to all archived files for consistency:

```
docs/PLANNING/archived/
├── 2025-10-12-current-state-summary.md
└── 2025-12-05-viewport-consistency-plan.md    # Add date prefix
```

---

## Documentation Lifecycle Process

### Step 1: Determine Action (Archive vs. Consolidate)

Use decision framework above to decide.

### Step 2: If Consolidating

1. **Identify Target Document**: Which canonical doc should receive content?
2. **Extract Key Information**: Merge essential content into target
3. **Update Target Document**: Add consolidated information
4. **Archive Original** (if valuable) or **Delete** (Git preserves history)
5. **Optional**: Add brief legacy reference in target doc

### Step 3: If Archiving

1. **Move to Archive Folder**: `docs/PLANNING/archived/`
2. **Add Date Prefix**: `YYYY-MM-DD-original-name.md`
3. **Update Status**: Add `[ARCHIVED]` or `[COMPLETE]` header
4. **Optional**: Add note explaining why archived and where consolidated

### Step 4: Update Index

Update relevant README/index files to reflect changes:
- `docs/PLANNING/README.md` for planning docs
- Canonical doc if consolidated

---

## Best Practices Summary

### ✅ **Do**

- Use date prefixes (`YYYY-MM-DD-`) for archived files
- Archive planning docs after consolidation (preserve history)
- Consolidate overlapping production docs
- Keep archive folder structure organized
- Document why files were archived
- Regular audits to identify stale docs

### ❌ **Don't**

- Mix archive and consolidate strategies without clear rationale
- Create redundant prefixes (`ARCHIVED-` when folder already indicates)
- Archive without date prefixes (harder to sort/organize)
- Consolidate documents with low overlap
- Archive documents that need active maintenance
- Skip updating index files

---

## Real-World Examples

### Example 1: Viewport Consistency Plan

**Original Location**: `docs/VEWPORT-CONSISTENCY-PLAN.md` (with typo)

**Action**: ✅ **Archive** (not consolidate)
- Content was implementation-specific planning
- Self-contained document
- Valuable historical context preserved
- No significant overlap with existing docs

**Result**: 
- Moved to: `docs/PLANNING/archived/viewport-consistency-plan.md`
- Could enhance: `docs/PLANNING/archived/2025-12-05-viewport-consistency-plan.md`

### Example 2: Multiple Testing Docs

**Original Files**: 
- `docs/LINK-TESTING.md`
- `docs/DYNAMIC-LINK-TESTING.md`

**Action**: ✅ **Consolidate**
- High content overlap
- Same functional area (testing)
- Frequently referenced together

**Result**:
- Merged into: `docs/TESTING.md`
- Original files deleted (Git history preserved)

### Example 3: Planning Documents

**Original**: `docs/SEARCH-UX-ENHANCEMENTS-TDD-PLAN.md`

**Action**: ✅ **Archive** (after partial consolidation)
- Planning document with implementation details
- Key info consolidated into `docs/UI.md`
- Original preserved for historical reference

**Result**:
- Key info in: `docs/UI.md`
- Original in: `docs/PLANNING/archived/search-ux-enhancements.md`

---

## Migration Plan for Existing Archives

### Current State

- `docs/PLANNING/archived/2025-10-12-current-state-summary.md` ✅ (already has date)
- `docs/PLANNING/archived/viewport-consistency-plan.md` ⚠️ (missing date)

### Recommended Action

Rename files missing date prefixes:

```bash
# Add date prefix to viewport-consistency-plan.md
mv docs/PLANNING/archived/viewport-consistency-plan.md \
   docs/PLANNING/archived/2025-12-05-viewport-consistency-plan.md
```

**Rationale**: Consistent naming makes archives easier to browse chronologically.

---

## Decision Tree

```
Is the document overlapping with other active docs?
├─ YES (70%+ overlap)
│  └─ → CONSOLIDATE into canonical doc
│
└─ NO (<30% overlap)
   │
   Is it actively maintained/updated?
   ├─ YES
   │  └─ → KEEP active
   │
   └─ NO
      │
      Is it complete/implemented?
      ├─ YES
      │  └─ → ARCHIVE with date prefix
      │
      └─ NO
         └─ → REVIEW for deletion or keep active
```

---

## References

- **[Planning Documentation Guide](PLANNING-DOCUMENTATION-GUIDE.md)** - Detailed planning doc lifecycle
- **[Documentation Consolidation Guide](README.md)** - Historical consolidation strategy (legacy "Legacy Documentation" pattern)
- **Industry Best Practices**: Archive vs. consolidate decision frameworks
- **ISO 8601 Date Format**: Standard for date prefixes (YYYY-MM-DD)

## Note on Existing Legacy Documentation Sections

Many existing consolidated documents (e.g., `docs/UI.md`, `docs/TESTING.md`, `docs/ROUTING.md`, `docs/VERSIONING.md`) contain "Legacy Documentation" sections that follow the old consolidation pattern. These sections:

- ✅ Are **preserved** for historical reference
- ✅ Document files that were consolidated using the old pattern
- ⚠️ Should **not be used as a template** for new consolidations

For new consolidations, use the archive vs. consolidate decision framework documented in this guide instead of automatically adding "Legacy Documentation" sections.

---

## Recommendations

1. ✅ **Use date prefixes** (`YYYY-MM-DD-`) for all archived files
2. ✅ **Archive planning docs** after consolidation (preserve history)
3. ✅ **Consolidate overlapping production docs** (reduce maintenance)
4. ✅ **Regular audits** to identify stale documentation
5. ✅ **Clear criteria** for archive vs. consolidate decisions

---

*Last updated: 2025-12-12*
*Based on industry best practices research and project-specific needs*

