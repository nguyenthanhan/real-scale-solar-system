import * as THREE from "three";

/**
 * Creates a texture for rocky planets (Mercury and Venus) with craters
 */
export function createRockyPlanetTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  const baseColor = new THREE.Color(color);

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
}
