# GitHub Pages Deployment

## Overview

This project uses GitHub Actions for reliable, automated deployment to GitHub Pages. The deployment system runs tests before deploying and provides full visibility through workflow logs.

## Deployment Workflow

### Automatic Deployment

Every push to `main` triggers automatic deployment:

```bash
git push origin main
# Deployment happens automatically
```

**Workflow**: `.github/workflows/deploy.yml`

**Process**:
1. **Build Job** (~2 minutes)
   - Checkout repository
   - Install dependencies
   - Run link tests (non-blocking)
   - Upload site artifact

2. **Deploy Job** (~20 seconds)
   - Deploy to GitHub Pages
   - Output deployment URL

### Manual Deployment

Trigger deployment manually via CLI:

```bash
npm run deploy:trigger
```

Or via GitHub UI:
1. Go to Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Deployment Status

### Check Status

```bash
# Deployment status
npm run deploy:status

# All pipeline status
npm run pipeline:status

# Full pipeline list
npm run pipeline:check
```

### Via GitHub API

```bash
# Latest Pages build
gh api repos/CCRI-Cyberknights/page/pages/builds/latest

# Workflow runs
gh run list --workflow=deploy.yml --limit 5
```

## Configuration

### Repository Settings

**Required**: Enable GitHub Actions deployment

1. Go to: https://github.com/CCRI-Cyberknights/page/settings/pages
2. Under "Build and deployment" → Source
3. Select **"GitHub Actions"**
4. Save changes

### Workflow Configuration

**File**: `.github/workflows/deploy.yml`

**Key Features**:
- Automatic trigger on push to `main`
- Manual trigger via `workflow_dispatch`
- Pre-deployment testing (non-blocking)
- Concurrency control (one deployment at a time)
- Full deployment logs

**Permissions**:
```yaml
contents: read      # Read repository
pages: write        # Deploy to Pages
id-token: write     # OIDC authentication
```

## Testing Before Deployment

### Current Setup (Non-Blocking)

Link tests run before deployment but don't block:

```yaml
- name: Run link tests
  run: npm run test:links
  continue-on-error: true
```

### Enable Blocking Tests

To prevent deployment on test failures:

1. Edit `.github/workflows/deploy.yml`
2. Change `continue-on-error: false`
3. Commit and push

**Trade-offs**:
- ✅ Never deploy broken code
- ❌ Can't deploy if tests fail (even for urgent fixes)

## Troubleshooting

### Deployment Not Triggering

**Check workflow runs**:
```bash
npm run pipeline:check
```

**Manually trigger**:
```bash
npm run deploy:trigger
```

### Deployment Failed

**View logs**:
1. Go to Actions tab
2. Click failed workflow run
3. Check job logs for errors

**Common issues**:
- Test failures (if blocking tests enabled)
- Permissions issues (check repository settings)
- GitHub Pages not enabled

### Version Not Updating

**Check deployment status**:
```bash
gh api repos/CCRI-Cyberknights/page/pages/builds/latest
```

**Verify latest commit deployed**:
```bash
gh run list --workflow=deploy.yml --limit 1
```

**Cache busting**:
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check in private/incognito window

## NPM Scripts

```json
"deploy:trigger": "gh workflow run deploy.yml",
"deploy:status": "gh run list --workflow=deploy.yml --limit 5",
"pipeline:check": "gh run list --limit 10",
"pipeline:status": "gh run list --limit 5 --json status,conclusion,displayTitle,createdAt | jq '.[] | {title: .displayTitle, status: .status, conclusion: .conclusion, created: .createdAt}'"
```

## Architecture

### GitHub Actions Pattern

**Why GitHub Actions?**
- ✅ Reliable: Every push triggers deployment
- ✅ Visible: Full logs in Actions tab
- ✅ Controllable: Manual trigger available
- ✅ Testable: Run tests before deploying
- ✅ Modern: Official `actions/deploy-pages@v4`

**Workflow Structure**:
```
push to main
    ↓
build job (test + prepare)
    ↓
deploy job (deploy artifact)
    ↓
live site updated
```

### Concurrency Control

Only one deployment runs at a time:

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false  # Don't cancel in-progress deploys
```

This ensures deployments complete successfully without conflicts.

### Deployment URL

Site URL: https://ccri-cyberknights.github.io/page/

Deployment URL is output by the workflow and visible in Actions logs.

## Integration with Versioning

Deployment integrates with the version management system:

1. **Version Bump**: `npm run release:patch|minor|major`
2. **Push**: `git push --follow-tags`
3. **Deploy**: Automatic via GitHub Actions
4. **Live**: New version visible on site

See [VERSIONING.md](VERSIONING.md) for complete version management details.

## Monitoring

### Deployment Notifications

**GitHub Notifications**:
1. Go to repository Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "..." → "Subscribe to notifications"

**Watch Deployment**:
```bash
gh run watch
```

### Build Logs

View deployment logs:
```bash
# Latest workflow run
gh run view

# Specific run
gh run view <run-id>

# Watch in real-time
gh run watch <run-id>
```

## Best Practices

### Pre-Deployment

1. **Test locally**: Run tests before pushing
2. **Check changes**: Review what's being deployed
3. **Verify version**: Ensure version is correct

### Post-Deployment

1. **Verify deployment**: Check site is updated
2. **Test functionality**: Verify links and features work
3. **Monitor logs**: Check for errors or warnings

### Emergency Rollback

If deployment introduces critical issues:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <previous-commit>
git push --force origin main  # Use with caution!
```

## Related Documentation

- **`.github/README.md`** - GitHub Actions workflows documentation
- **`VERSIONING.md`** - Version management and release process
- **`TESTING.md`** - Testing suite and CI/CD integration
- **`TROUBLESHOOTING.md`** - General troubleshooting guide

## Legacy Documentation

The following files were consolidated into this document:

- **`docs/DEPLOYMENT-PATTERN-MIGRATION.md`** - Detailed migration from legacy GitHub Pages build system to GitHub Actions deployment pattern (last updated: commit `06843f7`)

### Migration Summary

**Legacy Pattern** (Before 2025-10-10):
- Used GitHub's "legacy" Pages build system
- Unreliable auto-deployment
- No visibility or control
- Manual API triggers required

**Current Pattern** (After 2025-10-10):
- GitHub Actions-based deployment
- Reliable automatic deployment
- Full visibility and control
- Built-in testing integration

**Migration completed**: 2025-10-10

The legacy migration documentation contains detailed comparison, troubleshooting steps, and historical context for the pattern change.

---

**Last Updated**: 2025-10-10  
**Deployment URL**: https://ccri-cyberknights.github.io/page/  
**Workflow File**: `.github/workflows/deploy.yml`

