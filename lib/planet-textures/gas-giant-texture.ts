import * as THREE from "three";

/**
 * Creates a realistic gas giant texture with atmospheric bands, storms, and cloud patterns
 */
export function createGasGiantTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  // Base color
  const baseColor = new THREE.Color(color);

  // Create atmospheric bands with realistic variations
  const numBands = 15;
  const bandHeight = canvas.height / numBands;

  for (let i = 0; i < numBands; i++) {
    // Create band with natural variations
    const y = i * bandHeight;

    // Band intensity varies with latitude
    const latitude = (i / numBands) * 2 - 1; // -1 to 1
    const intensity = 0.6 + Math.abs(latitude) * 0.4; // Stronger at poles

    // Create gradient within each band
    const gradient = ctx.createLinearGradient(0, y, 0, y + bandHeight);

    // Alternate between darker and lighter bands
    const shade = i % 2 === 0 ? 0.7 : 1.3;
    const r = Math.min(1, baseColor.r * shade * intensity);
    const g = Math.min(1, baseColor.g * shade * intensity);
    const b = Math.min(1, baseColor.b * shade * intensity);

    gradient.addColorStop(0, `rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.8)`);
    gradient.addColorStop(0.5, `rgba(${r * 255}, ${g * 255}, ${b * 255}, 1)`);
    gradient.addColorStop(1, `rgba(${r * 255}, ${g * 255}, ${b * 255}, 0.8)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, canvas.width, bandHeight);
  }

  // Add atmospheric storms and cloud features
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 5 + Math.random() * 20;

    // Storm intensity based on latitude
    const latitude = (y / canvas.height) * 2 - 1;
    const stormIntensity = 0.3 + Math.abs(latitude) * 0.7;

    // Different storm types
    const stormType = Math.random();
    let stormColor;

    if (stormType > 0.8) {
      // Red spots (like Jupiter's Great Red Spot)
      stormColor = `rgba(200, 50, 50, ${stormIntensity})`;
    } else if (stormType > 0.6) {
      // White storms
      stormColor = `rgba(255, 255, 255, ${stormIntensity * 0.5})`;
    } else {
      // Dark storms
      stormColor = `rgba(50, 50, 100, ${stormIntensity})`;
    }

    ctx.fillStyle = stormColor;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add cloud texture variations
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 2 + Math.random() * 6;

    // Cloud opacity varies
    const opacity = 0.1 + Math.random() * 0.3;
    const r = Math.min(1, baseColor.r * (0.8 + Math.random() * 0.4));
    const g = Math.min(1, baseColor.g * (0.8 + Math.random() * 0.4));
    const b = Math.min(1, baseColor.b * (0.8 + Math.random() * 0.4));

    ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add polar regions (darker)
  const polarGradient = ctx.createRadialGradient(
    canvas.width / 2,
    0,
    0,
    canvas.width / 2,
    0,
    canvas.width / 3
  );
  polarGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
  polarGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = polarGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  const southPolarGradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height,
    0,
    canvas.width / 2,
    canvas.height,
    canvas.width / 3
  );
  southPolarGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
  southPolarGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = southPolarGradient;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}
