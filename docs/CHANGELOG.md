# Changelog

All notable changes to the Cyber Club Landing Pages project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.5] - 2025-01-15

### Clickable Hashtags Feature
- **Blog Hashtag Functionality**: Implemented clickable hashtags in blog posts that automatically convert to search links
- **Search Endpoint**: Created new `#/search?q=term` endpoint for hashtag-triggered searches
- **Automatic Conversion**: Blog post hashtags (e.g., `#career`, `#microsoft`) are automatically converted to clickable links
- **Resource Integration**: Clicking hashtags triggers resource search functionality with the hashtag term
- **Modal Support**: Hashtag functionality works in both individual blog posts and blog modal views
- **URL Encoding**: Proper URL encoding for hashtag terms with special characters

### Timeout Protection & Development Tools
- **Timeout Technique**: Added comprehensive timeout protection for Playwright tests using `timeout 30s` command
- **NPM Scripts**: Created timeout-enabled test scripts (`test:timeout`, `test:timeout:single`, `test:hashtags`)
- **Cursor Rules**: Updated `.cursor-rules` with timeout guidelines and usage examples
- **Documentation**: Added timeout protection section to testing documentation with usage guidelines

### Code Quality Improvements
- **Unified Blog Loading Pattern**: Refactored blog routing to eliminate anti-pattern of dual code paths
- **DRY Principle**: Both `#/blog/slug` and `#/blogs/filename.html` URLs now use single `renderBlogPost()` function
- **Consistency**: All blog features (hashtags, navigation, styling) work identically across both URL formats
- **Maintainability**: Single source of truth for blog loading logic eliminates code duplication

### Blog System Simplification
- **Modal System Removal**: Completely removed blog modal system (~100 lines of code)
- **Direct Navigation**: Blog posts now use direct navigation matching guides system (`#/blogs/filename.html`)
- **Consistent UX**: Blog navigation now identical to guides navigation pattern
- **Code Cleanup**: Removed `openBlogPost()`, `closeBlogModal()`, and `makeModalHashtagsClickable()` functions
- **Simplified Architecture**: Blog system now matches guides system exactly for unified user experience

### Technical Implementation
- **Dynamic Conversion**: `makeHashtagsClickable()` function converts span elements to clickable links
- **Search Routing**: New `renderSearchPage()` function handles search endpoint routing
- **Direct Navigation**: Blog posts use `window.location.hash = '#/blogs/${post.file}'` for consistent routing
- **Hover Effects**: Added visual feedback with hover states for better user experience

## [1.8.4] - 2025-01-15

### Homepage Content Improvements
- **Enhanced Branding**: Clear CCRI Cyber Club identity without redundant official designations
- **Improved Inclusivity**: Emphasized collaborative community accessible to all skill levels
- **Social Connections Focus**: Highlighted approach of meeting people where they are with varying meeting formats
- **Authentic Messaging**: Removed references to specific events/companies not yet involved
- **Streamlined Content**: Eliminated taglines and parenthetical clarifications for cleaner flow

### Content Accuracy
- **Removed Specific References**: Eliminated mentions of specific companies (DOD, Electric Boat, Rite Solutions) and events
- **Authentic Activities**: Focused on actual club activities without referencing game nights or tabletop exercises
- **Cleaner Messaging**: Streamlined text to focus on core mission and approach

## [1.8.3] - 2025-01-15

### Added
- **Blog Section Optimization**: Scaled back blog prominence for balanced design and improved user experience
  - **Balanced Home Page Integration**: Clean "Updates & Blog" section with amber styling positioned after main content sections
  - **Simplified Implementation**: Removed dynamic loading and "Latest Post" indicators for reliability and performance
  - **Strategic Placement**: Positioned after "What We Do & Get Involved" section for balanced visual hierarchy
  - **Clean UX Design**: Streamlined "View Blog" button with consistent hover effects and amber gradient styling

### Enhanced
- **Blog Feature Refinement**: Optimized from prominent section to balanced, accessible design
  - **Amber Styling Maintained**: Clean gradient background with border-amber-500/60 styling for visual appeal
  - **Compact Button Design**: Smaller bg-amber-600 button with hover effects and smooth transitions
  - **Static Content**: Reliable static implementation without dynamic loading complexity
  - **Visual Consistency**: Styling matches "Our Members Get Hired!" section for brand consistency

### Fixed
- **Blog Discoverability**: Blog feature now has primary feature visibility instead of being buried in secondary section
- **User Experience**: Enhanced engagement with dynamic preview and prominent placement
- **Navigation Flow**: Streamlined access to blog content with multiple entry points

### Technical Implementation
- **updateBlogPreview() Function**: Dynamic blog content loading and preview display
- **Interactive Elements**: Event listeners for clickable navigation and hover effects
- **Error Handling**: Graceful fallback to "Coming Soon" when no posts available
- **Test Coverage**: Comprehensive test suite (6 tests) for blog prominence functionality

## [1.8.2] - 2025-01-15

