# Testing System - Modern Playwright Approach

## Overview

This project uses **Playwright** for comprehensive end-to-end testing, replacing the legacy Selenium WebDriver system. The modern approach provides better performance, reliability, and cross-browser support.

## Quick Start

```bash
# Run all link tests
npm run test:links

# Run modern Playwright tests
npm run test:links:modern

# Debug mode with visible browser
npm run test:links:modern:debug

# Interactive UI mode
npm run test:links:modern:ui
```

## Test Suites

### Link Testing
- **`npm run test:links`** - Main link testing (comprehensive)
- **`npm run test:links:modern`** - Modern ephemeral approach
- **`npm run test:links:playwright`** - Full Playwright suite

### Versioning Diagnostics
- **`npm run test:versioning`** - Version pipeline diagnostics
- **`npm run version:diagnose`** - Quick version check

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

## Troubleshooting

For testing issues, see:
- `docs/TROUBLESHOOTING.md` - General troubleshooting
- `docs/TESTING.md` - Testing documentation
- `docs/SELENIUM-CUTOVER-PLAN.md` - Migration details

## Development Workflow

1. **Pre-commit**: Automatic link testing via Playwright
2. **CI/CD**: GitHub Actions with Playwright
3. **Local Development**: Use `npm run test:links:modern:debug` for debugging
4. **Performance**: Monitor with `npm run test:links:modern`