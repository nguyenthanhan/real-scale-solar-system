# Real Scale Solar System 🌌

An immersive, true-to-scale 3D visualization of our solar system with accurate planetary sizes, distances, orbits, and scientific data. Experience the real proportions of our cosmic neighborhood directly in your browser.

> 🚀 **Experience the vastness of space** - See how small Earth really is compared to the Sun, and how far apart the planets actually are in our solar system.

[![Release and Deploy](https://github.com/nguyenthanhan/real-scale-solar-system/workflows/Release%20and%20Deploy/badge.svg)](https://github.com/nguyenthanhan/real-scale-solar-system/actions/workflows/release-and-deploy.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/v0-real-scale-solar-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

## ✨ Features

### 🌟 Core Experience

- **True-to-Scale 3D Visualization**: Explore a scientifically accurate model with real proportions
- **Realistic Planetary Details**: Accurate representation of planet sizes, colors, and features
- **Immersive Star Field**: 10,000+ stars create a realistic space environment
- **Dynamic Atmospheric Effects**: View-dependent atmospheric glow for planets with atmospheres
- **3D Planet Models**: Interactive rotating planet models with realistic textures and axial tilts
- **Procedural Textures**: Dynamically generated surfaces with accurate colors and features

### 🎮 Interactive Controls

- **Advanced Camera Controls**: Navigate with intuitive mouse/touch controls
- **Extreme Simulation Speed**: Control from 1x (real-time) to 10,000,000x
- **Real-Time Conversion Display**: See exactly how much real time corresponds to simulation time
- **Click to Explore**: Click on any planet or the Sun for detailed scientific information
- **3D Planet Rotation Control**: Adjust rotation speed in modal from 30 seconds to 12 hours per second
- **Optimized Context Performance**: Memoized rotation speed controls prevent unnecessary re-renders
- **Responsive Design**: Fully responsive layout that works across all devices

### 🔬 Scientific Accuracy

- **Accurate Orbital Mechanics**: True orbital paths with proper eccentricity calculations
- **Real Scale Proportions**: Sun dominates the scene as in reality, planets appear as small objects
- **Axial Tilt Visualization**: Realistic planetary axial tilts affecting rotation
- **Retrograde Rotation**: Venus and Uranus rotate in the opposite direction
- **Ring Systems**: Saturn, Jupiter, Uranus, and Neptune with accurate ring representations
- **Solar Features**: Sun with granulation, sunspots, prominences, and limb darkening

## ✅ Project Checklist

### 🌟 Core Features

- [x] **True-to-scale 3D solar system visualization**
- [x] **Realistic planetary sizes and distances**
- [x] **Accurate orbital mechanics with elliptical paths**
- [x] **Procedurally generated planet textures**
- [x] **Interactive 3D planet models in modal**
- [x] **Realistic star field with 10,000+ stars**
- [x] **Dynamic atmospheric effects (view-dependent)**
- [x] **Axial tilt visualization**
- [x] **Planet rotation with accurate speeds**
- [x] **Saturn, Jupiter, Uranus, and Neptune ring systems**

### 🎮 User Interface & Controls

- [x] **Advanced camera controls (orbit, zoom, pan)**
- [x] **Simulation speed control (1x to 10,000,000x)**
- [x] **Real-time conversion display**
- [x] **Click-to-explore planet information**
- [x] **Responsive design for all devices**
- [x] **Touch controls for mobile devices**
- [x] **Smart UI with auto-hiding labels**
- [x] **3D planet rotation speed control in modal**
- [x] **Optimized context performance with memoization**
- [x] **Enhanced type safety with explicit TypeScript typing**
- [x] **Centralized rotation calculations with caching**
- [x] **Web Worker support for complex calculations**
- [x] **Optimized texture generation with Web Workers**
- [x] **Texture caching system with actual memory tracking**
- [x] **Real memory monitoring with Performance Memory API**
- [x] **Strengthened TypeScript interfaces with complete data structures**

### 🔬 Scientific Accuracy

- [x] **Accurate orbital periods and speeds**
- [x] **Realistic planet surfaces and features**
- [x] **Earth with continents, oceans, and ice caps**
- [x] **Mars with volcanoes and dust storms**
- [x] **Gas giants with atmospheric bands**
- [x] **Sun with granulation and limb darkening**
- [x] **Retrograde rotation for Venus and Uranus**
- [x] **Realistic atmospheric glow effects**

### ⚠️ Known Issues

- [ ] **Performance: Investigate and fix FPS drops under load**

### 🚀 Future Enhancements

- [ ] **Real planet surface images**: Replace procedural textures with actual images for more realistic planet surfaces
- [ ] **Multi-language support**
- [ ] **Timeline feature for historical planetary positions**
- [ ] **Additional camera presets**

## 🛠️ Technical Stack

### Frontend Framework

- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React version with improved performance and hooks optimization
- **TypeScript 5**: Type-safe code ensuring reliability and explicit typing

### 3D Graphics & Visualization

- **React Three Fiber 9.1.2**: React renderer for Three.js
- **Three.js 0.176.0**: JavaScript 3D library
- **Canvas API**: Procedural texture generation

### Styling & Animation

- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Framer Motion 12.9.2**: Smooth animations and transitions

### Performance & State Management

- **React Context API**: Optimized with useMemo and useCallback for stable references
- **Explicit TypeScript Typing**: Enhanced type safety across all components
- **Memoized Context Values**: Prevents unnecessary re-renders and improves performance
- **Calculation Optimization**: Centralized rotation calculations with caching and Web Worker support
- **Render Cycle Optimization**: Reduced complex calculations in render cycles with utility functions
- **Texture Generation Optimization**: Web Worker-based texture generation with caching and debouncing
- **UI Performance**: Prevents freezing during heavy texture generation operations

## 🎮 How to Use

### Controls

- **Mouse/Touch**: Orbit around the solar system
- **Scroll/Pinch**: Zoom in/out with smooth camera movement
- **Right-Click and Drag**: Pan the view
- **Click on Planets**: View detailed scientific information
- **Speed Slider**: Adjust simulation speed from 1x to 10,000,000x

### Features

- **Real-Time Conversion**: See how much real time corresponds to simulation time
- **3D Planet Models**: Interactive rotating models in modal with accurate axial tilts
- **Smart UI**: Planet labels automatically hide when viewing detailed information
- **Responsive Design**: Optimized for all screen sizes and devices

## 🌍 Planet Information

The simulation includes scientifically accurate data for all major celestial bodies:

| Planet      | Key Features    | Special Characteristics                         |
| ----------- | --------------- | ----------------------------------------------- |
| **Mercury** | Smallest planet | Extreme temperature variations, rocky surface   |
| **Venus**   | Hottest planet  | Thick atmospheric pressure, retrograde rotation |
| **Earth**   | Our home planet | Only known world with liquid water oceans       |
| **Mars**    | The Red Planet  | Largest dust storms in the solar system         |
| **Jupiter** | Largest planet  | Famous Great Red Spot, ring system              |
| **Saturn**  | Ringed beauty   | Spectacular ring system, pale gold appearance   |
| **Uranus**  | Ice giant       | Unique sideways rotation, subtle rings          |
| **Neptune** | Windiest planet | Speeds reaching 2,100 km/h, ring system         |

Each celestial body features realistic orbital periods, accurate rotation speeds, true-to-scale sizes, procedurally generated textures, and comprehensive scientific data.

## 🔧 Recent Improvements

### Performance Optimizations

- **Context Memoization**: Rotation speed context now uses `useMemo` and `useCallback` for stable references
- **Explicit TypeScript Typing**: All state and context values have explicit types for better type safety
- **Reduced Re-renders**: Memoized context values prevent unnecessary component re-renders
- **Enhanced Error Handling**: Improved context provider error boundaries and null checks
- **Calculation Optimization**: Centralized rotation calculations with intelligent caching system
- **Web Worker Support**: Complex mathematical operations can be moved off the main thread
- **Render Cycle Optimization**: Eliminated complex calculations from render cycles using utility functions
- **Texture Generation Optimization**: Web Worker-based texture generation prevents UI freezing
- **Intelligent Caching**: Texture cache system with actual memory tracking and LRU eviction
- **Debounced Generation**: Prevents excessive texture regeneration with smart debouncing
- **Robust Error Handling**: Comprehensive validation and error boundaries for canvas operations
- **Type Safety**: Complete TypeScript interfaces with no optional fields
- **Real Memory Monitoring**: Performance Memory API integration for accurate memory usage tracking
- **Comprehensive Error Handling**: Robust error boundaries and validation for canvas operations
- **Strengthened TypeScript Interfaces**: Complete data structures with no optional chaining required

### Code Quality Enhancements

- **Type Safety**: Explicit typing for all context state and callback functions
- **Performance Monitoring**: Optimized context value stability across renders
- **Maintainability**: Clear type definitions and memoization patterns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nguyenthanhan/real-scale-solar-system.git
cd real-scale-solar-system

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm release` - Create a new release
- `pnpm changelog` - Generate changelog from conventional commits

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

- Follow TypeScript best practices with explicit typing
- Use React hooks optimization (useMemo, useCallback) for performance
- Maintain component reusability and proper context patterns
- Add proper documentation for new features
- Ensure responsive design compatibility
- Implement proper error boundaries and null checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for scientific data and inspiration
- **Three.js community** for the amazing 3D library
- **React Three Fiber** for seamless React integration
- **Next.js team** for the excellent framework

## 📊 Performance & Compatibility

This application is optimized for modern browsers and requires WebGL support:

- **Recommended browsers**: Chrome, Firefox, Safari, or Edge (latest versions)
- **WebGL support**: Ensure WebGL is enabled in your browser
- **Hardware**: Dedicated graphics card recommended for smoother performance
- **Mobile**: Full support for touch devices with optimized controls
- **Minimum requirements**: 4GB RAM and modern CPU

## 🔄 Release Process

The project uses semantic versioning for releases:

```bash
# Create a new release
pnpm release

# Release specific versions
pnpm release:patch  # Bug fixes, small improvements
pnpm release:minor  # New features, backward compatible
pnpm release:major  # Breaking changes
```

### Automated GitHub Releases

When you create a release, the system will:

1. Create a git tag with the new version
2. Trigger GitHub Actions to automatically create a GitHub release
3. Extract changelog content from CHANGELOG.md
4. Create a formatted release with automatic deployment to Vercel

## Support

If you encounter any issues or have questions:

- Check the [Issues](https://github.com/nguyenthanhan/real-scale-solar-system/issues) page
- Create a new issue with detailed information
- Contact the maintainers for support

---

**Note**: This is an educational tool designed to provide accurate astronomical information. While we strive for scientific accuracy, this simulation is for educational purposes and should not be used for professional astronomical calculations.
