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
- **Real-time planetary data**: Integration with Solar System OpenData API for accurate scientific information
- **Accurate calculations**: Uses astronomy-engine library for precise planetary position calculations
- **Historical events**: Browse and explore significant astronomical events throughout history
- **Date-based simulation**: Jump to any date to see planetary positions at that time
- **Orbital path visualization**: Toggleable 3D orbit traces with accurate inclinations
- **Asteroid belt visualization**: Toggleable asteroid belt regions (Main Belt, Kuiper Belt)
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

- **Next.js 16.1.1**: React framework with App Router
- **React 19.2.3**: Latest React version with improved performance and hooks optimization
- **TypeScript 5.9.3**: Type-safe code ensuring reliability and explicit typing

### 3D Graphics & Visualization

- **React Three Fiber 9.4.2**: React renderer for Three.js
- **Three.js 0.176.0**: JavaScript 3D library
- **@react-three/drei 10.7.7**: Useful helpers and abstractions for React Three Fiber
- **TextureLoader**: High-quality planet texture images for photorealistic rendering

### Astronomy & Calculations

- **astronomy-engine 2.1.19**: Accurate planetary position calculations based on JPL ephemeris data

### Styling & Animation

- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Framer Motion 12.23.26**: Smooth animations and transitions
- **lucide-react 0.454.0**: Beautiful icon library

### Performance & State Management

- **React Context API**: Optimized with useMemo and useCallback for stable references
- **Explicit TypeScript Typing**: Enhanced type safety across all components
- **Memoized Context Values**: Prevents unnecessary re-renders and improves performance
- **Calculation Optimization**: Centralized rotation calculations with caching and Web Worker support
- **Render Cycle Optimization**: Reduced complex calculations in render cycles with utility functions
- **Texture Loading Optimization**: Asynchronous texture loading with LRU caching for efficient memory usage
- **UI Performance**: Smooth rendering with fallback materials during texture loading

## 🎮 How to Use

### Controls

- **Mouse/Touch**: Orbit around the solar system
- **Scroll/Pinch**: Zoom in/out with smooth camera movement
- **Right-Click and Drag**: Pan the view
- **Click on Planets**: View detailed scientific information
- **Speed Slider**: Adjust simulation speed from 1x to 10,000,000x

### Features

- **Real-Time Conversion**: See how much real time corresponds to simulation time
- **Date Picker**: Select any date to view planetary positions at that specific time
- **Simulation Modes**: Toggle between speed-based and date-based simulation modes
- **Historical Events**: Browse significant astronomical events and jump to their dates
- **Orbit Visualization**: Toggle orbital paths on/off to see planetary trajectories with accurate 3D inclinations
- **Asteroid Belts**: Toggle visualization of Main Belt and Kuiper Belt regions
- **3D Planet Models**: Interactive rotating models in modal with accurate axial tilts
- **Smart UI**: Planet labels automatically hide when viewing detailed information
- **Responsive Design**: Optimized for all screen sizes and devices

## 🔧 Recent Highlights

- **Performance**: Memory Monitor pauses FPS/polling when hidden or tab inactive
- **Hydration**: Client-only guards to prevent SSR mismatches
- **Accuracy**: Fixed cache usage percentage edge cases
- **Worker Architecture**: Enhanced texture generation and rotation calculation workers with LRU caching
- **Type Safety**: Improved TypeScript typing with discriminated unions
- **Error Handling**: Comprehensive error boundaries and validation throughout the application
- See full details in [CHANGELOG.md](CHANGELOG.md)

## 🛸 Orbit Visualization

The application features accurate 3D orbital path visualization:

### Orbit Features

- **Toggleable Display**: Show or hide orbital paths with a single click
- **Accurate Inclinations**: Each orbit is tilted according to real orbital inclination angles relative to Earth's ecliptic plane
- **Color Differentiation**: Inner planets (Mercury, Venus, Earth, Mars) use lighter gray orbits, outer planets (Jupiter, Saturn, Uranus, Neptune) use darker gray
- **3D Rendering**: Orbits are visible from all camera angles with double-sided materials
- **Performance Optimized**: Efficient torus geometry with proper memory management and render ordering

## 🌌 Asteroid Belt Visualization

The application includes visualization of asteroid belt regions:

- **Main Asteroid Belt**: Located between Mars and Jupiter
- **Kuiper Belt**: Located beyond Neptune's orbit
- **Toggleable Display**: Show or hide belt regions independently
- **Accurate Positioning**: Belts are positioned according to real astronomical data

### Orbital Inclinations

- Mercury: 7.005°
- Venus: 3.395°
- Earth: 0.0° (reference plane)
- Mars: 1.85°
- Jupiter: 1.303°
- Saturn: 2.485°
- Uranus: 0.773°
- Neptune: 1.77°

## 🎨 Planet Textures

The solar system uses high-quality, photorealistic texture images for all celestial bodies:

### Texture Assets

- **Location**: `public/textures/` directory
- **Resolution**: 2048x1024 pixels (2:1 aspect ratio for sphere mapping)
- **Format**: JPG for planets (optimized file size), PNG for rings (with transparency)
- **Sources**: NASA imagery and public domain astronomical textures

### Texture Features

- **Realistic Surface Details**: Earth shows continents and oceans, Mars displays red geological features, gas giants show atmospheric bands
- **Efficient Loading**: Asynchronous texture loading with LRU (Least Recently Used) caching prevents duplicate loads
- **Error Handling**: Graceful fallback to base colors if textures fail to load
- **Memory Management**: Automatic cache cleanup with configurable limits (max 20 textures)
- **Special Materials**: Sun uses emissive material for self-illumination effect
- **Worker-Based Generation**: Texture generation handled in Web Workers for better performance

## 📅 Historical Events

The application includes a comprehensive historical events feature:

- **Event Browser**: Search and filter significant astronomical events throughout history
- **Categories**: Events organized by type (discoveries, missions, observations, etc.)
- **Date Navigation**: Click on events to jump to their dates in the simulation
- **Time Filtering**: Filter events by past, future, or all dates
- **Search Functionality**: Full-text search across event descriptions
- **Sort Options**: Sort events chronologically (ascending or descending)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Set up API key (optional but recommended)
# Get your free API key at: https://api.le-systeme-solaire.net/generatekey.html
cp .env.local.example .env.local
# Edit .env.local and add your API key

# 3. Start development server
pnpm dev
```

> **Note**: Without an API key, the app will use local fallback data. See [API Setup Guide](docs/API_SETUP.md) for detailed instructions.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with UI interface

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

## 🧪 Testing

The project includes comprehensive test coverage:

- **Test Framework**: Vitest with React Testing Library
- **Test Coverage**: Unit tests for utilities, hooks, components, and services
- **Property-Based Testing**: Uses fast-check for comprehensive input validation
- **Run Tests**: Use `pnpm test` for single run, `pnpm test:watch` for development, or `pnpm test:ui` for visual interface

Key test areas:
- Astronomy calculations and orbital mechanics
- Data validation and formatting
- Component rendering and interactions
- API integration and error handling
- Date interpolation and transitions

## Support

If you encounter any issues or have questions:

- Check the [Issues](https://github.com/nguyenthanhan/real-scale-solar-system/issues) page
- Create a new issue with detailed information
- Contact the maintainers for support

---

**Note**: This is an educational tool designed to provide accurate astronomical information. While we strive for scientific accuracy, this simulation is for educational purposes and should not be used for professional astronomical calculations.
