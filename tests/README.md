# Testing System - Comprehensive Testing Suite

## Overview

This project uses a **dual-layer testing approach**:
1. **Playwright** for comprehensive end-to-end testing (links, navigation, UI)
2. **Python QR Code Testing Suite** for QR code generation, validation, and debugging

The modern approach provides better performance, reliability, and cross-browser support for web testing, plus robust QR code validation capabilities.

## Quick Start

### Web Testing (Playwright)
```bash
# Run comprehensive tests (links + version display)
npm run test:links

# Debug mode with visible browser
npm run test:debug

# Interactive UI mode
npm run test:ui

# Test on specific devices
npx playwright test --project=pixel-7a
npx playwright test --project=mobile-chrome
```

### QR Code Testing (Python)
```bash
# Generate QR codes and create test page
python3 tests/qr-code-testing/gen_and_embed.py

# Run complete troubleshooting pipeline
python3 tests/qr-code-testing/qr_troubleshoot.py

# Run unit tests
python3 -m pytest tests/qr-code-testing/test_qr_pytest.py -v

# Quick QR code testing
python3 tests/qr-code-testing/qr_test.py "https://example.com" output.png
```

## Test Suites

### Web Testing (Playwright)
- **`npm run test:links`** - Main comprehensive test (links + version display)
- **`npm run test:debug`** - Debug mode with visible browser
- **`npm run test:ui`** - Interactive UI mode
- **`npm run test:qr-urls`** - QR code URL validation (production routes)
- **`npm run test:qr-urls:smoke`** - Fast QR URL validation (PR checks)
- **`npm run test:qr-urls:full`** - Comprehensive QR URL validation (all routes)

### Mobile Layout Testing
- **`npm run test:mobile`** - Test Pixel 7a mobile layout integrity
- **`npm run test:mobile:all`** - Test all mobile viewports (Pixel 7a, iPhone 13, small Android)
- **`npm run test:mobile:cutoff`** - Test mobile cutoff prevention (content not cut off at bottom)
- **`npm run test:desktop`** - Test desktop layout integrity

**⚠️ PREREQUISITE**: Start dev server first:
```bash
python3 -m http.server 8000 &
```

### Device Testing
- **`--project=pixel-7a`** - Google Pixel 7a emulation (414×794, Android 13)
- **`--project=mobile-chrome`** - Pixel 5 fallback mobile device
- **`--project=desktop-chrome`** - Your actual desktop viewport (1867×963)
- **`--project=chromium`** - Desktop Chrome browser
- **`--project=firefox`** - Desktop Firefox browser
- **`--project=webkit`** - Desktop Safari browser

### QR Code Testing (Python)
- **`qr-code-testing/gen_and_embed.py`** - QR code generation and HTML embedding
- **`qr-code-testing/playwright_validate.py`** - Visual validation using Playwright
- **`qr-code-testing/test_qr_pytest.py`** - Comprehensive unit tests (7 test cases)
- **`qr-code-testing/qr_troubleshoot.py`** - Complete debugging pipeline
- **`qr-code-testing/qr_test.py`** - Command-line tool for quick testing
- **`qr-code-testing/test_qr_simple.py`** - Basic QR code generation and visual verification
- **`qr-code-testing/test_qr_decode.py`** - QR code decoding using external web services
- **`qr-code-testing/test_qr_unit.py`** - Comprehensive unit testing of QR code generation
- **`qr-code-testing/test_qr_integration.py`** - Simplified integration test for CI/CD
- **`qr-code-testing/test_qr_code_decoding.py`** - QR code decoding validation

### QR Code Manager Unit Tests (Playwright)
- **`qr-code-manager-unit.spec.ts`** - Unit tests for QRCodeManager logic with mocked events
- **`test-qr-no-hover-scale.spec.ts`** - Visual integrity tests (no hover scale, pixel-perfect rendering)
- **`qr-code-url-validation.spec.ts`** - SPA routing QR code URL validation
- **`qr-mobile-viewport.spec.ts`** - Mobile viewport and responsive design tests

