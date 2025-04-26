import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControlsProps {
  simulationSpeed: number;
}

export function CameraControls({ simulationSpeed }: CameraControlsProps) {
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      keysPressed.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [simulationSpeed]);

  useFrame(({ camera }) => {
    const baseSpeed = 0.5;
    const moveForward = new THREE.Vector3();
    const moveRight = new THREE.Vector3();
    camera.getWorldDirection(moveForward);
    moveRight.crossVectors(camera.up, moveForward).normalize();
    moveForward.y = 0;
    moveForward.normalize();
    const distanceFromOrigin = camera.position.length();
    const toOrigin = new THREE.Vector3(0, 0, 0)
      .sub(camera.position)
      .normalize();
    const rotationAxisVertical = new THREE.Vector3()
      .crossVectors(toOrigin, camera.up)
      .normalize();
    const rotationAxisHorizontal = camera.up.clone().normalize();
    if (keysPressed.current["w"]) {
      camera.position.applyAxisAngle(
        rotationAxisVertical,
        baseSpeed / distanceFromOrigin
      );
    }
    if (keysPressed.current["s"]) {
      camera.position.applyAxisAngle(
        rotationAxisVertical,
        -baseSpeed / distanceFromOrigin
      );
    }
    if (keysPressed.current["a"]) {
      camera.position.applyAxisAngle(
        rotationAxisHorizontal,
        baseSpeed / distanceFromOrigin
      );
    }
    if (keysPressed.current["d"]) {
      camera.position.applyAxisAngle(
        rotationAxisHorizontal,
        -baseSpeed / distanceFromOrigin
      );
    }
    camera.lookAt(0, 0, 0);
  });

  return null;
}
