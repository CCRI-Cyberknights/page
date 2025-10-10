# Deployment Pattern Migration

**Date**: October 10, 2025  
**Status**: ✅ Completed

---

## Problem: Legacy GitHub Pages Deployment

### What You Were Using (Old Pattern)

**GitHub Pages "Legacy" Build System**:
- Relies on GitHub automatically detecting pushes to `main`
- Triggers a hidden "pages build and deployment" workflow
- No explicit control or visibility
- Configuration: Repository Settings → Pages → Source: "Deploy from branch"

### Issues Encountered

1. **Unreliable Auto-Deployment**
   - Commit `2097e0f` (v1.8.28) pushed at 19:44:57Z
   - No deployment triggered
   - Had to manually trigger via API: `gh api -X POST repos/CCRI-Cyberknights/page/pages/builds`

2. **No Visibility**
   - Can't see why deployment didn't happen
   - No logs or error messages
   - Have to query API to check status

3. **No Testing**
   - No ability to run tests before deploying
   - Can't block deployment on test failures
   - Deploy broken code directly to production

4. **No Control**
   - Can't manually trigger deployments easily
   - Can't add pre-deployment steps
   - Can't customize build process

---

## Solution: GitHub Actions-Based Deployment

### What You're Using Now (New Pattern)

**GitHub Actions with `actions/deploy-pages@v4`**:
- Explicit workflow in `.github/workflows/deploy.yml`
- Full control over when and how deployment happens
- Visible in Actions tab with logs
- Configuration: Repository Settings → Pages → Source: "GitHub Actions"

### Benefits

| Feature | Legacy Build | GitHub Actions |
|---------|--------------|----------------|
| **Reliability** | ❌ Unpredictable | ✅ Every push triggers workflow |
| **Visibility** | ❌ Hidden process | ✅ Full logs in Actions tab |
| **Testing** | ❌ No testing | ✅ Run tests before deploy |
| **Manual Trigger** | ❌ API only | ✅ Workflow dispatch button |
| **Concurrency Control** | ❌ None | ✅ Configurable |
| **Pre-deploy Steps** | ❌ Not possible | ✅ Fully customizable |
| **Status Checking** | ❌ API queries | ✅ `npm run deploy:status` |

---

## Migration Steps

### 1. ✅ Create Workflow File

Created `.github/workflows/deploy.yml` with:
- Build job (checkout, install, test, upload)
- Deploy job (deploy to GitHub Pages)
- Proper permissions and concurrency control

### 2. ⚠️ Update Repository Settings (Action Required)

**You need to do this manually**:

1. Go to: https://github.com/CCRI-Cyberknights/page/settings/pages
2. Under "Build and deployment"
3. Change **Source** from "Deploy from a branch" to **"GitHub Actions"**
4. Save changes

**Screenshot location**:
```
Settings → Pages → Build and deployment → Source → GitHub Actions
```

### 3. ✅ Add Helper Scripts

Added to `package.json`:
```json
"deploy:trigger": "gh workflow run deploy.yml",
"deploy:status": "gh run list --workflow=deploy.yml --limit 5"
```

### 4. ✅ Update Documentation

- Updated `.github/README.md` with deploy workflow documentation
- Created this migration guide

---

## New Workflow Details

### Workflow File: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main` branch (automatic)
- Manual dispatch via UI or CLI

**Build Job**:
```yaml
1. Checkout repository
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Run link tests (continue-on-error)
5. Configure Pages
6. Upload site artifact
```

**Deploy Job**:
```yaml
1. Wait for build to complete
2. Deploy artifact to GitHub Pages
3. Output deployment URL
```

**Permissions**:
```yaml
contents: read      # Read repository
pages: write        # Deploy to Pages
id-token: write     # OIDC authentication
```

**Concurrency**:
```yaml
group: "pages"              # Only one deployment at a time
cancel-in-progress: false   # Don't cancel in-progress deploys
```

---

## Usage

### Automatic Deployment

Push or merge to `main`:
```bash
git push origin main
```

Deployment happens automatically. Check status:
```bash
npm run deploy:status
```

### Manual Deployment

From CLI:
```bash
npm run deploy:trigger
# or
gh workflow run deploy.yml
```

From GitHub UI:
1. Go to Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Click green "Run workflow" button

### Check Deployment Status

```bash
# Quick status check
npm run deploy:status

# Detailed pipeline status (all workflows)
npm run pipeline:status

# Full pipeline list
npm run pipeline:check
```

---

## Testing Before Deployment

### Current Setup (Non-Blocking)

Link tests run before deployment but don't block:
```yaml
- name: Run link tests
  run: npm run test:links
  continue-on-error: true  # Doesn't block deployment
```

