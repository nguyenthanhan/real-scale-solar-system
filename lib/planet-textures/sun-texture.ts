/**
 * Creates a realistic sun texture with gradient, granulation, sunspots, and solar flares
 */
export function createSunTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Base gradient from center to edge (more realistic solar colors)
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0, "#FFFFFF"); // Pure white core (hottest)
  gradient.addColorStop(0.2, "#FFFF80"); // Bright yellow
  gradient.addColorStop(0.4, "#FFD700"); // Golden yellow
  gradient.addColorStop(0.6, "#FF8C00"); // Dark orange
  gradient.addColorStop(0.8, "#FF4500"); // Red-orange
  gradient.addColorStop(1, "#8B0000"); // Dark red edge (coolest)
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add solar granulation (convection cells) - more realistic pattern
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 1 + Math.random() * 3;

    // Distance from center determines brightness and color
    const dx = x - canvas.width / 2;
    const dy = y - canvas.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = canvas.width / 2;
    const normalizedDistance = distance / maxDistance;

    // Brighter granules in center, darker at edges
    const brightness = 0.8 + (1 - normalizedDistance) * 0.4;
    const red = Math.floor(255 * brightness);
    const green = Math.floor(200 * brightness);
    const blue = Math.floor(50 * brightness);

    ctx.fillStyle = `#${red.toString(16).padStart(2, "0")}${green
      .toString(16)
      .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}66`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add sunspots (more realistic distribution and appearance)
  for (let i = 0; i < 15; i++) {
    // Sunspots appear in bands around the equator (solar latitude ±30°)
    const y = canvas.height / 2 + (Math.random() * 0.4 - 0.2) * canvas.height;
    const x = Math.random() * canvas.width;
    const size = 2 + Math.random() * 8;

    // Dark umbra (core of sunspot)
    ctx.fillStyle = "#321400CC";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Penumbra (lighter region around the dark spot)
    ctx.fillStyle = "#96500080";
    ctx.beginPath();
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Sometimes add smaller spots nearby (sunspot groups)
    if (Math.random() > 0.7) {
      const offsetX = x + (Math.random() - 0.5) * 20;
      const offsetY = y + (Math.random() - 0.5) * 20;
      const smallSize = 1 + Math.random() * 3;

      ctx.fillStyle = "#32140099";
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, smallSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Add solar prominences and flares (more realistic)
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const x = canvas.width / 2 + Math.cos(angle) * (canvas.width / 2 - 15);
    const y = canvas.height / 2 + Math.sin(angle) * (canvas.height / 2 - 15);

    // Different types of prominences
    const prominenceType = Math.random();

    if (prominenceType > 0.7) {
      // Large prominence
      ctx.fillStyle = "#FF6432CC";
      const flareLength = 30 + Math.random() * 40;
      const flareWidth = 15 + Math.random() * 25;

      ctx.beginPath();
      ctx.moveTo(x, y);
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
    } else {
      // Smaller flare
      ctx.fillStyle = "#FFC86499";
      const flareLength = 10 + Math.random() * 20;
      const flareWidth = 5 + Math.random() * 10;

      ctx.beginPath();
      ctx.moveTo(x, y);
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
  }

  // Add subtle limb darkening effect (darker at edges)
  const limbGradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  limbGradient.addColorStop(0, "#00000000");
  limbGradient.addColorStop(0.7, "#00000000");
  limbGradient.addColorStop(1, "#0000004D");
  ctx.fillStyle = limbGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
