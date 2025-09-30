# CI/CD Pipeline Drift Prevention

This directory contains tools to prevent **pipeline drift** - the common problem where CI/CD workflows reference npm scripts that no longer exist, causing deployment failures.

## Problem Solved

**Pipeline Drift** occurs when:
1. You refactor your `package.json` scripts (remove, rename, consolidate)
2. You update documentation and local usage
3. **But forget to update GitHub Actions workflows**
4. CI/CD fails with "Missing script" errors

## Tools

### 1. `validate-workflow-scripts.js` - Main Validation Tool

**Purpose**: Validates that all GitHub Actions workflows reference only existing npm scripts.

**Features**:
- ✅ Parses all `.yml`/`.yaml` workflow files
- ✅ Extracts `npm run` commands from workflow steps
- ✅ Cross-references with `package.json` scripts
- ✅ Reports missing scripts with file locations
- ✅ Warns about unused scripts
- ✅ Exit codes for CI/CD integration

**Usage**:
```bash
# Run validation
node tests/ci-validation/validate-workflow-scripts.js

# Exit code 0 = success, 1 = validation failed
```

**Example Output**:
```
🔍 CI/CD Pipeline Script Validation

📦 Available scripts: 8
🔧 Workflow commands: 2

❌ Validation Errors:
❌ Missing script: "test:versioning" referenced in versioning-diagnostics.yml at jobs.versioning-diagnostics.steps[5]
   Command: npm run test:versioning

📋 Available scripts:
   test:links: node scripts/test-links-playwright.js
   test:debug: npx playwright test tests/playwright-link-testing-comprehensive.spec.ts --debug
   test:ui: npx playwright test tests/playwright-link-testing-comprehensive.spec.ts --ui
   version:show: echo $npm_package_version
   version:auto: HUSKY=0 standard-version --release-as patch
   version:diagnose: npm run test:links
   release: standard-version
   release:patch: standard-version --release-as patch
```

### 2. `pre-commit-validation.sh` - Pre-commit Hook

**Purpose**: Automatically validates workflows before commits are allowed.

**Features**:
- ✅ Runs automatically on every commit
- ✅ Blocks commits if workflows reference invalid scripts
- ✅ Provides helpful error messages and fix suggestions
- ✅ Installs required dependencies automatically
- ✅ Graceful handling of missing directories

**Integration**:
```bash
# Add to .husky/pre-commit
bash tests/ci-validation/pre-commit-validation.sh
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install js-yaml for YAML parsing
npm install js-yaml --save-dev
```

### 2. Add Pre-commit Hook

Add to `.husky/pre-commit`:
```bash
# CI/CD Pipeline Validation
bash tests/ci-validation/pre-commit-validation.sh
```

### 3. Test the Validation

```bash
# Test the validation tool
node tests/ci-validation/validate-workflow-scripts.js

# Test with a broken workflow (for testing)
# Temporarily rename a script in package.json and run validation
```

## Integration with Existing Workflow

### Current Pre-commit Hook Structure

Your existing `.husky/pre-commit` should be updated to include:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# CI/CD Pipeline Validation (NEW)
bash tests/ci-validation/pre-commit-validation.sh

# Existing version management
if [ "$HUSKY" = "0" ]; then
    echo "🚫 Husky disabled - skipping pre-commit processing"
    exit 0
fi

# Existing tests
npm run test:links
```

### GitHub Actions Integration

Add to your workflow files as a validation step:

```yaml
- name: Validate Workflow Scripts
  run: node tests/ci-validation/validate-workflow-scripts.js
```

## Prevention Strategy

### 1. **Immediate Prevention**
- Pre-commit hook blocks commits with invalid workflow references
- Fast feedback loop prevents broken workflows from reaching main branch

### 2. **CI/CD Validation**
- Workflow validation step catches any remaining issues
- Fails fast with clear error messages

### 3. **Refactoring Process**
When refactoring scripts:
1. ✅ Update `package.json`
2. ✅ Run `node tests/ci-validation/validate-workflow-scripts.js`
3. ✅ Fix any workflow references
4. ✅ Update documentation
5. ✅ Commit changes

### 4. **Monitoring**
- Regular validation runs catch drift early
- Unused script warnings help clean up dead code
- Clear error messages make fixes easy

## Troubleshooting

### Common Issues

**"js-yaml not found"**
```bash
npm install js-yaml --save-dev
```

**"Not in a git repository"**
- Ensure you're running from the project root
- Check that `.git` directory exists

**"No .github/workflows directory found"**
- This is normal if you don't have GitHub Actions workflows yet
- The validation will skip gracefully

### Debug Mode

```bash
# Run with verbose output
DEBUG=1 node tests/ci-validation/validate-workflow-scripts.js
```

## Future Enhancements

### Planned Features
- **Template-based workflows**: Auto-generate workflows from script definitions
- **Script dependency mapping**: Track which scripts depend on others
- **Workflow optimization**: Suggest workflow improvements
- **Integration with other CI systems**: Support for CircleCI, GitLab CI, etc.

### Advanced Validation
- **Command argument validation**: Check that script arguments are valid
- **Environment variable validation**: Ensure required env vars are set
- **Cross-workflow consistency**: Check for duplicate or conflicting steps

## Related Documentation

- **Main Testing**: `tests/README.md` - Comprehensive testing suite
- **Troubleshooting**: `docs/TROUBLESHOOTING.md` - General troubleshooting guide
- **Architecture**: `docs/ARCHITECTURE.md` - System architecture overview
- **Versioning**: `docs/VERSIONING.md` - Version management system

---

*This tool prevents the exact issue that caused your pipeline drift: workflows referencing non-existent scripts after refactoring.*
