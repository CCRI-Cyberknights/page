# Husky Git Hooks Directory

This directory contains Git hooks managed by Husky for the CCRI Cyberknights Page repository.

---

## Overview

Husky enables Git hooks to run automated checks and processes before commits, pushes, and other Git operations. This ensures code quality, prevents common errors, and maintains project standards.

---

## Directory Structure

```
.husky/
├── README.md           # This file
├── _/
│   └── husky.sh       # Husky core script (auto-generated)
└── pre-commit         # Pre-commit hook script
```

---

## Pre-commit Hook

**File**: `.husky/pre-commit`  
**Purpose**: Automated validation and version management before each commit

### What It Does

The pre-commit hook runs automatically before every commit and performs:

1. **Layout Pattern Validation** (Lines 19-44)
2. **CI/CD Pipeline Validation** (Lines 46-55)
3. **Automated Testing** (Lines 57-79)
4. **Automatic Version Bumping** (Lines 81-90)

---

## Hook Features

### 1. Layout Pattern Validation

**Purpose**: Prevents common Tailwind CSS layout conflicts

**Checks**:
- ❌ **Forbidden**: `flex flex-col` on `<body>` element
- ❌ **Forbidden**: `flex-grow` on `<main>` element
- ❌ **Forbidden**: `mt-auto` on `<footer>` element

**Why**: These patterns create conflicts with Tailwind's `max-w-*` and `mx-auto` utilities.

**Approved Pattern**:
```html
<body class="min-h-screen bg-forge-black text-pale-alloy">
  <div class="flex flex-col min-h-screen">
    <header class="max-w-5xl mx-auto">...</header>
    <main class="flex-1">...</main>
    <footer class="max-w-5xl mx-auto">...</footer>
  </div>
</body>
```

**Documentation**: See `docs/UI.md` - Layout Architecture section

---

### 2. CI/CD Pipeline Validation

**Purpose**: Prevents GitHub Actions workflows from referencing non-existent npm scripts

**Process**:
1. Extracts all `npm run` commands from `.github/workflows/*.yml`
2. Validates against `package.json` scripts
3. Blocks commit if invalid references found

**Script**: `tests/ci-validation/pre-commit-validation.sh`

**Example Error**:
```
❌ ERROR: Workflow references non-existent npm script: 'test:missing'
   Referenced in: .github/workflows/test-suite.yml
   Available scripts: test, test:links, test:baseline, ...
```

**Documentation**: See `tests/ci-validation/README.md`

---

### 3. Automated Testing

**Purpose**: Ensures code changes don't break existing functionality

**Triggers**: When HTML or JavaScript files are modified

**Tests Run**:
- **Link Testing**: Validates all internal and external links
- **Version Display**: Verifies version.json integration
- **Production URLs**: Tests live site links
- **Local URLs**: Tests development server links

**Command**: `npm run test:links` (Playwright-based)

**Skip Conditions**:
- No web files changed (HTML/JS)
- Only documentation files modified
- Release commits (`chore(release):`)

---

### 4. Automatic Version Bumping

**Purpose**: Maintains semantic versioning automatically

**Process**:
1. Detects significant file changes (HTML, JS, JSON, docs)
2. Runs `npm run version:auto` (standard-version)
3. Bumps patch version (e.g., 1.8.22 → 1.8.23)
4. Updates `package.json`, `package-lock.json`, `version.json`
5. Generates/updates `CHANGELOG.md`
6. Creates Git tag (e.g., `v1.8.23`)

**Tool**: `standard-version` (Conventional Commits)

**Skip Conditions**:
- No significant files changed
- Release commits (prevents double-bumping)
- `HUSKY=0` environment variable set

**Documentation**: See `docs/VERSIONING.md`

---

## Safety Guards

### Skip Mechanisms

**1. HUSKY Environment Variable**:
```bash
HUSKY=0 git commit -m "Skip hooks"
```

**2. Release Commit Detection**:
```bash
# Automatically skipped for commits like:
chore(release): 1.8.23
```

**3. Conditional Processing**:
- Only runs tests for web file changes
- Only bumps version for significant changes
- Skips for documentation-only commits

---

## Usage

### Normal Workflow

```bash
# Make changes to files
git add index.html

# Commit (hook runs automatically)
git commit -m "feat: add new feature"

# Hook runs:
# ✅ Layout validation
# ✅ CI/CD validation
# ✅ Automated tests
# ✅ Version bump (1.8.22 → 1.8.23)
# ✅ Changelog update
# ✅ Git tag created

# Push with tags
git push --follow-tags origin main
```

