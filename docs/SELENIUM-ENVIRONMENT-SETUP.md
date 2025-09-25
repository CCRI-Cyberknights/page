# Selenium Environment Setup

## Overview

This document describes the setup and maintenance of the `selenium_env` virtual environment used for automated testing and debugging in the CCRI Cyberknights project.

## Environment Details

### Virtual Environment
- **Name**: `selenium_env`
- **Python Version**: 3.12
- **Location**: `/home/zachary/Cursor_Projects/page/selenium_env/`
- **Purpose**: Isolated environment for Selenium WebDriver testing and debugging

### Dependencies
- **selenium**: 4.35.0 - WebDriver automation framework
- **requests**: 2.32.5 - HTTP library for link testing
- **beautifulsoup4**: 4.13.5 - HTML parsing for link discovery
- **urllib3**: 2.5.0 - HTTP client (selenium dependency)
- **certifi**: 2025.8.3 - SSL certificate verification
- **charset_normalizer**: 3.4.3 - Character encoding detection (requests dependency)

## Setup Instructions

### Initial Setup
```bash
# Create Python 3 virtual environment
python3 -m venv selenium_env

# Activate environment
source selenium_env/bin/activate

# Install required packages
pip install selenium requests beautifulsoup4

# Verify installation
python3 -c "import selenium; print('Selenium version:', selenium.__version__)"
```

### Pre-commit Hook Integration
The environment is integrated with Git pre-commit hooks via `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if HTML files changed
if git diff --cached --name-only | grep -q "\.html$"; then
    echo "🔗 HTML files changed - running parallel link tests..."
    . ./selenium_env/bin/activate
    python3 scripts/test-links-dynamic-parallel.py
    if [ $? -ne 0 ]; then
        echo "❌ Link tests failed. Please fix broken links before committing."
        exit 1
    fi
    echo "✅ All links are working correctly. Proceeding with version bump..."
    npm run version:auto
fi
```

## Migration from testing_env

### What Changed
- **Old Environment**: `testing_env` (Python 2.7)
- **New Environment**: `selenium_env` (Python 3.12)
- **Reason**: Link testing script requires Python 3 for f-strings and modern syntax

### Migration Steps Completed
1. ✅ Deleted `testing_env` directory
2. ✅ Created new `selenium_env` with Python 3
3. ✅ Installed all required dependencies
4. ✅ Updated pre-commit hook to use `selenium_env`
5. ✅ Updated all script references
6. ✅ Updated documentation references

### Troubleshooting Migration Issues
If you encounter issues related to the environment migration:

- **Import Errors**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#environment-issues)
- **Script Failures**: Check all scripts reference `selenium_env` not `testing_env`
- **Link Test Failures**: See [TESTING.md](TESTING.md#environment-migration) for details
5. ✅ Tested pre-commit hook functionality
6. ✅ Updated documentation

## Usage

### Activating Environment
```bash
source selenium_env/bin/activate
```

### Running Link Tests
```bash
# Activate environment
source selenium_env/bin/activate

# Run link tests
python3 scripts/test-links-dynamic-parallel.py
```

### Running Debugging Scripts
```bash
# Activate environment
source selenium_env/bin/activate

# Run layout debugging (if scripts exist)
python3 tests/navigation_detailed_analysis.py
python3 tests/footer_visibility_test.py
```

## Maintenance

### Updating Dependencies
```bash
# Activate environment
source selenium_env/bin/activate

# Update selenium
pip install --upgrade selenium

# Update all dependencies
pip install --upgrade selenium requests beautifulsoup4
```

### Checking Environment Status
```bash
# Check Python version
source selenium_env/bin/activate && python --version

# Check installed packages
source selenium_env/bin/activate && pip list

# Test selenium import
source selenium_env/bin/activate && python3 -c "import selenium; print('Selenium version:', selenium.__version__)"
```

### Troubleshooting

#### Common Issues

1. **ModuleNotFoundError**: Ensure environment is activated
   ```bash
   source selenium_env/bin/activate
   ```

2. **ChromeDriver Issues**: Selenium 4.x handles ChromeDriver automatically
   ```bash
   # No manual ChromeDriver installation needed
   ```

3. **Permission Errors**: Ensure proper file permissions
   ```bash
   chmod +x selenium_env/bin/activate
   ```

#### Environment Verification
```bash
# Complete environment check
source selenium_env/bin/activate && \
python3 -c "
import selenium, requests, bs4
print('✅ Selenium:', selenium.__version__)
print('✅ Requests:', requests.__version__)
print('✅ BeautifulSoup4:', bs4.__version__)
print('✅ Environment ready!')
"
```

## Integration Points

### Pre-commit Hook
- **File**: `.husky/pre-commit`
- **Trigger**: HTML file changes
- **Action**: Runs link tests using `selenium_env`

### Link Testing Script
- **File**: `scripts/test-links-dynamic-parallel.py`
- **Dependencies**: selenium, requests, beautifulsoup4
- **Purpose**: Validates all links in HTML files

### Debugging Scripts
- **Location**: `tests/` directory
- **Purpose**: Layout analysis and visual debugging
- **Dependencies**: selenium for WebDriver automation

## Best Practices

### Environment Isolation
- Always use `selenium_env` for testing
- Don't install testing dependencies globally
- Keep environment activated during testing sessions

### Dependency Management
- Pin dependency versions in requirements.txt (if created)
- Regularly update dependencies for security
- Test environment after updates

### Error Handling
- Check environment activation before running scripts
- Verify Chrome browser installation
- Ensure port 8000 is available for test server

## Future Considerations

### Potential Enhancements
- Add `requirements.txt` for dependency pinning
- Implement automated dependency updates
- Add environment validation script
- Consider Docker containerization for CI/CD

### Monitoring
- Track dependency versions
- Monitor test execution times
- Log environment setup issues
- Document any environment-specific problems

## Conclusion

The `selenium_env` virtual environment provides a clean, isolated testing environment for the CCRI Cyberknights project. The migration from `testing_env` to `selenium_env` ensures compatibility with modern Python features and maintains the project's automated testing capabilities.

The environment is fully integrated with Git pre-commit hooks and provides all necessary dependencies for link testing and layout debugging using Selenium WebDriver.
