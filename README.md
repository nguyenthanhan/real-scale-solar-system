# Real Scale Solar System 🌌

An immersive, true-to-scale 3D visualization of our solar system with accurate planetary sizes, distances, orbits, and scientific data. Experience the real proportions of our cosmic neighborhood directly in your browser.

> 🚀 **Experience the vastness of space** - See how small Earth really is compared to the Sun, and how far apart the planets actually are in our solar system.

[![Release and Deploy](https://github.com/nguyenthanhan/real-scale-solar-system/workflows/Release%20and%20Deploy/badge.svg)](https://github.com/nguyenthanhan/real-scale-solar-system/actions/workflows/release-and-deploy.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/v0-real-scale-solar-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

## ✨ Features

- **True-to-scale 3D model** with realistic sizes, distances, and orbital mechanics
- **Interactive controls**: orbit/zoom/pan, click-to-explore, rotation controls
- **Performance**: Web Workers, texture caching, real memory monitor, optimized renders
- **Visual fidelity**: 10k+ star field, atmospheric glow, ring systems, detailed sun
- **Responsive**: Works across desktop and mobile with touch support

## ✅ Project Status

The project checklist is complete. Here’s a concise overview of what’s shipped and what’s next:

- **Core**: True-to-scale 3D solar system, realistic planetary details, 10k+ star field, atmospheric glow, ring systems, interactive 3D planet models.
- **UI & Controls**: Orbit/zoom/pan camera, speed control up to 10,000,000x with real-time conversion, responsive and touch-friendly UI, info modals, optimized context performance.
- **Performance**: Web Workers for heavy work, texture caching with memory tracking, real memory monitor, debounced generation, reduced re-renders.
- **Scientific**: Accurate orbital mechanics, axial tilts, retrograde rotations (Venus, Uranus), solar surface features.

### ⚠️ Known Issues

- Occasional FPS dips on low-end devices under heavy load.

### 🚀 Roadmap

- Real planet surface imagery for higher realism
- Multi-language support
- Timeline for historical planetary positions
- Additional camera presets

## 🛠️ Technical Stack

### Core Technologies

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

## 🔧 Recent Highlights

- Performance: Memory Monitor pauses FPS/polling when hidden or tab inactive
- Hydration: Client-only guards to prevent SSR mismatches
- Accuracy: Fixed cache usage percentage edge cases
- See full details in [CHANGELOG.md](CHANGELOG.md)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
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