### Skip Hooks (Use Sparingly)

```bash
# Skip all hooks
HUSKY=0 git commit -m "docs: update README"

# Or use --no-verify (not recommended)
git commit --no-verify -m "emergency fix"
```

**⚠️ Warning**: Only skip hooks when absolutely necessary (e.g., emergency hotfixes, CI/CD issues)

---

## Installation

Husky is automatically installed when running:

```bash
npm install
```

The `prepare` script in `package.json` runs `husky install` automatically.

**Manual Installation**:
```bash
npm run prepare
```

---

## Troubleshooting

### Hook Not Running

**Symptoms**: Commits succeed without validation

**Solutions**:
1. Check if `HUSKY=0` is set: `echo $HUSKY`
2. Verify Husky installation: `npm run prepare`
3. Check hook permissions: `ls -la .husky/pre-commit`
4. Ensure hook is executable: `chmod +x .husky/pre-commit`

### Hook Failing Unexpectedly

**Symptoms**: Commit blocked with unclear error

**Solutions**:
1. **Layout errors**: Check for forbidden patterns in HTML
2. **CI/CD errors**: Verify npm script references in workflows
3. **Test failures**: Run `npm run test:links` manually
4. **Version bump errors**: Check `package.json` syntax

**Debug Mode**:
```bash
# Run hook manually
bash .husky/pre-commit

# Check specific validation
bash tests/ci-validation/pre-commit-validation.sh
```

### Performance Issues

**Symptoms**: Hook takes too long to complete

**Solutions**:
1. **Skip tests for docs-only changes**: Hook already does this
2. **Use incremental commits**: Commit smaller changesets
3. **Optimize test suite**: See `docs/TESTING.md`

---

## Hook Customization

### Adding New Validations

1. **Edit** `.husky/pre-commit`
2. **Add validation logic** with clear error messages
3. **Test thoroughly** before committing
4. **Document** in this README

**Example**:
```bash
# Custom validation
echo "🔍 Validating custom pattern..."
if grep -r "FORBIDDEN_PATTERN" index.html; then
    echo "❌ ERROR: Found forbidden pattern"
    exit 1
fi
echo "✅ Custom validation passed"
```

### Disabling Specific Checks

**Temporary Disable** (not recommended):
```bash
# Comment out specific validation in .husky/pre-commit
# echo "🔍 Validating layout patterns..."
# ... validation code ...
```

**Better Approach**: Fix the underlying issue instead of disabling checks

---

## Integration with CI/CD

The pre-commit hook complements GitHub Actions workflows:

- **Pre-commit**: Fast, local validation before commit
- **GitHub Actions**: Comprehensive testing after push

**Workflow**:
1. Developer commits → Pre-commit hook validates
2. Push to GitHub → GitHub Actions runs full test suite
3. Both must pass for successful deployment

**Documentation**: See `.github/README.md`

---

## Best Practices

### Do's ✅

- ✅ Let hooks run normally for most commits
- ✅ Fix validation errors instead of skipping hooks
- ✅ Keep hook scripts fast (<30 seconds)
- ✅ Provide clear error messages
- ✅ Document all validations

### Don'ts ❌

- ❌ Skip hooks regularly with `HUSKY=0`
- ❌ Use `--no-verify` unless emergency
- ❌ Add slow operations (>1 minute)
- ❌ Commit without testing hook changes
- ❌ Remove safety guards without team discussion

---

## Related Documentation

- **Version Management**: `docs/VERSIONING.md` - Semantic versioning and standard-version
- **CI/CD Validation**: `tests/ci-validation/README.md` - Pipeline drift prevention
- **Testing**: `docs/TESTING.md` - Test suite and Playwright integration
- **Layout Patterns**: `docs/UI.md` - Approved layout architecture
- **GitHub Actions**: `.github/README.md` - Workflow configuration

---

## Future Enhancements

### Planned Features

- **Commit Message Linting**: Enforce Conventional Commits format
- **Code Formatting**: Run Prettier on staged files
- **TypeScript Checking**: Type validation for TS files
- **Image Optimization**: Compress images before commit

### Hook Improvements

- Add progress indicators for long-running operations
- Implement parallel validation for faster execution
- Add hook configuration file for customization
- Create hook bypass mechanism for specific file patterns

---

**Last Updated**: October 9, 2025  
**Maintained By**: Cyberknights Development Team