### Added
- **Blog Template System**: Consistent template-based architecture for blog posts
  - **`page-blogs` Template**: Dedicated template for blog content with loading states and navigation
  - **Template Integration**: `#blogs-content` area for content injection and `#blogs-navigation` for consistent navigation
  - **Routes Object**: Added `blogs: document.getElementById('page-blogs').innerHTML` to routing system
  - **Template Consistency**: Blogs now use same template pattern as guides for unified architecture

- **DRY Navigation Pattern**: Unified "Back to [Section]" navigation system
  - **Factory Helper Functions**: `createBackNavigation(config)` and `createErrorNavigation(target, label)`
  - **Configurable Styling**: Emerald, neon-surge, and simple styling options with graceful fallbacks
  - **Template-Provided Navigation**: Navigation centralized in templates, not individual HTML files
  - **Comprehensive Test Coverage**: 7 tests covering all navigation patterns and styling variants

### Enhanced
- **Template-Based Architecture**: Both guides and blogs now use consistent template system
  - **Guides**: `page-guides` template with `#guides-content` and `#guides-navigation` areas
  - **Blogs**: `page-blogs` template with `#blogs-content` and `#blogs-navigation` areas
  - **Loading States**: Consistent loading spinners and error handling across templates
  - **Navigation Consistency**: Template-provided navigation eliminates duplicate links

- **Blog Routing Logic**: Updated both blog routing paths to use template system
  - **`#/blogs/filename.html`**: Now uses `page-blogs` template instead of `page-guides`
  - **`#/blog/slug`**: Now uses `page-blogs` template for consistent navigation
  - **Content Injection**: Blog content properly injected into `#blogs-content` area
  - **Error Handling**: Error states use template-provided navigation consistently

### Fixed
- **Navigation Duplication**: Removed duplicate "Back to Blog" links from individual blog HTML files
- **Template Consistency**: Blogs and guides now use identical template architecture
- **Maintainability**: Navigation centralized in templates, not scattered across HTML files
- **Test Coverage**: All 10 blog functionality tests passing with template system

### Technical Implementation
- **Template Structure**: `page-blogs` template with dedicated content and navigation areas
- **Routing Updates**: Both blog routing paths use `routes['blogs']` template
- **Helper Functions**: DRY navigation pattern with configurable styling and error handling
- **Test Suite**: `dry-navigation.spec.ts` with 7 comprehensive tests covering all navigation patterns

## [1.8.1] - 2025-01-15

### Added
- **Data-Driven Configuration Pattern**: Comprehensive refactoring to prevent configuration-related bugs
  - **Single Source of Truth**: Unified `categoryConfig` object replacing separate `catNames` and `categoryTexts`
  - **Complete Schema**: Each category includes `label`, `description`, `icon`, and `color` properties
  - **Runtime Validation**: Validates all required properties and prevents duplicate labels
  - **Factory Pattern**: Helper functions with graceful fallbacks for missing categories
  - **Type Safety**: JSDoc annotations for development-time validation

### Enhanced
- **Visual Differentiation System**: Configuration-driven color assignment for content types
  - **Blog Posts**: Amber hover accents (`hover:border-amber-500`)
  - **Guides** (Linux/Career): Blue hover accents (`hover:border-blue-500`)
  - **Default**: Emerald hover accents (`hover:border-emerald-600`)
- **Comprehensive Test Coverage**: 11 tests covering all functionality and edge cases
  - **Configuration Validation**: Tests for complete category configurations
  - **Error Handling**: Tests for invalid categories and missing configurations
  - **Visual Differentiation**: Tests for proper styling based on content type
  - **Before/After Validation**: Ensures identical behavior after refactoring

### Fixed
- **Configuration Bug Prevention**: Original missing description bug cannot happen again
- **Maintainability**: Single place to add/modify categories with automatic validation
- **Extensibility**: Easy to add new properties (e.g., `sortOrder`, `isActive`)

### Technical Implementation
- **Unified Configuration**: `categoryConfig` object with complete schema for all categories
- **Runtime Validation**: `validateCategoryConfig()` function with comprehensive checks
- **Helper Functions**: `createCategoryHelpers()` factory pattern for category operations
- **Visual Integration**: Dynamic color assignment based on category configuration
- **Test Suite**: `category-configuration.spec.ts` with 11 comprehensive tests

## [1.7.19] - 2025-09-29

### Enhanced
- **QR Code Manager Layout Improvements**: Comprehensive redesign of the full-screen QR Code Manager interface
  - **Unified Box Design**: URL/Length and Controls boxes now share the same width via common container
  - **Improved Layout Order**: Length information appears below URL input for better visual hierarchy
  - **Full-Width URL Input**: URL input field spans the full width of its container for better usability
  - **Simplified Responsive Design**: Single 600px breakpoint for cleaner responsive behavior
  - **Component Isolation**: All CSS moved from HTML to JavaScript file for better component architecture
  - **Consistent Styling**: Both PNG and SVG download buttons use identical gray styling
  - **Enhanced Download Options**: Separate PNG and SVG download buttons with dynamic filename generation

