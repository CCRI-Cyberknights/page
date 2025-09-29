# Troubleshooting Guide

This document covers common issues encountered during development and maintenance of the Cyber Club website, including version management problems and their solutions.

## 🔍 **NEW: Automated Versioning Diagnostics**

**Use Playwright to diagnose versioning issues automatically:**

```bash
# Run comprehensive versioning diagnostics
npm run version:diagnose

# Debug mode (interactive)
npm run test:versioning:debug

# UI mode (visual debugging)
npm run test:versioning:ui
```

**What it checks:**
- ✅ File system verification (`version.json` matches `package.json`)
- ✅ Git history validation (release commits include required files)
- ✅ Deployment verification (live site shows correct version)
- ✅ End-to-end pipeline consistency

**Benefits:**
- **Replaces manual debugging** with automated validation
- **Catches failures at every layer** (files → commits → deployment)
- **Provides detailed diagnostic output** for expert analysis
- **Integrates with CI/CD** for continuous monitoring

---

## Version Management Issues

### Problem: Version Display Lag (Off-by-One Issue)

**Symptoms:**
- Site displays version `v1.7.5` but repository has `v1.7.6`
- Version display is consistently one version behind
- GitHub Pages deployment successful but version doesn't update
- Release commits don't include updated version files

**Root Cause:**
This was caused by the old version management system where:
1. `standard-version` bumped `package.json` but didn't include updated `index.html`
2. The old `scripts/update-index-version.js` ran but output wasn't committed with release
3. GitHub Pages deployed from committed files, showing previous version

**Solution Implemented (2025):**
Modern version management system with single source of truth:

```json
// version.json - Single source of truth
{
  "version": "1.7.7",
  "commit": "34884c1",
  "date": "2025-09-27 19:26:40 -0400",
  "timestamp": "2025-09-27T23:27:11.388Z"
}
```

```javascript
// js/version-display.js - Dynamic fetching
class VersionDisplay {
  async updateVersion() {
    const response = await fetch('/version.json?t=' + Date.now());
    const versionInfo = await response.json();
    this.displayVersion(versionInfo);
  }
}
```

**Current Status (v1.7.7):**
- ✅ **Single source of truth**: `version.json` contains all version info
- ✅ **Dynamic fetching**: Runtime version updates with cache-busting
- ✅ **No version lag**: Site always shows correct version
- ✅ **Cache-bustable**: Immediate updates with timestamp parameters

### Problem: Release Process Issues

**Symptoms:**
- `version.json` not included in release commits
- `standard-version` postbump script fails
- Version update script runs but doesn't stage files
- Release commits missing updated version files

**Root Cause:**
`standard-version` configuration not properly staging updated files:

```json
// OLD (problematic) - removed in 2025 modernization
"postbump": "node scripts/update-index-version.js"

// NEW (working)
"postbump": "node scripts/update-version-json.js && git add version.json"
```

**Solution:**
1. **Update postbump script** to stage version.json
2. **Use git add** to include updated files in release commit
3. **Verify commit includes** both package.json and version.json

**Verification Commands:**
```bash
# Check release commit includes version.json
git show HEAD --name-only | grep version.json

# Verify version.json content
cat version.json | jq

# Test version display
curl -s https://ccri-cyberknights.github.io/page/version.json | jq
```

### Problem: GitHub Pages Deployment Issues

**Symptoms:**
- Custom workflow fails with environment protection errors
- Automatic Pages deployment works but version doesn't update
- Site shows old version despite successful deployment
- GitHub Actions shows failed custom workflow runs

**Root Cause:**
Conflicting deployment systems:
1. **Custom workflow**: Fails due to environment protection rules
2. **Automatic Pages**: Works but doesn't include version updates
3. **Dual deployment**: Two systems fighting each other

**Solution Implemented:**
Simplified deployment using GitHub Pages automatic deployment:

