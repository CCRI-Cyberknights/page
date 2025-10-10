#!/bin/bash

# QR Modal Mobile Keyboard Testing - Playwright Native
# 
# Uses only Playwright's built-in mobile device emulation and visual testing
# to verify QR modal behavior when mobile keyboard appears.

set -e

echo "📱 QR Modal Mobile Keyboard Testing - Playwright Native"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Playwright is available
if ! npx playwright --version &> /dev/null; then
    echo "❌ Error: Playwright not found. Please install with: npm install"
    exit 1
fi

# Create test results directory
mkdir -p test-results

echo "✅ Dependencies check complete"
echo ""

# Start local server if not running
echo "🌐 Starting local server..."
if ! curl -s http://localhost:8000 > /dev/null; then
    echo "Starting HTTP server on port 8000..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    sleep 2
    
    # Cleanup function
    cleanup() {
        echo ""
        echo "🧹 Cleaning up..."
        if [ ! -z "$SERVER_PID" ]; then
            kill $SERVER_PID 2>/dev/null || true
        fi
    }
    trap cleanup EXIT
else
    echo "✅ Server already running on port 8000"
fi

echo ""
echo "🎯 Running mobile keyboard tests with Playwright..."
echo ""

# Run the mobile keyboard tests
echo "📱 Testing mobile keyboard behavior across devices..."
npx playwright test tests/qr-modal-mobile-keyboard-playwright.spec.ts

echo ""
echo "📊 Test Results Summary:"
echo "======================="

# Count test results
if [ -d "test-results" ]; then
    SCREENSHOT_COUNT=$(find test-results -name "*.png" | wc -l)
    
    echo "📸 Screenshots captured: $SCREENSHOT_COUNT"
    echo ""
    
    # List captured screenshots
    echo "📁 Captured screenshots:"
    find test-results -name "*.png" | sort | while read file; do
        echo "  • $(basename "$file")"
    done
fi

echo ""
echo "🎉 Mobile keyboard testing complete!"
echo ""
echo "💡 Next steps:"
echo "  • Review screenshots in test-results/ directory"
echo "  • Check test output above for any issues"
echo "  • Screenshots show actual mobile keyboard behavior"
echo ""
echo "📚 This test uses Playwright's built-in mobile device emulation"
echo "   and visual testing capabilities - no external dependencies required!"
