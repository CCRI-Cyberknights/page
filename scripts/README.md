# Scripts Directory

This directory contains utility scripts for the CCRI Cyberknights landing pages project.

**For troubleshooting layout issues:** See [Advanced Screenshot Analysis & AI-Powered Debugging](../docs/TROUBLESHOOTING.md#advanced-screenshot-analysis--ai-powered-debugging) in the troubleshooting guide.

---

## Script Consolidation Policy

### Overview

This directory follows a consolidation policy similar to the documentation standards in `docs/README.md`. Scripts that have completed their purpose (one-time migrations, completed refactors) are removed from the active codebase but preserved in Git history with full traceability.

### Consolidation Decision Framework

Use this decision tree for script management:

1. **Is the script used in active workflows (CI/CD, pre-commit hooks)?** → Keep
2. **Is the script part of ongoing maintenance (QR generation, testing)?** → Keep
3. **Was the script a one-time migration that's now complete?** → Remove (with Git reference)
4. **Is the script referenced in package.json or GitHub Actions?** → Keep
5. **Does the script have future utility for similar tasks?** → Keep

### Removal Process

When removing completed migration scripts:

1. **Document in Legacy Scripts section** (below)
2. **Include Git commit hash** for historical reference
3. **Summarize purpose and completion status**
4. **Remove file from repository**
5. **Commit with descriptive message**

---

## Legacy Scripts

The following scripts served their purpose and have been archived. They remain accessible via Git history.

### `refactor-guide-styles.py`
**Purpose**: Automated refactoring of guide HTML files to use idiomatic Tailwind CSS patterns  
**Completed**: September 2025 (commit `72a4b98`)  
**Last Version**: Git hash `d38f18b`  
**Summary**: 
- Replaced CSS custom properties with JIT configuration
- Added `@layer` organization for component styles
- Migrated all 5 guide files to idiomatic Tailwind patterns
- Migration completed successfully, all guides now use consistent styling

**Status**: ✅ Migration complete - script no longer needed

### `update-cheatsheet-qr-to-svg.py`
**Purpose**: One-time migration from canvas-based QR codes to SVG format  
**Completed**: September 2025 (commit `8d14022`)  
**Last Version**: Git hash `ddedd7a`  
**Summary**:
- Converted canvas-generated QR codes to SVG format
- Updated all cheatsheet HTML files with SVG QR codes
- Improved QR code quality and consistency
- All QR codes now use SVG format with proper viewBox scaling

**Status**: ✅ Migration complete - use `generate_qr_codes.py` for new QR codes

### `validate_qr_standards.py`
**Purpose**: QR code standards validation tool  
**Completed**: October 2025 (commit `e20c4e1`)  
**Last Version**: Git hash `e20c4e1`  
**Summary**:
- Validated SVG format, viewBox, colors, and dimensions
- Batch processing for all guide files
- Auto-fix capability for common issues
- All guides now follow consistent QR standards

**Status**: ✅ Standards established and validated - QR codes now consistently formatted

### `analyze-qr-modal.py`
**Purpose**: AI-powered screenshot analysis for CSS layout debugging  
**Completed**: October 2025 (commit `3e46f71`)  
**Last Version**: Git hash `3e46f71`  
**Summary**:
- OpenCV integration for computer vision analysis
- Element detection (QR codes, URL boxes, modal borders)
- Overlap detection and distance measurements
- Layout issues resolved using browser API verification

**Status**: ✅ Layout debugging complete - use browser DevTools for future layout issues

### `analyze-keyboard-visibility.py`
**Purpose**: OpenCV analysis for mobile keyboard visibility testing  
**Completed**: October 2025 (commit `06843f7`)  
**Last Version**: Git hash `06843f7`  
**Summary**:
- OpenCV-based screenshot analysis for keyboard detection
- QR code and input field visibility verification
- Replaced with simpler CSS-first approach (100dvh)
- Legacy testing approach superseded by Playwright tests

**Status**: ✅ Mobile keyboard issue resolved - use Playwright tests for future mobile testing

### `test-keyboard-visibility.sh`
**Purpose**: Bash wrapper for OpenCV keyboard visibility tests  
**Completed**: October 2025 (commit `06843f7`)  
**Last Version**: Git hash `06843f7`  
**Summary**:
- Automated running of Playwright + OpenCV tests
- Legacy testing infrastructure
- Replaced with direct Playwright test execution

**Status**: ✅ Testing infrastructure simplified - use `npx playwright test` directly

### `test-mobile-keyboard-playwright.sh`
**Purpose**: Bash wrapper for Playwright mobile keyboard tests  
**Completed**: October 2025 (commit `06843f7`)  
**Last Version**: Git hash `06843f7`  
**Summary**:
- Automated running of Playwright mobile keyboard tests
- Wrapper for test suite execution
- Replaced with direct Playwright test execution

**Status**: ✅ Testing infrastructure simplified - use `npx playwright test tests/qr-modal-mobile-keyboard-playwright.spec.ts` directly

---

## YouTube URL Shortener Script

### `youtube_url_shortener.py`

A Python script for shortening long YouTube URLs to `youtu.be` format, essential for creating clean QR codes.

#### Features

- **Automatic Shortening**: Shortens long YouTube URLs to short format
- **Prefix Preservation**: Maintains prefixes like `@` if present
- **Batch Processing**: Can shorten multiple URLs at once
- **Error Handling**: Gracefully handles non-YouTube URLs
- **Command Line Interface**: Easy to use from command line

#### Usage

```bash
# Shorten single URL
python youtube_url_shortener.py "https://www.youtube.com/watch?v=VIDEO_ID&list=..."

# Shorten multiple URLs
python youtube_url_shortener.py "https://www.youtube.com/watch?v=VIDEO1&list=..." "https://www.youtube.com/watch?v=VIDEO2&list=..."

# Run test cases (no arguments)
python youtube_url_shortener.py
```

#### Examples

```bash
# Input: https://www.youtube.com/watch?v=7JYJO_D8zVs&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=4
# Output: https://youtu.be/7JYJO_D8zVs

# Input: @https://www.youtube.com/watch?v=gSVg40u0fZE&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=5
# Output: @https://youtu.be/gSVg40u0fZE
```

#### Integration with QR Code Workflow

This script is essential for the QR code generation workflow:

1. **Shorten URLs**: Use this script to shorten long YouTube URLs to short format
2. **Generate QR Codes**: Use the short URLs in `generate_qr_codes.py`
3. **Embed in HTML**: Use the generated QR codes in educational guides

## Active Utility Scripts

### `generate_qr_codes.py`

A comprehensive Python script for generating SVG QR codes with custom styling and colors, specifically designed for embedding directly into HTML guides. This script was developed to support the QR code integration in educational guides like the Linux cheat sheet.

#### What We Achieved

We successfully created a **production-ready SVG QR code generation system** that:
- **Generates SVG QR codes** with proper viewBox scaling and styling
- **Supports command-line configuration** for all visual parameters
- **Produces HTML-ready output** with proper formatting and comments
- **Handles multiple video URLs** automatically
- **Provides detailed usage instructions** and error handling
- **Maintains consistent design standards** across all cheatsheets

#### Features

- **Multiple Cheatsheet Support**: Generate QR codes for different Linux cheatsheets (1, 2, 3, or 4)
- **SVG Format**: Generates scalable SVG QR codes instead of PNG images
- **Proper ViewBox Scaling**: Uses `viewBox="0 0 23.2 23.2"` for consistent rendering
- **Custom Colors**: Generate QR codes with emerald backgrounds (#10b981) and black modules (#000000)
- **Minimal Margins**: Configurable border settings for tight, clean appearance
- **HTML-Ready Output**: Generates complete SVG elements ready for direct HTML embedding
- **Low ECL**: Uses Low Error Correction Level for smaller, more compact QR codes
- **Configurable**: Command-line options for all visual parameters
- **Batch Processing**: Handles multiple URLs in a single run
- **Error Handling**: Comprehensive error checking and user feedback
- **Design Standards**: Maintains consistent appearance across all cheatsheets

#### How It Works

1. **QR Code Creation**: Uses the `qrcode` Python library to generate QR codes
2. **SVG Generation**: Converts QR code modules to SVG path data
3. **ViewBox Scaling**: Applies proper scaling (total_size / 10) for consistent rendering
4. **SVG Assembly**: Creates complete SVG elements with proper styling
5. **File Output**: Saves formatted results with comments and metadata

#### Usage

```bash
# Generate QR codes for Linux Cheatsheet 1 (default)
python generate_qr_codes.py

# Generate QR codes for Linux Cheatsheet 2
python generate_qr_codes.py --cheatsheet 2

# Generate QR codes for Linux Cheatsheet 3
python generate_qr_codes.py --cheatsheet 3

# Generate QR codes for Linux Cheatsheet 4
python generate_qr_codes.py --cheatsheet 4

# Save to custom output file
python generate_qr_codes.py --cheatsheet 2 --output qr_codes_cheatsheet2.txt

# Different error correction level (not recommended - stick with L)
python generate_qr_codes.py --cheatsheet 1 --ecl M --box-size 8 --border 2
```

#### Command Line Options

- `--cheatsheet`: Cheatsheet number (1, 2, 3, or 4) - default: 1
- `--ecl`: Error Correction Level ('L', 'M', 'Q', 'H') - default: 'L' (recommended)
- `--box-size`: Size of each QR module in pixels - default: 8
- `--border`: Border size in modules - default: 2
- `--fill-color`: Color of QR code modules - default: '#000000' (black)
- `--back-color`: Background color - default: '#10b981' (emerald green)
- `--output`: Output file for SVG QR codes - default: 'qr_codes_output.txt'

#### Output Format

The script generates a text file containing:
- Comments with video titles and URLs
- Complete SVG elements ready for HTML embedding
- Character count for each QR code
- Usage instructions for HTML integration

#### Example Output

```
# QR Codes for Linux Cheat Sheet
# Generated with generate_qr_codes.py

# Linux Commands and File Structure
# URL: https://youtu.be/N9j--n-zGgc
# Length: 1494 characters
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOgAAADoCAIAAABqyz8vAAAEF0lEQVR4nO3dQW5TMRRA0RaxgOyKZSGWxa6yBAaMv4SRLfvW54xLmpArD57c9z9fv399QM233W8A/odwSRIuScIlSbgkCZck4ZIkXJKES5JwSRIuScIlSbgkCZck4ZL0ffQfvH/8/CgYvWc863Ot/r27Ptdqo5/LiUuScEkSLknCJUm4JAmXJOFyxxz3ya79DKfNX1e/n6fXfw2+//r35cQlSbgkCZck4ZIkXJKES5JwuXuOe9qc9au+z9Xekf8HJy5JwiVJuCQJlyThkiRckoRL0vI57mlG77OOzjUrewzqnLgkCZck4ZIkXJKES5JwSRIuSdfNcWeZNfcdfX3+cuKSJFyShEuScEkSLknCJUm4JC2f4542j6zPX2ftx618X0+cuCQJlyThkiRckoRLknBJEi53z3Er+wR27VVY/dyyr/p9PXHikiRckoRLknBJEi5JwiVJuNwxx63c13wya55amYO+4t/XEycuScIlSbgkCZck4ZIkXJKES9Ln6JxvdH45a464eu/BrM+1er572j3d16Y5sROXJOGSJFyShEuScEkSLknC5Y457pPV+wEq+wcq+3ffm+4Tz3r/TlyShEuScEkSLknCJUm4JAmXO/YqzNoXO+qr3n/dtZd3196JWe/TiUuScEkSLknCJUm4JAmXJOGStHw/7up7tJX7uKftqX1tujc86/WduCQJlyThkiRckoRLknBJEi5Jy/fjcubc9LVpruw+LlcTLknCJUm4JAmXJOGSJFzuuI+76+/xT/u9p72f96TXr+wzduKSJFyShEuScEkSLknCJUm43H0fd9f8b9bcd5fTnqM2atf34sQlSbgkCZck4ZIkXJKES5Jwufs+7qjV919n/d7V91nrc9n3pnvPTlyShEuScEkSLknCJUm4JAmXpOVz3NP2Cay+f7z6uWir57vvyH1oJy5JwiVJuCQJlyThkiRckoTLHXsV6nY992vW7z1tr8UuTlyShEuScEkSLknCJUm4JAmXO+7j7vp7/1G75rKneR82l531fpy4JAmXJOGSJFyShEuScEkSLnfvVThtLjjrdWZ9rtV7dp+cdo92FicuScIlSbgkCZck4ZIkXJKES9K2/bijds1TVz8X7cnqn5/FflwYIFyShEuScEkSLknCJUm4JC2f41bseq7YLq/D5uL2KnAF4ZIkXJKES5JwSRIuScIlyRz30H0Fleef7ZqLO3FJEi5JwiVJuCQJlyThkiRckpbPcU/bz7rruV+z5rL1vRazOHFJEi5JwiVJuCQJlyThkiRc7p7jftX9A6vnxLN+vn7fd5QTlyThkiRckoRLknBJEi5JwiXp87R7lvAvnLgkCZck4ZIkXJKES5JwSRIuScIlSbgkCZck4ZIkXJKES5JwSRIuH0V/AD9lY5vuT1JzAAAAAElFTkSuQmCC

# File System Navigation from the Terminal
# URL: https://youtu.be/lI0mUMqBesU
# Length: 1506 characters
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOgAAADoCAIAAABqyz8vAAAEH0lEQVR4nO3d0W0UMRRA0QSlgO2KshBl0dWUQAMZhMGWfTPnfCe7s5srfzw59vvr1883qPm2+wHgXwiXJOGSJFyShEuScEkSLknCJUm4JAmXJOGSJFyShEuScEkSLkkfo79wff/xVnC3z/ju+XftS571fb4GP+9pRr9/Ky5JwiVJuCQJlyThkiRckoTLM+a4d+pz0F3vO/q97XrfWWY9vxWXJOGSJFyShEuScEkSLknC5dlz3PrccXSf7q79vru+h9Oe04pLknBJEi5JwiVJuCQJlyThkrR8jls3a7476/VPOxdiFysuScIlSbgkCZck4ZIkXJKES9Lj5rirz5GdNWc1r/0zKy5JwiVJuCQJlyThkiRckoRL0vI57mlzx9Xn6c6aE3/VcxtmseKSJFyShEuScEkSLknCJUm4PHuOu+u+sdPmr7POSVjtiv+9rLgkCZck4ZIkXJKES5JwSRIuSe+V/Ze7rL73a9Y+3aex4pIkXJKES5JwSRIuScIlSbg8Yz/u6rnj6rnpLPXXvw7bNzz6ea24JAmXJOGSJFyShEuScEkSLknL9+Oett901/1hq+emr0nPXznH14pLknBJEi5JwiVJuCQJlyThkrT8nrNRu/bjnrbfdJZr8Vx211zcikuScEkSLknCJUm4JAmXJOGStO2es9P2oe56/dH33XVe7+uw+a4VlyThkiRckoRLknBJEi5JwuUZ5ypU9svu+n//Xa7IucV3nI/LIwiXJOGSJFyShEuScEkSLkkfX3Vf6ayff9p89Jo057YfFz4hXJKES5JwSRIuScIlSbgkLb/n7LT55eo55aznGfWKz49HWXFJEi5JwiVJuCQJlyThkiRcko6752zW/G/WnHL1vPPOaec8vJyPC/9PuCQJlyThkiRckoRLknBJWn4+7mn7RE+bH6/ep7uL/bjwCeGSJFyShEuScEkSLknCJWnbuQq7jO4TPe1+tdX7XK/IPXBWXJKES5JwSRIuScIlSbgkCZdnnKtQ2Sd6N3ecdS/aafPd+lx2lBWXJOGSJFyShEuScEkSLknC5dnn41buS5s1f139eXfdf1Z5HisuScIlSbgkCZck4ZIkXJKES9Lye85Om/+ttuv84CuyT3oWKy5JwiVJuCQJlyThkiRckoRL0vI57mlW3yu26964K/L8s855sOKSJFyShEuScEkSLknCJUm4JD1ujjtq13x01nm616b71Vafy2vFJUm4JAmXJOGSJFyShEuScElaPsc97TyEWfPIXZ931z1td3ad52DFJUm4JAmXJOGSJFyShEuScHn2HPdp57POmteeto92lHMVYIBwSRIuScIlSbgkCZck4ZL0ftp+WfgbVlyShEuScEkSLknCJUm4JAmXJOGSJFyShEuScEkSLknCJUm4JAmXt6LfZJJanrtwxm8AAAAASUVORK5CYII=

📋 Usage Instructions:
1. Copy the base64 data URLs from the output file
2. Paste them into your HTML <img> src attributes
3. Example: <img src="data:image/png;base64,iVBORw0KGgo..." />
```

#### Dependencies

- `qrcode[pil]`: QR code generation library with PIL support
- `argparse`: Command-line argument parsing (built-in)
- `base64`: Base64 encoding (built-in)
- `io`: StringIO for memory buffer (built-in)

#### Installation

```bash
pip install qrcode[pil]
```

#### Integration with HTML

The generated SVG elements can be directly embedded in HTML:

```html
<svg width="120" height="120" viewBox="0 0 23.2 23.2" xmlns="http://www.w3.org/2000/svg" class="border border-emerald-500 rounded" style="background-color: #10b981;">
  <path d="[QR_CODE_PATH_DATA]" fill="#000000" fill-opacity="1" fill-rule="nonzero" stroke="none"/>
  <title>QR Code</title>
</svg>
```

#### Design Standards

**⚠️ IMPORTANT**: All QR codes must follow the established design standards. See [QR Code Standards](../docs/QR-CODE-STANDARDS.md) for complete specifications.

**Key Requirements**:
- **Format**: SVG (NOT PNG)
- **ViewBox**: `"0 0 23.2 23.2"` (scaled by factor of 10)
- **Fill Color**: `"#000000"` (hex format, NOT "black")
- **Display Size**: `120x120` pixels
- **Background**: `#10b981` (emerald green)

#### Adding New Cheatsheets

To add support for new cheatsheets (e.g., Cheatsheet 3):

1. **Edit the Script**: Modify `get_cheatsheet_videos()` function in `generate_qr_codes.py`
2. **Add New Entry**: Add a new entry to the `cheatsheets` dictionary:
   ```python
   3: [
       {
           'title': 'New Video Title',
           'url': 'https://youtu.be/SHORT_URL',
           'full_url': 'https://www.youtube.com/watch?v=FULL_URL',
           'filename': 'video1_qr'
       }
   ]
   ```
3. **Update Argument Parser**: Add the new cheatsheet number to the choices:
   ```python
   parser.add_argument('--cheatsheet', type=int, choices=[1, 2, 3], default=1,
                      help='Cheatsheet number (1, 2, or 3, default: 1)')
   ```
4. **Test**: Run `python generate_qr_codes.py --cheatsheet 3` to verify

#### Replication Process

To replicate this QR code system for other guides:

1. **Install Dependencies**: `pip install qrcode[pil]`
2. **Run Script**: `python generate_qr_codes.py --cheatsheet 2`
3. **Copy Base64 Data**: Extract QR codes from output file
4. **Embed in HTML**: Use the provided HTML template structure
5. **Apply Styling**: Use Tailwind CSS classes for consistent appearance

#### Why This Approach?

1. **Self-Contained**: No external image files needed
2. **Fast Loading**: No additional HTTP requests
3. **Reliable**: Works in any browser without JavaScript
4. **Customizable**: Easy to modify colors and styling
5. **Version Control Friendly**: All content in one HTML file
6. **Scalable**: Easy to generate QR codes for new content
7. **Maintainable**: Clear separation of generation and embedding

---

## Active Automated Testing Scripts

These scripts are actively used in CI/CD pipelines and pre-commit hooks.

### `test-links-playwright.js`

A comprehensive Playwright script that tests all links on the site across production and local environments. This script is integrated with the Git pre-commit hook and runs automatically when HTML files are modified.

#### Features

- **Playwright-based**: Modern, reliable browser automation
- **Dual URL Testing**: Tests both production and local development URLs
- **Comprehensive Coverage**: Tests internal hash links, external links, and navigation flows
- **Pre-commit Integration**: Automatically runs when HTML files are modified
- **Performance Monitoring**: Tracks test execution time and throughput

#### Usage

```bash
# Run via npm (recommended)
npm run test:links

# Direct execution
node scripts/test-links-playwright.js
```

#### Pre-commit Integration

The script is automatically called by the Git pre-commit hook (`.husky/pre-commit`) when HTML files are modified, ensuring all links work correctly before commits.

### `test-qr-urls.js`

Tests that QR code URLs are correctly configured and point to valid hash routes in the SPA.

#### Usage

```bash
# Full test suite
npm run test:qr-urls

# Smoke test (quick validation)
npm run test:qr-urls:smoke
```

### `update-version-json.js`

Automatically updates `version.json` after version bumps via `standard-version`. This script is called as a `postbump` hook in package.json.

#### Features

- **Automatic Execution**: Runs after every version bump
- **JSON Synchronization**: Keeps version.json in sync with package.json
- **Git Integration**: Automatically stages changes for the release commit

---

## Related Documentation

- **Testing Guide**: See [TESTING.md](../docs/TESTING.md) for comprehensive testing documentation
- **Troubleshooting**: See [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) for debugging techniques
- **Project Overview**: See main [README.md](../README.md) for project context
- **Architecture**: See [ARCHITECTURE.md](../docs/ARCHITECTURE.md) for technical details
