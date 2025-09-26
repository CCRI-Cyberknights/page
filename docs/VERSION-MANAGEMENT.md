# Version Management System

## Overview

The Cyber Club Landing Pages project implements an intelligent, automated versioning system based on conventional commits and file change analysis. This system provides "set it and forget it" version management that maintains semantic versioning while requiring minimal developer attention.

## Architecture

### **1. Intelligent Analysis Engine**
The system uses a **two-layer detection system**:

- **Commit Message Analysis**: Scans commit messages for conventional commit prefixes (`feat:`, `fix:`, `BREAKING CHANGE`, etc.)
- **File Change Analysis**: Examines staged files for architectural patterns (documentation changes, new features, config updates)

### **2. Conservative Decision Tree**
The implementation follows a **strict hierarchy** with conservative defaults:

```
1. Check for MAJOR indicators (very strict) → Major bump
2. Check for MINOR indicators (strict) → Minor bump  
3. Check for PATCH indicators (broad) → Patch bump
4. Default fallback → Patch bump (conservative)
```

### **3. Pre-commit Integration**
The strategy is **automatically triggered** through:
- **Husky pre-commit hook** that runs link tests (no longer does versioning)
- **Git workflow integration** - happens transparently on every commit
- **No automatic versioning** - versioning now handled by `standard-version`

### **4. Version Display Integration**
The system handles **version synchronization** across:
- `package.json` (primary version source)
- HTML meta tags (`<meta name="version" content="1.0.113">`)
- HTML comments (`<!-- Version: 1.0.113 -->`)
- Footer display with commit information tooltip

### **5. Manual Override System**
Provides **escape hatches** for special cases:
- Direct version setting: `npm run release:patch`
- Force bump types: `npm run release:minor`
- Current version inspection: `npm run version:show`

## Implementation Details

### **File Structure**
```
project-root/
├── package.json                    # Version tracking and npm scripts
├── scripts/
│   └── update-index-version.js    # DRY version management script
├── .husky/
│   └── pre-commit                  # Git hook for link testing (no versioning)
├── index.html                      # Updated with version metadata
└── docs/
    ├── VERSION-MANAGEMENT.md       # This documentation (legacy system)
    └── TAG-BASED-DEPLOYMENT.md     # Current system documentation
```

### **Version Display**
The version is displayed in the footer between the copyright and QR Code:
```
© 2024 CCRI Cybersecurity Club • v1.6.10
```

**Hover Tooltip**: Shows commit hash and timestamp:
```
Commit: 81c1cde - 2024-09-23 10:45:00 -0400
```

### **Version Detection Rules**

#### **MAJOR Version Bumps** (Breaking Changes)
- Commit message contains: `BREAKING CHANGE`, `breaking change`, `BREAKING`, `breaking`
- **Very strict** - only triggers on explicit breaking change indicators

#### **MINOR Version Bumps** (New Features)
- Commit message starts with: `feat:`, `feature:`
- File changes include: `package.json`, `.gitignore`, `README.md`
- New pages or major functionality additions

#### **PATCH Version Bumps** (Bug Fixes & Improvements)
- Commit message starts with: `fix:`, `bug:`, `patch:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`
- Documentation changes (`docs/` folder)
- Image updates (`images/` folder)
- CSS/styling changes
- **Default fallback** for any other changes

## Usage

### **Automatic Versioning (Default)**
```bash
git add .
git commit -m "feat: add new Linux guide page"
# Version automatically bumps from 1.0.113 → 1.1.0
```

### **Manual Version Control**
```bash
# Show current version and commit info
npm run version:show

# Force specific version bump
npm run release:patch   # 1.0.113 → 1.0.114
npm run release:minor   # 1.0.113 → 1.1.0
npm run release:major   # 1.0.113 → 2.0.0
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

## Workflow Integration

### **Developer Workflow**
1. **Developer commits** → **Pre-commit hook triggers** → **Analysis runs** → **Version bumps** → **Commit proceeds**
2. **Zero friction** for normal development
3. **Intelligent detection** reduces cognitive load
4. **Consistent results** across all contributors

### **Version History**
- **Starting Version**: `1.0.113` (based on 113 existing commits)
- **Git Tags**: Automatically created (`v1.6.9`, `v1.6.10`, etc.)
- **Version Display**: Updated in HTML footer with commit information
- **Metadata**: Stored in HTML comments and meta tags

## Technical Implementation

### **DRY Version Management Script** (`scripts/update-index-version.js`)
- **Version Synchronization**: Reads version from `package.json` and updates `index.html`
- **Commit Information**: Maintains commit hash and date information
- **Automatic Integration**: Called by `standard-version` postbump hook
- **DRY Principle**: Single source of truth for version data

### **Husky Integration** (`.husky/pre-commit`)

The pre-commit hook now focuses on link testing and skips versioning (handled by `standard-version`):

```bash
#!/bin/bash
. "$(dirname -- "$0")/_/husky.sh"

cd "$(dirname -- "$0")/.."

