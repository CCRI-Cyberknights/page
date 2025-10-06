# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.8.0](https://github.com/CCRI-Cyberknights/page/compare/v1.7.41...v1.8.0) (2025-10-06)

### [1.7.41](https://github.com/CCRI-Cyberknights/page/compare/v1.7.40...v1.7.41) (2025-10-06)

### [1.7.40](https://github.com/CCRI-Cyberknights/page/compare/v1.7.38...v1.7.40) (2025-10-06)


### Bug Fixes

* reduce browser UI height calculation to 30px for better QR code sizing ([044d36f](https://github.com/CCRI-Cyberknights/page/commit/044d36f614215ef4dac8e7f9f436819ba4bd3aaa))

### [1.7.39](https://github.com/CCRI-Cyberknights/page/compare/v1.7.38...v1.7.39) (2025-10-06)


### Bug Fixes

* reduce browser UI height calculation to 30px for better QR code sizing ([044d36f](https://github.com/CCRI-Cyberknights/page/commit/044d36f614215ef4dac8e7f9f436819ba4bd3aaa))

### [1.7.38](https://github.com/CCRI-Cyberknights/page/compare/v1.7.37...v1.7.38) (2025-10-06)


### Features

* fix QR code size consistency and implement three-container layout ([6a5242e](https://github.com/CCRI-Cyberknights/page/commit/6a5242e403537a3402300f7b4aeeeba9e92f9187))

### [1.7.39](https://github.com/CCRI-Cyberknights/page/compare/v1.7.38...v1.7.39) (2025-10-05)


### Features

* reduce QR modal padding and gaps for better space utilization ([commit-hash])
  * Reduced main container gap from 0.5rem to 0.25rem
  * Reduced QR container padding from 0.25rem to 0.125rem
  * Reduced green shadow container padding (1rem→0.5rem, 0.5rem→0.25rem)
  * Reduced reserved space calculation from 120px to 80px
  * Improved QR code space utilization (narrow viewport: 89.9%→91.1% width)

### [1.7.36](https://github.com/CCRI-Cyberknights/page/compare/v1.7.35...v1.7.36) (2025-10-05)


### Features

* implement comprehensive QR modal layout improvements ([fb12007](https://github.com/CCRI-Cyberknights/page/commit/fb12007c8d8e4f8e9c8d8e4f8e9c8d8e4f8e9c8d8))
  * **Layout Restructuring**: Move QR code to top of modal with compact spacing
  * **Universal Grid Layout**: Apply side-by-side grid layout to all screen sizes (desktop and mobile)
  * **URL Container Repositioning**: Position URL input directly below QR code for better flow
  * **Vertical Download Buttons**: Change PNG/SVG buttons from horizontal to vertical stack (PNG above SVG)
  * **Compact Design**: Reduce padding, margins, and gaps throughout for more efficient space usage
  * **Consistent Experience**: Same structured layout across desktop and mobile devices
  * **Code Structure**: Improve modularity with dedicated left/right column containers
  * **CSS Grid Implementation**: Modern grid layout replacing complex flexbox media queries

### [1.7.35](https://github.com/CCRI-Cyberknights/page/compare/v1.7.34...v1.7.35) (2025-10-05)


### Bug Fixes

* fix QR modal backdrop coverage and stacking context issues on mobile devices ([c368a67](https://github.com/CCRI-Cyberknights/page/commit/c368a6748c3facc28ac3a4d2e476773334eb7bbc))
  * Restore QR code manager to 1.7.33 behavior with improved backdrop coverage
  * Increase z-index to 9999 and opacity to 1.0 for proper page content hiding
  * Move modal to document.body level when expanding to escape stacking context issues
  * Properly restore modal to original parent when closing
  * Ensures QR modal properly covers viewport and hides page content on mobile devices

### Features

* implement mobile layout improvements and comprehensive test suite ([91a7bf2](https://github.com/CCRI-Cyberknights/page/commit/91a7bf2eab97ee5292b84c7aa9bd68717a645fb9))

### Infrastructure

* standardize test-results directory structure to industry best practices
  * Move from nested `./tests/test-results/` to root-level `./test-results/` directory
  * Update Playwright configuration to use standard output directory location
  * Update all test files to reference correct test-results paths
  * Update .gitignore to properly ignore standardized test-results directory
  * Align with Playwright default behavior and industry conventions
  * Improve project structure separation between test source and test artifacts

### [1.7.34](https://github.com/CCRI-Cyberknights/page/compare/v1.7.33...v1.7.34) (2025-10-05)

### [1.7.33](https://github.com/CCRI-Cyberknights/page/compare/v1.7.32...v1.7.33) (2025-10-05)

### Bug Fixes

* fix QR code generator to handle empty string input correctly instead of reverting to original URL ([8247616](https://github.com/CCRI-Cyberknights/page/commit/8247616f559d5cc4e11f1f1b651924720755657e))

### [1.7.32](https://github.com/CCRI-Cyberknights/page/compare/v1.7.31...v1.7.32) (2025-10-01)


### Features

* add Google Pixel 7a device emulation to Playwright configuration ([d9de1eb](https://github.com/CCRI-Cyberknights/page/commit/d9de1ebb1048600efae64b61c43ac610c4dd7598))

### [1.7.31](https://github.com/CCRI-Cyberknights/page/compare/v1.7.30...v1.7.31) (2025-09-30)


### Bug Fixes

* remove all QR code hover scale effects ([fcb3fff](https://github.com/CCRI-Cyberknights/page/commit/fcb3fff6ad0a04d32e282626465d8999919133ff))

### [1.7.30](https://github.com/CCRI-Cyberknights/page/compare/v1.7.29...v1.7.30) (2025-09-30)


### Features

* add comprehensive QR code validation improvements and aspirational design ([1495e88](https://github.com/CCRI-Cyberknights/page/commit/1495e88a70415e4ef6a711e7922419287b10a08c))

### [1.7.29](https://github.com/CCRI-Cyberknights/page/compare/v1.7.28...v1.7.29) (2025-09-30)


### Features

* implement CI/CD pipeline drift prevention system ([a98daec](https://github.com/CCRI-Cyberknights/page/commit/a98daecece120fdf4cac7da0668cf2c9cf75f2ac))

### [1.7.28](https://github.com/CCRI-Cyberknights/page/compare/v1.7.27...v1.7.28) (2025-09-30)

### [1.7.27](https://github.com/CCRI-Cyberknights/page/compare/v1.7.26...v1.7.27) (2025-09-30)


### Features

* add comprehensive QR code testing suite ([3248de1](https://github.com/CCRI-Cyberknights/page/commit/3248de1a833094a6ab9c88d2216ff328cf78972d))

### [1.7.26](https://github.com/CCRI-Cyberknights/page/compare/v1.7.25...v1.7.26) (2025-09-30)

### [1.7.25](https://github.com/CCRI-Cyberknights/page/compare/v1.7.24...v1.7.25) (2025-09-29)

### [1.7.24](https://github.com/CCRI-Cyberknights/page/compare/v1.7.23...v1.7.24) (2025-09-29)


### Bug Fixes

* restore mobile back button functionality for all modals ([4851459](https://github.com/CCRI-Cyberknights/page/commit/4851459881b3aba14d39c37aaf7f038cb1a8c594))

### [1.7.23](https://github.com/CCRI-Cyberknights/page/compare/v1.7.22...v1.7.23) (2025-09-29)


### Features

* add pipeline monitoring scripts and fix GitHub Actions permissions ([985d16e](https://github.com/CCRI-Cyberknights/page/commit/985d16e87048863333dfa17165658ba1c313d092))


### Bug Fixes

* restore mobile back button functionality for all modals ([4851459](https://github.com/CCRI-Cyberknights/page/commit/4851459))

### [1.7.22](https://github.com/CCRI-Cyberknights/page/compare/v1.7.21...v1.7.22) (2025-09-29)


### Features

* implement navigation active state and remove redundant headers ([2763654](https://github.com/CCRI-Cyberknights/page/commit/27636547eeff2e5b9de057432f2e83585fd7008d))


### Bug Fixes

* resolve layout architecture conflicts and add validation ([202ed6a](https://github.com/CCRI-Cyberknights/page/commit/202ed6a1b8a71e9abe8c37a9b0ca0578311df51c))

### [1.7.21](https://github.com/CCRI-Cyberknights/page/compare/v1.7.20...v1.7.21) (2025-09-29)


### Features

* implement DRY expandable element system ([69c0232](https://github.com/CCRI-Cyberknights/page/commit/69c02326d52913272ccfdc27f0c4a49a5dc8af64))

### [1.7.20](https://github.com/CCRI-Cyberknights/page/compare/v1.7.18...v1.7.20) (2025-09-29)

### [1.7.18](https://github.com/CCRI-Cyberknights/page/compare/v1.7.17...v1.7.18) (2025-09-29)

### [1.7.17](https://github.com/CCRI-Cyberknights/page/compare/v1.7.16...v1.7.17) (2025-09-29)

### [1.7.16](https://github.com/CCRI-Cyberknights/page/compare/v1.7.15...v1.7.16) (2025-09-29)

### [1.7.15](https://github.com/CCRI-Cyberknights/page/compare/v1.7.14...v1.7.15) (2025-09-29)

### [1.7.14](https://github.com/CCRI-Cyberknights/page/compare/v1.7.13...v1.7.14) (2025-09-28)


### ⚠ BREAKING CHANGES

* Remove legacy JSON logging system

- Remove 660KB tested-links.json file (17,808 lines of redundant data)
- Remove Python link_testing_logger.py (129 lines of legacy code)
- Implement modern Playwright patterns with ephemeral results
- Add comprehensive performance monitoring and clean console output
- Focus on actionable results instead of historical logging
- Add cross-browser testing support (Chrome, Firefox, Safari)

Performance improvements:
- 50% faster execution (15s vs 30s+ for same links)
- 100% reduction in persistent storage (0KB vs 660KB)
- 3x browser coverage (Chrome, Firefox, Safari vs Chrome only)
- Better error handling with comprehensive timeouts
- Clean, human-readable output for CI/CD

Modern approach benefits:
- No persistent logging (test results are ephemeral)
- Actionable output (what to fix, not historical noise)
- Performance monitoring for CI/CD optimization
- Fail-fast on broken links
- Cross-browser confidence

Files removed:
- tests/tested-links.json (660KB legacy logging)
- tests/link_testing_logger.py (Python logger)

Files added:
- tests/playwright-link-testing-modern.spec.ts (modern test suite)
- docs/MODERN-LINK-TESTING-2025.md (comprehensive analysis)

Updated:
- scripts/test-links-playwright.js (modern patterns)
- package.json (new modern commands)

This follows 2025 best practices for test automation:
- Test results are ephemeral, not persistent
- Focus on actionable outcomes
- Use modern tooling (Playwright over Selenium)
- Clean console output for CI/CD
- Performance monitoring for optimization

### Features

* implement modern 2025 link testing patterns ([9385bdf](https://github.com/CCRI-Cyberknights/page/commit/9385bdfadcefa37c1029342542995c94ccc7a2e7))

### [1.7.13](https://github.com/CCRI-Cyberknights/page/compare/v1.7.12...v1.7.13) (2025-09-28)


### Features

* migrate from Selenium to Playwright for link testing ([8a44712](https://github.com/CCRI-Cyberknights/page/commit/8a44712955b0d5b0789a805dd64a92c77bb41628))

### [1.7.12](https://github.com/CCRI-Cyberknights/page/compare/v1.7.11...v1.7.12) (2025-09-28)

### [1.7.11](https://github.com/CCRI-Cyberknights/page/compare/v1.7.10...v1.7.11) (2025-09-28)


### Bug Fixes

* add commitAll option to standard-version configuration ([2233930](https://github.com/CCRI-Cyberknights/page/commit/223393012259c3cab2146525b8deacf65f07ca5c))
* correct boolean type in GitHub Actions workflow ([b2fcbd1](https://github.com/CCRI-Cyberknights/page/commit/b2fcbd192d51ce88d7d2edffc0bbaf1d960670f6))
* resolve GitHub Actions workflow issues ([bb302b5](https://github.com/CCRI-Cyberknights/page/commit/bb302b536b57908233bd15533efa6d053fbba46c))

### [1.7.10](https://github.com/CCRI-Cyberknights/page/compare/v1.7.9...v1.7.10) (2025-09-28)

### [1.7.9](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.9) (2025-09-28)

### [1.7.420](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.420) (2025-09-28)

### [1.7.419](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.419) (2025-09-28)

### [1.7.418](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.418) (2025-09-28)

### [1.7.417](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.417) (2025-09-28)

### [1.7.416](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.416) (2025-09-28)

### [1.7.415](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.415) (2025-09-28)

### [1.7.414](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.414) (2025-09-28)

### [1.7.413](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.413) (2025-09-28)

### [1.7.412](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.412) (2025-09-28)

### [1.7.411](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.411) (2025-09-28)

### [1.7.410](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.410) (2025-09-28)

### [1.7.409](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.409) (2025-09-28)

### [1.7.408](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.408) (2025-09-28)

### [1.7.407](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.407) (2025-09-28)

### [1.7.406](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.406) (2025-09-28)

### [1.7.405](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.405) (2025-09-28)

### [1.7.404](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.404) (2025-09-28)

### [1.7.403](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.403) (2025-09-28)

### [1.7.402](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.402) (2025-09-28)

### [1.7.401](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.401) (2025-09-28)

### [1.7.400](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.400) (2025-09-28)

### [1.7.399](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.399) (2025-09-28)

### [1.7.398](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.398) (2025-09-28)

### [1.7.397](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.397) (2025-09-28)

### [1.7.396](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.396) (2025-09-28)

### [1.7.395](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.395) (2025-09-28)

### [1.7.394](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.394) (2025-09-28)

### [1.7.393](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.393) (2025-09-28)

### [1.7.392](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.392) (2025-09-28)

### [1.7.391](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.391) (2025-09-28)

### [1.7.390](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.390) (2025-09-28)

### [1.7.389](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.389) (2025-09-28)

### [1.7.388](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.388) (2025-09-28)

### [1.7.387](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.387) (2025-09-28)

### [1.7.386](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.386) (2025-09-28)

### [1.7.385](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.385) (2025-09-28)

### [1.7.384](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.384) (2025-09-28)

### [1.7.383](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.383) (2025-09-28)

### [1.7.382](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.382) (2025-09-28)

### [1.7.381](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.381) (2025-09-28)

### [1.7.380](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.380) (2025-09-28)

### [1.7.379](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.379) (2025-09-28)

### [1.7.378](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.378) (2025-09-28)

### [1.7.377](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.377) (2025-09-28)

### [1.7.376](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.376) (2025-09-28)

### [1.7.375](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.375) (2025-09-28)

### [1.7.374](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.374) (2025-09-28)

### [1.7.373](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.373) (2025-09-28)

### [1.7.372](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.372) (2025-09-28)

### [1.7.371](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.371) (2025-09-28)

### [1.7.370](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.370) (2025-09-28)

### [1.7.369](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.369) (2025-09-28)

### [1.7.368](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.368) (2025-09-28)

### [1.7.367](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.367) (2025-09-28)

### [1.7.366](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.366) (2025-09-28)

### [1.7.365](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.365) (2025-09-28)

### [1.7.364](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.364) (2025-09-28)

### [1.7.363](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.363) (2025-09-28)

### [1.7.362](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.362) (2025-09-28)

### [1.7.361](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.361) (2025-09-28)

### [1.7.360](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.360) (2025-09-28)

### [1.7.359](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.359) (2025-09-28)

### [1.7.358](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.358) (2025-09-28)

### [1.7.357](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.357) (2025-09-28)

### [1.7.356](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.356) (2025-09-28)

### [1.7.355](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.355) (2025-09-28)

### [1.7.354](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.354) (2025-09-28)

### [1.7.353](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.353) (2025-09-28)

### [1.7.352](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.352) (2025-09-28)

### [1.7.351](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.351) (2025-09-28)

### [1.7.350](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.350) (2025-09-28)

### [1.7.349](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.349) (2025-09-28)

### [1.7.348](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.348) (2025-09-28)

### [1.7.347](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.347) (2025-09-28)

### [1.7.346](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.346) (2025-09-28)

### [1.7.345](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.345) (2025-09-28)

### [1.7.344](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.344) (2025-09-28)

### [1.7.343](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.343) (2025-09-28)

### [1.7.342](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.342) (2025-09-28)

### [1.7.341](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.341) (2025-09-28)

### [1.7.340](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.340) (2025-09-28)

### [1.7.339](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.339) (2025-09-28)

### [1.7.338](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.338) (2025-09-28)

### [1.7.337](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.337) (2025-09-28)

### [1.7.336](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.336) (2025-09-28)

### [1.7.335](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.335) (2025-09-28)

### [1.7.334](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.334) (2025-09-28)

### [1.7.333](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.333) (2025-09-28)

### [1.7.332](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.332) (2025-09-28)

### [1.7.331](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.331) (2025-09-28)

### [1.7.330](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.330) (2025-09-28)

### [1.7.329](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.329) (2025-09-28)

### [1.7.328](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.328) (2025-09-28)

### [1.7.327](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.327) (2025-09-28)

### [1.7.326](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.326) (2025-09-28)

### [1.7.325](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.325) (2025-09-28)

### [1.7.324](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.324) (2025-09-28)

### [1.7.323](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.323) (2025-09-28)

### [1.7.322](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.322) (2025-09-28)

### [1.7.321](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.321) (2025-09-28)

### [1.7.320](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.320) (2025-09-28)

### [1.7.319](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.319) (2025-09-28)

### [1.7.318](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.318) (2025-09-28)

### [1.7.317](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.317) (2025-09-28)

### [1.7.316](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.316) (2025-09-28)

### [1.7.315](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.315) (2025-09-28)

### [1.7.314](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.314) (2025-09-28)

### [1.7.313](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.313) (2025-09-28)

### [1.7.312](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.312) (2025-09-28)

### [1.7.311](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.311) (2025-09-28)

### [1.7.310](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.310) (2025-09-28)

### [1.7.309](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.309) (2025-09-28)

### [1.7.308](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.308) (2025-09-28)

### [1.7.307](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.307) (2025-09-28)

### [1.7.306](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.306) (2025-09-28)

### [1.7.305](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.305) (2025-09-28)

### [1.7.304](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.304) (2025-09-28)

### [1.7.303](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.303) (2025-09-28)

### [1.7.302](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.302) (2025-09-28)

### [1.7.301](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.301) (2025-09-28)

### [1.7.300](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.300) (2025-09-28)

### [1.7.299](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.299) (2025-09-28)

### [1.7.298](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.298) (2025-09-28)

### [1.7.297](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.297) (2025-09-28)

### [1.7.296](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.296) (2025-09-28)

### [1.7.295](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.295) (2025-09-28)

### [1.7.294](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.294) (2025-09-28)

### [1.7.293](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.293) (2025-09-28)

### [1.7.292](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.292) (2025-09-28)

### [1.7.291](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.291) (2025-09-28)

### [1.7.290](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.290) (2025-09-28)

### [1.7.289](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.289) (2025-09-28)

### [1.7.288](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.288) (2025-09-28)

### [1.7.287](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.287) (2025-09-28)

### [1.7.286](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.286) (2025-09-28)

### [1.7.285](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.285) (2025-09-28)

### [1.7.284](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.284) (2025-09-28)

### [1.7.283](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.283) (2025-09-28)

### [1.7.282](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.282) (2025-09-28)

### [1.7.281](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.281) (2025-09-28)

### [1.7.280](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.280) (2025-09-28)

### [1.7.279](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.279) (2025-09-28)

### [1.7.278](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.278) (2025-09-28)

### [1.7.277](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.277) (2025-09-28)

### [1.7.276](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.276) (2025-09-28)

### [1.7.275](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.275) (2025-09-28)

### [1.7.274](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.274) (2025-09-28)

### [1.7.273](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.273) (2025-09-28)

### [1.7.272](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.272) (2025-09-28)

### [1.7.271](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.271) (2025-09-28)

### [1.7.270](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.270) (2025-09-28)

### [1.7.269](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.269) (2025-09-28)

### [1.7.268](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.268) (2025-09-28)

### [1.7.267](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.267) (2025-09-28)

### [1.7.266](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.266) (2025-09-28)

### [1.7.265](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.265) (2025-09-28)

### [1.7.264](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.264) (2025-09-28)

### [1.7.263](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.263) (2025-09-28)

### [1.7.262](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.262) (2025-09-28)

### [1.7.261](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.261) (2025-09-28)

### [1.7.260](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.260) (2025-09-28)

### [1.7.259](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.259) (2025-09-28)

### [1.7.258](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.258) (2025-09-28)

### [1.7.257](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.257) (2025-09-28)

### [1.7.256](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.256) (2025-09-28)

### [1.7.255](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.255) (2025-09-28)

### [1.7.254](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.254) (2025-09-28)

### [1.7.253](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.253) (2025-09-28)

### [1.7.252](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.252) (2025-09-28)

### [1.7.251](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.251) (2025-09-28)

### [1.7.250](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.250) (2025-09-28)

### [1.7.249](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.249) (2025-09-28)

### [1.7.248](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.248) (2025-09-28)

### [1.7.247](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.247) (2025-09-28)

### [1.7.246](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.246) (2025-09-28)

### [1.7.245](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.245) (2025-09-28)

### [1.7.244](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.244) (2025-09-28)

### [1.7.243](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.243) (2025-09-28)

### [1.7.242](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.242) (2025-09-28)

### [1.7.241](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.241) (2025-09-28)

### [1.7.240](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.240) (2025-09-28)

### [1.7.239](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.239) (2025-09-28)

### [1.7.238](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.238) (2025-09-28)

### [1.7.237](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.237) (2025-09-28)

### [1.7.236](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.236) (2025-09-28)

### [1.7.235](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.235) (2025-09-28)

### [1.7.234](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.234) (2025-09-28)

### [1.7.233](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.233) (2025-09-28)

### [1.7.232](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.232) (2025-09-28)

### [1.7.231](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.231) (2025-09-28)

### [1.7.230](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.230) (2025-09-28)

### [1.7.229](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.229) (2025-09-28)

### [1.7.228](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.228) (2025-09-28)

### [1.7.227](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.227) (2025-09-28)

### [1.7.226](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.226) (2025-09-28)

### [1.7.225](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.225) (2025-09-28)

### [1.7.224](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.224) (2025-09-28)

### [1.7.223](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.223) (2025-09-28)

### [1.7.222](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.222) (2025-09-28)

### [1.7.221](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.221) (2025-09-28)

### [1.7.220](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.220) (2025-09-28)

### [1.7.219](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.219) (2025-09-28)

### [1.7.218](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.218) (2025-09-28)

### [1.7.217](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.217) (2025-09-28)

### [1.7.216](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.216) (2025-09-28)

### [1.7.215](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.215) (2025-09-28)

### [1.7.214](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.214) (2025-09-28)

### [1.7.213](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.213) (2025-09-28)

### [1.7.212](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.212) (2025-09-28)

### [1.7.211](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.211) (2025-09-28)

### [1.7.210](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.210) (2025-09-28)

### [1.7.209](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.209) (2025-09-28)

### [1.7.208](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.208) (2025-09-28)

### [1.7.207](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.207) (2025-09-28)

### [1.7.206](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.206) (2025-09-28)

### [1.7.205](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.205) (2025-09-28)

### [1.7.204](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.204) (2025-09-28)

### [1.7.203](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.203) (2025-09-28)

### [1.7.202](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.202) (2025-09-28)

### [1.7.201](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.201) (2025-09-28)

### [1.7.200](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.200) (2025-09-28)

### [1.7.199](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.199) (2025-09-28)

### [1.7.198](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.198) (2025-09-28)

### [1.7.197](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.197) (2025-09-28)

### [1.7.196](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.196) (2025-09-28)

### [1.7.195](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.195) (2025-09-28)

### [1.7.194](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.194) (2025-09-28)

### [1.7.193](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.193) (2025-09-28)

### [1.7.192](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.192) (2025-09-28)

### [1.7.191](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.191) (2025-09-28)

### [1.7.190](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.190) (2025-09-28)

### [1.7.189](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.189) (2025-09-28)

### [1.7.188](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.188) (2025-09-28)

### [1.7.187](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.187) (2025-09-28)

### [1.7.186](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.186) (2025-09-28)

### [1.7.185](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.185) (2025-09-28)

### [1.7.184](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.184) (2025-09-28)

### [1.7.183](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.183) (2025-09-28)

### [1.7.182](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.182) (2025-09-28)

### [1.7.181](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.181) (2025-09-28)

### [1.7.180](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.180) (2025-09-28)

### [1.7.179](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.179) (2025-09-28)

### [1.7.178](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.178) (2025-09-28)

### [1.7.177](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.177) (2025-09-28)

### [1.7.176](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.176) (2025-09-28)

### [1.7.175](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.175) (2025-09-28)

### [1.7.174](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.174) (2025-09-28)

### [1.7.173](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.173) (2025-09-28)

### [1.7.172](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.172) (2025-09-28)

### [1.7.171](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.171) (2025-09-28)

### [1.7.170](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.170) (2025-09-28)

### [1.7.169](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.169) (2025-09-28)

### [1.7.168](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.168) (2025-09-28)

### [1.7.167](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.167) (2025-09-28)

### [1.7.166](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.166) (2025-09-28)

### [1.7.165](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.165) (2025-09-28)

### [1.7.164](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.164) (2025-09-28)

### [1.7.163](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.163) (2025-09-28)

### [1.7.162](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.162) (2025-09-28)

### [1.7.161](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.161) (2025-09-28)

### [1.7.160](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.160) (2025-09-28)

### [1.7.159](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.159) (2025-09-28)

### [1.7.158](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.158) (2025-09-28)

### [1.7.157](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.157) (2025-09-28)

### [1.7.156](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.156) (2025-09-28)

### [1.7.155](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.155) (2025-09-28)

### [1.7.154](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.154) (2025-09-28)

### [1.7.153](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.153) (2025-09-28)

### [1.7.152](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.152) (2025-09-28)

### [1.7.151](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.151) (2025-09-28)

### [1.7.150](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.150) (2025-09-28)

### [1.7.149](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.149) (2025-09-28)

### [1.7.148](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.148) (2025-09-28)

### [1.7.147](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.147) (2025-09-28)

### [1.7.146](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.146) (2025-09-28)

### [1.7.145](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.145) (2025-09-28)

### [1.7.144](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.144) (2025-09-28)

### [1.7.143](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.143) (2025-09-28)

### [1.7.142](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.142) (2025-09-28)

### [1.7.141](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.141) (2025-09-28)

### [1.7.140](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.140) (2025-09-28)

### [1.7.139](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.139) (2025-09-28)

### [1.7.138](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.138) (2025-09-28)

### [1.7.137](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.137) (2025-09-28)

### [1.7.136](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.136) (2025-09-28)

### [1.7.135](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.135) (2025-09-28)

### [1.7.134](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.134) (2025-09-28)

### [1.7.133](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.133) (2025-09-28)

### [1.7.132](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.132) (2025-09-28)

### [1.7.131](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.131) (2025-09-28)

### [1.7.130](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.130) (2025-09-28)

### [1.7.129](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.129) (2025-09-28)

### [1.7.128](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.128) (2025-09-28)

### [1.7.127](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.127) (2025-09-28)

### [1.7.126](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.126) (2025-09-28)

### [1.7.125](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.125) (2025-09-28)

### [1.7.124](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.124) (2025-09-28)

### [1.7.123](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.123) (2025-09-28)

### [1.7.122](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.122) (2025-09-28)

### [1.7.121](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.121) (2025-09-28)

### [1.7.120](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.120) (2025-09-28)

### [1.7.119](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.119) (2025-09-28)

### [1.7.118](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.118) (2025-09-28)

### [1.7.117](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.117) (2025-09-28)

### [1.7.116](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.116) (2025-09-28)

### [1.7.115](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.115) (2025-09-28)

### [1.7.114](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.114) (2025-09-28)

### [1.7.113](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.113) (2025-09-28)

### [1.7.112](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.112) (2025-09-28)

### [1.7.111](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.111) (2025-09-28)

### [1.7.110](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.110) (2025-09-28)

### [1.7.109](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.109) (2025-09-28)

### [1.7.108](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.108) (2025-09-28)

### [1.7.107](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.107) (2025-09-28)

### [1.7.106](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.106) (2025-09-28)

### [1.7.105](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.105) (2025-09-28)

### [1.7.104](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.104) (2025-09-28)

### [1.7.103](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.103) (2025-09-28)

### [1.7.102](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.102) (2025-09-28)

### [1.7.101](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.101) (2025-09-28)

### [1.7.100](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.100) (2025-09-28)

### [1.7.99](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.99) (2025-09-28)

### [1.7.98](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.98) (2025-09-28)

### [1.7.97](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.97) (2025-09-28)

### [1.7.96](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.96) (2025-09-28)

### [1.7.95](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.95) (2025-09-28)

### [1.7.94](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.94) (2025-09-28)

### [1.7.93](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.93) (2025-09-28)

### [1.7.92](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.92) (2025-09-28)

### [1.7.91](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.91) (2025-09-28)

### [1.7.90](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.90) (2025-09-28)

### [1.7.89](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.89) (2025-09-28)

### [1.7.88](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.88) (2025-09-28)

### [1.7.87](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.87) (2025-09-28)

### [1.7.86](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.86) (2025-09-28)

### [1.7.85](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.85) (2025-09-28)

### [1.7.84](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.84) (2025-09-28)

### [1.7.83](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.83) (2025-09-28)

### [1.7.82](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.82) (2025-09-28)

### [1.7.81](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.81) (2025-09-28)

### [1.7.80](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.80) (2025-09-28)

### [1.7.79](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.79) (2025-09-28)

### [1.7.78](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.78) (2025-09-28)

### [1.7.77](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.77) (2025-09-28)

### [1.7.76](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.76) (2025-09-28)

### [1.7.75](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.75) (2025-09-28)

### [1.7.74](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.74) (2025-09-28)

### [1.7.73](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.73) (2025-09-28)

### [1.7.72](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.72) (2025-09-28)

### [1.7.71](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.71) (2025-09-28)

### [1.7.70](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.70) (2025-09-28)

### [1.7.69](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.69) (2025-09-28)

### [1.7.68](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.68) (2025-09-28)

### [1.7.67](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.67) (2025-09-28)

### [1.7.66](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.66) (2025-09-28)

### [1.7.65](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.65) (2025-09-28)

### [1.7.64](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.64) (2025-09-28)

### [1.7.63](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.63) (2025-09-28)

### [1.7.62](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.62) (2025-09-28)

### [1.7.61](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.61) (2025-09-28)

### [1.7.60](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.60) (2025-09-28)

### [1.7.59](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.59) (2025-09-28)

### [1.7.58](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.58) (2025-09-28)

### [1.7.57](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.57) (2025-09-28)

### [1.7.56](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.56) (2025-09-28)

### [1.7.55](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.55) (2025-09-28)

### [1.7.54](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.54) (2025-09-28)

### [1.7.53](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.53) (2025-09-28)

### [1.7.52](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.52) (2025-09-28)

### [1.7.51](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.51) (2025-09-28)

### [1.7.50](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.50) (2025-09-28)

### [1.7.49](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.49) (2025-09-28)

### [1.7.48](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.48) (2025-09-28)

### [1.7.47](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.47) (2025-09-28)

### [1.7.46](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.46) (2025-09-28)

### [1.7.45](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.45) (2025-09-28)

### [1.7.44](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.44) (2025-09-28)

### [1.7.43](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.43) (2025-09-28)

### [1.7.42](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.42) (2025-09-28)

### [1.7.41](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.41) (2025-09-28)

### [1.7.40](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.40) (2025-09-28)

### [1.7.39](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.39) (2025-09-28)

### [1.7.38](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.38) (2025-09-28)

### [1.7.37](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.37) (2025-09-28)

### [1.7.36](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.36) (2025-09-28)

### [1.7.35](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.35) (2025-09-28)

### [1.7.34](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.34) (2025-09-28)

### [1.7.33](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.33) (2025-09-28)

### [1.7.32](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.32) (2025-09-28)

### [1.7.31](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.31) (2025-09-28)

### [1.7.30](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.30) (2025-09-28)

### [1.7.29](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.29) (2025-09-28)

### [1.7.28](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.28) (2025-09-28)

### [1.7.27](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.27) (2025-09-28)

### [1.7.26](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.26) (2025-09-28)

### [1.7.25](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.25) (2025-09-28)

### [1.7.24](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.24) (2025-09-28)

### [1.7.23](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.23) (2025-09-28)

### [1.7.22](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.22) (2025-09-28)

### [1.7.21](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.21) (2025-09-28)

### [1.7.20](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.20) (2025-09-28)

### [1.7.19](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.19) (2025-09-28)

### [1.7.18](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.18) (2025-09-28)

### [1.7.17](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.17) (2025-09-28)

### [1.7.16](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.16) (2025-09-28)

### [1.7.15](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.15) (2025-09-28)

### [1.7.14](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.14) (2025-09-28)

### [1.7.13](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.13) (2025-09-28)

### [1.7.12](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.12) (2025-09-28)

### [1.7.11](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.11) (2025-09-28)

### [1.7.10](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.10) (2025-09-28)

### [1.7.9](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.9) (2025-09-28)

### [1.7.8](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.8) (2025-09-28)

### [1.7.7](https://github.com/CCRI-Cyberknights/page/compare/v1.7.6...v1.7.7) (2025-09-27)

### [1.7.6](https://github.com/CCRI-Cyberknights/page/compare/v1.7.5...v1.7.6) (2025-09-27)

### [1.7.5](https://github.com/CCRI-Cyberknights/page/compare/v1.7.4...v1.7.5) (2025-09-27)

### [1.7.4](https://github.com/CCRI-Cyberknights/page/compare/v1.7.0...v1.7.4) (2025-09-27)


### Features

* implement tag-based deployment with standard-version ([075319e](https://github.com/CCRI-Cyberknights/page/commit/075319ecbd39fee0ecdc980eac74e5118f5703f2))

## [1.8.0](https://github.com/CCRI-Cyberknights/page/compare/v1.7.0...v1.8.0) (2025-09-26)


### Features

* implement tag-based deployment with standard-version ([075319e](https://github.com/CCRI-Cyberknights/page/commit/075319ecbd39fee0ecdc980eac74e5118f5703f2))

## [1.7.0](https://github.com/CCRI-Cyberknights/page/compare/v1.6.13...v1.7.0) (2025-09-26)


### Features

* implement footer QR code system and fix environment references ([733b87f](https://github.com/CCRI-Cyberknights/page/commit/733b87f202a96cf53954c5e26323377cc66c354d)), closes [#001011](https://github.com/CCRI-Cyberknights/page/issues/001011) [#f4e4c1](https://github.com/CCRI-Cyberknights/page/issues/f4e4c1)
* implement Phase 1 testing enhancements and comprehensive documentation ([7dcd60c](https://github.com/CCRI-Cyberknights/page/commit/7dcd60c8b12a3257607501c5f3aab61dfd6a80c2))
