# GitHub Configuration Directory

This directory contains GitHub-specific configuration files for the CCRI Cyberknights Page repository.

---

## Overview

The `.github/` directory houses GitHub Actions workflows and other GitHub-specific configurations that automate testing, validation, and deployment processes for the project.

---

## Directory Structure

```
.github/
├── README.md                           # This file
└── workflows/
    ├── deploy.yml                      # Automated deployment to GitHub Pages
    └── versioning-diagnostics.yml      # Automated versioning and diagnostics workflow
```

---

## GitHub Actions Workflows

### `deploy.yml`

**Purpose**: Automated, reliable deployment to GitHub Pages

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

**Key Features**:
- **Reliability**: Explicit deployment control - no missed deployments
- **Testing Before Deploy**: Runs link tests before deploying (currently set to continue-on-error)
- **Concurrency Control**: Only one deployment at a time, no cancellation of in-progress deploys
- **Full Visibility**: Deployment status visible in Actions tab
- **Modern Pattern**: Uses official `actions/deploy-pages@v4` action

**Jobs**:
1. **build** - Prepare site for deployment
   - Checkout repository
   - Setup Node.js environment
   - Install dependencies
   - Run link tests (optional, non-blocking)
   - Upload site artifact

2. **deploy** - Deploy to GitHub Pages
   - Deploy using official GitHub Pages action
   - Environment: `github-pages`
   - Outputs deployment URL

**Why This Pattern is Better**:
- ✅ **Reliable**: No mysterious deployment failures
- ✅ **Testable**: Run tests before deploying
- ✅ **Visible**: Clear deployment status and logs
- ✅ **Controllable**: Manual trigger available via workflow_dispatch
- ✅ **Modern**: Uses latest GitHub Pages deployment action

**Migration from Legacy Build**:
This workflow replaces GitHub's legacy "Build from branch" system. To activate:
1. Go to repository Settings → Pages
2. Under "Build and deployment" → Source, select "GitHub Actions"
3. The next push to `main` will use this workflow

---

### `versioning-diagnostics.yml`

**Purpose**: Automated versioning diagnostics and validation workflow

**Triggers**:
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

**Key Features**:
- **Smart Skipping**: Automatically skips for `chore(release)` commits to avoid unnecessary delays
- **Version Validation**: Verifies version.json structure and content
- **Diagnostics**: Runs comprehensive versioning system checks
- **Test Results**: Stores results in `test-results/versioning-results.json`

**Permissions**:
- `contents: read` - Read repository contents
- `statuses: write` - Update commit statuses
- `pull-requests: write` - Comment on pull requests

**Jobs**:
1. **versioning-diagnostics**
   - Runs on `ubuntu-latest`
   - Checks out repository with full history
   - Sets up Node.js environment
   - Installs dependencies
   - Runs `npm run version:diagnose`
   - Uploads test results as artifacts

**Workflow Inputs** (Manual Dispatch):
- `run_diagnostics`: Run full versioning diagnostics (default: `true`)

**Example Output**:
```
✅ Version validation passed
📊 Version: 1.8.23
🏷️  Latest tag: v1.8.22
📝 Commit: a75f44a
```

---

## CI/CD Pipeline Drift Prevention

### Problem Solved

GitHub Actions workflows can reference npm scripts that don't exist, causing silent failures or confusing errors. The CI/CD pipeline drift prevention system ensures workflows only reference valid npm scripts.

### Solution

**Pre-commit Validation** (`tests/ci-validation/pre-commit-validation.sh`):
- Extracts all `npm run` commands from workflow files
- Validates against `package.json` scripts
- Blocks commits if invalid references are found
- Provides clear error messages with script names

**Benefits**:
- ✅ Prevents workflow failures from missing scripts
- ✅ Catches errors before they reach CI/CD
- ✅ Maintains workflow-script synchronization
- ✅ Clear error messages for quick fixes

---

## Workflow Best Practices

### Adding New Workflows

1. **Create workflow file** in `.github/workflows/`
2. **Use descriptive names** (e.g., `test-suite.yml`, `deploy-production.yml`)
3. **Add conditional skipping** for release commits if appropriate:
   ```yaml
   if: ${{ !contains(github.event.head_commit.message, 'chore(release)') }}
   ```
4. **Document workflow** in this README
5. **Test locally** using `act` or similar tools
6. **Validate script references** with pre-commit hook

### Workflow Naming Convention

- Use kebab-case for workflow files
- Use descriptive names that indicate purpose
- Examples: `versioning-diagnostics.yml`, `link-testing.yml`, `deploy.yml`

### Conditional Execution

**Skip for release commits**:
```yaml
if: ${{ !contains(github.event.head_commit.message, 'chore(release)') }}
```

**Run only for specific files**:
```yaml
on:
  push:
    paths:
      - '**.html'
      - '**.js'
      - 'package.json'
```

---

## Integration with Pre-commit Hooks

The `.github/` workflows are validated by pre-commit hooks to ensure:

1. **Script References**: All `npm run` commands reference valid scripts
2. **Syntax Validation**: YAML syntax is correct
3. **Required Fields**: Workflows have necessary permissions and triggers

**Validation Script**: `tests/ci-validation/pre-commit-validation.sh`

**Pre-commit Hook**: `.husky/pre-commit` (lines 46-55)

---

## Maintenance

### Updating Workflows

1. **Edit workflow file** in `.github/workflows/`
2. **Test changes** locally if possible
3. **Commit changes** - pre-commit hook validates automatically
4. **Monitor first run** in GitHub Actions tab
5. **Update this README** if adding new workflows

### Adding npm Script References

When adding `npm run <script>` to workflows:

1. **Ensure script exists** in `package.json`
2. **Test script locally** before committing
3. **Pre-commit hook validates** automatically
4. **Update workflow documentation** in this README

### Troubleshooting

**Workflow fails with "script not found"**:
- Check `package.json` for script existence
- Verify script name spelling
- Run pre-commit validation manually: `bash tests/ci-validation/pre-commit-validation.sh`

**Workflow skipped unexpectedly**:
- Check conditional logic in workflow file
- Verify commit message format
- Review workflow triggers

---

## Related Documentation

- **Deployment**: `docs/DEPLOYMENT.md` - GitHub Pages deployment system and workflows
- **CI/CD Validation**: `tests/ci-validation/README.md` - Detailed validation system documentation
- **Version Management**: `docs/VERSIONING.md` - Semantic versioning and release process
- **Testing**: `docs/TESTING.md` - Test suite and CI/CD integration
- **Pre-commit Hooks**: `.husky/README.md` - Git hook configuration and usage

---

## Future Enhancements

### Planned Workflows

- **Link Testing**: Automated link validation on PRs
- **Visual Regression**: Screenshot comparison for UI changes
- **Security Scanning**: Dependency vulnerability checks

### Workflow Improvements

- Add workflow status badges to README
- Implement workflow caching for faster runs
- Add matrix testing for multiple Node.js versions
- Integrate with external services (e.g., Codecov)

---

**Last Updated**: October 9, 2025  
**Maintained By**: Cyberknights Development Team