### Enable Blocking Tests (Optional)

To block deployment on test failures:

1. Edit `.github/workflows/deploy.yml`
2. Remove or set to `false`:
   ```yaml
   continue-on-error: false  # Blocks deployment on failure
   ```
3. Commit and push

**Trade-offs**:
- ✅ Never deploy broken code
- ❌ Can't deploy if tests fail (even for urgent fixes)

**Recommendation**: Start with non-blocking, enable blocking once tests are stable.

---

## Comparison: Real Example

### Old Pattern (October 10, 2025)

```
19:44:57 - Push commit 2097e0f (v1.8.28) to main
19:44:58 - Versioning workflow runs (skipped, release commit)
           ... waiting ...
           ... nothing happens ...
19:55:00 - Notice deployment didn't happen
19:55:58 - Manually trigger via API
19:56:18 - Deployment completes
```

**Total time to deployment**: 11+ minutes (with manual intervention)

### New Pattern (After Migration)

```
XX:XX:XX - Push commit to main
XX:XX:XX - Deploy workflow triggers automatically
XX:XX:XX - Build job runs (~2 minutes)
XX:XX:XX - Deploy job runs (~20 seconds)
XX:XX:XX - Deployment complete
```

**Total time to deployment**: ~2-3 minutes (fully automatic, no intervention)

---

## Advanced Customization

### Add Build Step

Need to compile/optimize before deploying?

```yaml
- name: Build site
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: 'dist'  # Deploy built output instead of source
```

### Add Environment Variables

```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com
```

### Deploy Only on Successful Tests

```yaml
- name: Run full test suite
  run: npm test  # No continue-on-error

- name: Upload artifact
  # Only runs if tests pass
```

### Deploy to Staging First

```yaml
deploy-staging:
  # ... deploy to staging environment

deploy-production:
  needs: deploy-staging
  environment:
    name: github-pages
  # ... deploy to production
```

---

## Rollback Plan

If something goes wrong, you can roll back:

### Option 1: Revert to Legacy (Not Recommended)

1. Go to Settings → Pages
2. Change Source back to "Deploy from a branch"
3. Select `main` branch

### Option 2: Fix Forward (Recommended)

1. Fix the workflow file
2. Commit and push
3. Check deployment status
4. Iterate until working

### Option 3: Manual Deploy via API

```bash
gh api -X POST repos/CCRI-Cyberknights/page/pages/builds
```

---

## Monitoring

### Check Deployment Status

```bash
# Via npm scripts
npm run deploy:status
npm run pipeline:status

# Via gh CLI
gh run list --workflow=deploy.yml
gh run view <run-id>
gh run watch <run-id>

# Via API
gh api repos/CCRI-Cyberknights/page/pages/builds/latest
```

### Set Up Alerts

**GitHub Web**:
1. Go to repository Actions tab
2. Select workflow
3. Click "..." → "Subscribe to notifications"

**Email on Failure**:
Add to workflow:
```yaml
- name: Send failure notification
  if: failure()
  run: echo "Deployment failed!" # Or use notification action
```

---

## Future Enhancements

### Potential Improvements

1. **Deployment Notifications**
   - Slack/Discord webhook on deployment
   - Email on failure
   - GitHub status checks

2. **Multi-Environment**
   - Staging environment for PRs
   - Production for main branch
   - Preview deployments

3. **Performance Optimization**
   - Cache dependencies between runs
   - Optimize artifact upload
   - Parallel testing

4. **Enhanced Testing**
   - Visual regression tests
   - Mobile layout tests
   - Performance tests
   - Accessibility tests

5. **Deployment Protection**
   - Required reviewers for production
   - Deployment windows (e.g., no deploys on Fridays)
   - Automatic rollback on errors

---

## Key Takeaways

### Old Pattern (Legacy)
- ❌ Unreliable
- ❌ No visibility
- ❌ No control
- ❌ No testing
- ❌ Manual intervention required

### New Pattern (GitHub Actions)
- ✅ Reliable
- ✅ Full visibility
- ✅ Complete control
- ✅ Pre-deployment testing
- ✅ Manual trigger available

### Action Required
**Don't forget to update repository settings!**

Go to: https://github.com/CCRI-Cyberknights/page/settings/pages  
Change Source to: **GitHub Actions**

---

**Pattern Status**: ✅ Implemented  
**Action Required**: ⚠️ Update repository settings  
**Documentation**: ✅ Complete  
**Next Steps**: See `.github/README.md` for workflow details

---

**Last Updated**: October 10, 2025  
**Maintained By**: Cyberknights Development Team

