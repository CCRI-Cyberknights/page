# Changelog

All notable changes to the CCRI Cyberknights Landing Pages project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.5] - 2024-12-19

### Changed
- **Script Rename**: Renamed `scripts/youtube_url_converter.py` to `scripts/youtube_url_shortener.py` for better accuracy
- **Terminology Update**: Changed "convert" to "shorten" throughout documentation for clarity
- **Function Names**: Updated internal function names to reflect shortening terminology
- **Documentation Updates**: Updated all references to use new filename and terminology

### Technical Implementation
- **File Rename**: `youtube_url_converter.py` → `youtube_url_shortener.py`
- **Function Updates**: `convert_youtube_url()` → `shorten_youtube_url()`
- **Documentation Consistency**: All documentation now uses accurate terminology
- **Workflow Clarity**: Improved clarity in QR code generation workflow

## [1.5.4] - 2024-12-19

### Added
- **Comprehensive QR Code Documentation**: Complete documentation system for QR code integration
  - **Document README**: `document/README.md` with implementation details and replication guide
  - **Scripts README**: `scripts/README.md` with QR code generation system documentation
  - **Cross-Reference Network**: All documentation files now properly reference QR code system

### Changed
- **Branding Update**: Updated Linux Cheatsheet title from "CCRI Cyberknights" to "Cyber Club"
- **Spelling Correction**: Fixed "Cheat Sheet" to "Cheatsheet" for consistency
- **Documentation Integration**: Enhanced all major documentation files with QR code references

### Technical Implementation
- **Documentation Architecture**: Comprehensive cross-referenced documentation system
- **Replication Framework**: Complete guides for extending QR code system to other guides
- **Version Management**: Updated to v1.5.4 with proper changelog documentation

## [1.5.3] - 2024-12-19

### Added
- **QR Code Integration in Educational Documents**: Implemented comprehensive QR code system for Linux cheat sheet
  - **Table-based Layout**: Clean, spreadsheet-like interface combining video titles, URLs, and QR codes
  - **Base64 Embedded QR Codes**: Self-contained QR codes with green backgrounds and black modules
  - **Single Clickable Links**: Combined video titles and short URLs into unified clickable areas
  - **Custom QR Generation**: Python script (`scripts/generate_qr_codes.py`) for generating styled QR codes
  - **Comprehensive Documentation**: Detailed implementation guides in `document/README.md` and `scripts/README.md`