### QR Modal Testing (Playwright)
- **`qr-modal-desired-state.spec.ts`** - Tests to ensure QR modal opens to desired state (large QR code dominating viewport)
- **`qr-modal-proportions.spec.ts`** - Tests to ensure QR modal container maintains square-ish proportions
- **`qr-modal-screenshot-test.spec.ts`** - Visual regression tests for QR modal on different devices
- **`qr-modal-visual-regression-real.spec.ts`** - Real-world visual regression testing
- **`qr-modal-mobile-test.spec.ts`** - Mobile-specific QR modal functionality tests
- **`qr-modal-regression-prevention.spec.ts`** - Tests to prevent QR modal regressions
- **`debug-dom-structure.spec.ts`** - Diagnostic test to inspect QR modal DOM hierarchy
- **`debug-qr-content.spec.ts`** - Diagnostic test to inspect QR modal content structure

## Device Emulation & Mobile Testing

### Google Pixel 7a Emulation

The Playwright configuration includes a custom **Google Pixel 7a** device profile for accurate mobile testing:

#### **Device Specifications**
- **CSS Viewport**: 414 × 794 px (actual browser viewport)
- **Device Scale Factor**: 2.61 (actual DPR from whatismyviewport.com)
- **Screen Size**: 414 × 920 px (total screen in CSS pixels)
- **User Agent**: Android 13, Chrome 120
- **Touch Support**: Enabled
- **Mobile**: True

#### **US-Specific Defaults**
- **Locale**: en-US
- **Timezone**: America/New_York
- **Geolocation**: Providence, RI (CCRI location)
- **Permissions**: Geolocation enabled

#### **Usage Examples**

```bash
# Test on Pixel 7a specifically
npx playwright test --project=pixel-7a

# Test on your actual desktop viewport
npx playwright test --project=desktop-chrome

# Test QR code functionality on mobile
npx playwright test tests/qr-code-url-validation.spec.ts --project=pixel-7a

# Test mobile viewport issues
npx playwright test tests/qr-mobile-viewport.spec.ts --project=pixel-7a

# Debug mobile layout issues
npx playwright test --project=pixel-7a --debug
```

#### **Mobile-Specific Test Scenarios**
- **QR Code Scanning**: Test QR code visibility and scanning on mobile devices
- **Touch Interactions**: Verify touch targets are appropriately sized
- **Viewport Responsiveness**: Ensure layout works on mobile screens
- **Performance**: Test loading times on mobile networks
- **Accessibility**: Verify mobile accessibility features

### Available Device Projects

| Project | Device | Viewport | Use Case |
|---------|--------|----------|----------|
| `pixel-7a` | Google Pixel 7a | 414×794 | Primary mobile testing |
| `mobile-chrome` | Pixel 5 | 393×851 | Fallback mobile device |
| `desktop-chrome` | Your Desktop | 1867×963 | Your actual desktop viewport |
| `chromium` | Desktop Chrome | 1280×720 | Standard desktop testing |
| `firefox` | Desktop Firefox | 1280×720 | Cross-browser testing |
| `webkit` | Desktop Safari | 1280×720 | Cross-browser testing |

## Mobile Layout Integrity Testing

### Overview

The Mobile Layout Integrity Testing system prevents viewport clipping issues and ensures all content is visible or scrollable across different devices. This system catches layout bugs before they reach production.

### Problem Solved

**Issue**: QR modal content was being clipped on mobile devices due to fixed viewport heights and missing bottom padding. Additionally, the modal backdrop wasn't properly covering the page content, allowing it to show through.

**Root Cause**: CSS `h-screen` constraints, insufficient responsive design for mobile viewports, and stacking context issues where the modal was constrained by its parent container.

### Solution Implemented

- **Precise Viewport Definitions**: Exact device viewports from whatismyviewport.com
- **Comprehensive Testing**: All critical elements tested for visibility and scrollability
- **Visual Regression**: Screenshot comparison to catch layout changes
- **Cross-Device Consistency**: Behavior verification across multiple devices
- **Mobile Cutoff Prevention**: Dynamic viewport height (dvh) and overflow scrolling
- **Stacking Context Fix**: Modal moved to document.body level to escape parent container constraints
- **Backdrop Coverage**: Increased z-index to 9999 and opacity to 1.0 for proper page content hiding

