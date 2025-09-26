# Version Management - Tag-Based Deployment System

## Overview

The Cyber Club Landing Pages project has transitioned to a **tag-based deployment model** using `standard-version` for automated versioning and GitHub Actions for deployment. This approach resolves tag conflicts, provides better traceability, and creates a more robust release pipeline.

## Architecture

### **1. Tag-Based Deployment Strategy**
- **Single Source of Truth**: Each deployment corresponds to a Git tag (`vX.Y.Z`)
- **Traceability**: Clear history of releases with exact version mapping
- **Safety**: Only intentional version bumps trigger deployments
- **Consistency**: All version files updated atomically

### **2. Standard-Version Integration**
- **Conventional Commits**: Automatic version bumping based on commit messages
- **Changelog Generation**: Automatic `CHANGELOG.md` creation
- **DRY Version Management**: Synchronized updates across `package.json` and `index.html`
- **Git Integration**: Automatic tagging and commit creation

### **3. GitHub Actions Workflow**
- **Tag-Triggered**: Only runs when version tags are pushed
- **Version Verification**: Ensures consistency between tag and package.json
- **GitHub Pages Deployment**: Automatic deployment to production
- **GitHub Releases**: Automatic release creation with changelog

## Workflow

### **Developer Workflow**

1. **Development**: Work on `main` branch as usual
2. **Release**: When ready to release, run:
   ```bash
   npm run release
   git push origin main --follow-tags
   ```

### **What Happens During Release**

1. **Version Analysis**: `standard-version` analyzes commits since last tag
2. **Version Bump**: Determines bump type (major/minor/patch) from conventional commits
3. **File Updates**: Updates `package.json`, `package-lock.json`
4. **HTML Update**: Runs `scripts/update-index-version.js` to update JavaScript constants
5. **Changelog**: Generates/updates `CHANGELOG.md` with commit history
6. **Commit**: Creates commit with message `chore(release): X.Y.Z`
7. **Tag**: Creates Git tag `vX.Y.Z`
8. **GitHub Action**: Triggers deployment workflow

### **Deployment Process**

1. **Tag Push**: GitHub Action triggers on `v*` tag push
2. **Checkout**: Checks out repository at specific tag
3. **Verification**: Verifies version consistency
4. **Deploy**: Deploys to GitHub Pages
5. **Release**: Creates GitHub Release with changelog

## Implementation Details

### **Standard-Version Configuration**

```json
{
  "scripts": {
    "release": "standard-version",
    "release:patch": "standard-version --release-as patch",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major"
  },
  "standard-version": {
    "scripts": {
      "postbump": "node scripts/update-index-version.js"
    }
  }
}
```

### **Version Update Script**

`scripts/update-index-version.js`:
- Reads version from `package.json`
- Gets commit hash and date from Git
- Updates JavaScript constants in `index.html`
- Maintains DRY version management

### **GitHub Actions Workflow**

`.github/workflows/release.yml`:
- Triggers only on version tag pushes
- Verifies version consistency
- Deploys to GitHub Pages
- Creates GitHub Releases

### **Pre-commit Hook Integration**

The pre-commit hook detects `standard-version` releases and skips the old versioning system:
```bash
if git log -1 --pretty=%B | grep -q "chore(release):"; then
    echo "📦 Standard-version release detected - skipping old version bumping system"
    exit 0
fi
```

## Version Bump Rules

### **Major Version (X.0.0)**
- Breaking changes
- Commit message contains: `BREAKING CHANGE`, `breaking change`

### **Minor Version (X.Y.0)**
- New features
- Commit message starts with: `feat:`, `feature:`

### **Patch Version (X.Y.Z)**
- Bug fixes, documentation, styling
- Commit message starts with: `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`

## Benefits

### **For Developers**
- **Zero Friction**: Versioning happens automatically
- **Conventional Commits**: Clear commit message standards
- **No Tag Conflicts**: Proper release workflow eliminates conflicts
- **Consistent Results**: Same behavior across all contributors

### **For Deployment**
- **Traceability**: Know exactly which version is live
- **Safety**: No accidental deployments from incomplete work
- **Reliability**: Version consistency verification
- **Automation**: Complete CI/CD pipeline

### **For Users**
- **Transparent Versioning**: Version visible in footer
- **Commit Information**: Hover tooltip shows when changes were made
- **Professional Appearance**: Version display enhances credibility

## Migration from Old System

### **What Changed**
- **Old**: Deploy on every push to `main`
- **New**: Deploy only on version tags
- **Old**: Custom version bumping script with tag conflicts
- **New**: `standard-version` with proper release workflow
- **Old**: Manual changelog maintenance
- **New**: Automatic changelog generation

### **Backward Compatibility**
- Old versioning scripts remain available (`npm run version:*`)
- Pre-commit hook detects and skips old system for `standard-version` releases
- Existing tags and version history preserved

## Usage Examples

