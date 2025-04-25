# Interactive Solar System

An immersive, interactive 3D visualization of our solar system with realistic planetary orbits, rotations, and scientific data. Experience the beauty of space exploration directly in your browser through this educational and engaging simulation.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/heimers-projects/v0-interactive-solar-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/CaPSeCtgDv6)

## Features

- **Interactive 3D Visualization**: Explore a realistic model of our solar system with accurate celestial positioning
- **Scientific Accuracy**: Planetary orbits and rotations scaled to real astronomical data
- **Detailed Information Cards**: Access comprehensive data about each celestial body
- **Advanced Camera Controls**: Navigate the solar system with intuitive keyboard and mouse controls
- **Adjustable Simulation Speed**: Control the pace of the simulation from 1x (real-time) to 100,000x with steps of 1,000
- **Realistic Planetary Details**: Accurate representation of planet sizes, colors, and features like Saturn's and Uranus' rings
- **Responsive Design**: Fully responsive layout that works across devices
- **Star Field Background**: Immersive star field backdrop for a realistic space environment

## Technical Implementation

This project leverages modern web technologies to deliver a performant and visually stunning experience:

- **Next.js 15.2.4**: React framework providing the foundation of the application
- **React Three Fiber**: React renderer for Three.js, enabling declarative 3D scene creation
- **Three.js**: JavaScript 3D library powering the visualization
- **TypeScript**: Type-safe code ensuring reliability and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive styling
- **React Hooks**: State management and lifecycle control for interactive components

## Controls and Interaction

### Keyboard Navigation

- **W/S**: Move camera forward/backward
- **A/D**: Move camera left/right
- **Q/E**: Decrease/increase simulation speed by 100
- **Toggle Button**: Enable/disable keyboard controls

### Mouse Controls

- **Click and Drag**: Orbit around the solar system
- **Scroll**: Zoom in/out
- **Right-Click and Drag**: Pan the view

### Interaction

- **Click on any planet or the sun**: View detailed scientific information
- **Click outside of information cards**: Close the current information panel
- **Speed Control Slider**: Manually adjust simulation speed from 1x to 100,000x with increments of 100

## Planet Information

The simulation includes scientifically accurate data for all major celestial bodies in our solar system:

### The Sun

- Central star of our solar system
- Real-time visualization with accurate proportions
- Detailed information including temperature, composition, and fun facts

### The Planets

1. **Mercury**: Smallest planet with extreme temperature variations
2. **Venus**: Hottest planet with thick atmospheric pressure
3. **Earth**: Our home planet, the only known world with liquid water oceans
4. **Mars**: The Red Planet with the largest dust storms in the solar system
5. **Jupiter**: Largest planet with the famous Great Red Spot
6. **Saturn**: Known for its spectacular ring system
7. **Uranus**: Ice giant with a unique sideways rotation
8. **Neptune**: Windiest planet with speeds reaching 2,100 km/h

Each celestial body features:

- Realistic orbital periods relative to Earth
- Accurate rotation speeds
- Proportional sizes and distances (scaled for visualization)
- Scientific data including diameter, gravity, atmosphere composition, and more

## Installation and Setup

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm (recommended) or npm

### Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/interactive-solar-system.git
   cd interactive-solar-system
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
- Special thanks to the open-source community for their contributions to the libraries used in this project

## Development and Contributions

This project is open to contributions. Feel free to submit issues and pull requests to help improve the simulation or add new features.

### Future Improvements

- Add dwarf planets (Pluto, Ceres, etc.)
- Implement asteroid belt visualization
- Add moon systems for the outer planets
- Create a timeline feature to observe planetary positions at different dates
