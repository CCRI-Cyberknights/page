# Testing System - Modern Playwright Approach

## Overview

This project uses **Playwright** for comprehensive end-to-end testing, replacing the legacy Selenium WebDriver system. The modern approach provides better performance, reliability, and cross-browser support.

## Quick Start

```bash
# Run comprehensive tests (links + version display)
npm run test:links

# Debug mode with visible browser
npm run test:debug

# Interactive UI mode
npm run test:ui
```

## Test Suites

### Comprehensive Testing
- **`npm run test:links`** - Main comprehensive test (links + version display)
- **`npm run test:debug`** - Debug mode with visible browser
- **`npm run test:ui`** - Interactive UI mode

## Modern Approach Benefits

- **3-5x Faster**: Significant performance improvements
- **Cross-Browser**: Chrome, Firefox, Safari support
- **Ephemeral Results**: No persistent logging, focus on actionable outcomes
- **Better Reliability**: More stable than Selenium
- **Modern Tooling**: TypeScript support, better debugging

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

## Troubleshooting

For testing issues, see:
- `docs/TROUBLESHOOTING.md` - General troubleshooting
- `docs/TESTING.md` - Testing documentation
- `docs/SELENIUM-CUTOVER-PLAN.md` - Migration details

## Development Workflow

1. **Pre-commit**: Automatic comprehensive testing (links + version display)
2. **CI/CD**: GitHub Actions with Playwright
3. **Local Development**: Use `npm run test:debug` for debugging
4. **Performance**: Monitor with `npm run test:links`