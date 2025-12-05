# Planning Documentation Management Guide

## Overview

This document establishes best practices for managing planning and implementation documents that are inevitable during active development. These guidelines ensure planning documents are organized, traceable, and properly lifecycle-managed while maintaining the project's documentation consolidation standards.

---

## Core Principles

### 1. **Separation of Concerns**
- **Production Documentation** (`docs/*.md`): Canonical, long-term documentation
- **Planning Documentation** (`docs/PLANNING/`): Active planning and implementation documents
- **Test Documentation** (`docs/TEST-DOCUMENTATION/`): Test-specific documentation (existing pattern)

### 2. **Lifecycle Management**
Planning documents follow a clear lifecycle:
1. **Active Planning** → In `docs/PLANNING/`
2. **Implementation** → Updated with progress, still in `docs/PLANNING/`
3. **Completed** → Consolidated into canonical docs, archived or deleted

### 3. **Traceability**
All planning documents maintain Git commit history for complete traceability, following the project's consolidation patterns.

---

## Folder Structure

```
docs/
├── PLANNING/                    # Active planning documents
│   ├── README.md               # Planning folder index and guidelines
│   ├── active/                 # Currently in progress
│   ├── implemented/            # Completed, awaiting consolidation
│   └── archived/               # Historical reference only
│
├── TEST-DOCUMENTATION/         # Test-specific docs (existing)
│
└── *.md                        # Canonical production documentation
```

---

## Document Lifecycle

### Phase 1: Active Planning
**Location**: `docs/PLANNING/active/`

- Documents in active development or planning phase
- May be frequently updated
- Status clearly marked (e.g., `[PLANNING]`, `[IN-PROGRESS]`)

**Naming Convention**:
- Use descriptive names: `feature-name-plan.md`
- Include date prefix: `YYYY-MM-DD-feature-name-plan.md` (optional, for sorting)
- Avoid verbose names like `*IMPLEMENTATION-PLAN*` or `*ENHANCEMENT-PLAN*`

**Example**:
- `docs/PLANNING/active/2025-12-05-search-ux-enhancements.md`
- `docs/PLANNING/active/card-interaction-improvements.md`

### Phase 2: Implementation Complete
**Location**: `docs/PLANNING/implemented/`

- Feature is implemented but documentation not yet consolidated
- Marked with completion status in header
- Awaiting consolidation into canonical docs

**Status Markers**:
```markdown
# Feature Name

**Status**: ✅ IMPLEMENTED
**Implementation Date**: 2025-12-05
**Consolidation Target**: `docs/UI.md`
```

### Phase 3: Consolidated/Archived
**Action**: Consolidate into canonical docs and archive original

1. **Extract Key Information**: Move essential details to canonical docs
2. **Add Legacy Reference**: Reference original in canonical doc's "Legacy Documentation" section
3. **Archive or Delete**: 
   - **Archive**: Move to `docs/PLANNING/archived/` if contains valuable historical context
   - **Delete**: If fully consolidated and no longer needed

---

## Document Types & Patterns

### 1. Feature Planning Documents

**Purpose**: Document feature requirements, design decisions, and implementation plans

**Template**:
```markdown
# [Feature Name]

**Status**: [PLANNING | IN-PROGRESS | IMPLEMENTED | ARCHIVED]
**Created**: YYYY-MM-DD
**Target Consolidation**: `docs/[CANONICAL-DOC].md`

## Overview
Brief description of the feature...

## Requirements
- Requirement 1
- Requirement 2

## Implementation Plan
### Phase 1: ...
### Phase 2: ...

## Technical Decisions
- Decision 1: Rationale
- Decision 2: Rationale

## Testing Strategy
...

## References
- Related canonical docs
- External resources
```

### 2. TDD Implementation Plans

**Purpose**: Detailed TDD workflow and test plans

**Pattern**: Similar to existing `SEARCH-UX-ENHANCEMENTS-TDD-PLAN.md`
- Feature-by-feature breakdown
- Test cases and scenarios
- Implementation priority matrix

### 3. System Design Documents

**Purpose**: Document system architecture and design patterns

**Example**: Like `DECLARATIVE-PANEL-SYSTEM.md`
- Design principles
- Implementation details
- Integration points

---

## Consolidation Process

When a planning document is ready for consolidation:

### Step 1: Identify Consolidation Target
Determine which canonical document should contain the information:
- UI/UX features → `docs/UI.md`
- Testing strategies → `docs/TESTING.md`
- Architecture decisions → `docs/ARCHITECTURE.md`
- Version/deployment → `docs/VERSIONING.md` or `docs/DEPLOYMENT.md`

### Step 2: Extract Key Information
1. **Overview/Summary**: Brief description for canonical doc
2. **Implementation Details**: Technical specifics if needed
3. **Historical Context**: Preserve important decisions/rationale

### Step 3: Update Canonical Document
Add to appropriate section. **Do not add "Legacy Documentation" sections** - use the archive/consolidate decision framework instead.

```markdown
## [Feature Section]

[Brief summary and current implementation details...]
```

