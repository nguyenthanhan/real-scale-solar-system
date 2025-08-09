/**
 * Web Worker for texture generation
 * Moves heavy canvas operations off the main thread to prevent UI freezing
 */

// Message types for worker communication
interface TextureGenerationRequest {
  type: "GENERATE_TEXTURE";
  textureType:
    | "earth"
    | "mars"
    | "gas-giant"
    | "sun"
    | "ice-giant"
    | "rocky-planet";
  width: number;
  height: number;
  color?: string;
  id: string;
}

interface TextureGenerationResponse {
  type: "TEXTURE_GENERATED";
  imageData: ImageBitmap;
  id: string;
}

interface WorkerErrorResponse {
  type: "TEXTURE_ERROR";
  error: string;
  id: string;
}

// Texture generation functions (moved from main thread)
function createEarthTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Base ocean color (deep blue)
  ctx.fillStyle = "#0B1426";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add ocean depth variations (optimized with fewer iterations)
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 5 + Math.random() * 15;

    // Deeper areas are darker
    const depth = Math.random();
    const blue = Math.floor(20 + depth * 40);
    const green = Math.floor(10 + depth * 20);

    ctx.fillStyle = `#00${green.toString(16).padStart(2, "0")}${blue
      .toString(16)
      .padStart(2, "0")}4D`;
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

    // Add continent detail (mountains, forests) - optimized
    for (let i = 0; i < 15; i++) {
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
}

function createMarsTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  // Base reddish surface (Mars regolith)
  ctx.fillStyle = "#CD5C5C";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add surface variations (optimized with fewer iterations)
  for (let i = 0; i < 500; i++) {
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
    const x = feature.x * canvas.width;
    const y = feature.y * canvas.height;
    const size = feature.size * Math.min(canvas.width, canvas.height);

    if (feature.type === "volcano") {
      // Create volcano shape
      ctx.beginPath();
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
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Add dust storm effects (optimized)
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 2 + Math.random() * 6;

    ctx.fillStyle = "#FFE4C466";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add polar ice caps (CO2 and water ice)
  ctx.fillStyle = "#F0F8FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.08);
  ctx.fillRect(0, canvas.height * 0.92, canvas.width, canvas.height * 0.08);
}

function createGasGiantTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color: string
): void {
  // Parse hex color
  function parseHexColor(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
    let r: number, g: number, b: number;

    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
      g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
      b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      b = parseInt(cleanHex.slice(4, 6), 16) / 255;
    } else {
      r = g = b = 0;
    }

    return { r, g, b };
  }

  const baseColor = parseHexColor(color);

  // Create atmospheric bands with realistic variations
  const numBands = 15;
  const bandHeight = canvas.height / numBands;

  for (let i = 0; i < numBands; i++) {
    const y = i * bandHeight;
    const latitude = (i / numBands) * 2 - 1;
    const intensity = 0.6 + Math.abs(latitude) * 0.4;

    const gradient = ctx.createLinearGradient(0, y, 0, y + bandHeight);
    const shade = i % 2 === 0 ? 0.7 : 1.3;
    const r = Math.min(1, baseColor.r * shade * intensity);
    const g = Math.min(1, baseColor.g * shade * intensity);
    const b = Math.min(1, baseColor.b * shade * intensity);

    const colorHex = `#${Math.floor(r * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(g * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(b * 255)
      .toString(16)
      .padStart(2, "0")}`;

    gradient.addColorStop(0, `${colorHex}CC`);
    gradient.addColorStop(0.5, `${colorHex}FF`);
    gradient.addColorStop(1, `${colorHex}CC`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, canvas.width, bandHeight);
  }

  // Add atmospheric storms and cloud features (optimized)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 10 + Math.random() * 30;

    const stormIntensity = Math.random();
    const r = Math.min(1, baseColor.r * (0.5 + stormIntensity * 0.5));
    const g = Math.min(1, baseColor.g * (0.5 + stormIntensity * 0.5));
    const b = Math.min(1, baseColor.b * (0.5 + stormIntensity * 0.5));

    ctx.fillStyle = `#${Math.floor(r * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(g * 255)
      .toString(16)
      .padStart(2, "0")}${Math.floor(b * 255)
      .toString(16)
      .padStart(2, "0")}CC`;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Handle texture generation requests
self.addEventListener(
  "message",
  async (event: MessageEvent<TextureGenerationRequest>) => {
    const { type, textureType, width, height, color, id } = event.data;

    if (type === "GENERATE_TEXTURE") {
      try {
        // Create offscreen canvas for texture generation
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d")!;

        // Generate texture based on type
        switch (textureType) {
          case "earth":
            createEarthTexture(ctx, canvas);
            break;
          case "mars":
            createMarsTexture(ctx, canvas);
            break;
          case "gas-giant":
            if (color) {
              createGasGiantTexture(ctx, canvas, color);
            } else {
              throw new Error("Color required for gas giant texture");
            }
            break;
          default:
            throw new Error(`Unsupported texture type: ${textureType}`);
        }

        // Convert canvas to ImageBitmap for transfer
        const imageBitmap = await canvas.transferToImageBitmap();

        const response: TextureGenerationResponse = {
          type: "TEXTURE_GENERATED",
          imageData: imageBitmap,
          id,
        };

        self.postMessage(response, [imageBitmap]);
      } catch (error) {
        const errorResponse: WorkerErrorResponse = {
          type: "TEXTURE_ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
          id,
        };
        self.postMessage(errorResponse);
      }
    }
  }
);

// Handle worker initialization
self.addEventListener("message", (event: MessageEvent) => {
  if (event.data.type === "INIT_WORKER") {
    self.postMessage({ type: "WORKER_READY" });
  }
});

export type {
  TextureGenerationRequest,
  TextureGenerationResponse,
  WorkerErrorResponse,
};
