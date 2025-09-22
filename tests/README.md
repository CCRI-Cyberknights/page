# Tests

This directory contains automated tests for the CCRI Cyberknights website.

## Test Files

### `test_routing.py`
Tests the main site's client-side routing and navigation functionality:
- Tests the `/resources/linux` route
- Verifies Linux Cheat Sheet link navigation
- Tests "Back to Club" link functionality
- Tests QR Code toggle and panel visibility

### `test_qr_standalone.py`
Tests the QR Code functionality on standalone pages:
- Tests the Linux cheat sheet page (`resources/linux-cheatsheet-1.html`)
- Verifies QR Code toggle button works
- Tests QR Code panel visibility and canvas generation
- Checks QR Code info display

## Running Tests

### Prerequisites
1. Start the Python HTTP server:
   ```bash
   python3 -m http.server 8000
   ```

2. Activate the Selenium environment:
   ```bash
   source selenium_env/bin/activate
   ```

### Running Individual Tests
```bash
# Test main site routing
python tests/test_routing.py

# Test standalone QR Code functionality
python tests/test_qr_standalone.py
```

### Running All Tests
```bash
# Run all tests
python tests/test_routing.py && python tests/test_qr_standalone.py
```

## Test Environment

- **Browser**: Chrome (headless mode)
- **Server**: Python HTTP server on port 8000
- **Dependencies**: Selenium WebDriver
- **Environment**: Virtual environment in `selenium_env/`

## Test Coverage

- ✅ Client-side routing (`#/resources/linux`)
- ✅ Resource page filtering and display
- ✅ Navigation links (Back to Club, Linux Boot Guide)
- ✅ QR Code functionality (toggle, panel, generation)
- ✅ Standalone page navigation
- ✅ Cross-page link functionality

## Adding New Tests

When adding new test files:
1. Follow the naming convention: `test_*.py`
2. Use descriptive names that indicate what is being tested
3. Update this README with a description of the new test
4. Ensure tests can run independently and don't interfere with each other
