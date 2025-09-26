# Troubleshooting Guide

This document covers common issues encountered during development and maintenance of the Cyber Club website, including version management problems and their solutions.

## Version Management Issues

### Problem: Aggressive Version Bumping

**Symptoms:**
- Documentation commits incorrectly trigger minor bumps (1.2.5 → 1.3.0)
- Font improvements cause version jumps (1.2.5 → 1.4.0)
- Code refactoring triggers major bumps (1.2.5 → 1.5.0)
- Version numbers inflate rapidly without corresponding feature additions

**Root Cause:**
The automated version bumping system (`scripts/bump-version.sh`) was overly aggressive and had several logic flaws:

1. **Incorrect Commit Message Analysis**: Script reads previous commit instead of current commit
2. **Overly Broad Minor Bump Criteria**: Terms like "improve" and "enhance" catch patch-level changes
3. **File Analysis Issues**: Regex patterns too broad, catching refactoring as new features

**Solution Implemented:**
Manual approval system for non-patch bumps:

```bash
# New behavior in bump-version.sh
if [[ "$bump_type" == "patch" ]]; then
    echo "✅ Auto-approving PATCH bump"
    bump_version "$bump_type"
else
    if prompt_for_approval "$bump_type" "$CURRENT_VERSION"; then
        bump_version "$bump_type"
    else
        echo "⚠️ Skipping version bump due to user cancellation"
        exit 0
    fi
fi
```

**Current Status (v1.6.10):**
- ✅ **PATCH bumps**: Automatically approved and applied
- ✅ **MINOR/MAJOR bumps**: Require manual user approval
- ✅ **User Control**: You can approve or cancel any non-patch bump
- ✅ **Clear Feedback**: System shows what changes would trigger bumps

**Version Bump Guidelines:**

| Type | Trigger | Example | Result |
|------|---------|---------|---------|
| **PATCH** | Documentation, bug fixes, refactoring | `docs: update documentation` | 1.6.10 → 1.6.11 |
| **MINOR** | New features, new pages | `feat: add new resource category` | 1.6.10 → 1.7.0 |
| **MAJOR** | Breaking changes, complete redesign | `feat!: redesign entire site` | 1.6.10 → 2.0.0 |

**Prevention:**
- Use proper commit message conventions (`docs:`, `fix:`, `feat:`)
- Review version bump prompts before approving
- Monitor version history for inappropriate bumps

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

### Selenium Environment Problems

**Problem:** Selenium WebDriver not working after environment changes

**Symptoms:**
- `ModuleNotFoundError: No module named 'selenium'`
- `selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH`
- Pre-commit hooks failing with environment errors

**Root Cause:**
The project migrated from `testing_env` (Python 2.7) to `selenium_env` (Python 3.12), but some references weren't updated.

**Solution:**
1. **Use correct environment**: `selenium_env` instead of `testing_env`
2. **Install dependencies**: `pip install selenium requests beautifulsoup4`
3. **Update pre-commit hook**: Point to `selenium_env/bin/activate`
4. **Verify installation**: Run tests to confirm environment works

**Current Environment:**
- **Name**: `selenium_env`
- **Python Version**: 3.12
- **Location**: `/home/zachary/Cursor_Projects/page/selenium_env/`
- **Dependencies**: selenium, requests, beautifulsoup4

### Directory Path References

**Problem:** Scripts referencing old directory path `qr-code-landing-pages`

**Symptoms:**
- Python scripts failing with `ModuleNotFoundError`
- Subprocess commands failing with wrong working directory
- Inconsistent behavior between local and CI environments

**Root Cause:**
Project was renamed from `qr-code-landing-pages` to `page`, but some hardcoded paths weren't updated.

**Solution:**
Update all references in Python scripts:
```python
# Before
sys.path.append('/home/zachary/Cursor_Projects/qr-code-landing-pages/testing_env/lib/python3.12/site-packages')

# After
sys.path.append('/home/zachary/Cursor_Projects/page/testing_env/lib/python3.12/site-packages')
```

**Files Updated:**
- `scripts/test-links.py`
- `scripts/test-links-dynamic-parallel.py`
- `scripts/compare-link-test-performance.py`
- `scripts/test-links-dynamic.py`

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

Use the Selenium test suite in the `tests/` directory:

