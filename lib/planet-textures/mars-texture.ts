/**
 * Creates a texture for Mars with reddish surface, darker regions, and polar caps
 */
export function createMarsTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Create a reddish surface
  ctx.fillStyle = "#c1440e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add darker regions
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = "rgba(100, 30, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      10 + Math.random() * 50,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Add polar caps
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.1);
  ctx.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1);
}
