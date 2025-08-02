# Real Scale Solar System

An immersive, true-to-scale 3D visualization of our solar system with accurate planetary sizes, distances, orbits, and scientific data. Experience the real proportions of our cosmic neighborhood directly in your browser through this educational and scientifically accurate simulation.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/heimers-projects/v0-real-scale-solar-system)
[![Version](https://img.shields.io/badge/version-1.0.4-blue?style=for-the-badge)](https://github.com/nguyenthanhan/real-scale-solar-system)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

## Features

- **True-to-Scale 3D Visualization**: Explore a scientifically accurate model of our solar system with real proportions
- **Real Scale Accuracy**: Planetary sizes and distances at true astronomical proportions
- **Detailed Information Cards**: Access comprehensive data about each celestial body with fun facts
- **Advanced Camera Controls**: Navigate the solar system with intuitive mouse controls
- **Adjustable Simulation Speed**: Control the pace of the simulation from 1x (real-time) to 100,000x with smooth slider control
- **Realistic Planetary Details**: Accurate representation of planet sizes, colors, and features including Saturn's, Jupiter's, Uranus', and Neptune's rings
- **Procedural Textures**: Dynamically generated planet surfaces with realistic variations
- **Responsive Design**: Fully responsive layout that works across devices
- **Star Field Background**: Immersive star field backdrop for a realistic space environment
- **Axial Tilt**: Realistic planetary axial tilts affecting rotation visualization
- **Real Scale Proportions**: Sun dominates the scene as in reality, planets appear as small objects

## Technical Implementation

This project leverages modern web technologies to deliver a performant and visually stunning experience:

- **Next.js 15.2.4**: React framework with App Router providing the foundation
- **React 19**: Latest React version with improved performance and features
- **React Three Fiber 9.1.2**: React renderer for Three.js, enabling declarative 3D scene creation
- **Three.js 0.176.0**: JavaScript 3D library powering the visualization
- **TypeScript 5**: Type-safe code ensuring reliability and better developer experience
- **Tailwind CSS 3.4.17**: Utility-first CSS framework for responsive styling
- **Framer Motion 12.9.2**: Smooth animations and transitions for UI elements
- **Custom React Hooks**: Modular state management and lifecycle control
- **Canvas API**: Procedural texture generation for realistic planet surfaces

## Controls and Interaction

### Mouse Controls

- **Click and Drag**: Orbit around the solar system
- **Scroll**: Zoom in/out with smooth camera movement
- **Right-Click and Drag**: Pan the view

### Interaction

- **Click on any planet or the sun**: View detailed scientific information in a modal
- **Click outside of information cards**: Close the current information panel
- **Speed Control Slider**: Manually adjust simulation speed from 1x to 100,000x with real-time updates
- **Hide/Show Controls**: Double-click the control panel to toggle visibility

## Planet Information

The simulation includes scientifically accurate data for all major celestial bodies in our solar system:

### The Sun

- Central star of our solar system with realistic glow effects
- Procedurally generated surface with sunspots and solar flares
- Real-time rotation and light emission
- Detailed information including temperature, composition, and fun facts

### The Planets

1. **Mercury**: Smallest planet with extreme temperature variations and rocky surface
2. **Venus**: Hottest planet with thick atmospheric pressure and retrograde rotation
3. **Earth**: Our home planet, the only known world with liquid water oceans
4. **Mars**: The Red Planet with the largest dust storms in the solar system
5. **Jupiter**: Largest planet with the famous Great Red Spot and ring system
6. **Saturn**: Known for its spectacular ring system and pale gold appearance
7. **Uranus**: Ice giant with a unique sideways rotation and subtle rings
8. **Neptune**: Windiest planet with speeds reaching 2,100 km/h and ring system

Each celestial body features:

- Realistic orbital periods relative to Earth with elliptical paths
- Accurate rotation speeds with proper axial tilts
- True-to-scale sizes and distances (real astronomical proportions)
- Procedurally generated textures showing surface variations
- Scientific data including diameter, gravity, atmosphere composition, and more
- Dynamic labels that adjust based on camera distance

## Technical Architecture

### Component Structure

- **SolarSystem**: Main 3D scene container with camera and lighting
- **Planet**: Individual planet component with orbital and rotation logic
- **Sun**: Central star with glow effects and light emission
- **Modal Components**: Information display and speed controls
- **Custom Hooks**: Modular logic for movement, materials, and interactions

### Key Features

- **Elliptical Orbits**: Realistic orbital paths with eccentricity calculations
- **Procedural Textures**: Canvas-generated surfaces for each planet type
- **Performance Optimization**: Efficient rendering with proper Three.js practices
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Responsive Design**: Mobile-friendly interface with adaptive controls

## Installation and Setup

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 10.12.4 (recommended) or npm

### Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/real-scale-solar-system.git
   cd real-scale-solar-system
   ```

2. Install dependencies

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
# Build the application
pnpm build
# or
npm run build

# Start the production server
pnpm start
# or
npm start
```

### Release Process

The project uses semantic versioning for releases. To create a new release:

```bash
# Push current changes without version bumping (for manual version updates)
pnpm release

# Release a patch version (bug fixes, small improvements)
pnpm release:patch

# Release a minor version (new features, backward compatible)
pnpm release:minor

# Release a major version (breaking changes)
pnpm release:major
```

The release process will:

- Automatically increment the version number
- Update the CHANGELOG.md with the release date
- Create a git commit and tag
- Push changes to the repository
- Trigger deployment (if configured)
- **Automatically create a GitHub release** with content from CHANGELOG.md

### Automated GitHub Releases

When you create a release using the release commands, the system will:

1. **Create a git tag** with the new version
2. **Trigger GitHub Actions** to automatically create a GitHub release
3. **Extract changelog content** from CHANGELOG.md for that specific version
4. **Create a formatted release** with:
   - Release title and description
   - Changelog content from CHANGELOG.md
   - Links to compare changes
   - Automatic deployment to Vercel

### Manual Changelog Extraction

You can manually extract changelog content for any version:

```bash
# Extract changelog for a specific version
pnpm changelog 1.0.0

# Or use the script directly
node scripts/extract-changelog.js 1.0.0
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm release` - Push current changes without version bumping (for manual version updates)
- `pnpm release:patch` - Release patch version (1.0.0 → 1.0.1)
- `pnpm release:minor` - Release minor version (1.0.0 → 1.1.0)
- `pnpm release:major` - Release major version (1.0.0 → 2.0.0)
- `pnpm changelog <version>` - Extract changelog content for a specific version

## Performance and Browser Compatibility

This application is optimized for modern browsers and requires WebGL support. For the best experience:

- Use Chrome, Firefox, Safari, or Edge (latest versions)
- Ensure WebGL is enabled in your browser
- Recommended: Dedicated graphics card for smoother performance
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

- Check the [Issues](https://github.com/nguyenthanhan/real-scale-solar-system/issues) page
- Create a new issue with detailed information
- Contact the maintainers for support

---

**Note**: This is an educational tool designed to provide accurate astronomical information. While we strive for scientific accuracy, this simulation is for educational purposes and should not be used for professional astronomical calculations.