### Technical Implementation
- **Common Container Architecture**: Both control boxes constrained by same `max-width: 400px`
- **CSS Consolidation**: Moved `.qr-fullscreen` styles from HTML to JavaScript for self-contained components
- **Responsive Simplification**: Removed multiple breakpoints in favor of single 600px transition
- **Dynamic Input Sizing**: URL input maintains full-width behavior while respecting container constraints
- **Download Format Support**: Enhanced `downloadQR()` method supports both PNG and SVG formats with proper MIME types

## [1.6.14] - 2025-09-25

### Added
- **Enhanced Error Detection**: Context-aware error detection that avoids false positives
- **HTTP Status Validation**: Basic HTTP status code checking for navigation requests
- **Testing Roadmap**: Comprehensive roadmap for future testing improvements
- **Legitimate Content Whitelist**: Whitelist of known legitimate content patterns

### Changed
- **Error Detection Logic**: Improved to distinguish between actual HTTP errors and legitimate content
- **Test Reporting**: Enhanced error messages with HTTP status information
- **Environment References**: Fixed all `testing_env` references to use `selenium_env`

### Technical Implementation
- **Context-Aware Detection**: `detect_actual_errors()` method with pattern matching
- **HTTP Status Checking**: `check_http_status()` method for basic validation
- **Enhanced Debugging**: Improved error reporting with comprehensive status details
- **Documentation**: Updated all testing-related documentation

## [1.6.13] - 2025-09-25

### Added
- **Footer QR Code**: 64x64px SVG QR code in footer with custom colors
- **Version Tooltip System**: Hover tooltip showing full version information
- **QR Panel Auto-Close**: Automatically closes when navigating between pages

### Changed
- **QR Code Technology**: Canvas-based → SVG-based for crisp display
- **Footer Layout**: Restructured to vertical layout with centered version number
- **QR Panel Positioning**: Opens above QR code for better UX
- **Footer Padding**: Reduced from `py-6` to `py-1` for compact design
- **Version Display**: Consolidated hover area for copyright and version
- **Copyright Attribution**: Updated to show "© 2025 Zachary Hartmann (President, CCRI Cyber Club)"

### Technical Implementation
- **SVG Generation**: Uses `QRCode.toString()` with SVG output
- **Custom Colors**: Dark blue-green (`#001011`) and light cream (`#f4e4c1`) for print compatibility
- **Modal Integration**: QR code opens modal when clicked
- **Clean Code**: Removed extraneous canvas elements and unused functions
- **Unified Hover**: Single tooltip area for footer text elements

## [1.5.5]

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

## [1.5.4]

### Added
- **Comprehensive QR Code Documentation**: Complete documentation system for QR code integration
  - **Document README**: `document/README.md` with implementation details and replication guide
  - **Scripts README**: `scripts/README.md` with QR code generation system documentation
  - **Cross-Reference Network**: All documentation files now properly reference QR code system

### Changed
- **Spelling Correction**: Fixed "Cheat Sheet" to "Cheatsheet" for consistency
- **Documentation Integration**: Enhanced all major documentation files with QR code references

### Technical Implementation
- **Documentation Architecture**: Comprehensive cross-referenced documentation system
- **Replication Framework**: Complete guides for extending QR code system to other guides
- **Version Management**: Updated to v1.5.4 with proper changelog documentation

## [1.5.3]

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
- **Updated QR-UI.md**: Added section on educational guide QR integration
- **Cross-Referenced Documentation**: Ensured all relevant docs reference the new QR system

## [1.5.2]

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

## [1.5.1]

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

## [1.5.0]

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
  - Modern version management with single source of truth (version.json)
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

## [1.4.2]

### Added
- Automated version management system
- Pre-commit hooks for version bumping
- Conventional commit support
- Version display in footer with commit information tooltip

### Changed
- Version management from manual to automated
- Git workflow integration for versioning

## [1.4.1]

### Added
- Modern Playwright test suite with cross-browser support
- Automated testing for routing, QR codes, and cross-page navigation
- Testing documentation and methodology
- Cross-browser compatibility testing

### Fixed
- Layout issues identified through automated testing
- Navigation positioning problems
- Footer visibility issues

## [1.4.0]

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
npm run version:show

# Force specific version bump
npm run release:patch   # 1.5.1 → 1.5.2
npm run release:minor   # 1.5.1 → 1.6.0
npm run release:major   # 1.5.1 → 2.0.0
```

---

## Related Documentation

- [UI](UI.md) - Comprehensive UI documentation including design evolution
- [Versioning](VERSIONING.md) - Current tag-based deployment and versioning system documentation
- [Architecture Overview](ARCHITECTURE.md) - Overall system architecture
- [UI](UI.md) - UI enhancement documentation
- [Testing Strategy](TESTING.md) - Testing approach and implementation