### Test Coverage

- **Mobile Viewports**: Pixel 7a (414×794), iPhone 13 (390×844), small Android (360×740)
- **Desktop Viewports**: Your desktop (1867×963), laptop (1280×720), tablet (768×1024)
- **Layout Integrity**: All critical elements visible or scrollable
- **Scroll Behavior**: Page scrolls when content exceeds viewport
- **Viewport Stability**: Layout remains stable when viewport height changes
- **Visual Regression**: Screenshot comparison for layout changes

### Usage

```bash
# Test Pixel 7a mobile layout
npm run test:mobile

# Test all mobile viewports
npm run test:mobile:all

# Test desktop layout
npm run test:desktop

# Test specific device
npx playwright test tests/mobile-layout-integrity.spec.ts --project=pixel-7a
```

### Test Categories

#### **Layout Integrity Tests**
- **Element Visibility**: Critical elements are visible or scrollable
- **Scroll Behavior**: Page scrolls when content exceeds viewport
- **Viewport Stability**: Layout remains stable when viewport height changes

#### **Visual Regression Tests**
- **Screenshot Comparison**: Layout changes are caught automatically
- **Cross-Device Consistency**: Behavior verification across devices

#### **Critical Elements Tested**
- QR Code display
- URL input field
- Length display
- Error correction controls
- Download buttons
- Close button

### Architecture

The testing system uses:
- **Precise Viewport Definitions**: Exact device specifications
- **Element Visibility Checks**: `isVisible()` and `scrollIntoViewIfNeeded()`
- **Scroll Metrics**: `scrollHeight` vs `clientHeight` comparison
- **Screenshot Regression**: Visual change detection
- **Cross-Device Testing**: Multiple viewport validation

## QR Code URL Validation System

### Overview

The QR Code URL Validation System prevents SPA routing issues where footer QR codes encode incorrect URLs. This system ensures QR codes always point to the correct current page URL.

### Problem Solved

**Issue**: Footer QR codes in Single Page Application (SPA) were encoding incorrect URLs, directing users to the home page instead of the current route.

**Root Cause**: QRCodeManager initialized on `DOMContentLoaded` but SPA routing processed hash changes after DOM ready, causing timing mismatch.

### Solution Implemented

- **Hashchange Listener**: Updates QR URL when routes change
- **Comprehensive Testing**: Playwright test suite covering all SPA routes
- **Performance Optimized**: ~5 second execution time
- **CI/CD Integration**: Automated validation in deployment pipeline

### Test Coverage

- All SPA routes have correct QR URLs
- QR URL updates on route navigation
- Direct navigation initializes correctly
- Edge cases: back/forward navigation, deep links, programmatic navigation

### Usage

   ```bash
# Quick validation (5 seconds)
npm run test:qr-urls

# Fast PR validation (smoke tests)
npm run test:qr-urls:smoke

# Comprehensive validation (all routes)
npm run test:qr-urls:full
```

### Test Routes

The system validates these SPA routes:
- `#/home` - Home page
- `#/guides/linux-cheatsheet-1.html` - Linux Cheatsheet 1
- `#/guides/linux-cheatsheet-2.html` - Linux Cheatsheet 2
- `#/guides/linux-cheatsheet-3.html` - Linux Cheatsheet 3
- `#/resources` - Resources page
- `#/calendar` - Calendar page

### Architecture Validation

The hashchange listener approach is optimal for hash-based SPAs, providing:
- Direct coupling to routing events
- Simple, maintainable implementation
- Future-proofing for history-based routing
- Comprehensive edge case coverage

## QR Code Manager Unit Testing

### Overview

The QR Code Manager Unit Testing system provides comprehensive testing of the QRCodeManager JavaScript class using Playwright with mocked events and isolated testing environments.

### Test Categories

