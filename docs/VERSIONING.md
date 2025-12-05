# Version Management System

## Overview

This project uses a modern version management system that eliminates common deployment issues like version lag and off-by-one errors. The system provides a single source of truth for version information and ensures deployed sites always display the correct version.

## Architecture

### Core Components

1. **`version.json`** - Single source of truth for version information
2. **`scripts/update-version-json.js`** - Updates version.json during releases
3. **`js/version-display.js`** - Dynamically fetches and displays version in UI
4. **`standard-version`** - Automated version bumping and release management
5. **GitHub Actions** - Automated deployment workflow (see [DEPLOYMENT.md](DEPLOYMENT.md))

### Version Information Structure

```json
{
  "version": "1.7.30",
  "commit": "1495e88",
  "date": "2025-09-29 23:21:29 -0400",
  "timestamp": "2025-09-30T03:30:00.966Z"
}
```

## How It Works

### Commit-Driven Versioning

This system uses [Conventional Commits](https://www.conventionalcommits.org/) to automatically determine version bump types. See [CONTRIBUTING.md](../CONTRIBUTING.md#commit-message-conventions) for the complete commit message format.

- `feat:` → **minor** version bump (new features)
- `fix:` → **patch** version bump (bug fixes)  
- `chore:` → **patch** version bump (maintenance)
- `docs:` → **patch** version bump (documentation)

### Release Process

1. **Version Bump**: Run `npm run release:patch|minor|major`
2. **Package Update**: `standard-version` bumps `package.json`
3. **Version File Update**: `update-version-json.js` updates `version.json`
4. **Commit**: Both files committed in same release commit
5. **Tag**: Git tag created (e.g., `v1.7.7`)
6. **Deploy**: GitHub Actions automatically deploys (see [DEPLOYMENT.md](DEPLOYMENT.md))

### Runtime Version Display

1. **Page Load**: `version-display.js` initializes
2. **Fetch Version**: Requests `/version.json` with cache-busting
3. **Update UI**: Updates all version displays in the interface
4. **Fallback**: Shows fallback version if fetch fails

## File Structure

```
├── version.json                    # Single source of truth
├── scripts/
│   └── update-version-json.js     # Version update script
├── js/
│   └── version-display.js         # Runtime version display
└── package.json                   # Standard-version configuration
```

## Configuration

### Package.json Scripts

```json
{
  "scripts": {
    "version:auto": "standard-version --release-as patch",
    "release": "standard-version",
    "release:patch": "standard-version --release-as patch",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major"
  },
  "standard-version": {
    "scripts": {
      "postbump": "node scripts/update-version-json.js && git add version.json"
    }
  }
}
```

### HTML Integration

```html
<script src="./js/version-display.js"></script>
```

## Usage

### Making a Release

```bash
# Patch release (1.7.7 -> 1.7.8)
npm run release:patch

# Minor release (1.7.7 -> 1.8.0)
npm run release:minor

# Major release (1.7.7 -> 2.0.0)
npm run release:major
```

### Manual Version Update

```bash
# Update version.json manually (if needed)
node scripts/update-version-json.js
```

## Benefits

### ✅ Advantages

- **Single Source of Truth**: Version managed in one place (`version.json`)
- **No Version Lag**: Deployed site always shows correct version
- **Cache-Bustable**: Version updates immediately with cache-busting
- **Modern Pattern**: Follows 2025 best practices for static sites
- **Maintainable**: Simple, clean implementation
- **Reliable**: No more off-by-one deployment issues

### ✅ Eliminates Common Issues

- **Off-by-one version display** (site shows previous version)
- **Hardcoded version constants** in multiple files
- **Manual version synchronization** across files
- **Cache-related version lag**
- **Complex deployment workflows**

## Troubleshooting

### Version Not Updating on Site

1. **Check GitHub Pages deployment**:
   ```bash
   gh api repos/CCRI-Cyberknights/page/pages/builds | jq '.[0]'
   ```

2. **Verify version.json is committed**:
   ```bash
   git show HEAD --name-only | grep version.json
   ```

3. **Test version.json directly**:
   ```bash
   curl -s https://ccri-cyberknights.github.io/page/version.json | jq
   ```

4. **Check browser cache**:
   - Open DevTools → Network → Disable cache
   - Reload page

### Release Process Issues

1. **Version.json not in commit**:
   - Check `standard-version` configuration
   - Verify `postbump` script runs successfully

2. **GitHub Pages not deploying**:
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment troubleshooting
   - Check GitHub Actions workflow status: `npm run deploy:status`
   - Manually trigger deployment: `npm run deploy:trigger`

3. **Version display not working**:
   - Check browser console for JavaScript errors
   - Verify `version-display.js` is loaded in HTML

### Debugging Version Bump Issues

When version bumps don't occur or hooks fail silently, use the structured logging system to diagnose issues:

#### Hook Logging System

The project includes comprehensive logging for git hooks to make debugging easier. All hook executions are automatically logged with structured JSON format.

**View Logs**:
```bash
# View last execution
./scripts/view-hook-logs.sh

# View last 5 executions
./scripts/view-hook-logs.sh -l 5

# View only errors
./scripts/view-hook-logs.sh -e

# View statistics
./scripts/view-hook-logs.sh -s
```

**Debug Mode**:
Enable verbose debug logging:
```bash
GIT_HOOK_DEBUG=1 git commit
```

**Log Location**: `.git/hook-logs/` (git-ignored, ephemeral)

**What's Logged**:
- Hook execution start/end with timestamps
- Environment variables (HUSKY, etc.)
- Staged files that triggered the hook
- Decision points (why hook skipped, why tests skipped)
- Test execution results and duration
- Version bump attempts with before/after versions
- Exit codes and error messages
- Performance metrics (duration of each step)

**Common Issues Diagnosed**:
- Did the hook run?
- Why did it skip execution? (HUSKY=0, release commit, no significant files)
- What environment variables were set?
- Which files triggered the hook?
- Did standard-version fail? Why?
- How long did each step take?

**Files**:
- `scripts/hook-logger.sh` - Core logging utility
- `scripts/view-hook-logs.sh` - Log viewer and analysis tool
- `scripts/test-hook-logging.sh` - Test script for verification

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more debugging information.

## Deployment Integration

This project uses GitHub Actions for automated deployment. When you push a release:

1. **Version Bump**: `npm run release:patch|minor|major`
2. **Push**: `git push --follow-tags`
3. **Deploy**: Automatic via GitHub Actions workflow
4. **Live**: New version visible on site (~2-3 minutes)

**See [DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment documentation, including:
- Deployment workflow details
- Manual deployment triggers
- Deployment status checking
- Troubleshooting deployment issues

## Legacy: GitHub Pages Deployment Behavior

> **Note**: The following section describes the legacy GitHub Pages deployment system used before 2025-10-10. The project now uses GitHub Actions for reliable deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for current deployment documentation.

### Smart Change Detection (Legacy)

The legacy GitHub Pages system used undocumented "smart change detection" that categorized files by priority:

#### **File Priority System:**

1. **Primary Files** (Always trigger deployment):
   - `index.html` - Main entry point
   - `README.md` - Repository documentation
   - Core HTML/CSS/JS files

2. **Secondary Files** (Usually trigger deployment):
   - CSS files (`*.css`)
   - JavaScript files (`*.js`)
   - Image assets

3. **Auxiliary Files** (May NOT trigger deployment):
   - `version.json` - Metadata files
   - Configuration files
   - Documentation files

#### **Deployment Triggers:**

```bash
# ✅ These changes trigger deployment
git commit -m "feat: update index.html"
git commit -m "fix: modify main.js"
git commit -m "style: update styles.css"

# ❌ These changes may NOT trigger deployment
git commit -m "chore: update version.json"
git commit -m "docs: update README.md"
git commit -m "config: update package.json"
```

#### **Forcing Deployment:**

When auxiliary file changes don't trigger deployment:

```bash
# Method 1: Touch index.html
echo "  <!-- Trigger deployment -->" >> index.html
git add index.html
git commit -m "chore: trigger GitHub Pages deployment"

# Method 2: Update README.md
echo "" >> README.md
git add README.md
git commit -m "chore: trigger deployment"

# Method 3: Modify package.json
# Add a comment or update version
```

#### **Best Practices:**

1. **Always include primary file changes** when updating auxiliary files
2. **Monitor deployment status** after commits
3. **Use trivial changes** to force deployment when needed
4. **Document deployment triggers** for team members

#### **Technical Notes:**

- This behavior is **undocumented by GitHub**
- Based on community discovery and trial-and-error
- Affects all GitHub Pages sites using direct static serving
- Conservative approach prioritizes performance over immediate updates

## Migration History

### From Old System (Pre-2025)

**Previous Issues (Resolved)**:
- Hardcoded version constants in `index.html` (removed)
- Old `scripts/update-index-version.js` complexity (replaced with `update-version-json.js`)
- Off-by-one version display issues (eliminated)
- Manual synchronization across files

**Migration Steps Completed**:
1. ✅ Replaced hardcoded constants with dynamic fetching
2. ✅ Implemented `version.json` as single source of truth
3. ✅ Created `version-display.js` for runtime updates
4. ✅ Updated `standard-version` configuration
5. ✅ Removed old `update-index-version.js` script (replaced with `update-version-json.js`)

## Related Files

- **`docs/ARCHITECTURE.md`** - Overall system architecture
- **`docs/TROUBLESHOOTING.md`** - Common issues and solutions
- **`docs/UI.md`** - User interface implementation details
- **`package.json`** - Release configuration and scripts
- **`version.json`** - Current version information
- **`js/version-display.js`** - Version display implementation
- **`scripts/update-version-json.js`** - Version update script

## Best Practices

### Development

1. **Always use release scripts** instead of manual version bumps
2. **Test version display** after each release
3. **Verify deployment** includes `version.json`
4. **Check cross-browser compatibility** for version display

### Deployment

1. **Monitor GitHub Actions** for successful deployments (`npm run deploy:status`)
2. **Verify version consistency** between repository and live site
3. **Use cache-busting** for immediate version updates
4. **Keep deployment reliable** with GitHub Actions workflow (see [DEPLOYMENT.md](DEPLOYMENT.md))

### Maintenance

1. **Regular dependency updates** for `standard-version`
2. **Documentation updates** when changing version system
3. **Backup version.json** before major changes
4. **Test rollback procedures** if needed

## Legacy Documentation

The following files were consolidated into this document:
- **`docs/HOOK-LOGGING-STRATEGY.md`** - Comprehensive hook logging strategy and implementation guide (last updated: commit `22f467e`, consolidated: 2025-12-05)

---

*Last updated: 2025-12-05 - Version 1.8.35*
*Related: [ARCHITECTURE.md](./ARCHITECTURE.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | [UI.md](./UI.md)*