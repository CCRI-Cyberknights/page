# Link Testing System

## Overview

The CCRI Cyberknights Landing Pages project includes a comprehensive link testing system that validates all internal navigation links and external links before every commit. This ensures that users never encounter broken links on the live site.

## 🌐 Dual URL Testing

The system now tests **both production and local development** URLs to ensure links work correctly in all environments:

- **Production URL**: `https://ccri-cyberknights.github.io/page` (tested first)
- **Local URL**: `http://localhost:8000` (tested second)  
- **Pre-commit Hook**: Automatically tests both URLs when HTML files change
- **Failure Handling**: Commit blocked if either URL has broken links

## Components

### 1. Main Testing Script (`scripts/test-links.py`)

A comprehensive Python script using Selenium WebDriver that tests:

- **14 Internal Navigation Links**: All hash-based routes (`#/home`, `#/cybersecurity`, etc.)
- **2 External Links**: CCRI and Microsoft Forms links
- **Navigation Flows**: Key user journeys between pages
- **Content Validation**: Ensures pages load with expected content
- **Error Detection**: Identifies 404s and other error states

### 2. Standalone Test Runner (`scripts/test-links.sh`)

A bash script that can be run manually for testing:

```bash
./scripts/test-links.sh
```

### 3. Pre-commit Integration (`.husky/pre-commit`)

Automatically runs link tests before every commit:

```bash
# Link tests run automatically on commit
git commit -m "your changes"
```

## How It Works

### Internal Link Testing

1. **Navigation**: Uses Selenium to navigate to each hash route
2. **Content Validation**: Checks for expected content on each page
3. **Error Detection**: Identifies 404s and error states
4. **SPA Compatibility**: Waits for Single-Page Application routing to complete

### External Link Testing

1. **HTTP Requests**: Uses Python `requests` library for external URLs
2. **Status Codes**: Validates HTTP response codes (200 = success)
3. **Timeout Handling**: Prevents hanging on slow external sites

### Navigation Flow Testing

1. **User Journeys**: Tests common navigation patterns
2. **Click Simulation**: Simulates user clicks on navigation elements
3. **Flow Validation**: Ensures users can navigate between pages

## Test Coverage

### Internal Links Tested

| **Category** | **Links** | **Count** |
|--------------|-----------|-----------|
| **Main Navigation** | Home, Club, Linux, Calendar, Resources | 5 |
| **Resource Categories** | Cyberknights, CCRI, CTF Competitions, CTF Tools, STEM Day, Career, Linux | 7 |
| **Special Pages** | Map (Warwick 4080), Linux Cheatsheet | 2 |

### External Links Tested

| **Link** | **URL** | **Purpose** |
|----------|---------|-------------|
| **CCRI Cybersecurity Student Club** | `https://www.ccri.edu/comp/cybersecurity/studentclub.html` | Official club page |
| **Microsoft Forms Signup** | `https://forms.cloud.microsoft/r/U26WUVJGgp` | Club signup form |

### Navigation Flows Tested

1. **Home → Club**: Main navigation flow
2. **Club → Resources**: Secondary navigation
3. **Resources → Linux**: Category filtering

## Usage

### Manual Testing

Run the standalone test script:

```bash
./scripts/test-links.sh
```

### Pre-commit Testing

Tests run automatically on every commit:

```bash
git add .
git commit -m "your changes"
# Link tests run automatically
```

### CI/CD Integration

The test script can be integrated into CI/CD pipelines:

```bash
# In your CI/CD pipeline
source selenium_env/bin/activate
python3 scripts/test-links-dynamic-parallel.py "https://ccri-cyberknights.github.io/page"
```

## Requirements

### Dependencies

- **Python 3.12+**
- **Selenium WebDriver**
- **Chrome/Chromium browser**
- **Python requests library**

### Environment Setup

The system uses a dedicated virtual environment at `selenium_env/`:

```bash
# Environment is automatically activated by scripts
source selenium_env/bin/activate
```

## Test Results

### Success Criteria

- **All internal links**: Must load with expected content
- **All external links**: Must return HTTP 200 status
- **Navigation flows**: Must complete successfully
- **No errors**: No 404s or error states detected

### Sample Output

```
🚀 Starting comprehensive link testing...
📍 Base URL: https://ccri-cyberknights.github.io/page

📋 Testing 14 internal links...
🔍 Testing internal link: Home (#/home)
   ✅ PASS: Home - Content found, no errors
...

🌐 Testing 2 external links...
🔍 Testing external link: CCRI Cybersecurity Student Club
   ✅ PASS: CCRI Cybersecurity Student Club - Status 200
...

📊 LINK TESTING REPORT
📈 SUMMARY:
   Total Links Tested: 16
   Passed: 16
   Failed: 0
   Success Rate: 100.0%

🎉 ALL TESTS PASSED! Your links are working correctly.
```

## Troubleshooting

### Common Issues

1. **Selenium Environment Missing**
   ```bash
   # Ensure selenium_env exists
   ls -la selenium_env/
   ```

2. **Chrome Driver Issues**
   ```bash
   # Check Chrome installation
   google-chrome --version
   ```

3. **Network Timeouts**
   - External links may timeout on slow connections
   - Increase timeout values in the script if needed

### Debug Mode

For debugging, modify the script to run in non-headless mode:

```python
# In scripts/test-links.py
chrome_options.add_argument("--headless")  # Remove this line
```

## Maintenance

### Adding New Links

1. **Internal Links**: Add to `internal_links` array in `scripts/test-links.py`
2. **External Links**: Add to `external_links` array
3. **Navigation Flows**: Add to `flows` array in `test_navigation_flow()`

### Updating Expected Content

When page content changes, update the `expected_content` field for each link:

```python
{"url": "#/home", "name": "Home", "expected_content": "New Expected Content"}
```

## Benefits

- **Prevents Broken Links**: Catches link issues before they reach users
- **Automated Validation**: No manual testing required
- **Comprehensive Coverage**: Tests all navigation paths
- **CI/CD Ready**: Integrates with automated deployment pipelines
- **User Experience**: Ensures smooth navigation for all users

---

*Last Updated: January 2025*
*Related Files: `scripts/test-links.py`, `scripts/test-links.sh`, `.husky/pre-commit`*