# Check if any HTML files have been modified
if git diff --cached --name-only | grep -q "\.html$"; then
    echo "🔗 HTML files changed - analyzing changes..."
    
    # Check if only index.html was changed
    html_files=$(git diff --cached --name-only | grep "\.html$")
    if [ "$html_files" = "index.html" ]; then
        echo "📄 Only index.html changed - checking if changes are version-only..."
        
        # Analyze if changes are version-only
        index_diff=$(git diff --cached index.html)
        version_meta_changes=$(echo "$index_diff" | grep -cE "^[+-].*meta name=\"version\"" || echo "0")
        version_span_changes=$(echo "$index_diff" | grep -cE "^[+-].*span id=\"version\"" || echo "0")
        total_changes=$(echo "$index_diff" | grep -cE "^[+-]" || echo "0")
        total_version_changes=$((version_meta_changes + version_span_changes))
        
        # If all changes are version-related, skip link tests
        if [ "$total_version_changes" -gt 0 ] && [ "$total_version_changes" -eq "$total_changes" ]; then
            echo "✅ Only version numbers changed - skipping link tests"
            echo "ℹ️  Version management now handled by standard-version (npm run release)"
            exit 0
        fi
    fi
    
    # Run link tests for content changes
    echo "🔗 Running parallel link tests..."
    . ./selenium_env/bin/activate
    python3 scripts/test-links-dynamic-parallel.py "https://ccri-cyberknights.github.io/page"
    python3 scripts/test-links-dynamic-parallel.py "http://localhost:8000"
fi

    echo "ℹ️  Version management now handled by standard-version (npm run release)"
fi
```

**Optimization Features:**

- **Smart Detection**: Analyzes git diff to identify version-only changes
- **Performance Optimization**: Skips link tests when only version numbers change
- **Reliability**: Still runs full tests for actual content changes
- **Transparency**: Shows analysis of what changed

**Version-Only Changes Detected:**
- `const VERSION = "..."` updates
- `const COMMIT_HASH = "..."` updates  
- `const COMMIT_DATE = "..."` updates

### **Package.json Configuration**
```json
{
  "scripts": {
    "version:show": "echo $npm_package_version",
    "release": "standard-version",
    "release:patch": "standard-version --release-as patch",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:links"
    }
  }
}
```

## Benefits

### **For Developers**
- **Zero Friction**: Versioning happens automatically
- **Intelligent Detection**: Reduces manual decision-making
- **Consistent Results**: Same behavior across all team members
- **Clear History**: Git tags provide clear version milestones

### **For Users**
- **Transparent Versioning**: Version visible in footer
- **Commit Information**: Hover tooltip shows when changes were made
- **Professional Appearance**: Version display enhances credibility

### **For Maintenance**
- **Automated Process**: No manual version management required
- **Semantic Versioning**: Clear meaning of version numbers
- **Git Integration**: Version tags for easy release management
- **Documentation**: Comprehensive tracking of changes

## Troubleshooting

### **Common Issues**

#### **Version Not Bumping**
- Check if Husky is installed: `npx husky install`
- Verify pre-commit hook exists: `ls .husky/pre-commit`
- Check script permissions: `chmod +x scripts/update-index-version.js`

#### **Wrong Version Bump Type**
- Use manual override: `npm run release:minor`
- Check commit message format (use conventional commits)
- Verify file changes are staged: `git status`

#### **Version Display Issues**
- Check HTML for version elements: `grep "version" index.html`
- Verify JavaScript updates version display
- Check browser cache for old version

#### **Environment Issues**
- **Pre-commit Hook Failures**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#husky-pre-commit-hook-issues)
- **Link Test Failures**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#environment-issues)
- **Import Errors**: Ensure using `selenium_env` not `testing_env`
- **Tag Conflicts and Invalid Tags**: See [TAG-BASED-DEPLOYMENT.md](TAG-BASED-DEPLOYMENT.md#troubleshooting) for modern deployment issues

### **Manual Override Commands**
```bash
# Force specific version
npm run release:patch

# Show current status
npm run version:show

# Reinstall Husky hooks
npx husky install
```

## Future Enhancements

### **Planned Features**
1. **Release Notes**: Automatic generation of release notes from commits
2. **Version History**: Web page showing version history and changes
3. **CI/CD Integration**: GitHub Actions integration for automated releases
4. **Changelog**: Automatic changelog generation

### **Extension Points**
1. **Custom Rules**: Add project-specific version bump rules
2. **Notification System**: Notify team of version changes
3. **Analytics**: Track version bump patterns and frequency
4. **Integration**: Connect with external tools and services

## Related Documentation

- [Tag-Based Deployment](TAG-BASED-DEPLOYMENT.md) - **CURRENT** Modern deployment model using standard-version
- [Architecture Overview](ARCHITECTURE.md) - Overall system architecture
- [Testing Strategy](TESTING.md) - Testing approach and tools
- [Testing Roadmap](TESTING-ROADMAP.md) - Future testing enhancements and goals
- [Layout Troubleshooting](LAYOUT-TROUBLESHOOTING.md) - CSS debugging methodology
- [Selenium Debugging Innovation](SELENIUM-DEBUGGING-INNOVATION.md) - Debugging approach

## Legacy System (Deprecated)

**Note**: The original intelligent versioning system (`scripts/bump-version.sh`) has been replaced with the modern tag-based deployment model using `standard-version`. See [Tag-Based Deployment](TAG-BASED-DEPLOYMENT.md) for the current system.

## Conclusion

This versioning system provides a professional, automated approach to version management that:
- **Eliminates manual overhead** through intelligent automation
- **Maintains semantic meaning** through conventional commits
- **Provides transparency** through version display and commit information
- **Ensures consistency** across all contributors and environments

The system creates a **"set it and forget it"** versioning experience that maintains professional standards while requiring minimal developer attention.
