#!/bin/bash

# QR Modal Keyboard Visibility Test Runner
# 
# This script runs comprehensive keyboard visibility tests across multiple devices
# using Playwright automation and OpenCV computer vision analysis.

set -e

echo "🚀 QR Modal Keyboard Visibility Test Suite"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Python and required packages are available
echo "🔍 Checking dependencies..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required but not installed"
    exit 1
fi

# Check if OpenCV is available
if ! python3 -c "import cv2" 2>/dev/null; then
    echo "⚠️  Warning: OpenCV not found. Installing..."
    if [ -d "venv" ]; then
        source venv/bin/activate
    else
        python3 -m venv venv
        source venv/bin/activate
    fi
    pip install opencv-python numpy
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
echo "🎯 Running keyboard visibility tests..."
echo ""

# Run the comprehensive keyboard visibility test
echo "📱 Testing across multiple devices with OpenCV analysis..."
npx playwright test tests/qr-modal-keyboard-opencv-analysis.spec.ts --headed=false

echo ""
echo "🔍 Running individual device tests..."
npx playwright test tests/qr-modal-mobile-keyboard-visibility.spec.ts --headed=false

echo ""
echo "📊 Test Results Summary:"
echo "======================="

# Count test results
if [ -d "test-results" ]; then
    BEFORE_COUNT=$(find test-results -name "*before.png" | wc -l)
    AFTER_COUNT=$(find test-results -name "*after.png" | wc -l)
    
    echo "📸 Screenshots captured:"
    echo "  • Before keyboard: $BEFORE_COUNT"
    echo "  • After keyboard: $AFTER_COUNT"
    echo ""
    
    # List captured screenshots
    echo "📁 Captured screenshots:"
    find test-results -name "*.png" | sort | while read file; do
        echo "  • $(basename "$file")"
    done
fi

echo ""
echo "🎉 Keyboard visibility testing complete!"
echo ""
echo "💡 Next steps:"
echo "  • Review screenshots in test-results/ directory"
echo "  • Check test output above for any issues"
echo "  • Run individual analysis: python3 scripts/analyze-keyboard-visibility.py <before> <after>"
echo ""
echo "📚 For detailed analysis, run:"
echo "  python3 scripts/analyze-keyboard-visibility.py test-results/keyboard-iPhone-12-before.png test-results/keyboard-iPhone-12-after.png"
