/**
 * Creates a realistic Mars texture with accurate surface features, dust storms, and polar caps
 */
export function createMarsTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Base reddish surface (Mars regolith)
  ctx.fillStyle = "#CD5C5C";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add surface variations (different rock types)
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 3 + Math.random() * 8;

    // Different surface materials
    const materialType = Math.random();
    let color;
    if (materialType > 0.8) {
      // Iron oxide rich areas (darker red)
      color = "#8B0000";
    } else if (materialType > 0.6) {
      // Basalt regions (brownish)
      color = "#8B4513";
    } else if (materialType > 0.4) {
      // Clay deposits (orange)
      color = "#FF6347";
    } else {
      // Dust covered areas (lighter)
      color = "#F4A460";
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add major surface features (simplified)
  const features = [
    // Olympus Mons (large volcano)
    { x: 0.3, y: 0.2, size: 0.15, color: "#8B0000", type: "volcano" },
    // Valles Marineris (canyon system)
    { x: 0.6, y: 0.4, size: 0.2, color: "#654321", type: "canyon" },
    // Hellas Basin (impact crater)
    { x: 0.7, y: 0.7, size: 0.12, color: "#8B4513", type: "crater" },
  ];

  features.forEach((feature) => {
    ctx.fillStyle = feature.color;
    ctx.beginPath();
    const x = feature.x * canvas.width;
    const y = feature.y * canvas.height;
    const size = feature.size * Math.min(canvas.width, canvas.height);

    if (feature.type === "volcano") {
      // Create volcano shape
      ctx.moveTo(x, y);
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        const distance = size * (0.2 + Math.random() * 0.3);
        ctx.lineTo(
          x + Math.cos(angle) * distance,
          y + Math.sin(angle) * distance
        );
      }
      ctx.closePath();
      ctx.fill();
    } else if (feature.type === "canyon") {
      // Create canyon system
      ctx.fillRect(x - size / 2, y - size / 4, size, size / 2);
    } else {
      // Create crater
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Add dust storm effects
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 2 + Math.random() * 6;

    ctx.fillStyle = "rgba(255, 228, 196, 0.4)";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add polar ice caps (CO2 and water ice)
  ctx.fillStyle = "#F0F8FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.08);
  ctx.fillRect(0, canvas.height * 0.92, canvas.width, canvas.height * 0.08);

  // Add atmospheric dust haze
  const dustGradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  dustGradient.addColorStop(0, "rgba(255, 228, 196, 0.1)");
  dustGradient.addColorStop(0.8, "rgba(255, 228, 196, 0.05)");
  dustGradient.addColorStop(1, "rgba(255, 228, 196, 0)");
  ctx.fillStyle = dustGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
