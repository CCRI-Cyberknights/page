#!/bin/bash
# Standalone link testing script for CCRI Cyberknights Landing Pages
# Can be run manually or integrated into CI/CD pipelines

set -e

echo "🚀 CCRI Cyberknights Link Testing Suite"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if testing environment exists
if [ ! -d "testing_env" ]; then
    echo "❌ Error: Testing environment not found at testing_env/"
    echo "   Please ensure the testing environment is set up correctly"
    exit 1
fi

# Check if test script exists
if [ ! -f "scripts/test-links.py" ]; then
    echo "❌ Error: Link testing script not found at scripts/test-links.py"
    exit 1
fi

echo "🔍 Running comprehensive link tests..."
echo ""

# Activate testing environment and run tests
source testing_env/bin/activate
python3 scripts/test-links.py

# Capture exit code
TEST_RESULT=$?

echo ""
echo "======================================"

if [ $TEST_RESULT -eq 0 ]; then
    echo "🎉 ALL LINKS ARE WORKING CORRECTLY!"
    echo "✅ Your site is ready for deployment"
    exit 0
else
    echo "❌ LINK TESTING FAILED!"
    echo "⚠️  Please fix the broken links before committing"
    exit 1
fi
