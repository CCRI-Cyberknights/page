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