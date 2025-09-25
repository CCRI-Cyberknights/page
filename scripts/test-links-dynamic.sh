#!/bin/bash
# Dynamic Link Testing Script for CCRI Cyberknights Landing Pages
# Automatically discovers and tests all links found in the HTML

set -e

echo "🚀 CCRI Cyberknights Dynamic Link Testing Suite"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if testing environment exists
if [ ! -d "selenium_env" ]; then
    echo "❌ Error: Testing environment not found at selenium_env/"
    echo "   Please ensure the testing environment is set up correctly"
    exit 1
fi

# Check if test script exists
if [ ! -f "scripts/test-links-dynamic.py" ]; then
    echo "❌ Error: Dynamic link testing script not found at scripts/test-links-dynamic.py"
    exit 1
fi

echo "🔍 Running dynamic link discovery and testing..."
echo "   This will automatically find and test ALL links in your HTML"
echo ""

# Activate testing environment and run tests
source selenium_env/bin/activate
python3 scripts/test-links-dynamic.py

# Capture exit code
TEST_RESULT=$?

echo ""
echo "=============================================="

if [ $TEST_RESULT -eq 0 ]; then
    echo "🎉 ALL DISCOVERED LINKS ARE WORKING CORRECTLY!"
    echo "✅ Your site is ready for deployment"
    echo "🔍 Dynamic discovery ensures no links are missed"
    exit 0
else
    echo "❌ DYNAMIC LINK TESTING FAILED!"
    echo "⚠️  Please fix the broken links before committing"
    echo "🔍 Check the report above for specific failures"
    exit 1
fi