### Technical Implementation
- **QR Code Specifications**: Low Error Correction Level (L), 8px box size, 2px border for minimal margins
- **Color Scheme**: Green background (#10b981) with black modules for optimal scanning
- **HTML Structure**: Table-based layout with centered QR codes and borderless design
- **URL Strategy**: Short YouTube URLs (youtu.be) for cleaner QR codes, full URLs for clickable links
- **Replication System**: Complete documentation and tools for extending to other educational guides

### Documentation Updates
- **Updated README.md**: Added QR code integration features and documentation references
- **Enhanced ARCHITECTURE.md**: Documented QR code system in technical architecture
- **Updated QR-CODES.md**: Added section on educational guide QR integration
- **Cross-Referenced Documentation**: Ensured all relevant docs reference the new QR system

## [1.5.2] - 2024-09-24

### Fixed
- **Modal bullet formatting restoration**: Re-added `formatDetailedSummary` function that was accidentally removed during "more info" pulldown cleanup
- **Modal content display**: Detailed summaries now properly display as bullet points in resource modals
- **Function dependency**: Fixed missing function reference that was causing modals to show empty content
- **Footer positioning inconsistency**: Fixed footer appearing at different heights when different resource filters are selected
  - Implemented sticky footer layout using flexbox (`flex flex-col` on body, `flex-grow` on main, `mt-auto` on footer)
  - Footer now consistently appears at bottom of viewport when content is minimal
  - Resolves visual inconsistency between Cyberknights (3 cards) and Linux (2 cards) resource filters

### Changed
- **Linux Day 1 Setup Tips styling**: Updated `document/linux-day-1-setup-tips.html` to use dark theme and official color palette
  - Converted from light theme (blue colors) to dark theme matching `linux-cheatsheet-1.html`
  - Applied official Cyberknights color palette with CSS custom properties
  - Used `--neon-surge` (#43CC50) for headings and `--ember-spark` (#C27329) for emphasis
  - Added proper HTML structure with QR code functionality and footer
  - Maintained consistent styling with other Linux documentation
- **Linux Cheatsheet 1 DRY refactoring**: Refactored `document/linux-cheatsheet-1.html` to use more Tailwind elements and DRY principles
  - Added reusable CSS classes (`.section-container`, `.section-title`, `.subsection-title`, `.command-code`, `.code-block`, `.emphasis-text`)
  - Updated color palette to match official Cyberknights colors (`--neon-surge: #43CC50`)
  - Refactored all sections to use consistent DRY classes instead of inline styles
  - Added navigation links and footer to match other Linux documentation
  - Improved maintainability and consistency across Linux guides

## [1.5.1] - 2024-09-23

### Added
- Enhanced QR code landing banner with individual value badges
- Strategic positioning of "Excitement • Opportunity • Belonging" banner for QR code users
- Blog page template (coming soon content)
- Comprehensive design evolution documentation
- **Home page banner restoration**: "Excitement • Opportunity • Belonging" banner added back to home page only
- **VBox Summary Image Toggle**: Interactive toggle functionality for VirtualBox summary screenshot
- **Generalized Image Toggle System**: CSS custom properties for consistent image expansion across all toggleable images

### Changed
- Removed redundant top banner from all pages
- Enhanced banner design with gradient backgrounds and individual badges
- Improved visual hierarchy for QR code landing experience
- **Content reorganization**:
  - Moved "Career boost" content from Mission box to "Our Members Get Hired!" box
  - Updated hiring box copy with new messaging: "From resumes to real jobs — we help you land the role"
  - Standardized text hierarchy: "Our Members Get Hired!" as main green headline, all supporting text same color and size
  - Removed redundant tagline "Where cybersecurity students become professionals"
- **Image Toggle System Improvements**:
  - VBox summary image now spans full container width in collapsed state
  - All images expand to 96% screen width (increased from 90%) for better visibility
  - Unified sizing system using CSS custom properties for consistency

### Fixed
- Banner positioning for optimal QR code user experience
- Visual consistency across all pages
- **Modal interaction improvements**:
  - Click-anywhere-to-close functionality for resource modals
  - Consistent bullet-point formatting between modal and inline expansion
  - Preserved action button functionality (opens links without closing modal)
  - Enhanced user experience with multiple modal close methods
- **Content structure improvements**:
  - Better logical grouping of career-related content
  - Clearer visual hierarchy in hiring messaging
  - Consistent text styling for improved readability

## [1.5.0] - 2024-09-23

### Added
- **Navigation & Interaction Upgrade**:
  - Button-style navigation links with clear visual hierarchy
  - Mobile-optimized search with fixed positioning to prevent virtual keyboard interference
  - Resource card expand/collapse functionality with bullet-point formatting
  - External link indicators for outbound links
  - Comprehensive unit tests for interactive elements

- **Content and Information Architecture Overhaul**:
  - Merged "Home" and "Club" pages into unified "Club Home" page
  - Engaging headline: "Who are the Cyber Knights?"
  - Streamlined mission statement removing speculative projects
  - Clarified competition messaging emphasizing team competition against other schools
  - Relocated CTAs into dedicated "Get Involved" section
  - Added jargon explanations (e.g., "CTF competitions")

- **Branding and Aesthetic Elements**:
  - Interactive Cyber Knight icon system with full-screen modal expansion
  - Canonical color palette with CSS variables
  - Enhanced QR code landing banner
  - DRY implementation for image toggle functionality

- **Technical Improvements**:
  - DRY principles implementation with JavaScript constants
  - Unified toggle functionality for multiple interactive elements
  - CSS architecture improvements with proper specificity
  - Automated testing for new interactive features

### Changed
- Navigation structure simplified from complex mobile menu to direct navigation
- Page consolidation eliminated redundant content
- Color consistency across all interactive elements
- Resource card interaction refined with better UX patterns
- Linux documentation generalized for broader applicability

### Fixed
- Mobile search UX preventing virtual keyboard interference
- Resource card redundant text display
- CSS specificity issues with icon toggle functionality
- Navigation link clarity and visual hierarchy

### Removed
- Redundant "Home" and "Club" page separation
- Speculative project references from mission statement
- Complex mobile navigation hamburger menu
- Top banner redundancy across all pages

## [1.4.2] - 2024-09-22

### Added
- Automated version management system
- Pre-commit hooks for version bumping
- Conventional commit support
- Version display in footer with commit information tooltip

### Changed
- Version management from manual to automated
- Git workflow integration for versioning

## [1.4.1] - 2024-09-22

### Added
- Comprehensive Selenium WebDriver test suite
- Automated testing for routing, QR codes, and cross-page navigation
- Testing documentation and methodology
- Cross-browser compatibility testing

### Fixed
- Layout issues identified through automated testing
- Navigation positioning problems
- Footer visibility issues

## [1.4.0] - 2024-09-21

### Added
- **UI Improvements**:
  - Consistent color palette with emerald-500 standardization
  - Simplified navigation removing hamburger menu
  - Organized resource categories with combined CTF tools
  - Enhanced resource discoverability with beginner guidance
  - Improved Linux guide formatting
  - Header cleanup removing redundant text

- **Resource System Enhancements**:
  - Resource descriptions for better context
  - Default "Cyberknights" filter
  - Improved card layout with visual hierarchy
  - Enhanced resource categorization

### Changed
- Color standardization across all interactive elements
- Navigation from complex mobile menu to direct navigation
- Resource category organization and naming
- Default resource filter from "all" to "cyberknights"

### Removed
- Confusing resources table display
- Redundant header text
- Separate "code-breaking" category (merged into CTF tools)

## [1.3.x] - Previous Versions

### Added
- Initial QR code landing page system
- Basic routing and navigation
- Resource management system
- Calendar integration
- Document loading system
- Campus maps functionality

### Technical Foundation
- Single-file architecture with JavaScript router
- Tailwind CSS integration
- GitHub Pages hosting setup
- Basic responsive design
- QR code generation system

---

## Version Management

This project uses automated version management with the following features:

- **Conventional Commits**: Commit messages drive version bump decisions
- **Pre-commit Hooks**: Automatic version bumping on every commit
- **Semantic Versioning**: Clear meaning for version numbers (MAJOR.MINOR.PATCH)
- **Git Integration**: Automatic version tags and metadata synchronization
- **Version Display**: Footer shows current version with commit information tooltip

### Version Bump Rules

- **MAJOR**: Breaking changes, architectural overhauls
- **MINOR**: New features, significant functionality additions
- **PATCH**: Bug fixes, documentation updates, minor improvements

### Manual Version Control

```bash
# Show current version
./scripts/bump-version.sh show

# Force specific version bump
./scripts/bump-version.sh patch   # 1.5.1 → 1.5.2
./scripts/bump-version.sh minor   # 1.5.1 → 1.6.0
./scripts/bump-version.sh major   # 1.5.1 → 2.0.0
```

---

## Related Documentation

- [Design Evolution v1.5](DESIGN-EVOLUTION-v1.5.md) - Comprehensive documentation of v1.5.x changes
- [Version Management](VERSION-MANAGEMENT.md) - Detailed versioning system documentation
- [Architecture Overview](ARCHITECTURE.md) - Overall system architecture
- [UI Improvements](UI-IMPROVEMENTS.md) - UI enhancement documentation
- [Testing Strategy](TESTING.md) - Testing approach and implementation
