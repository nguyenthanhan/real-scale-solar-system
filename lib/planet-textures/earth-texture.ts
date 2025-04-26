/**
 * Creates a texture for Earth with oceans, continents and ice caps
 */
export function createEarthTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Create continents and oceans
  ctx.fillStyle = "#1a4d66";
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
  ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);
}
