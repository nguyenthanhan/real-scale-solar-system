#!/bin/bash

# Release script for Real Scale Solar System
# Usage: npm run release [version]
# Example: npm run release 1.0.0

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

# Check if version is provided
if [ -z "$1" ]; then
    print_error "Version number is required!"
    echo "Usage: npm run release <version>"
    echo "Example: npm run release 1.0.0"
    exit 1
fi

VERSION=$1

# Validate version format (basic semver check)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format. Please use semantic versioning (e.g., 1.0.0)"
    exit 1
fi

print_info "Starting release process for version $VERSION"

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Working directory is not clean. Please commit or stash your changes first."
    git status --short
    exit 1
fi

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

# Update package.json version
print_info "Updating package.json version to $VERSION..."
npm version $VERSION --no-git-tag-version

# Update CHANGELOG.md with current date if it exists
if [ -f "CHANGELOG.md" ]; then
    print_info "Updating CHANGELOG.md with release date..."
    TODAY=$(date +"%Y-%m-%d")
    # Replace [Unreleased] or existing date with current date for the version
    sed -i "s/## \[$VERSION\] - [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}/## [$VERSION] - $TODAY/" CHANGELOG.md
    sed -i "s/## \[$VERSION\] - Unreleased/## [$VERSION] - $TODAY/" CHANGELOG.md
fi

# Stage files for commit
print_info "Staging files for commit..."
git add package.json
if [ -f "CHANGELOG.md" ]; then
    git add CHANGELOG.md
fi

# Create commit
print_info "Creating release commit..."
COMMIT_MESSAGE="chore: release v$VERSION

- Update version to $VERSION"

if [ -f "CHANGELOG.md" ]; then
    COMMIT_MESSAGE="$COMMIT_MESSAGE
- Update CHANGELOG.md with release date"
fi

git commit -m "$COMMIT_MESSAGE"

# Create annotated tag
print_info "Creating git tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"

# Push changes and tags
print_info "Pushing changes to origin..."
git push origin $CURRENT_BRANCH
git push origin "v$VERSION"

print_success "Release v$VERSION completed successfully! 🎉"
print_info "Release summary:"
echo "  - Version updated in package.json"
if [ -f "CHANGELOG.md" ]; then
    echo "  - CHANGELOG.md updated with release date"
fi
echo "  - Commit created and pushed"
echo "  - Tag v$VERSION created and pushed"
