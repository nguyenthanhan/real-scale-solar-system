# Changelog

All notable changes to the Real Scale Solar System project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2025-08-10

### Added

- **Performance Monitoring Optimizations**: Enhanced memory monitor component with intelligent resource management
- **Visibility-Based Resource Control**: FPS sampling and stats polling now pause when panel is hidden or browser tab is inactive
- **SSR Hydration Safety**: Added client-side hydration checks to prevent server-side rendering mismatches
- **Clean FPS Measurement**: Implemented proper data clearing and guards to prevent stale FPS readings

### Changed

- **Memory Monitor Performance**: FPS tracking and stats refresh now respect panel visibility and document visibility states
- **Resource Management**: Eliminated unnecessary `requestAnimationFrame` calls and polling when components are not visible
- **Hydration Compatibility**: Protected browser-only APIs with proper client-side checks for Next.js compatibility
- **FPS Accuracy**: Enhanced FPS measurement with sample clearing and mid-frame visibility guards

### Fixed

- **Hydration Errors**: Resolved "Hydration failed" errors by ensuring server and client render identical initial HTML
- **Cache Usage Display**: Fixed division by zero errors and improved cache percentage calculations
- **Resource Leaks**: Prevented unnecessary background processing when debug panel is hidden
- **Stale Data Issues**: Eliminated contamination of FPS readings from previous measurement sessions

## [1.0.8] - 2025-08-09

### Added

- **Unified Message Handling**: Consolidated multiple message event listeners into single, robust handlers with proper validation
- **Enhanced Type Safety**: Discriminated union types for texture generation requests with compile-time color validation
- **Improved Cache Management**: LRU (Least Recently Used) cache implementation with proper eviction strategies
- **Robust Error Propagation**: Comprehensive error handling with structured error responses and proper promise rejection
- **Input Validation**: Enhanced validation for canvas dimensions (integer-only), color formats, and rotation parameters
- **Color Normalization**: Automatic color string normalization for canvas compatibility, preventing transparent output
- **Worker Error Recovery**: Immediate promise rejection on worker errors, preventing hanging operations
- **Memory Leak Prevention**: Proper cleanup of pending promises during component unmount and worker termination

### Changed

- **Worker Architecture**: Refactored texture generation and rotation calculation workers for better maintainability
- **Error Handling**: Enhanced error messages with detailed context and structured response formats
- **Cache Strategy**: Implemented proper LRU eviction instead of simple FIFO for better performance
- **Type Safety**: Replaced optional color properties with discriminated unions for compile-time validation
- **Color Processing**: Enhanced color parsing to support multiple formats (hex, rgb, rgba, named colors)
- **Validation Logic**: Stricter input validation preventing silent failures and quantization issues

### Fixed

- **Silent Failures**: Fixed issues where invalid hex colors would silently return black instead of throwing errors
- **Memory Leaks**: Prevented unresolved promises from hanging during worker termination or component unmount
- **Canvas Compatibility**: Fixed color string normalization to prevent transparent output in canvas operations
- **Cache Drift**: Eliminated potential drift between worker and main thread validation bounds
- **Origin Validation**: Removed ineffective origin checks in Web Workers that never fired
- **Integer Dimensions**: Fixed canvas dimension validation to prevent silent flooring of fractional values
- **Promise Hanging**: Immediate rejection of pending promises when worker errors occur

### Technical Improvements

- **Worker Communication**: Streamlined message handling with unified validation and error reporting
- **Type Definitions**: Enhanced TypeScript interfaces with proper discriminated unions and validation bounds
- **Performance**: Improved cache hit rates with LRU strategy and better memory management
- **Reliability**: Comprehensive error boundaries and validation throughout the worker system

---

## [1.0.7] - 2025-08-08

### Added

- Time conversion display in control modal for better user understanding of simulation speed
- Comprehensive development guidelines covering workflow, scientific accuracy, styling, TypeScript standards, and Three.js best practices
- Conditional label rendering support via showLabels prop in Planet component

### Changed

- Increased MAX_SPEED to 10,000,000 for significantly faster simulation capabilities
- Improved speed input range and step values for finer simulation control
- Enhanced debug logging in usePlanetMovement hook to only activate in development mode for better performance
- Updated Tailwind CSS configuration and modal component structure

### Fixed

- Added lastLoggedDayRef to track logged days for debug logging in usePlanetMovement hook
- Increased z-index of modal overlay to ensure proper stacking context
- Resolved various issues in usePlanetMovement.ts hook

### Documentation

- Updated README.md with enhanced simulation features and UI improvements
- Cleaned up unused properties in various documentation files

### Dependencies

- Updated dependencies in pnpm-lock.yaml
- Bumped brace-expansion from 1.1.11 to 1.1.12
- Added sharp and unrs-resolver to ignored built dependencies

---

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
