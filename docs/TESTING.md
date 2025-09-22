# Testing Strategy & Implementation

Automated testing using Selenium WebDriver to ensure functionality across client-side routing, QR code generation, and cross-page navigation.

## Overview

The project uses a comprehensive test suite to validate:
- Client-side hash-based routing (`#/page` navigation)
- QR Code functionality (generation, error correction, download)
- Resource page filtering and display
- Cross-page link functionality
- Standalone page navigation and features

## Test Architecture

### Test Environment
- **Browser**: Chrome (headless mode for CI/CD compatibility)
- **Framework**: Selenium WebDriver 4.x
- **Language**: Python 3.x
- **Server**: Python HTTP server (port 8000)
- **Environment**: Isolated virtual environment (`selenium_env/`)

### Test Organization
```
tests/
├── README.md              # Test documentation and usage
├── run_tests.py           # Test runner (executable)
├── test_routing.py        # Main site routing tests
└── test_qr_standalone.py  # Standalone page tests
```

## Test Categories

### 1. Client-Side Routing Tests (`test_routing.py`)

**Purpose**: Validates the JavaScript router and page navigation functionality.

**Coverage**:
- Hash-based routing (`#/resources/linux`)
- Dynamic content loading and rendering
- Resource page filtering and category selection
- Cross-page navigation links
- QR Code toggle and panel functionality

**Key Test Cases**:
- Navigate to `/resources/linux` route
- Verify Linux Cheat Sheet link presence and functionality
- Test "Back to Club" navigation
- Validate QR Code panel visibility and generation

### 2. Standalone Page Tests (`test_qr_standalone.py`)

**Purpose**: Ensures standalone HTML pages work independently of the main SPA.

**Coverage**:
- Direct HTML file loading (`resources/linux-cheatsheet-1.html`)
- QR Code functionality on standalone pages
- Footer positioning and styling consistency
- Cross-page link functionality

**Key Test Cases**:
- Load standalone Linux cheat sheet page
- Test QR Code toggle and panel visibility
- Verify QR Code generation and info display
- Validate navigation links work correctly

## Testing Approach

### Why Selenium?

**Client-Side Heavy Application**: The site relies heavily on JavaScript for:
- Hash-based routing (`#/page` navigation)
- Dynamic content rendering
- QR Code generation and interaction
- Resource filtering and display

**Cross-Browser Compatibility**: Selenium ensures functionality works across different browsers and environments.

**User Journey Testing**: Tests simulate real user interactions (clicks, navigation, form input).

**Visual Regression Prevention**: Catches layout and styling issues that unit tests might miss.

### Test Design Principles

**1. Real User Simulation**
- Tests interact with elements as users would
- Use realistic wait times and interaction patterns
- Test complete user journeys, not isolated functions

**2. Robust Element Selection**
- Prefer stable selectors (IDs, data attributes)
- Use XPath for complex text-based selections
- Implement proper wait strategies (WebDriverWait)

**3. Isolated Test Cases**
- Each test can run independently
- No shared state between tests
- Clean setup and teardown

**4. Comprehensive Coverage**
- Test both happy path and edge cases
- Validate error states and fallbacks
- Cover all major user workflows

## Implementation Details

### Test Setup

**Virtual Environment**:
```bash
python -m venv selenium_env
source selenium_env/bin/activate
pip install selenium
```

**Chrome Driver Configuration**:
```python
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
```

### Wait Strategies

**Explicit Waits**: Use `WebDriverWait` for dynamic content:
```python
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "app"))
)
```

**Implicit Waits**: Allow time for JavaScript execution:
```python
time.sleep(2)  # For complex interactions
```

### Element Selection Patterns

**Stable Selectors**:
- IDs: `driver.find_element(By.ID, "footer-qr-toggle")`
- XPath with text: `driver.find_element(By.XPATH, "//a[contains(text(), '← Back to Resources')]")`
- CSS selectors: `driver.find_element(By.CSS_SELECTOR, ".qr-panel")`