1. **Removed custom workflow** (`.github/workflows/release.yml`)
2. **Use automatic Pages deployment** from main branch
3. **Rely on version.json** for version display
4. **Single deployment path** eliminates conflicts

**Current Deployment Flow:**
1. Make changes → commit to `main`
2. Run `npm run release:patch` → bumps version, updates version.json
3. Push commit + tag → GitHub Pages automatically deploys
4. Site updates → version display fetches version.json

### Problem: Version Display Not Working

**Symptoms:**
- Version display shows fallback version
- JavaScript console shows fetch errors
- version.json not accessible
- Version elements not updating

**Root Cause:**
Runtime version fetching issues:

1. **version.json not deployed**: File missing from deployment
2. **JavaScript errors**: version-display.js not loading
3. **Network issues**: Fetch requests failing
4. **Cache issues**: Browser caching old version

**Solution:**
1. **Check version.json deployment**:
   ```bash
   curl -s https://ccri-cyberknights.github.io/page/version.json
   ```

2. **Verify JavaScript loading**:
   ```html
   <script src="./js/version-display.js"></script>
   ```

3. **Check browser console** for errors

4. **Test with cache-busting**:
   ```bash
   curl -s "https://ccri-cyberknights.github.io/page/version.json?t=$(date +%s)"
   ```

### Version Management Best Practices

**Release Process:**
1. **Always use release scripts**: `npm run release:patch|minor|major`
2. **Verify version.json included**: Check release commit includes version.json
3. **Test version display**: Verify site shows correct version
4. **Monitor deployment**: Check GitHub Actions for successful deployment

**Troubleshooting Steps:**
1. **Check repository state**: `git log --oneline -3`
2. **Verify version.json**: `cat version.json | jq`
3. **Test live site**: `curl -s https://ccri-cyberknights.github.io/page/version.json | jq`
4. **Check browser cache**: Disable cache in DevTools

**Common Commands:**
```bash
# Check current version
npm run version:show

# Create patch release
npm run release:patch

# Verify deployment
gh api repos/CCRI-Cyberknights/page/pages/builds | jq '.[0]'

# Test version display
curl -s https://ccri-cyberknights.github.io/page/version.json | jq '.version'
```

## URL Structure Issues

### Problem: URLs Changed from `/#/home` to `/index.html#/home`

**Symptoms:**
- Users reported that URLs were showing `index.html` in the path
- Previously clean URLs like `https://ccri-cyberknights.github.io/page/#/home` became `https://ccri-cyberknights.github.io/page/index.html#/home`
- Issue appeared after implementing the Linux cheat sheet functionality

**Root Cause:**
The issue was caused by navigation links in `document/linux-cheatsheet-1.html` that explicitly referenced `index.html`:

```html
<!-- INCORRECT (caused the issue) -->
<a href="../index.html#/resources">← Back to Resources</a>
<a href="../index.html#/linux">Linux Boot Guide</a>

<!-- CORRECT (clean URLs) -->
<a href="../#/resources">← Back to Resources</a>
<a href="../#/linux">Linux Boot Guide</a>
```

**Why This Happened:**
When users clicked the navigation links in the Linux cheat sheet, their browsers displayed the full URL including `index.html`. This created the appearance that GitHub Pages had changed its serving behavior, when in fact both URL formats work correctly.

**Solution:**
Update navigation links in standalone HTML files to use clean hash routing without explicit `index.html` references.

**Verification:**
Both URL formats serve identical content:
- `https://ccri-cyberknights.github.io/page/#/home` ✅
- `https://ccri-cyberknights.github.io/page/index.html#/home` ✅

**Prevention:**
- Always use clean hash routing (`#/page`) in internal navigation links
- Avoid explicit `index.html` references in relative URLs
- Test navigation flows to ensure clean URLs are maintained

## Routing Issues

### Problem: Linux Resources Page Shows "Loading Document..."

