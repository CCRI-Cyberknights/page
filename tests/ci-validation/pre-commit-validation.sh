#!/bin/bash

# CI/CD Pipeline Drift Prevention - Pre-commit Hook
# 
# This hook validates that GitHub Actions workflows reference only existing npm scripts.
# It prevents pipeline drift caused by incomplete refactoring.
#
# Usage: Called automatically by Husky pre-commit hook
# Exit codes: 0 = success, 1 = validation failed

set -e

echo "🔍 Validating CI/CD workflow scripts..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Get the project root
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

# Check if .github/workflows directory exists
if [ ! -d ".github/workflows" ]; then
    echo "⚠️  No .github/workflows directory found - skipping validation"
    exit 0
fi

# Check if Node.js is available
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js not found - cannot validate workflow scripts"
    exit 1
fi

# Check if js-yaml is available (required for YAML parsing)
if ! node -e "require('js-yaml')" > /dev/null 2>&1; then
    echo "⚠️  js-yaml not found - installing..."
    npm install js-yaml --save-dev
fi

# Run the validation script
if node tests/ci-validation/validate-workflow-scripts.js; then
    echo "✅ CI/CD workflow validation passed"
    exit 0
else
    echo ""
    echo "❌ CI/CD workflow validation failed"
    echo ""
    echo "💡 To fix this issue:"
    echo "   1. Check the errors above"
    echo "   2. Update workflows to reference existing scripts"
    echo "   3. Or add missing scripts to package.json"
    echo ""
    echo "🔧 Available scripts:"
    node -e "console.log(Object.keys(require('./package.json').scripts || {}).map(s => '   ' + s).join('\n'))"
    echo ""
    exit 1
fi
