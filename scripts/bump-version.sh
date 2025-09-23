#!/bin/bash

# Intelligent Version Bumping Script for CCRI Cyberknights Landing Pages
# Based on conventional commits and file change analysis

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Function to bump version
bump_version() {
    local bump_type=$1
    local new_version
    
    case $bump_type in
        "major")
            new_version=$(npm version major --no-git-tag-version | sed 's/v//')
            echo -e "${RED}MAJOR bump: ${CURRENT_VERSION} → ${new_version}${NC}"
            ;;
        "minor")
            new_version=$(npm version minor --no-git-tag-version | sed 's/v//')
            echo -e "${YELLOW}MINOR bump: ${CURRENT_VERSION} → ${new_version}${NC}"
            ;;
        "patch")
            new_version=$(npm version patch --no-git-tag-version | sed 's/v//')
            echo -e "${GREEN}PATCH bump: ${CURRENT_VERSION} → ${new_version}${NC}"
            ;;
    esac
    
    # Update HTML with new version
    update_html_version "$new_version"
    
    # Create git tag
    git tag "v${new_version}"
    
    echo -e "${GREEN}Version bumped to: ${new_version}${NC}"
    echo -e "${BLUE}Git tag created: v${new_version}${NC}"
}

# Function to update HTML with version
update_html_version() {
    local version=$1
    local commit_date=$(git log -1 --format="%ci")
    local commit_hash=$(git rev-parse --short HEAD)
    
    # Update version in HTML comments and meta tags
    sed -i "s/<!-- Version: [^ ]* -->/<!-- Version: ${version} -->/g" index.html
    sed -i "s/<meta name=\"version\" content=\"[^\"]*\">/<meta name=\"version\" content=\"${version}\">/g" index.html
    
    # Update footer version display
    sed -i "s/<span id=\"version\">[^<]*<\/span>/<span id=\"version\">${version}<\/span>/g" index.html
    
    # Update version tooltip with commit info
    sed -i "s/title=\"[^\"]*\"/title=\"Commit: ${commit_hash} - ${commit_date}\"/g" index.html
    
    echo -e "${BLUE}HTML updated with version ${version}${NC}"
}

# Function to analyze commit message
analyze_commit_message() {
    local commit_msg="$1"
    
    # Check for MAJOR indicators (very strict)
    if [[ "$commit_msg" =~ (BREAKING CHANGE|breaking change|BREAKING|breaking) ]]; then
        echo "major"
        return
    fi
    
    # Check for MINOR indicators (strict)
    if [[ "$commit_msg" =~ ^(feat|feature): ]]; then
        echo "minor"
        return
    fi
    
    # Check for PATCH indicators (broad)
    if [[ "$commit_msg" =~ ^(fix|bug|patch|docs|style|refactor|perf|test|chore): ]]; then
        echo "patch"
        return
    fi
    
    # Default to patch for any other changes
    echo "patch"
}

# Function to analyze file changes
analyze_file_changes() {
    local staged_files=$(git diff --cached --name-only)
    
    # Check for major architectural changes
    if echo "$staged_files" | grep -q -E "(package\.json|\.gitignore|README\.md)$"; then
        echo "minor"
        return
    fi
    
    # Check for new features (new pages, major functionality)
    if echo "$staged_files" | grep -q -E "(index\.html.*new.*page|new.*feature)"; then
        echo "minor"
        return
    fi
    
    # Check for documentation changes
    if echo "$staged_files" | grep -q -E "^docs/"; then
        echo "patch"
        return
    fi
    
    # Check for image updates
    if echo "$staged_files" | grep -q -E "^images/"; then
        echo "patch"
        return
    fi
    
    # Check for CSS/styling changes
    if echo "$staged_files" | grep -q -E "(\.css|style|styling)"; then
        echo "patch"
        return
    fi
    
    # Default to patch
    echo "patch"
}

# Main logic
case "$1" in
    "auto")
        echo -e "${BLUE}🚀 Auto-bumping version...${NC}"
        
        # Get commit message from git
        commit_msg=$(git log -1 --pretty=%B)
        echo -e "${BLUE}Commit message: ${commit_msg}${NC}"
        
        # Analyze commit message
        commit_bump=$(analyze_commit_message "$commit_msg")
        echo -e "${BLUE}Commit analysis: ${commit_bump}${NC}"
        
        # Analyze file changes
        file_bump=$(analyze_file_changes)
        echo -e "${BLUE}File analysis: ${file_bump}${NC}"
        
        # Use the more conservative bump (higher priority)
        if [[ "$commit_bump" == "major" || "$file_bump" == "major" ]]; then
            bump_type="major"
        elif [[ "$commit_bump" == "minor" || "$file_bump" == "minor" ]]; then
            bump_type="minor"
        else
            bump_type="patch"
        fi
        
        bump_version "$bump_type"
        ;;
    "patch")
        echo -e "${GREEN}PATCH bump requested${NC}"
        bump_version "patch"
        ;;
    "minor")
        echo -e "${YELLOW}MINOR bump requested${NC}"
        bump_version "minor"
        ;;
    "major")
        echo -e "${RED}MAJOR bump requested${NC}"
        bump_version "major"
        ;;
    "show")
        echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"
        echo -e "${BLUE}Commit info: $(git log -1 --format='%h - %ci')${NC}"
        ;;
    *)
        echo -e "${RED}Usage: $0 {auto|patch|minor|major|show}${NC}"
        echo -e "${BLUE}  auto   - Intelligent version bumping based on commit and file analysis${NC}"
        echo -e "${BLUE}  patch  - Bump patch version (1.0.0 → 1.0.1)${NC}"
        echo -e "${BLUE}  minor  - Bump minor version (1.0.0 → 1.1.0)${NC}"
        echo -e "${BLUE}  major  - Bump major version (1.0.0 → 2.0.0)${NC}"
        echo -e "${BLUE}  show   - Show current version and commit info${NC}"
        exit 1
        ;;
esac