### **Creating a Release**
```bash
# Automatic version bump based on commits
npm run release

# Manual version bump
npm run release:patch   # 1.2.3 → 1.2.4
npm run release:minor   # 1.2.3 → 1.3.0
npm run release:major   # 1.2.3 → 2.0.0

# Push tags to trigger deployment
git push origin main --follow-tags
```

### **Conventional Commit Examples**
```bash
# Minor bump (new feature)
git commit -m "feat: add calendar integration"

# Patch bump (bug fix)
git commit -m "fix: resolve navigation width issue"

# Patch bump (documentation)
git commit -m "docs: update troubleshooting guide"

# Major bump (breaking change)
git commit -m "feat: redesign navigation system

BREAKING CHANGE: Navigation structure has changed"
```

## Troubleshooting

### **Common Issues**

#### **Version Not Bumping**
- Check if `standard-version` is installed: `npm list standard-version`
- Verify commit messages follow conventional format
- Check if commits exist since last tag: `git log --oneline $(git describe --tags --abbrev=0)..HEAD`

#### **Tag Conflicts**
- Old system: `fatal: tag 'vX.Y.Z' already exists`
- New system: `standard-version` handles tag creation properly
- Solution: Use `npm run release` instead of old versioning scripts

#### **Invalid Tags (vnull, etc.)**
- **Cause**: Conflicting `--release-as` arguments or invalid version in `package.json`
- **Example**: `npm run release:patch -- --release-as 1.7.0` creates `vnull` tag
- **Solution**: Use manual version update for specific versions
- **Prevention**: `--release-as` only accepts `major`, `minor`, `patch` (not specific versions)

#### **Setting Specific Versions**
- **Problem**: `standard-version` doesn't support setting specific version numbers
- **Solution**: Manual update approach:
  ```bash
  # Method 1: Edit package.json manually
  # Edit version in package.json to desired version
  node scripts/update-index-version.js
  git add package.json index.html
  git commit -m "chore: set version to X.Y.Z"
  
  # Method 2: Use npm version
  npm version X.Y.Z --no-git-tag-version
  node scripts/update-index-version.js
  git add package.json index.html
  git commit -m "chore: set version to X.Y.Z"
  ```

#### **Deployment Not Triggering**
- Verify GitHub Actions workflow exists: `.github/workflows/release.yml`
- Check if tag was pushed: `git push origin main --follow-tags`
- Verify GitHub Pages settings point to `gh-pages` branch

#### **Version Inconsistency**
- Check if `scripts/update-index-version.js` ran successfully
- Verify JavaScript constants in `index.html` match `package.json`
- Check GitHub Action logs for version verification errors

### **Manual Override Commands**
```bash
# Automatic version bump (recommended)
npm run release              # Auto-determines bump type from commits
npm run release:patch        # Force patch bump (1.2.3 → 1.2.4)
npm run release:minor        # Force minor bump (1.2.3 → 1.3.0)
npm run release:major       # Force major bump (1.2.3 → 2.0.0)

# Setting specific versions (manual approach)
# Edit package.json version field manually, then:
node scripts/update-index-version.js
git add package.json index.html
git commit -m "chore: set version to X.Y.Z"

# Show current status
npm run version:show

# Check tag history
git tag -l | tail -10
```

## Future Enhancements

### **Planned Features**
1. **Release Notes**: Enhanced GitHub Releases with detailed descriptions
2. **Version History**: Web page showing version history and changes
3. **Approval Workflows**: Manual approval for major/minor bumps
4. **Notification System**: Notify team of version changes

### **Extension Points**
1. **Custom Rules**: Add project-specific version bump rules
2. **Integration**: Connect with external tools and services
3. **Analytics**: Track version bump patterns and frequency
4. **Automation**: Further automation of release processes

## Legacy System Summary

The previous versioning system used an intelligent analysis engine with conventional commits and file change analysis. Key features included:

- **Two-layer detection**: Commit message analysis + file change analysis
- **Conservative decision tree**: Strict hierarchy with patch bump defaults
- **Pre-commit integration**: Automatic triggering on every commit
- **Manual override system**: Escape hatches for special cases

**Legacy Documentation**: The complete documentation of the old system can be found at commit hash `8e29c16` in the file `docs/VERSION-MANAGEMENT.md`.

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md) - Overall system architecture
- [Testing Strategy](TESTING.md) - Testing approach and tools
- [GitHub Actions Workflow](.github/workflows/release.yml) - Deployment workflow

## Conclusion

The tag-based deployment model provides a professional, automated approach to version management that:

- **Eliminates manual overhead** through intelligent automation
- **Maintains semantic meaning** through conventional commits
- **Provides transparency** through version display and commit information
- **Ensures consistency** across all contributors and environments
- **Resolves tag conflicts** through proper release workflow
- **Creates traceable deployments** with clear version mapping

This system creates a **"set it and forget it"** versioning experience that maintains professional standards while requiring minimal developer attention.

---

*Last Updated: 2025-09-26*  
*Related Files: `package.json`, `scripts/update-index-version.js`, `.github/workflows/release.yml`, `.husky/pre-commit`*
