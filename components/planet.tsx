"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useLoader, ThreeEvent } from "@react-three/fiber";
import { Sphere, Ring, Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/types/planet-types";

// Define the planet props
interface PlanetProps {
  planet: PlanetData;
  simulationSpeed: number;
  distanceScale: number;
  onClick: (planet: PlanetData) => void;
}

export function Planet({
  planet,
  simulationSpeed,
  distanceScale,
  onClick,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Create a procedural texture with patterns to show rotation
  const planetMaterial = useMemo(() => {
    // Create a canvas for the texture
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Fill with base color
      ctx.fillStyle = planet.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add patterns based on the planet type
      if (planet.name === "Sun") {
        // Create a more realistic sun with proper gradient and solar features
        // Base gradient from center to edge
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        gradient.addColorStop(0, "#FFFF00"); // Bright yellow core
        gradient.addColorStop(0.4, "#FDB813"); // Orange-yellow
        gradient.addColorStop(0.7, "#FF8C00"); // Dark orange
        gradient.addColorStop(1, "#FF4500"); // Red-orange edge
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add solar granulation texture (small cells across surface)
        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = 2 + Math.random() * 4;

          // Distance from center determines brightness
          const dx = x - canvas.width / 2;
          const dy = y - canvas.height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = canvas.width / 2;
          const brightness = 1 - (distance / maxDistance) * 0.5;

          ctx.fillStyle = `rgba(255, 255, ${Math.floor(
            100 * brightness
          )}, 0.3)`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add some darker sunspots
        for (let i = 0; i < 12; i++) {
          // Sunspots tend to appear in bands around the equator
          const y =
            canvas.height / 2 + (Math.random() * 0.6 - 0.3) * canvas.height;
          const x = Math.random() * canvas.width;
          const size = 3 + Math.random() * 10;

          ctx.fillStyle = "rgba(180, 50, 0, 0.6)";
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Add penumbra (lighter region around the dark spot)
          ctx.fillStyle = "rgba(255, 150, 0, 0.4)";
          ctx.beginPath();
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add solar prominences (flares) at the edges
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const x =
            canvas.width / 2 + Math.cos(angle) * (canvas.width / 2 - 10);
          const y =
            canvas.height / 2 + Math.sin(angle) * (canvas.height / 2 - 10);

          ctx.fillStyle = "rgba(255, 200, 50, 0.7)";

          // Create flame-like shape
          ctx.beginPath();
          ctx.moveTo(x, y);

          const flareLength = 20 + Math.random() * 30;
          const flareWidth = 10 + Math.random() * 20;

          const outX = x + Math.cos(angle) * flareLength;
          const outY = y + Math.sin(angle) * flareLength;

          const perpAngle = angle + Math.PI / 2;
          const ctrlX1 =
            x +
            Math.cos(angle) * flareLength * 0.5 +
            Math.cos(perpAngle) * flareWidth;
          const ctrlY1 =
            y +
            Math.sin(angle) * flareLength * 0.5 +
            Math.sin(perpAngle) * flareWidth;

          const ctrlX2 =
            x +
            Math.cos(angle) * flareLength * 0.5 -
            Math.cos(perpAngle) * flareWidth;
          const ctrlY2 =
            y +
            Math.sin(angle) * flareLength * 0.5 -
            Math.sin(perpAngle) * flareWidth;

          ctx.quadraticCurveTo(ctrlX1, ctrlY1, outX, outY);
          ctx.quadraticCurveTo(ctrlX2, ctrlY2, x, y);

          ctx.fill();
        }
      } else if (planet.name === "Jupiter" || planet.name === "Saturn") {
        // Bands for gas giants
        const numBands = 12;
        const bandHeight = canvas.height / numBands;

        for (let i = 0; i < numBands; i++) {
          // Alternate between darker and lighter bands
          const shade = i % 2 === 0 ? 0.8 : 1.2;
          const baseColor = new THREE.Color(planet.color);
          const r = Math.min(1, baseColor.r * shade);
          const g = Math.min(1, baseColor.g * shade);
          const b = Math.min(1, baseColor.b * shade);

          ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
          ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);
        }
      } else if (planet.name === "Earth") {
        // Create continents and oceans
        ctx.fillStyle = "#1a4d66"; // Ocean blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add continents
        ctx.fillStyle = "#2f6a69";
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = 20 + Math.random() * 60;

          ctx.moveTo(x, y);
          // Create irregular continent shape
          for (let j = 0; j < 8; j++) {
            const angle = (j * Math.PI) / 4;
            const distance = size * (0.5 + Math.random() * 0.5);
            ctx.lineTo(
              x + Math.cos(angle) * distance,
              y + Math.sin(angle) * distance
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        // Add ice caps
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.15);
        ctx.fillRect(
          0,
          canvas.height * 0.85,
          canvas.width,
          canvas.height * 0.15
        );
      } else if (planet.name === "Mars") {
        // Create a reddish surface with craters
        ctx.fillStyle = "#c1440e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add darker regions
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = "rgba(100, 30, 0, 0.3)";
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            10 + Math.random() * 50,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Add polar caps
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.1);
        ctx.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1);
      } else if (planet.name === "Mercury" || planet.name === "Venus") {
        // Create a cratered surface
        const baseColor = new THREE.Color(planet.color);

        // Add craters
        for (let i = 0; i < 50; i++) {
          const shade = 0.7 + Math.random() * 0.6;
          const r = Math.min(1, baseColor.r * shade);
          const g = Math.min(1, baseColor.g * shade);
          const b = Math.min(1, baseColor.b * shade);

          ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2 + Math.random() * 8,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      } else if (planet.name === "Uranus" || planet.name === "Neptune") {
        // Create a smooth gradient with subtle bands
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const baseColor = new THREE.Color(planet.color);

        for (let i = 0; i < 5; i++) {
          const position = i / 4;
          const shade = 0.8 + (i % 2) * 0.4;
          const r = Math.min(1, baseColor.r * shade);
          const g = Math.min(1, baseColor.g * shade);
          const b = Math.min(1, baseColor.b * shade);

          gradient.addColorStop(
            position,
            `rgb(${r * 255}, ${g * 255}, ${b * 255})`
          );
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.6,
    });
  }, [planet.name, planet.color]);

  // Refs to store current position and angle
  const currentAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastSpeedRef = useRef(simulationSpeed);

  // Basic coefficient to adjust the overall simulation speed
  // Increased to ensure visible movement even at lower simulation speeds
  const baseSpeed = 0.00005; // Increased from 0.0000005 to ensure planets move visibly

  // compute scaled distance from realDistance
  const scaledDistance = planet.realDistance * distanceScale;
  const scaledSize = planet.size * distanceScale;

  // Create elliptical orbit path once
  const orbitCurve = useMemo(() => {
    return new THREE.EllipseCurve(
      0,
      0, // Center x, y
      scaledDistance,
      scaledDistance * 0.95, // xRadius, yRadius
      0,
      2 * Math.PI, // Start angle, end angle
      false, // Clockwise
      0 // Rotation
    );
  }, [scaledDistance]);

  // Update position when speed changes
  useEffect(() => {
    // Store the new speed
    lastSpeedRef.current = simulationSpeed;
  }, [simulationSpeed]);

  // Calculate the position based on time and simulation speed
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastTimeRef.current;
    lastTimeRef.current = elapsedTime;

    // Calculate the position on the orbit
    if (orbitRef.current) {
      // When simulationSpeed = 0, planet will pause
      if (simulationSpeed === 0) {
        // Keep current position
      } else {
        // Check if orbitSpeed is properly applied - this should use the planet's specific orbit speed
        const angleIncrement =
          (deltaTime * simulationSpeed * baseSpeed) / planet.orbitSpeed;

        // Update current angle
        currentAngleRef.current =
          (currentAngleRef.current + angleIncrement) % (2 * Math.PI);

        // Get position on the elliptical curve
        const position = orbitCurve.getPoint(
          currentAngleRef.current / (2 * Math.PI)
        );

        // Update planet position directly
        orbitRef.current.position.x = position.x;
        orbitRef.current.position.z = position.y; // y from curve maps to z in 3D
      }
    }

    // Update planet rotation around its axis
    if (planetRef.current) {
      // Check if rotationSpeed is properly used - this should use the planet's specific rotation speed
      const rotationSpeed =
        simulationSpeed === 0 ? 0.0001 : simulationSpeed * baseSpeed * 0.5;
      planetRef.current.rotation.y +=
        (0.01 / planet.rotationSpeed) * rotationSpeed;
    }
  });

  // Create orbit path visualization
  const orbitPath = useMemo(() => {
    const points = orbitCurve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    return (
      <primitive
        object={
          new THREE.LineLoop(
            geometry,
            new THREE.LineBasicMaterial({
              color: "#666666",
              opacity: 0.5,
              transparent: true,
            })
          )
        }
      />
    );
  }, [orbitCurve]);

  // Handle planet click with proper event propagation
  const handlePlanetClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(planet);
  };

  return (
    <>
      {/* Orbit path */}
      {orbitPath}

      {/* Planet group */}
      <group ref={orbitRef} position={[scaledDistance, 0, 0]}>
        {/* Planet */}
        <Sphere
          ref={planetRef}
          args={[scaledSize, 32, 32]}
          onClick={handlePlanetClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <primitive object={planetMaterial} attach="material" />
        </Sphere>

        {planet.hasRings && (
          <>
            <Ring
              args={[scaledSize * 1.4, scaledSize * 2.2, 64]}
              rotation={[Math.PI / 2, planet.ringTilt || 0, 0]}
            >
              <meshStandardMaterial
                color={planet.ringColor || "#CDCDCD"}
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
                metalness={0.3}
                roughness={0.7}
              />
            </Ring>
          </>
        )}

        {["Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(
          planet.name
        ) ? (
          <Html
            position={[0, scaledSize + 0.5, 0]}
            style={{ pointerEvents: "none" }}
            center
          >
            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {planet.name}
            </div>
          </Html>
        ) : (
          hovered && (
            <Html style={{ pointerEvents: "none" }}>
              <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                {planet.name}
              </div>
            </Html>
          )
        )}
      </group>
    </>
  );
}
