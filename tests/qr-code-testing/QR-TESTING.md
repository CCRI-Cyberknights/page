# QR Code Testing Tools

This directory contains comprehensive tools for testing QR code generation and decoding functionality, specifically designed for the Linux cheatsheet project.

## Tools Overview

### 1. `test_qr_simple.py` - Basic QR Code Generation
**Purpose**: Generate QR codes and create visual test pages
**Usage**: `python3 tests/test_qr_simple.py`

**Features**:
- Generates QR codes for all cheatsheet URLs
- Creates HTML test page for visual verification
- Saves PNG files for manual testing
- Provides base64 encoded versions

**Output**:
- `/tmp/qr_*.png` - Individual QR code images
- `/tmp/qr_test_results.html` - Visual test page
- `/tmp/qr_test_results.json` - JSON results

### 2. `test_qr_decode.py` - QR Code Decoding
**Purpose**: Test QR code decoding using online APIs
**Usage**: `python3 tests/test_qr_decode.py`

**Features**:
- Decodes QR codes using qr-server.com API
- Tests all generated QR codes
- Validates decoded content matches expected URLs
- Provides success/failure reporting

**Prerequisites**: Requires QR code files from `test_qr_simple.py`

### 3. `test_qr_unit.py` - Comprehensive Unit Tests
**Purpose**: Complete QR code testing suite
**Usage**: `python3 tests/test_qr_unit.py`

**Features**:
- Tests cheatsheet-specific QR codes
- Tests different QR code sizes (5, 10, 15, 20)
- Tests error correction levels (L, M, Q, H)
- Comprehensive success reporting
- Detailed JSON results

**Test Categories**:
- **Cheatsheet QR Tests**: 4 URLs (home, cheatsheet, 2 videos)
- **Quality Tests**: 4 different sizes
- **Error Correction Tests**: 4 ECL levels

### 4. `qr_test.py` - Command-Line Tool
**Purpose**: Quick QR code generation and decoding
**Usage**: 
```bash
# Generate QR code
python3 tests/qr_test.py "https://example.com" output.png

# Decode QR code
python3 tests/qr_test.py --decode input.png

# Get base64 QR code
python3 tests/qr_test.py --base64 "https://example.com"
```

## Test URLs

The tools test these specific URLs for the Linux cheatsheet:

1. **Home Page**: `https://ccri-cyberknights.github.io/page/`
2. **Cheatsheet 3**: `https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html`
3. **Video 1**: `https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6`
4. **Video 2**: `https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7`

## Dependencies

**Required Python packages**:
- `qrcode` - QR code generation
- `PIL` (Pillow) - Image processing
- `requests` - HTTP requests for decoding APIs

**System packages** (optional):
- `zbar-tools` - Local QR code decoding
- `python3-opencv` - OpenCV for image processing
- `python3-zbar` - Python zbar bindings

## Integration with Project

These tools can be integrated into the project's testing pipeline:

1. **Pre-commit**: Run `test_qr_unit.py` to ensure QR codes work
2. **CI/CD**: Include QR code tests in automated testing
3. **Development**: Use `qr_test.py` for quick QR code testing
4. **Validation**: Use `test_qr_decode.py` to verify existing QR codes

## Expected Results

All tests should pass with:
- ✅ **Cheatsheet QR Tests**: 4/4 passed
- ✅ **Quality Tests**: 4/4 passed  
- ✅ **Error Correction Tests**: 4/4 passed
- ✅ **Overall**: 12/12 passed

## Troubleshooting

**Common Issues**:
1. **Decoding fails**: Check internet connection for API access
2. **Generation fails**: Ensure `qrcode` and `PIL` packages are installed
3. **File not found**: Run `test_qr_simple.py` first to generate test files

**Debug Commands**:
```bash
# Check Python packages
python3 -c "import qrcode, PIL, requests; print('All packages available')"

# Test individual QR code
python3 tests/qr_test.py "test" /tmp/debug.png

# Decode specific file
python3 tests/qr_test.py --decode /tmp/debug.png
```

## Future Enhancements

- [ ] Add local QR code decoding (zbar integration)
- [ ] Add QR code quality metrics
- [ ] Add batch testing for multiple files
- [ ] Add integration with Playwright for automated testing
- [ ] Add QR code validation for embedded base64 images
