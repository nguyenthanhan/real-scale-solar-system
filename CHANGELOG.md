# Changelog

All notable changes to the Real Scale Solar System project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2025-08-03

### Changed

- **Unified GitHub Actions**: Consolidated release and deployment workflows into single streamlined process

---

## [1.0.5] - 2025-08-02

### Added

- **GitHub Button**: Added small GitHub button in top right corner of the entire screen
- **Custom GitHub Icon**: Implemented official GitHub SVG logo for authentic branding

### Changed

- **UI Enhancement**: Added floating GitHub button with static styling (no animations)
- **Repository Link**: Updated GitHub button to link to correct repository URL

---

## [1.0.4] - 2025-08-02

### Added

- **README Version Badge Auto-Update**: Release script now automatically updates version badge in README.md
- **Enhanced Release Automation**: Complete automation of version synchronization across all files
- **Changelog Validation**: Release script now validates that new version exists in CHANGELOG.md before proceeding

### Changed

- **Release Script**: Updated to handle README.md version badge updates and changelog validation
- **Commit Messages**: Enhanced to include README.md changes in release commits
- **Release Summary**: Added README.md update notifications in release output

### Fixed

- **Version Synchronization**: Ensured package.json, CHANGELOG.md, and README.md versions stay in sync
- **Release Process**: Streamlined release workflow for better consistency
- **Release Safety**: Prevented releases without proper changelog documentation

## [1.0.3] - 2025-08-02

### Added

- **Enhanced Changelog Extraction**: Improved script to include version headers with dates
- **Better Release Formatting**: Cleaner output with proper markdown formatting
- **Improved GitHub Actions**: Better handling of multiline content in releases

### Changed

- **Changelog Script**: Updated to include version headers (e.g., "## [1.0.2] - 2025-08-02")
- **Release Workflow**: Simplified content extraction and improved reliability
- **Content Cleaning**: Normalized spacing and removed excessive blank lines

### Fixed

- **URL Encoding Issues**: Resolved problems with escaped newlines in changelog output
- **Formatting Consistency**: Ensured consistent markdown formatting across all outputs

## [1.0.2] - 2025-08-02

### Added

- **Automated GitHub Releases**: Automatic creation of GitHub releases with changelog content
- **Changelog Extraction Script**: Node.js script to extract changelog content for specific versions
- **Enhanced Release Process**: Improved release scripts with semantic versioning support
- **GitHub Actions Workflow**: Automated release workflow that triggers on version tags

### Changed

- **Release Commands**: Updated to use semantic versioning (`pnpm release:patch/minor/major`)
- **Documentation**: Enhanced README with release process documentation
- **Dependabot Configuration**: Added comprehensive dependabot.yml for automated dependency updates

### Fixed

- **GitHub Actions**: Fixed checkout action version and added pnpm support
- **Deployment Workflow**: Improved Vercel deployment with proper pnpm setup

---

## [Unreleased]

### Planned Features

- Additional celestial bodies (moons, asteroids)
- More detailed planetary atmospheres
- Enhanced educational content
- VR/AR support
- Multi-language support
- Enhanced texture generation with more realistic surface details
- Additional camera presets for different viewing angles
- Educational mode with interactive learning elements

### Technical Improvements

- Performance optimizations for large-scale solar system rendering
- Enhanced mobile responsiveness and touch controls
- Improved accessibility features
- Better error handling and user feedback

---

_This changelog will be updated with each new release to document all changes, improvements, and new features._