#### 1. **Unit Tests** (`qr-code-manager-unit.spec.ts`)
- **Purpose**: Test QRCodeManager logic with mocked events
- **Coverage**: Constructor initialization, hashchange events, popstate events, pushState/replaceState wrapping
- **Approach**: Mock QRCodeManager class with event listeners
- **Benefits**: Fast execution, isolated testing, logic validation

#### 2. **Visual Integrity Tests** (`test-qr-no-hover-scale.spec.ts`)
- **Purpose**: Ensure QR codes maintain visual integrity for proper scanning
- **Coverage**: No hover scale effects, pixel-perfect rendering, no animations
- **Critical**: QR codes must never have scale effects that could blur the code
- **Validation**: CSS class checking, computed style analysis

#### 3. **SPA Routing Tests** (`qr-code-url-validation.spec.ts`)
- **Purpose**: Validate QR code URL accuracy in Single Page Applications
- **Coverage**: Route navigation, direct deep links, back/forward navigation
- **Performance**: ~5 second execution time
- **Integration**: Production URL validation

#### 4. **Mobile Viewport Tests** (`qr-mobile-viewport.spec.ts`)
- **Purpose**: Ensure QR Code Manager works correctly on mobile devices
- **Coverage**: Viewport changes, responsive design, mobile interactions
- **Validation**: Horizontal scrolling prevention, green border maintenance

### Testing Strategy

#### **Dual-Layer Approach**
1. **Playwright Integration Tests**: Test actual browser behavior (5s runtime)
2. **Unit Tests**: Mocked events for logic validation (fast execution)

#### **Performance Optimization**
- **Smoke/Full Test Split**: Fast PR validation vs comprehensive testing
- **Parallel Execution**: Playwright supports parallel workers
- **Headless Mode**: GPU disabled for CI performance

#### **Edge Case Coverage**
- Back/Forward Navigation: Browser button rapid clicking
- Direct Deep Link Refresh: Page reload on specific routes
- Programmatic Navigation: Router pushes new hash without user interaction
- Multiple Rapid Navigation: Fast user navigation sequences
- History API Integration: pushState/replaceState wrapping
- URL Normalization: Trailing slashes and query strings

### Usage

   ```bash
# Run all QR Code Manager tests
npx playwright test tests/qr-code-manager-unit.spec.ts
npx playwright test tests/test-qr-no-hover-scale.spec.ts
npx playwright test tests/qr-code-url-validation.spec.ts
npx playwright test tests/qr-mobile-viewport.spec.ts

# Run specific test categories
npx playwright test tests/qr-code-manager-unit.spec.ts --grep="hashchange"
npx playwright test tests/test-qr-no-hover-scale.spec.ts --grep="hover scale"
```

### CI/CD Integration

```yaml
# GitHub Actions
- name: QR Code Manager Tests
  run: |
    npm run test:qr-urls:smoke
    npx playwright test tests/qr-code-manager-unit.spec.ts
    npx playwright test tests/test-qr-no-hover-scale.spec.ts
```

## QR Code Testing Suite - Detailed Documentation

### **Core Scripts Overview**

The QR code testing suite provides comprehensive tools for generating, validating, and debugging QR codes used throughout the project. This system was created to solve the "white QR codes" issue and provides production-ready testing capabilities.

### **1. `gen_and_embed.py` - QR Code Generator**

**Purpose**: Generate QR codes with proper Base64 embedding and create HTML test pages.

**Features**:
- Multiple error correction levels (L, M, Q, H)
- Configurable box sizes and borders
- RGBA image format for better compatibility
- Metadata generation (JSON)
- Base64 roundtrip validation
- HTML test page creation

**Usage**:
```bash
python3 tests/qr-code-testing/gen_and_embed.py
```

**Output Files**:
- `out/qr_*.png` - QR code images
- `out/qr_*.b64.txt` - Base64 encoded data
- `out/qr_*.meta.json` - Metadata (URL, dimensions, settings)
- `out/index.html` - Test page with embedded QR codes

**Test URLs**:
- Home page: `https://ccri-cyberknights.github.io/page/`
- Cheatsheet 3: `https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html`
- Video 1: YouTube URL for Linux tutorial
- Video 2: YouTube URL for Linux tutorial