**Symptoms:**
- Visiting `#/resources/linux` displays "Loading Document..." instead of content
- Issue appeared after major refactoring commit

**Root Cause:**
The Linux resources page was using a separate template (`page-resources-linux`) that wasn't properly integrated with the main resources system.

**Solution:**
1. **Integrated Linux into main resources system** - Removed the separate `page-resources-linux` template
2. **Updated routing** - Linux resources now use the main resources template with filtering
3. **Enhanced intro text** - Added Linux-specific intro text that displays when navigating to `/resources/linux`

**Current Implementation:**
- Linux resources are now part of the main resources data array
- The `/resources/linux` route uses the main resources template with `linux` filter preselected
- Linux-specific intro text displays automatically when navigating to the Linux filter
- All dynamic functionality (search, filtering, transitions) works for Linux resources

**Verification:**
- `#/resources/linux` now displays Linux resources with proper filtering
- Linux filter button is active when navigating to `/resources/linux`
- Linux-specific intro text displays correctly
- Dynamic intro text transitions work when clicking filter buttons

## GitHub Pages Configuration

### `.nojekyll` File

**Purpose:**
The `.nojekyll` file tells GitHub Pages to serve files as static assets without Jekyll processing.

**When to Use:**
- When using custom build processes
- When serving static HTML/CSS/JS files directly
- When Jekyll processing interferes with site functionality

**Implementation:**
Create an empty `.nojekyll` file in the repository root:
```bash
touch .nojekyll
```

**Note:** This file was added during troubleshooting but is kept as a best practice for static sites.

## Common Development Issues

### Modal Bullet Formatting Missing

**Problem:** Resource modals showing empty content instead of bulleted detailed summaries

**Symptoms:**
- Modals open but show no detailed content
- Detailed summary text appears to be missing
- Bullet points not displaying in modal content
- Issue appeared after removing "more info" pulldowns

**Root Cause:**
The `formatDetailedSummary` function was accidentally removed when cleaning up the "more info" pulldown functionality, but the modal was still trying to call this function.

**Solution:**
1. **Re-added the `formatDetailedSummary` function**:
   ```javascript
   function formatDetailedSummary(text) {
     if (!text) return '';
     
     // Split by periods and filter out empty strings
     const sentences = text.split('.').filter(s => s.trim().length > 0);
     
     // Create bullet points
     return sentences.map(sentence => {
       const trimmed = sentence.trim();
       return `<li>${trimmed}${trimmed.endsWith('.') ? '' : '.'}</li>`;
     }).join('');
   }
   ```

2. **Updated modal HTML to wrap bullets in `<ul>` tags**:
   ```html
   <div class="text-slate-400 mb-6 leading-relaxed">
     <ul class="list-disc list-inside space-y-1">
       ${formatDetailedSummary(resource.detailedSummary)}
     </ul>
   </div>
   ```

**Current Implementation:**
- Detailed summaries are properly formatted as bullet points
- Modal content displays correctly with proper spacing
- Function dependency is maintained for consistent formatting

**Verification:**
- Open any resource modal to confirm bullet points display
- Check that detailed summaries are properly formatted
- Verify consistent spacing and styling

### Modal Interaction Problems

**Problem:** Resource modals not closing when clicking on content

**Symptoms:**
- Users had to click the "X" button to close modals
- Clicking anywhere on the modal content didn't close it
- Poor user experience for modal interaction

**Root Cause:**
The modal was only configured to close when clicking the overlay (outside the modal) or the "X" button, but not when clicking on the modal content itself.

**Solution:**
1. **Added click handler to modal content:**
   ```javascript
   <div class="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto cursor-pointer" onclick="closeResourceModal()">
   ```

2. **Prevented action button from closing modal:**
   ```javascript
   <a href="${resource.url}" ... onclick="event.stopPropagation()">
   ```

