# Version Management System

## Overview

This project uses a modern, 2025-compliant version management system that eliminates common deployment issues like version lag and off-by-one errors. The system provides a single source of truth for version information and ensures deployed sites always display the correct version.

## Architecture

### Core Components

1. **`version.json`** - Single source of truth for version information
2. **`scripts/update-version-json.js`** - Updates version.json during releases
3. **`js/version-display.js`** - Dynamically fetches and displays version in UI
4. **`standard-version`** - Automated version bumping and release management
5. **GitHub Pages** - Automatic deployment from main branch

### Version Information Structure

```json
{
  "version": "1.7.7",
  "commit": "34884c1",
  "date": "2025-09-27 19:26:40 -0400",
  "timestamp": "2025-09-27T23:27:11.388Z"
}
```

## How It Works

### Release Process

1. **Version Bump**: Run `npm run release:patch|minor|major`
2. **Package Update**: `standard-version` bumps `package.json`
3. **Version File Update**: `update-version-json.js` updates `version.json`
4. **Commit**: Both files committed in same release commit
5. **Tag**: Git tag created (e.g., `v1.7.7`)
6. **Deploy**: GitHub Pages automatically deploys from main branch

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
   - Check GitHub Actions for "pages build and deployment"
   - Verify Pages source is set to `main` branch

3. **Version display not working**:
   - Check browser console for JavaScript errors
   - Verify `version-display.js` is loaded in HTML

## Migration History

### From Old System (Pre-2025)

**Previous Issues**:
- Hardcoded version constants in `index.html`
- `scripts/update-index-version.js` complexity
- Off-by-one version display issues
- Manual synchronization across files

**Migration Steps Completed**:
1. ✅ Replaced hardcoded constants with dynamic fetching
2. ✅ Implemented `version.json` as single source of truth
3. ✅ Created `version-display.js` for runtime updates
4. ✅ Updated `standard-version` configuration
5. ✅ Removed old `update-index-version.js` script

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

1. **Monitor GitHub Actions** for successful deployments
2. **Verify version consistency** between repository and live site
3. **Use cache-busting** for immediate version updates
4. **Keep deployment simple** with automatic GitHub Pages

### Maintenance

1. **Regular dependency updates** for `standard-version`
2. **Documentation updates** when changing version system
3. **Backup version.json** before major changes
4. **Test rollback procedures** if needed

---

*Last updated: 2025-09-27 - Version 1.7.7*
*Related: [ARCHITECTURE.md](./ARCHITECTURE.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | [UI.md](./UI.md)*