**Note**: Many existing canonical documents (e.g., `docs/UI.md`, `docs/TESTING.md`) contain "Legacy Documentation" sections from the old consolidation pattern. These are preserved for historical reference, but new consolidations should follow the [Documentation Lifecycle Management Guide](../DOCUMENTATION-LIFECYCLE-GUIDE.md) decision framework.

### Step 4: Archive or Delete Original
- Move to `docs/PLANNING/archived/` if valuable for historical reference
- Delete if fully consolidated (Git history preserves it)

### Step 5: Update Planning README
Update `docs/PLANNING/README.md` index to reflect the change.

---

## Naming Conventions

### ✅ Good Names
- `search-ux-enhancements.md`
- `card-interaction-improvements.md`
- `viewport-consistency-system.md`
- `mobile-keyboard-handling.md`

### ❌ Avoid
- `SEARCH-UX-ENHANCEMENTS-IMPLEMENTATION-PLAN.md` (too verbose)
- `Card-Interaction-Enhancement-Plan.md` (redundant suffix)
- `*TDD-PLAN.md` (unless it's specifically a TDD workflow doc)

**Principle**: Use concise, descriptive names. The folder structure (`docs/PLANNING/`) already indicates it's a planning document.

---

## Status Tracking

Each planning document should include a clear status header:

```markdown
# Feature Name

**Status**: [PLANNING | IN-PROGRESS | IMPLEMENTED | ARCHIVED]
**Priority**: [P0 | P1 | P2 | P3]
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Target Consolidation**: `docs/[CANONICAL].md`
```

### Status Definitions

- **PLANNING**: Initial planning, requirements gathering
- **IN-PROGRESS**: Active implementation
- **IMPLEMENTED**: Feature complete, awaiting consolidation
- **ARCHIVED**: Consolidated or no longer relevant

---

## Integration with Existing Patterns

### Test Documentation Pattern
Follows the existing `docs/TEST-DOCUMENTATION/` pattern:
- Dedicated folder for specific document type
- README.md for organization and guidelines
- Clear separation from production docs

### Consolidation Pattern
Follows the existing consolidation strategy from `docs/README.md`:
- Legacy references with Git commit hashes
- Brief summary + legacy reference pattern
- Historical traceability preserved

---

## Maintenance Guidelines

### Regular Reviews
- **Monthly**: Review `docs/PLANNING/active/` for stale documents
- **Quarterly**: Review `docs/PLANNING/implemented/` for consolidation candidates
- **Semi-Annually**: Review `docs/PLANNING/archived/` for cleanup

### Cleanup Criteria
Move to archive or delete if:
- ✅ Fully consolidated into canonical docs
- ✅ Feature is deprecated/removed
- ✅ No longer relevant to current project direction
- ✅ Historical value preserved in Git history

---

## Example Workflow

### Creating a New Planning Document

1. **Create document**:
   ```bash
   docs/PLANNING/active/2025-12-05-new-feature.md
   ```

2. **Add status header**:
   ```markdown
   **Status**: PLANNING
   **Priority**: P1
   **Target Consolidation**: `docs/UI.md`
   ```

3. **Document plan**:
   - Requirements
   - Implementation strategy
   - Testing approach

### Moving to Implementation

1. **Update status**:
   ```markdown
   **Status**: IN-PROGRESS
   ```

2. **Add progress updates**:
   - Mark completed sections
   - Document decisions made
   - Update timeline

### Completing Implementation

1. **Update status**:
   ```markdown
   **Status**: IMPLEMENTED
   **Implementation Date**: 2025-12-10
   ```

2. **Move to implemented folder**:
   ```bash
   mv docs/PLANNING/active/feature.md docs/PLANNING/implemented/
   ```

3. **Schedule consolidation** (in next documentation review)

### Consolidating

1. **Extract key info** to canonical doc
2. **Add legacy reference** with Git commit hash
3. **Archive original**:
   ```bash
   mv docs/PLANNING/implemented/feature.md docs/PLANNING/archived/
   ```

---

## Best Practices Summary

### ✅ Do

- Keep planning docs in `docs/PLANNING/`
- Use clear status markers
- Document target consolidation location
- Follow concise naming conventions
- Regularly review and consolidate
- Preserve Git history for traceability

### ❌ Don't

- Mix planning docs with production docs in root `docs/`
- Use verbose names with redundant suffixes
- Leave completed docs unconsolidated indefinitely
- Delete without consolidating first
- Create planning docs without clear consolidation plan

---

## References

- **[Documentation Lifecycle Management Guide](DOCUMENTATION-LIFECYCLE-GUIDE.md)** - ⭐ **PRIMARY GUIDE** - Archive vs. consolidate decision framework and naming conventions
- **[Documentation Consolidation Guide](README.md)** - Historical consolidation strategy (legacy pattern)
- **[Testing Documentation](TEST-DOCUMENTATION/README.md)** - Similar pattern for test docs
- **Git History** - All documents preserved via version control

---

*Last updated: 2025-12-05*
*This document follows the project's documentation consolidation standards while providing structure for inevitable planning documents.*

