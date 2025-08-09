import * as THREE from "three";

/**
 * Creates a texture for ice giants (Uranus and Neptune) with smooth gradients and subtle bands
 */
export function createIceGiantTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const baseColor = new THREE.Color(color);

  for (let i = 0; i < 5; i++) {
    const position = i / 4;
    const shade = 0.8 + (i % 2) * 0.4;
    const r = Math.min(1, baseColor.r * shade);
    const g = Math.min(1, baseColor.g * shade);
    const b = Math.min(1, baseColor.b * shade);

    gradient.addColorStop(
      position,
      `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}`
    );
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