**Key Functions**:
- `gen_qr(id, data, box_size, border, error)` - Generate QR code
- `make_html(ids)` - Create HTML test page
- `verify_b64_roundtrip(id)` - Validate Base64 encoding

### **2. `playwright_validate.py` - Visual Validation**

**Purpose**: Diagnose QR code rendering issues using Playwright browser automation.

**Features**:
- DOM property inspection (`naturalWidth`, `naturalHeight`)
- Computed style analysis
- Visibility checks
- Screenshot generation
- Detailed issue reporting
- CSS overlay detection

**Usage**:
```bash
python3 tests/qr-code-testing/playwright_validate.py [html_path]
```

**Output Files**:
- `out/playwright_screenshot.png` - Full page screenshot
- `out/playwright_results.json` - Detailed validation results

**Diagnostic Checks**:
- Image loading status (natural dimensions)
- CSS visibility properties
- Parent element styling
- Base64 data integrity
- Browser rendering issues

**Common Issues Detected**:
- Images not loaded (natural dimensions = 0)
- CSS hiding elements (opacity, display, visibility)
- Invalid data URI format
- Base64 data truncation
- CSS overlay problems

### **3. `test_qr_pytest.py` - Unit Tests**

**Purpose**: Comprehensive automated testing for CI/CD integration.

**Test Categories**:
- **QR Generation Tests** (3 tests):
  - Basic QR code generation
  - Different sizes and parameters
  - Base64 roundtrip validation
- **Validation Tests** (2 tests):
  - Content validation
  - Error correction levels
- **Integration Tests** (2 tests):
  - HTML generation
  - Complete pipeline

**Usage**:
```bash
# Run all tests
python3 -m pytest tests/qr-code-testing/test_qr_pytest.py -v

# Run specific test class
python3 -m pytest tests/qr-code-testing/test_qr_pytest.py::TestQRGeneration -v

# Run single test
python3 -m pytest tests/qr-code-testing/test_qr_pytest.py::TestQRGeneration::test_qr_generation_basic -v
```

**Test Results**:
```
============================== 7 passed in 0.12s ===============================
tests/test_qr_pytest.py::TestQRGeneration::test_qr_generation_basic PASSED
tests/test_qr_pytest.py::TestQRGeneration::test_qr_generation_different_sizes PASSED
tests/test_qr_pytest.py::TestQRGeneration::test_base64_roundtrip PASSED
tests/test_qr_pytest.py::TestQRGeneration::test_html_generation PASSED
tests/test_qr_pytest.py::TestQRValidation::test_qr_content_validation PASSED
tests/test_qr_pytest.py::TestQRValidation::test_error_correction_levels PASSED
tests/test_qr_pytest.py::TestQRIntegration::test_complete_pipeline PASSED
```

### **4. `qr_troubleshoot.py` - Debugging Pipeline**

**Purpose**: Complete end-to-end troubleshooting and artifact generation for engineers.

**Features**:
- Automated generation → validation → reporting pipeline
- Debug package creation (ZIP with all artifacts)
- Step-by-step diagnosis
- Engineer-ready reports
- Comprehensive file verification

**Usage**:
```bash
python3 tests/qr-code-testing/qr_troubleshoot.py
```

**Pipeline Steps**:
1. **Generate QR Codes** - Create PNG, Base64, and metadata files
2. **Verify Generated Files** - Check file sizes and existence
3. **Playwright Validation** - Visual rendering checks
4. **Create Debug Package** - ZIP file with all artifacts
5. **Generate Report** - Next steps and common fixes

**Output Files**:
- `qr_debug_TIMESTAMP.zip` - Complete debug package
- `debug_summary.json` - Pipeline results summary

**Debug Package Contents**:
- All generated PNG files
- Base64 text files
- JSON metadata
- HTML test page
- Playwright screenshots
- Test scripts
- Results JSON

### **5. `qr_test.py` - Command-Line Tool**

**Purpose**: Quick on-demand QR code generation and decoding for developers.