## Running Tests

### Prerequisites
1. **Start Development Server**:
   ```bash
   python3 -m http.server 8000
   ```

2. **Activate Test Environment**:
   ```bash
   source selenium_env/bin/activate
   ```

### Test Execution

**Run All Tests**:
```bash
python tests/run_tests.py
```

**Run Individual Tests**:
```bash
python tests/test_routing.py
python tests/test_qr_standalone.py
```

**Test Runner Features**:
- Parallel test execution
- Comprehensive reporting
- Exit code based on results
- Color-coded output

## Test Maintenance

### Adding New Tests

**1. Follow Naming Convention**: `test_*.py`

**2. Test Structure**:
```python
def test_feature_name():
    # Setup
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Test steps
        driver.get("http://localhost:8000/page")
        # Assertions
    finally:
        driver.quit()
```

**3. Update Documentation**:
- Add test description to `tests/README.md`
- Update test coverage list
- Document any new dependencies

### Debugging Tests

**Headful Mode**: Remove `--headless` flag for visual debugging:
```python
# chrome_options.add_argument("--headless")  # Comment out
```

**Screenshots**: Capture screenshots on failure:
```python
driver.save_screenshot("test_failure.png")
```

**Console Logs**: Enable browser console logging:
```python
chrome_options.add_argument("--enable-logging")
chrome_options.add_argument("--log-level=0")
```

## Continuous Integration

### GitHub Actions Integration

**Workflow Example**:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.x
      - name: Install dependencies
        run: |
          python -m venv selenium_env
          source selenium_env/bin/activate
          pip install selenium
      - name: Run tests
        run: |
          python3 -m http.server 8000 &
          source selenium_env/bin/activate
          python tests/run_tests.py
```

## Best Practices

### Test Reliability

**1. Stable Selectors**: Use IDs and data attributes over CSS classes
**2. Proper Waits**: Always wait for elements to be present/visible
**3. Clean State**: Reset browser state between tests
**4. Error Handling**: Implement proper try/catch blocks

### Performance

**1. Headless Mode**: Use headless Chrome for faster execution
**2. Parallel Execution**: Run independent tests in parallel
**3. Resource Cleanup**: Always quit WebDriver instances
**4. Selective Testing**: Run only relevant tests during development

### Maintenance

**1. Regular Updates**: Keep Selenium and ChromeDriver versions current
**2. Test Review**: Regularly review and update test cases
**3. Documentation**: Keep test documentation current
**4. Monitoring**: Track test execution times and failure rates

## Future Enhancements

### Planned Improvements

**1. Visual Regression Testing**: Add screenshot comparison tests
**2. Performance Testing**: Measure page load times and interaction responsiveness
**3. Mobile Testing**: Add mobile device simulation tests
**4. Accessibility Testing**: Integrate aXe-core for accessibility validation

### Test Coverage Expansion

**1. Calendar Functionality**: Test Google Calendar integration and ICS parsing
**2. Resource Filtering**: Test all resource categories and search functionality
**3. QR Code Edge Cases**: Test with various URL lengths and special characters
**4. Cross-Browser Testing**: Add Firefox and Safari support

## Troubleshooting

### Common Issues

**1. Element Not Found**: Check if element exists and is visible
**2. Timeout Errors**: Increase wait times for slow-loading content
**3. Chrome Driver Issues**: Ensure ChromeDriver version matches Chrome version
**4. Port Conflicts**: Verify port 8000 is available for the test server

### Debug Commands

**Check Chrome Version**:
```bash
google-chrome --version
```

**Check ChromeDriver Version**:
```bash
chromedriver --version
```

**Test Server Status**:
```bash
curl http://localhost:8000
```

This testing strategy ensures the CCRI Cyberknights website maintains high quality and reliability across all features and user interactions.
