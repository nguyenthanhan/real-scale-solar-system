# Changelog

All notable changes to the Real Scale Solar System project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
