# Real Scale Solar System

An immersive, true-to-scale 3D visualization of our solar system with accurate planetary sizes, distances, orbits, and scientific data. Experience the real proportions of our cosmic neighborhood directly in your browser through this educational and scientifically accurate simulation.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/heimers-projects/v0-real-scale-solar-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/CaPSeCtgDv6)

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
- **React Three Fiber**: React renderer for Three.js, enabling declarative 3D scene creation
- **Three.js**: JavaScript 3D library powering the visualization
- **TypeScript**: Type-safe code ensuring reliability and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive styling
- **Framer Motion**: Smooth animations and transitions for UI elements
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
- pnpm (recommended) or npm

### Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/real-scale-solar-system.git
   cd real-scale-solar-system
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
pnpm build
pnpm start
```

## Credits and Attribution

- Initially created with [v0.dev](https://v0.dev) by Vercel
- Astronomical data sourced from NASA's public databases
- 3D visualization powered by Three.js and React Three Fiber
- Procedural textures generated using HTML5 Canvas API
- Special thanks to the open-source community for their contributions to the libraries used in this project

## Development and Contributions

This project is open to contributions. Feel free to submit issues and pull requests to help improve the simulation or add new features.

### Future Improvements

- Add dwarf planets (Pluto, Ceres, etc.)
- Implement asteroid belt visualization
- Add moon systems for the outer planets
- Create a timeline feature to observe planetary positions at different dates
- Enhanced texture generation with more realistic surface details
- Additional camera presets for different viewing angles
- Educational mode with interactive learning elements
