/**
 * Creates a realistic sun texture with gradient, granulation, sunspots, and solar flares
 */
export function createSunTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
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

    ctx.fillStyle = `rgba(255, 255, ${Math.floor(100 * brightness)}, 0.3)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add some darker sunspots
  for (let i = 0; i < 12; i++) {
    // Sunspots tend to appear in bands around the equator
    const y = canvas.height / 2 + (Math.random() * 0.6 - 0.3) * canvas.height;
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
    const x = canvas.width / 2 + Math.cos(angle) * (canvas.width / 2 - 10);
    const y = canvas.height / 2 + Math.sin(angle) * (canvas.height / 2 - 10);

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
}
