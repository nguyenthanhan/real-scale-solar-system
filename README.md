# Real Scale Solar System 🌌

An immersive, true-to-scale 3D visualization of our solar system with accurate planetary sizes, distances, orbits, and scientific data. Experience the real proportions of our cosmic neighborhood directly in your browser through this educational and scientifically accurate simulation.

> 🚀 **Experience the vastness of space** - See how small Earth really is compared to the Sun, and how far apart the planets actually are in our solar system.

[![Release and Deploy](https://github.com/nguyenthanhan/real-scale-solar-system/workflows/Release%20and%20Deploy/badge.svg)](https://github.com/nguyenthanhan/real-scale-solar-system/actions/workflows/release-and-deploy.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/v0-real-scale-solar-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

## ✨ Features

### 🌟 Core Experience

- **True-to-Scale 3D Visualization**: Explore a scientifically accurate model of our solar system with real proportions
- **Real Scale Accuracy**: Planetary sizes and distances at true astronomical proportions - see how vast space really is!
- **Immersive Star Field**: 10,000+ stars create a realistic space environment
- **Realistic Planetary Details**: Accurate representation of planet sizes, colors, and features including Saturn's, Jupiter's, Uranus', and Neptune's rings
- **3D Planet Models in Modal**: Interactive 3D rotating planet models with realistic textures and axial tilts
- **Realistic Planet Textures**: Procedurally generated surfaces with accurate colors, features, and atmospheric effects

### 🎮 Interactive Controls

- **Advanced Camera Controls**: Navigate the solar system with intuitive mouse controls
- **Extreme Simulation Speed**: Control the pace from 1x (real-time) to 10,000,000x with smooth slider control
- **Real-Time Conversion Display**: See exactly how much real time corresponds to simulation time
- **Click to Explore**: Click on any planet or the Sun for detailed scientific information
- **3D Planet Rotation Control**: Adjust rotation speed in modal from 5 minutes to 24 hours per second
- **Smart Modal Management**: Planet labels automatically hide when viewing detailed information
- **Responsive Design**: Fully responsive layout that works across all devices

### 🔬 Scientific Accuracy

- **Procedural Textures**: Dynamically generated planet surfaces with realistic variations
- **Axial Tilt**: Realistic planetary axial tilts affecting rotation visualization
- **Elliptical Orbits**: True orbital paths with proper eccentricity calculations
- **Real Scale Proportions**: Sun dominates the scene as in reality, planets appear as small objects
- **Accurate Orbital Periods**: Each planet moves at its real orbital speed relative to Earth
- **Realistic Planet Surfaces**: Earth with continents, oceans, and ice caps; Mars with volcanoes and dust storms
- **Gas Giant Atmospheres**: Jupiter and Saturn with atmospheric bands, storms, and cloud patterns
- **Solar Features**: Sun with granulation, sunspots, prominences, and limb darkening

## 🛠️ Technical Implementation

This project leverages cutting-edge web technologies to deliver a performant and visually stunning experience:

### 🎯 Frontend Framework

- **Next.js 15.2.4**: React framework with App Router providing the foundation
- **React 19**: Latest React version with improved performance and features
- **TypeScript 5**: Type-safe code ensuring reliability and better developer experience

### 🌌 3D Graphics & Visualization

- **React Three Fiber 9.1.2**: React renderer for Three.js, enabling declarative 3D scene creation
- **Three.js 0.176.0**: JavaScript 3D library powering the visualization
- **Canvas API**: Procedural texture generation for realistic planet surfaces

### 🎨 Styling & Animation

- **Tailwind CSS 3.4.17**: Utility-first CSS framework for responsive styling
- **Framer Motion 12.9.2**: Smooth animations and transitions for UI elements

### 🏗️ Architecture

- **Custom React Hooks**: Modular state management and lifecycle control
- **Component-Based Design**: Reusable, maintainable code structure
- **Performance Optimized**: Efficient rendering with proper Three.js practices

## 🎮 Controls and Interaction

### 🖱️ Mouse Controls

- **Click and Drag**: Orbit around the solar system
- **Scroll**: Zoom in/out with smooth camera movement
- **Right-Click and Drag**: Pan the view

### 🔍 Interaction

- **Click on any planet or the sun**: View detailed scientific information in a modal with 3D rotating model
- **Click outside of information cards**: Close the current information panel
- **Speed Control Slider**: Manually adjust simulation speed from 1x to 10,000,000x with real-time updates
- **Time Conversion Display**: See how much real time corresponds to simulation time (e.g., "1s = 8.3m • Earth orbit: 0.7 days")
- **Rotation Speed Control**: Adjust 3D planet rotation speed from 5 minutes to 24 hours per second
- **Hide/Show Controls**: Double-click the control panel to toggle visibility
- **Smart UI**: Planet labels automatically hide when viewing detailed information

### 📱 Mobile Support

- **Touch Controls**: Full support for touch devices
- **Responsive Interface**: Optimized for all screen sizes
- **Gesture Support**: Pinch to zoom, swipe to orbit

## 🌍 Planet Information

The simulation includes scientifically accurate data for all major celestial bodies in our solar system:

### ☀️ The Sun

- **Central star** of our solar system with realistic glow effects
- **Procedurally generated surface** with granulation, sunspots, and solar prominences
- **Real-time rotation** synchronized with simulation speed
- **Limb darkening effect** for realistic solar appearance
- **Detailed information** including temperature, composition, and fun facts

### 🪐 The Planets

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

### 🔬 Scientific Data

Each celestial body features:

- **Realistic orbital periods** relative to Earth with elliptical paths
- **Accurate rotation speeds** with proper axial tilts
- **True-to-scale sizes and distances** (real astronomical proportions)
- **Procedurally generated textures** showing surface variations
- **Comprehensive scientific data** including diameter, gravity, atmosphere composition
- **Dynamic labels** that adjust based on camera distance and modal state
- **3D rotation visualization** with accurate axial tilts and rotation directions
- **Realistic surface features** including continents, volcanoes, atmospheric storms

## 🏗️ Technical Architecture

### 🧩 Component Structure

- **SolarSystem**: Main 3D scene container with camera and lighting
- **Planet**: Individual planet component with orbital and rotation logic
- **Sun**: Central star with glow effects and light emission
- **Modal Components**: Information display with 3D planet models and rotation controls
- **Custom Hooks**: Modular logic for movement, materials, and interactions
- **Texture Generators**: Procedural texture creation for realistic planet surfaces

### ⚡ Key Features

- **Elliptical Orbits**: Realistic orbital paths with eccentricity calculations
- **Procedural Textures**: Canvas-generated surfaces for each planet type with realistic features
- **3D Planet Models**: Interactive rotating models in modal with accurate axial tilts
- **Rotation Speed Control**: Adjustable planet rotation speed with context-based state management
- **Performance Optimization**: Efficient rendering with proper Three.js practices
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Responsive Design**: Mobile-friendly interface with adaptive controls

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

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

- Follow TypeScript best practices
- Maintain component reusability
- Add proper documentation for new features
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for scientific data and inspiration
- **Three.js community** for the amazing 3D library
- **React Three Fiber** for seamless React integration
- **Next.js team** for the excellent framework

## 📊 Performance and Browser Compatibility

This application is optimized for modern browsers and requires WebGL support. For the best experience:

- **Recommended browsers**: Chrome, Firefox, Safari, or Edge (latest versions)
- **WebGL support**: Ensure WebGL is enabled in your browser
- **Hardware**: Dedicated graphics card recommended for smoother performance
- **Mobile**: Full support for touch devices with optimized controls

## 🔄 Release Process

The project uses semantic versioning for releases. To create a new release:

```bash
# Push current changes without version bumping
pnpm release

# Release a patch version (bug fixes, small improvements)
pnpm release:patch

# Release a minor version (new features, backward compatible)
pnpm release:minor

# Release a major version (breaking changes)
pnpm release:major
```

### 🚀 Automated GitHub Releases

When you create a release using the release commands, the system will:

1. **Create a git tag** with the new version
2. **Trigger GitHub Actions** to automatically create a GitHub release
3. **Extract changelog content** from CHANGELOG.md for that specific version
4. **Create a formatted release** with:
   - Release title and description
   - Changelog content from CHANGELOG.md
   - Links to compare changes
   - Automatic deployment to Vercel

### 📝 Manual Changelog Extraction

You can manually extract changelog content for any version:

```bash
# Extract changelog for a specific version
pnpm changelog 1.0.0

# Or use the script directly
node scripts/extract-changelog.js 1.0.0
```

- Minimum: 4GB RAM and modern CPU

## Credits and Attribution

- Initially created with [v0.dev](https://v0.dev) by Vercel
- Astronomical data sourced from NASA's public databases
- 3D visualization powered by Three.js and React Three Fiber
- Procedural textures generated using HTML5 Canvas API
- Special thanks to the open-source community for their contributions to the libraries used in this project

## Development and Contributions

This project is open to contributions. Feel free to submit issues and pull requests to help improve the simulation or add new features.

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Future Improvements

- Add dwarf planets (Pluto, Ceres, etc.)
- Implement asteroid belt visualization
- Add moon systems for the outer planets
- Create a timeline feature to observe planetary positions at different dates
- Enhanced texture generation with more realistic surface details
- Additional camera presets for different viewing angles
- Educational mode with interactive learning elements
- VR/AR support for immersive experiences
- Multi-language support for global accessibility
- Real-time weather data integration for Earth
- Enhanced atmospheric effects and cloud systems
- Interactive planet surface exploration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

- Check the [Issues](https://github.com/nguyenthanhan/real-scale-solar-system/issues) page
- Create a new issue with detailed information
- Contact the maintainers for support

---

**Note**: This is an educational tool designed to provide accurate astronomical information. While we strive for scientific accuracy, this simulation is for educational purposes and should not be used for professional astronomical calculations.