**Current Implementation:**
- Click anywhere on modal content → Modal closes
- Click "Visit Site" button → Opens link (doesn't close modal)
- Click "X" button → Modal closes (still works)
- Click outside modal → Modal closes (already worked)

**Verification:**
- Modal closes when clicking on title, content, or empty areas
- Action button still functions correctly without closing modal
- All existing close methods continue to work

### Bulleted Formatting Inconsistency

**Problem:** Modal content displayed as wall of text instead of bullet points

**Symptoms:**
- Inline card expansion showed bulleted content
- Modal popup showed raw text without formatting
- Inconsistent user experience between interaction methods

**Root Cause:**
The modal was displaying `resource.detailedSummary` directly without using the `formatDetailedSummary()` function that creates bullet points.

**Solution:**
Updated modal to use the same formatting function as inline expansion:
```javascript
// Before
${resource.detailedSummary}

// After  
${formatDetailedSummary(resource.detailedSummary)}
```

**Current Implementation:**
- Both inline card expansion and modal popup use bulleted formatting
- Consistent user experience across all resource detail views
- Same `formatDetailedSummary()` function used everywhere

**Verification:**
- Modal content displays with bullet points
- Inline expansion continues to work with bullet points
- Consistent formatting across all interaction methods

### JavaScript Module Loading

**Problem:** QR code functionality not working after refactoring

**Symptoms:**
- QR code toggle button not responding
- Console errors about missing functions
- Inconsistent behavior between main site and standalone pages

**Solution:**
- Ensure `js/qr-code-manager.js` is loaded after `js/qrcode.min.js`
- Use consistent initialization patterns across all pages
- Test functionality on both main site and standalone pages

### File Path Issues

**Problem:** Broken links after moving files

**Symptoms:**
- 404 errors for JavaScript files
- Missing images or assets
- Inconsistent behavior between local and deployed versions

**Solution:**
- Update all references when moving files
- Use relative paths consistently
- Test both local and deployed versions

## Environment and Testing Issues

### Legacy Testing Environment Problems

**Problem:** Legacy testing environment issues (historical reference)

**Symptoms:**
- `ModuleNotFoundError: No module named 'selenium'`
- `selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH`
- Pre-commit hooks failing with environment errors

**Root Cause:**
The project previously used Selenium WebDriver for testing, but has since migrated to Playwright for modern testing.

**Solution:**
Use Playwright for testing instead of Selenium:

```bash
# Run modern Playwright tests
npm run test:links:modern

# Debug mode
npm run test:links:modern:debug

# Interactive UI
npm run test:links:modern:ui
```

**Modern Alternative:**
The project now uses Playwright for comprehensive testing with:
- Cross-browser support (Chrome, Firefox, Safari)
- Better performance and reliability
- Modern TypeScript/JavaScript approach
- Ephemeral results and performance monitoring

## Testing Strategy

### Manual Testing Checklist

Before deploying changes:

1. **Navigation Testing:**
   - [ ] All internal links work correctly
   - [ ] URLs remain clean (no unnecessary `index.html`)
   - [ ] Hash routing functions properly

2. **Cross-Page Testing:**
   - [ ] Main site navigation works
   - [ ] Standalone pages load correctly
   - [ ] Links between pages function properly

3. **QR Code Testing:**
   - [ ] QR code toggle works on main site
   - [ ] QR code functionality works on standalone pages
   - [ ] Download functionality works

4. **Resource Page Testing:**
   - [ ] All resource categories display correctly
   - [ ] Filtering works properly
   - [ ] Deep links function correctly
   - [ ] Modal opens when clicking resource cards
   - [ ] Modal closes when clicking anywhere on content
   - [ ] Modal displays bulleted formatting
   - [ ] Action button opens links without closing modal
   - [ ] Inline card expansion shows bulleted content
   - [ ] Inline expansion can be collapsed by re-clicking

5. **Version Management Testing:**
   - [ ] Documentation commits trigger PATCH bumps only
   - [ ] Feature commits trigger MINOR bumps with approval
   - [ ] Breaking changes trigger MAJOR bumps with approval
   - [ ] Version display updates correctly in footer

### Automated Testing

Use the Playwright test suite in the `tests/` directory:

```bash
# Run comprehensive Playwright tests
npm run test:links:playwright

# Run modern Playwright tests
npm run test:links:modern

# Debug mode
npm run test:links:playwright:debug

# Interactive UI
npm run test:links:playwright:ui
```

### Testing Environment Setup

**Prerequisites:**
1. **Node.js**: Version 20 or higher
2. **npm**: For package management
3. **Playwright**: Installed via `npx playwright install --with-deps`

**Setup Steps:**
```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Verify installation
npm run test:links:playwright:debug
```

## Debugging Tips

### Browser Developer Tools

1. **Console Tab:**
   - Check for JavaScript errors
   - Verify function availability
   - Monitor network requests

2. **Network Tab:**
   - Verify all assets load correctly
   - Check for 404 errors
   - Monitor redirect behavior

3. **Elements Tab:**
   - Inspect DOM structure
   - Verify CSS classes are applied
   - Check for missing elements

### Server-Side Debugging

1. **Check GitHub Pages Status:**
   - Verify deployment completed successfully
   - Check for build errors
   - Confirm file structure

2. **Test Both URL Formats:**
   ```bash
   curl "https://ccri-cyberknights.github.io/page/#/home"
   curl "https://ccri-cyberknights.github.io/page/index.html#/home"
   ```

3. **Check Environment:**
   ```bash
   # Verify Node.js environment
   node --version  # Should show Node.js 20+
   npm --version   # Should show npm version
   npx playwright --version  # Should show Playwright version
   ```

## Prevention Strategies

### Code Review Checklist

- [ ] All internal links use clean hash routing
- [ ] No explicit `index.html` references in relative URLs
- [ ] All routes are properly registered
- [ ] JavaScript modules load in correct order
- [ ] Cross-page functionality tested
- [ ] Commit messages follow conventions (`docs:`, `fix:`, `feat:`)
- [ ] Version bump prompts reviewed before approval
- [ ] Directory paths reference correct project name (`page`)

### Pre-commit Hook Issues

### Problem: Infinite Loop in Version Bumping

**Symptoms:**
- Version jumps dramatically (e.g., from 1.7.8 to 1.7.420+)
- Multiple `chore(release)` commits created rapidly
- Pre-commit hook runs continuously
- Repository becomes unstable

**Root Cause:**
Pre-commit hook runs `standard-version` which creates commits that re-trigger the hook, creating an infinite loop.

**Solution Implemented:**
1. **Add HUSKY=0 to version:auto script**:
   ```json
   "version:auto": "HUSKY=0 standard-version --release-as patch"
   ```

2. **Add safety guard in pre-commit hook**:
   ```bash
   if [ "$HUSKY" = "0" ]; then
       echo "🚫 Husky disabled - skipping pre-commit processing"
       exit 0
   fi
   ```

3. **Reset version to reasonable number**:
   ```bash
   npm version 1.7.8 --no-git-tag-version
   ```

**Prevention:**
- Never run `standard-version` without `HUSKY=0` in pre-commit hooks
- Consider moving version bumping to CI/CD instead of local hooks
- Always test version bumping in isolation before committing

---

## 🔧 **Playwright Diagnostic System**

### Using Automated Diagnostics

**Quick Diagnosis:**
```bash
npm run version:diagnose
```

**Detailed Debugging:**
```bash
# Interactive debugging
npm run test:versioning:debug

# Visual debugging with UI
npm run test:versioning:ui
```

### Diagnostic Test Categories

#### 1. File System Verification
- **Checks**: `version.json` exists and matches `package.json`
- **Validates**: JSON structure, timestamps, required fields
- **Catches**: Missing files, version mismatches, corrupted data

#### 2. Git History Validation  
- **Checks**: Release commits include required files
- **Validates**: Commit message format, file staging
- **Catches**: Silent `postbump` failures, missing artifacts

#### 3. Deployment Verification
- **Checks**: Live site displays correct version
- **Validates**: `version.json` accessibility, UI consistency
- **Catches**: Deployment lag, cache issues, broken URLs

#### 4. End-to-End Pipeline
- **Checks**: Complete consistency across all layers
- **Validates**: Local → Git → Deployment alignment
- **Catches**: Systemic failures, integration issues

### Interpreting Diagnostic Results

**✅ All Tests Pass:**
- Versioning pipeline is healthy
- No action required

**❌ File System Tests Fail:**
- `version.json` missing or corrupted
- Version mismatch between files
- Run `node scripts/update-version-json.js` to fix

**❌ Git History Tests Fail:**
- Release commits missing required files
- `postbump` script failed silently
- Check `standard-version` configuration

**❌ Deployment Tests Fail:**
- Live site shows wrong version
- `version.json` not accessible
- GitHub Pages deployment issues

**❌ End-to-End Tests Fail:**
- Systemic versioning failure
- Multiple layers affected
- Requires expert analysis

### Diagnostic Output Example

```
=== VERSIONING DIAGNOSTIC INFO ===
Package Version: 1.7.10
Version.json Version: 1.7.9
Latest Commit: chore(release): 1.7.10
Latest Commit Files: CHANGELOG.md, package-lock.json, package.json
Is Release Commit: true
================================
```

**Analysis**: Version mismatch detected - `version.json` shows `1.7.9` but `package.json` shows `1.7.10`. The release commit is missing `version.json`, indicating `postbump` script failure.

### Integration with CI/CD

**GitHub Actions Integration:**
- Automatic diagnostics on every push/PR
- Post-release validation for tags
- Artifact upload for failed tests
- PR comments with diagnostic results

**Local Development:**
- Run diagnostics before releases
- Debug versioning issues quickly
- Validate fixes before committing

---


**Performance Issue**: Pre-commit hook running unnecessary link tests on every commit.

**Solution**: Modern 2025-compliant version management system eliminates the need for complex change detection. All commits run comprehensive link testing to ensure site integrity.

**Documentation**: See [Versioning](VERSIONING.md#troubleshooting) for complete details on the tag-based deployment system.

### Documentation Updates

- [ ] Update relevant documentation when making changes
- [ ] Document new troubleshooting steps
- [ ] Keep this file current with new issues
- [ ] Update version references when bumping versions

## Lessons Learned

1. **Simple Issues Can Have Complex Symptoms:** The URL structure issue appeared to be a GitHub Pages configuration problem but was actually caused by simple navigation links.

2. **Test User Journeys:** Always test complete user flows, not just individual pages.

3. **Verify Assumptions:** Both URL formats worked correctly - the issue was browser behavior, not server behavior.

4. **Document Troubleshooting:** Keep detailed records of issues and solutions for future reference.

5. **Version Management Requires Discipline:** Automated systems need human oversight to prevent inappropriate version inflation.

6. **Environment Consistency Matters:** All team members and CI systems must use the same environment configuration.

## Husky Pre-commit Hook Issues

### Problem: Husky Pre-commit Hook Fails with Missing Files

**Symptoms:**
- Error: `.husky/_/husky.sh: No such file or directory`
- Error: `syntax error in expression (error token is "0")`
- Pre-commit hook fails during git commit
- Version bumping script doesn't run

**Root Cause:**
The husky package is listed in `package.json` devDependencies but `node_modules` directory doesn't exist, meaning dependencies haven't been installed.

**Solution:**
```bash
# Install npm dependencies (this will also run husky install)
npm install

# Verify husky is working
ls -la .husky/
ls -la .husky/_/
```

**Prevention:**
- Always run `npm install` after cloning the repository
- Include `node_modules/` in `.gitignore` (already done)
- Document dependency installation in README
- Use `npm ci` in CI/CD environments for consistent installs

### Problem: Pre-commit Hook Variable Issues

**Symptoms:**
- Error: `syntax error in expression (error token is "0")`
- Variables appear empty instead of "0"

**Root Cause:**
Shell variables from `grep -c` commands can return empty strings instead of "0" when no matches are found.

**Solution:**
```bash
# Ensure variables are numeric with fallback (LEGACY - no longer used)
version_const_changes=$(echo "$index_diff" | grep -cE "^[+-].*const VERSION" 2>/dev/null || echo "0")
version_const_changes=${version_const_changes:-0}  # Fallback to 0 if empty
```

## Environment Issues

### Problem: Playwright Installation Issues

**Symptoms:**
- Error: `Cannot find module '@playwright/test'`
- Error: `No such file or directory: node_modules`
- Link tests failing with module errors
- Scripts referencing non-existent Playwright installation

**Root Cause:**
The project uses Playwright for testing, but dependencies haven't been installed or are outdated.

**Solution:**
```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Verify installation
npx playwright --version
```

**Prevention:**
- Always run `npm ci` after cloning the repository
- Include `node_modules/` in `.gitignore` (already done)
- Document dependency installation in README
- Use `npm ci` in CI/CD environments for consistent installs

## Layout Debugging

### Problem: Layout Issues Requiring Systematic Analysis

**Symptoms:**
- Elements not positioned correctly
- Layout inconsistencies across pages
- Responsive design problems
- Footer visibility issues

**Root Cause:**
CSS layout issues require systematic debugging with precise measurements and visual documentation.

**Solution:**
The project uses **Playwright-based debugging** for systematic layout issue resolution. This approach provides objective measurements and visual verification for CSS layout problems.

### Playwright Debugging Methodology

**Key Benefits:**
1. **Objective Measurements**: Pixel-perfect element positioning
2. **Automated Screenshots**: Visual documentation of issues
3. **Computed Style Analysis**: Complete CSS property extraction
4. **Cross-page Consistency**: Systematic testing across all routes
5. **Quantitative Analysis**: Mathematical verification of layout behavior

**Debugging Tools Available:**
- **`tests/playwright-link-testing-modern.spec.ts`**: Modern comprehensive testing
- **`tests/playwright-link-testing-comprehensive.spec.ts`**: Full feature parity testing
- **`tests/versioning-diagnostics.spec.ts`**: Versioning pipeline diagnostics

**Usage:**
```bash
# Run layout debugging tests
npm run test:links:playwright:debug

# Interactive debugging
npm run test:links:playwright:ui

# Comprehensive testing
npm run test:links:playwright
```

### Why Playwright?

**Advantages over Traditional Debugging:**
- **Reproducible**: Same results every time
- **Comprehensive**: Tests all pages automatically
- **Documented**: Screenshots provide visual proof
- **Quantitative**: Precise measurements, not estimates
- **Efficient**: Automated analysis vs. manual inspection
- **Cross-Browser Compatibility**: Playwright ensures functionality works across different browsers and environments

### Playwright Debugging Methodology

**1. Test-Driven Debugging**: Write Playwright tests before making changes

## Layout Troubleshooting

---

## Legacy Documentation

The following files were consolidated into this document:
- **`docs/TROUBLESHOOTING.md`** - Comprehensive troubleshooting guide with modern Playwright testing and legacy reference (consolidated)

*Last Updated: 2025-09-29*
*Related Files: `version.json`, `scripts/update-version-json.js`, `js/version-display.js`, `package.json`, `.husky/pre-commit`, `index.html`, `node_modules/`, `docs/TESTING.md`, `docs/VERSIONING.md`, `docs/ARCHITECTURE.md`*