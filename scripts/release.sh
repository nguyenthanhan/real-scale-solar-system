#!/bin/bash

# Release script for Real Scale Solar System
# Usage: pnpm release [major|minor|patch]
# Examples: 
#   pnpm release patch  # 1.0.0 -> 1.0.1
#   pnpm release minor  # 1.0.0 -> 1.1.0
#   pnpm release major  # 1.0.0 -> 2.0.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to get current version from package.json
get_current_version() {
    node -p "require('./package.json').version"
}

# Function to increment version
increment_version() {
    local current_version=$1
    local increment_type=$2
    
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $increment_type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            print_error "Invalid increment type: $increment_type"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

RELEASE_TYPE=$1

# Check if no parameter provided (push-only mode)
if [ -z "$RELEASE_TYPE" ]; then
    print_info "No release type provided. Running in push-only mode..."
    print_info "This will commit and push current changes without version bumping."
    
    # Check if working directory is clean
    if [ -n "$(git status --porcelain)" ]; then
        print_info "Found changes to commit:"
        git status --short
    else
        print_warning "No changes to commit. Working directory is clean."
        exit 0
    fi
    
    # Check if we're on main branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_warning "You are on branch '$CURRENT_BRANCH'. It's recommended to push from 'main' branch."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Push cancelled."
            exit 1
        fi
    fi
    
    # Pull latest changes
    print_info "Pulling latest changes from origin..."
    git pull origin $CURRENT_BRANCH
    
    # Stage all changes
    print_info "Staging all changes..."
    git add package.json CHANGELOG.md README.md
    
    # Get current version
    CURRENT_VERSION=$(get_current_version)
    
    # Create commit
    print_info "Creating commit..."
    COMMIT_MESSAGE="build: release v$CURRENT_VERSION

- Update package.json version
- Update CHANGELOG.md with new version entry
- Update README.md version badge"

    git commit -m "$COMMIT_MESSAGE"
    
    # Create annotated tag for current version
    print_info "Creating git tag v$CURRENT_VERSION..."
    git tag -a "v$CURRENT_VERSION" -m "Release v$CURRENT_VERSION

Push-only release - no version bump"
    
    # Push changes and tags
    print_info "Pushing changes to origin..."
    git push origin $CURRENT_BRANCH
    git push origin "v$CURRENT_VERSION"
    
    print_success "Push completed successfully! 🎉"
    print_info "Push summary:"
    echo "  - All changes committed and pushed"
    echo "  - Current version: $CURRENT_VERSION"
    echo "  - Branch: $CURRENT_BRANCH"
    echo "  - Tag v$CURRENT_VERSION created and pushed"
    exit 0
fi

# Validate release type
if [[ ! "$RELEASE_TYPE" =~ ^(major|minor|patch)$ ]]; then
    print_error "Invalid release type: $RELEASE_TYPE"
    echo "Valid options: major, minor, patch"
    echo "Or run without parameters for push-only mode"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(get_current_version)
print_info "Current version: $CURRENT_VERSION"

# Calculate new version
NEW_VERSION=$(increment_version "$CURRENT_VERSION" "$RELEASE_TYPE")
print_info "New version will be: $NEW_VERSION"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You are on branch '$CURRENT_BRANCH'. It's recommended to release from 'main' branch."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Release cancelled."
        exit 1
    fi
fi

# Pull latest changes
print_info "Pulling latest changes from origin..."
git pull origin $CURRENT_BRANCH

# Update package.json version using npm version (works with pnpm too)
print_info "Updating package.json version to $NEW_VERSION..."
npm version $NEW_VERSION --no-git-tag-version

# Update CHANGELOG.md with current date if it exists
if [ -f "CHANGELOG.md" ]; then
    print_info "Updating CHANGELOG.md with release date..."
    TODAY=$(date +"%Y-%m-%d")
    # Replace [Unreleased] or existing date with current date for the version
    sed -i "s/## \[$NEW_VERSION\] - [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}/## [$NEW_VERSION] - $TODAY/" CHANGELOG.md
    sed -i "s/## \[$NEW_VERSION\] - Unreleased/## [$NEW_VERSION] - $TODAY/" CHANGELOG.md
    
    # Add new [Unreleased] section if it doesn't exist
    if ! grep -q "## \[Unreleased\]" CHANGELOG.md; then
        # Add [Unreleased] section after the first ## heading
        sed -i "1,/^## /{ /^## /a\\\n## [Unreleased]\n\n### Planned Features\n- Additional improvements and features\n" CHANGELOG.md
    fi
fi

# Update README.md version badge if it exists
if [ -f "README.md" ]; then
    print_info "Updating README.md version badge to $NEW_VERSION..."
    # Update the version badge in README.md
    sed -i "s/badge\/version-[0-9]\+\.[0-9]\+\.[0-9]\+/badge\/version-$NEW_VERSION/" README.md
fi

# Stage files for commit
print_info "Staging files for commit..."
git add package.json
if [ -f "CHANGELOG.md" ]; then
    git add CHANGELOG.md
fi
if [ -f "README.md" ]; then
    git add README.md
fi

# Create commit
print_info "Creating release commit..."
COMMIT_MESSAGE="build: release v$NEW_VERSION

- Bump version from $CURRENT_VERSION to $NEW_VERSION ($RELEASE_TYPE release)"

if [ -f "CHANGELOG.md" ]; then
    COMMIT_MESSAGE="$COMMIT_MESSAGE
- Update CHANGELOG.md with release date"
fi

if [ -f "README.md" ]; then
    COMMIT_MESSAGE="$COMMIT_MESSAGE
- Update README.md version badge"
fi

git commit -m "$COMMIT_MESSAGE"

# Create annotated tag
print_info "Creating git tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION

$RELEASE_TYPE release from $CURRENT_VERSION"

# Push changes and tags
print_info "Pushing changes to origin..."
git push origin $CURRENT_BRANCH
git push origin "v$NEW_VERSION"

print_success "Release v$NEW_VERSION completed successfully! 🎉"
print_info "Release summary:"
echo "  - Version bumped from $CURRENT_VERSION to $NEW_VERSION ($RELEASE_TYPE)"
if [ -f "CHANGELOG.md" ]; then
    echo "  - CHANGELOG.md updated with release date"
fi
if [ -f "README.md" ]; then
    echo "  - README.md version badge updated"
fi
echo "  - Commit created and pushed"
echo "  - Tag v$NEW_VERSION created and pushed"
echo ""
print_info "Next steps:"
echo "  - Review the release on GitHub"
echo "  - Update any deployment configurations if needed"