**Usage**:
```bash
# Generate QR code
python3 tests/qr-code-testing/qr_test.py "https://example.com" output.png

# Decode QR code
python3 tests/qr-code-testing/qr_test.py --decode input.png

# Get base64 QR code
python3 tests/qr-code-testing/qr_test.py --base64 "https://example.com"
```

**Features**:
- Lightweight and portable
- External API decoding
- Base64 generation
- File validation
- Success/failure reporting

**Example Output**:
```
Generating QR code for: https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html
QR code saved to: /tmp/test_cli.png
QR code size: 410x410
Decoded content: https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html
✅ Success: True
```

### **6. Supporting Files**

#### **`qr-code-testing/requirements.txt`**
Python dependencies for QR code testing:
```
qrcode>=7.4.2
Pillow>=10.0.0
requests>=2.31.0
pytest>=7.4.0
playwright>=1.40.0
```

#### **`qr-code-testing/QR-TESTING.md`**
Comprehensive documentation for QR code testing tools, including:
- Tool overview and usage
- Test URLs and expected results
- Dependencies and installation
- Integration with project
- Troubleshooting guide
- Future enhancements

#### **`qr-code-testing/QR-SOLUTION-SUMMARY.md`**
Complete solution documentation including:
- Problem analysis and resolution
- Architecture overview
- Test results summary
- Usage instructions
- Technical specifications
- Next steps and recommendations

## Modern Approach Benefits

### Web Testing (Playwright)
- **3-5x Faster**: Significant performance improvements
- **Cross-Browser**: Chrome, Firefox, Safari support
- **Ephemeral Results**: No persistent logging, focus on actionable outcomes
- **Better Reliability**: More stable than Selenium
- **Modern Tooling**: TypeScript support, better debugging

### QR Code Testing (Python)
- **Comprehensive Validation**: Generation, encoding, decoding, rendering
- **Multiple Test Layers**: Unit tests, integration tests, visual validation
- **Debugging Tools**: Complete troubleshooting pipeline with artifacts
- **CI/CD Ready**: Automated testing for deployment pipelines
- **Developer Friendly**: CLI tools and detailed error reporting

## Migration from Selenium

The project has migrated from Selenium WebDriver to Playwright. All legacy Python tests have been removed in favor of the modern JavaScript/TypeScript approach.

**Legacy system removed**: Selenium WebDriver, Python virtual environment, and all Python test files have been eliminated to simplify the project structure and improve maintainability.

## Test Configuration

Tests are configured in `playwright.config.ts` with:
- Cross-browser testing (Chrome, Firefox, Safari)
- Automatic screenshots and videos on failure
- Trace collection for debugging
- Optimized timeouts and retries

## Performance Monitoring

The modern system includes performance monitoring:
- Link testing throughput metrics
- Execution time tracking
- CI/CD optimization insights
- Fail-fast approach for broken links

## Environment Differences

The project operates in two distinct environments with different URL structures:

### Local Development Environment
- **URL**: `http://localhost:8000` or `http://127.0.0.1:8000`
- **File Paths**: Root-relative (e.g., `/version.json`, `/js/version-display.js`)
- **Server**: Python HTTP server (`python -m http.server 8000`)
- **Testing**: Direct file system access

### Production Environment (GitHub Pages)
- **URL**: `https://ccri-cyberknights.github.io/page`
- **File Paths**: Subdirectory-relative (e.g., `/page/version.json`, `/page/js/version-display.js`)
- **Server**: GitHub Pages CDN
- **Testing**: Live deployment verification

### Mobile Back Button Testing

**File**: `mobile-back-button.spec.ts`

**Purpose**: Ensures critical mobile UX functionality works correctly.

**Key Tests**:
- Image modals close with mobile back button
- Resource card modals close with mobile back button
- Multiple modal scenarios work correctly
- Navigation integrity is preserved

**Mobile Viewport**: Tests run in 375x667 (iPhone SE) viewport to simulate real mobile devices.

**Critical UX**: This prevents users from being trapped in modals on mobile devices.

### Automatic Environment Detection

