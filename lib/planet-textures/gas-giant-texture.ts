import * as THREE from "three";

/**
 * Creates a texture for gas giants (Jupiter and Saturn) with horizontal bands
 */
export function createGasGiantTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  // Bands for gas giants
  const numBands = 12;
  const bandHeight = canvas.height / numBands;

  for (let i = 0; i < numBands; i++) {
    // Alternate between darker and lighter bands
    const shade = i % 2 === 0 ? 0.8 : 1.2;
    const baseColor = new THREE.Color(color);
    const r = Math.min(1, baseColor.r * shade);
    const g = Math.min(1, baseColor.g * shade);
    const b = Math.min(1, baseColor.b * shade);

    ctx.fillStyle = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
    ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);
  }
}