```bash
# Start development server
python3 -m http.server 8000

# Activate test environment
source selenium_env/bin/activate

# Run all tests
python tests/run_tests.py
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
   # Verify Python environment
   source selenium_env/bin/activate
   python --version  # Should show Python 3.12
   pip list | grep selenium  # Should show selenium installed
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
- [ ] Environment references use `selenium_env` not `testing_env`
- [ ] Directory paths reference correct project name (`page`)

### Pre-commit Hook Optimization

**Performance Issue**: Pre-commit hook running unnecessary link tests on version-only changes.

**Solution**: Enhanced pre-commit hook with intelligent change detection that skips link testing when only version numbers change in `index.html`.

**Documentation**: See [Version Management System](VERSION-MANAGEMENT.md#husky-integration-huskypre-commit) for complete details on the pre-commit hook optimization.

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
# Ensure variables are numeric with fallback
version_const_changes=$(echo "$index_diff" | grep -cE "^[+-].*const VERSION" 2>/dev/null || echo "0")
version_const_changes=${version_const_changes:-0}  # Fallback to 0 if empty
```

## Environment Issues

### Problem: Import Errors with testing_env References

**Symptoms:**
- Error: `ModuleNotFoundError: No module named 'selenium'`
- Error: `No such file or directory: testing_env/bin/activate`
- Link tests failing with import errors
- Scripts referencing non-existent `testing_env` directory

**Root Cause:**
The project migrated from `testing_env` (Python 2.7) to `selenium_env` (Python 3.12), but some script references weren't updated.

**Solution:**
1. **Verify Environment Exists**:
   ```bash
   ls -la selenium_env/
   ```

2. **Check All Script References**: Search for any remaining `testing_env` references:
   ```bash
   grep -r "testing_env" .
   ```

3. **Update Script References**: All scripts should reference `selenium_env`:
   ```bash
   # Example fixes:
   sed -i 's/testing_env/selenium_env/g' scripts/*.py
   sed -i 's/testing_env/selenium_env/g' scripts/*.sh
   ```

4. **Recreate Environment** (if needed):
   ```bash
   python3 -m venv selenium_env
   source selenium_env/bin/activate
   pip install selenium requests beautifulsoup4
   ```

**Prevention:**
- Always use `selenium_env` in new scripts
- Run `grep -r "testing_env" .` before committing
- Document environment requirements clearly

### Problem: Localhost Link Tests Failing

**Symptoms:**
- Production link tests pass (100% success)
- Localhost link tests fail (low success rate)
- Error: "Error detected or incorrect navigation"
- Links work manually but fail in automated tests

**Root Cause:**
Environment path issues or JavaScript errors in local development environment.

**Solution:**
1. **Check Environment**: Ensure using `selenium_env` not `testing_env`
2. **Verify Dependencies**: Ensure all packages installed in `selenium_env`
3. **Test Manually**: Verify links work in browser at `http://localhost:8000`
4. **Check JavaScript**: Look for console errors in browser dev tools

**Debug Steps:**
```bash
# Check environment
source selenium_env/bin/activate
python3 -c "import selenium; print('Selenium available')"

# Test local server
python3 -m http.server 8000 &
curl http://localhost:8000

# Run link tests
python3 scripts/test-links-dynamic-parallel.py "http://localhost:8000"
```

## Enhanced Error Detection Issues

### Problem: False Positives from Legitimate Content

**Symptoms:**
- Tests fail with "Error detected or incorrect navigation"
- Error messages mention legitimate content like "qr svg container not found"
- Tests pass manually but fail in automated testing

**Root Cause:**
The error detection logic was too broad and flagged legitimate content containing error-related keywords.

**Solution:**
The testing system now uses context-aware error detection:

1. **Real Error Patterns**: Only detects actual HTTP errors like `'404 error'`, `'server error'`, `'access denied'`
2. **Legitimate Content Whitelist**: Ignores known legitimate patterns:
   - `'qr svg container not found'` (JavaScript console log)
   - `'error correction level'` (QR code UI text)
   - `'console.log'`, `'debug'`, `'warning'`, `'info'` (development messages)

**Implementation:**
```python
def detect_actual_errors(self, page_source):
    error_patterns = ['404 error', 'server error', 'access denied', ...]
    legitimate_patterns = ['qr svg container not found', 'error correction level', ...]
    
    has_error_pattern = any(error in page_source for error in error_patterns)
    is_legitimate_content = any(legit in page_source for legit in legitimate_patterns)
    
    return has_error_pattern and not is_legitimate_content
```

### Problem: Missing HTTP Status Validation

**Symptoms:**
- Tests don't validate actual HTTP response codes
- Navigation appears successful but server returns error codes
- Inconsistent test results between environments

**Solution:**
Added HTTP status validation to the testing framework:

1. **Status Code Checking**: Basic HTTP status validation for navigation requests
2. **Enhanced Reporting**: Error messages now include HTTP status information
3. **Debug Information**: Improved debugging output with comprehensive status details

---

*Last Updated: January 2025*
*Related Files: `scripts/bump-version.sh`, `package.json`, `.husky/pre-commit`, `selenium_env/`, `index.html`, `node_modules/`, `scripts/test-links-dynamic-parallel.py`, `docs/TESTING-ROADMAP.md`*