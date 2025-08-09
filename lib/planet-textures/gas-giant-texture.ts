/**
 * Converts a hex color string to normalized RGB values (0-1)
 * Supports formats: #RGB, #RRGGBB, #RRGGBBAA
 */
function parseHexColor(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  // Handle different hex formats
  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    // #RGB format
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length === 6) {
    // #RRGGBB format
    r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  } else {
    // Default to black if invalid format
    r = g = b = 0;
  }

  return { r, g, b };
}

/**
 * Creates a realistic gas giant texture with atmospheric bands, storms, and cloud patterns
 */
export function createGasGiantTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  // Base color
  const baseColor = parseHexColor(color);

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

    gradient.addColorStop(
      0,
      `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}CC`
    );
    gradient.addColorStop(
      0.5,
      `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}FF`
    );
    gradient.addColorStop(
      1,
      `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}CC`
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, canvas.width, bandHeight);
  }

  // Add atmospheric storms and cloud features (optimized)
  for (let i = 0; i < 30; i++) {
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
      stormColor = `#C83232${Math.floor(stormIntensity * 255)
        .toString(16)
        .padStart(2, "0")}`;
    } else if (stormType > 0.6) {
      // White storms
      stormColor = `#FFFFFF${Math.floor(stormIntensity * 0.5 * 255)
        .toString(16)
        .padStart(2, "0")}`;
    } else {
      // Dark storms
      stormColor = `#323264${Math.floor(stormIntensity * 255)
        .toString(16)
        .padStart(2, "0")}`;
    }

    ctx.fillStyle = stormColor;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add cloud texture variations (optimized)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 2 + Math.random() * 6;

    // Cloud opacity varies
    const opacity = 0.1 + Math.random() * 0.3;
    const r = Math.min(1, baseColor.r * (0.8 + Math.random() * 0.4));
    const g = Math.min(1, baseColor.g * (0.8 + Math.random() * 0.4));
    const b = Math.min(1, baseColor.b * (0.8 + Math.random() * 0.4));

    ctx.fillStyle = `#${Math.floor(r * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(g * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(b * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`;
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
  polarGradient.addColorStop(0, "#0000004D");
  polarGradient.addColorStop(1, "#00000000");
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
  southPolarGradient.addColorStop(0, "#0000004D");
  southPolarGradient.addColorStop(1, "#00000000");
  ctx.fillStyle = southPolarGradient;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}
