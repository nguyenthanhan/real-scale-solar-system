/**
 * Creates a realistic Earth texture with accurate continents, oceans, and atmospheric effects
 */
export function createEarthTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Base ocean color (deep blue)
  ctx.fillStyle = "#0B1426";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add ocean depth variations
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 5 + Math.random() * 15;

    // Deeper areas are darker
    const depth = Math.random();
    const blue = Math.floor(20 + depth * 40);
    const green = Math.floor(10 + depth * 20);

    ctx.fillStyle = `rgba(0, ${green}, ${blue}, 0.3)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add major continents (simplified but recognizable)
  const continents = [
    // North America
    { x: 0.2, y: 0.3, size: 0.25, color: "#4A7C59" },
    // South America
    { x: 0.25, y: 0.6, size: 0.2, color: "#4A7C59" },
    // Europe/Asia
    { x: 0.6, y: 0.25, size: 0.4, color: "#5B8A72" },
    // Africa
    { x: 0.55, y: 0.55, size: 0.25, color: "#4A7C59" },
    // Australia
    { x: 0.8, y: 0.7, size: 0.15, color: "#5B8A72" },
  ];

  continents.forEach((continent) => {
    ctx.fillStyle = continent.color;
    ctx.beginPath();
    const x = continent.x * canvas.width;
    const y = continent.y * canvas.height;
    const size = continent.size * Math.min(canvas.width, canvas.height);

    // Create irregular continent shape
    ctx.moveTo(x, y);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const distance = size * (0.3 + Math.random() * 0.4);
      ctx.lineTo(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance
      );
    }
    ctx.closePath();
    ctx.fill();

    // Add continent detail (mountains, forests)
    for (let i = 0; i < 20; i++) {
      const detailX = x + (Math.random() - 0.5) * size * 0.8;
      const detailY = y + (Math.random() - 0.5) * size * 0.8;
      const detailSize = 2 + Math.random() * 4;

      const detailType = Math.random();
      if (detailType > 0.7) {
        // Mountains (darker)
        ctx.fillStyle = "#2D4A3E";
      } else {
        // Forests (lighter)
        ctx.fillStyle = "#6B9A7A";
      }

      ctx.beginPath();
      ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Add polar ice caps
  ctx.fillStyle = "#E8F4FD";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.12);
  ctx.fillRect(0, canvas.height * 0.88, canvas.width, canvas.height * 0.12);

  // Add atmospheric glow effect
  const atmosphereGradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  atmosphereGradient.addColorStop(0, "rgba(135, 206, 235, 0.1)");
  atmosphereGradient.addColorStop(0.7, "rgba(135, 206, 235, 0.05)");
  atmosphereGradient.addColorStop(1, "rgba(135, 206, 235, 0)");
  ctx.fillStyle = atmosphereGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