The application automatically detects the environment and adjusts behavior:

```javascript
// Example from js/version-display.js
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
const versionUrl = isLocalhost ? '/version.json' : '/page/version.json';
```

This pattern ensures:
- **No 404 errors** during local development
- **Correct paths** for production deployment
- **Seamless testing** across both environments

### Testing Both Environments
```bash
# Test both local and production environments
npm run test:links

# Debug mode for troubleshooting
npm run test:debug
```

## QR Code Testing - Troubleshooting

### Common Issues and Solutions

#### **White QR Codes Issue**
**Problem**: QR codes appear as white boxes in HTML
**Solution**: Use `gen_and_embed.py` with proper Base64 encoding
**Debug**: Run `qr_troubleshoot.py` for complete diagnosis

#### **Base64 Encoding Problems**
**Problem**: Invalid data URI format
**Check**: Verify `data:image/png;base64,` prefix
**Fix**: Use `verify_b64_roundtrip()` function

#### **Playwright Validation Failures**
**Problem**: Images not loading in browser
**Debug**: Check `naturalWidth` and `naturalHeight` properties
**Solution**: Use `playwright_validate.py` for detailed analysis

#### **Unit Test Failures**
**Problem**: Tests failing in CI/CD
**Check**: Ensure `out/` directory exists
**Fix**: Use proper pytest fixtures for temp directories

### Debugging Workflow

1. **Quick Check**: `python3 tests/qr-code-testing/qr_test.py --decode qr_file.png`
2. **Full Diagnosis**: `python3 tests/qr-code-testing/qr_troubleshoot.py`
3. **Visual Validation**: `python3 tests/qr-code-testing/playwright_validate.py`
4. **Unit Tests**: `python3 -m pytest tests/qr-code-testing/test_qr_pytest.py -v`

### Integration with Project

#### **CI/CD Integration**
```yaml
# Add to GitHub Actions workflow
- name: QR Code Tests
  run: |
    pip install -r tests/qr-code-testing/requirements.txt
    python3 -m pytest tests/qr-code-testing/test_qr_pytest.py -v
```

#### **Pre-commit Hook**
```bash
# Add to .husky/pre-commit
python3 tests/qr-code-testing/qr_troubleshoot.py
```

#### **Development Workflow**
1. **Generate QR codes**: `python3 tests/qr-code-testing/gen_and_embed.py`
2. **Validate rendering**: `python3 tests/qr-code-testing/playwright_validate.py`
3. **Run tests**: `python3 -m pytest tests/qr-code-testing/test_qr_pytest.py -v`
4. **Debug issues**: `python3 tests/qr-code-testing/qr_troubleshoot.py`

## General Troubleshooting

For web testing issues, see:
- `docs/TROUBLESHOOTING.md` - General troubleshooting
- `docs/TESTING.md` - Testing documentation
- `docs/SELENIUM-CUTOVER-PLAN.md` - Migration details

## Development Workflow

### Web Testing Workflow
1. **Pre-commit**: Automatic comprehensive testing (links + version display)
2. **CI/CD**: GitHub Actions with Playwright
3. **Local Development**: Use `npm run test:debug` for debugging
4. **Performance**: Monitor with `npm run test:links`

### QR Code Testing Workflow
1. **Development**: Use `python3 tests/qr-code-testing/qr_test.py` for quick testing
2. **Validation**: Run `python3 tests/qr-code-testing/gen_and_embed.py` to generate test files
3. **Visual Check**: Use `python3 tests/qr-code-testing/playwright_validate.py` for rendering validation
4. **Unit Tests**: Run `python3 -m pytest tests/qr-code-testing/test_qr_pytest.py -v` before commits
5. **Debugging**: Use `python3 tests/qr-code-testing/qr_troubleshoot.py` for complete diagnosis

### Combined Workflow
1. **Pre-commit**: Both web tests (`npm run test:links`) and QR tests (`pytest`)
2. **CI/CD**: GitHub Actions with Playwright + Python QR testing
3. **Local Development**: Use debug modes for both systems
4. **Performance**: Monitor both web performance and QR code generation