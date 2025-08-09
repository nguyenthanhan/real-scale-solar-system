/**
 * Web Worker for texture generation
 * Moves heavy canvas operations off the main thread to prevent UI freezing
 */

// Message types for worker communication
interface BaseTextureGenerationRequest {
  type: "GENERATE_TEXTURE";
  width: number;
  height: number;
  id: string;
}

interface TextureGenerationRequestWithoutColor
  extends BaseTextureGenerationRequest {
  textureType: "earth" | "mars" | "sun";
}

interface TextureGenerationRequestWithColor
  extends BaseTextureGenerationRequest {
  textureType: "gas-giant" | "ice-giant" | "rocky-planet";
  color: string;
}

type TextureGenerationRequest =
  | TextureGenerationRequestWithoutColor
  | TextureGenerationRequestWithColor;

interface InitWorkerRequest {
  type: "INIT_WORKER";
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

type WorkerRequest = TextureGenerationRequest | InitWorkerRequest;

// Error handling utilities
function handleCanvasError(operation: string, error: unknown): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new Error(`Canvas operation failed (${operation}): ${errorMessage}`);
}

function validateCanvasContext(
  ctx: OffscreenCanvasRenderingContext2D,
  operation: string
): void {
  if (!ctx) {
    throw new Error(`Invalid canvas context for operation: ${operation}`);
  }
}

function validateCanvasDimensions(canvas: OffscreenCanvas): void {
  if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
    throw new Error(
      `Invalid canvas dimensions: ${canvas?.width}x${canvas?.height}`
    );
  }

  // Validate that dimensions are integers to prevent silent flooring
  if (!Number.isInteger(canvas.width) || !Number.isInteger(canvas.height)) {
    throw new Error(
      `Canvas dimensions must be integers: ${canvas.width}x${canvas.height}`
    );
  }
}

// Enhanced color parser that supports multiple formats
function parseColor(color: string): { r: number; g: number; b: number } {
  if (!color || typeof color !== "string") {
    throw new Error("Invalid color parameter");
  }

  const trimmedColor = color.trim().toLowerCase();

  // Handle hex colors (with or without #)
  if (trimmedColor.startsWith("#")) {
    // Strict validation for hex colors with #: exactly 3 or 6 valid hex digits
    if (
      /^#[0-9a-f]{3}$/i.test(trimmedColor) ||
      /^#[0-9a-f]{6}$/i.test(trimmedColor)
    ) {
      return parseHexColor(trimmedColor);
    }
  } else if (
    /^[0-9a-f]{3}$/i.test(trimmedColor) ||
    /^[0-9a-f]{6}$/i.test(trimmedColor)
  ) {
    // Strict validation for hex colors without #: exactly 3 or 6 valid hex digits
    return parseHexColor(trimmedColor);
  }

  // Handle rgb() format
  const rgbMatch = trimmedColor.match(
    /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return {
      r: Math.min(255, Math.max(0, parseInt(r))) / 255,
      g: Math.min(255, Math.max(0, parseInt(g))) / 255,
      b: Math.min(255, Math.max(0, parseInt(b))) / 255,
    };
  }

  // Handle rgba() format (ignore alpha)
  const rgbaMatch = trimmedColor.match(
    /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)$/
  );
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return {
      r: Math.min(255, Math.max(0, parseInt(r))) / 255,
      g: Math.min(255, Math.max(0, parseInt(g))) / 255,
      b: Math.min(255, Math.max(0, parseInt(b))) / 255,
    };
  }

  // Handle named colors
  const namedColors: Record<string, string> = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    black: "#000000",
    white: "#ffffff",
    gray: "#808080",
    grey: "#808080",
    orange: "#ffa500",
    purple: "#800080",
    brown: "#a52a2a",
    pink: "#ffc0cb",
    navy: "#000080",
    teal: "#008080",
    lime: "#00ff00",
    olive: "#808000",
    maroon: "#800000",
    silver: "#c0c0c0",
  };

  if (namedColors[trimmedColor]) {
    return parseHexColor(namedColors[trimmedColor]);
  }

  throw new Error(
    `Unsupported color format: ${color}. Supported formats: hex (#fff, #ffffff), rgb(r,g,b), rgba(r,g,b,a), or named colors.`
  );
}

// Texture generation functions (moved from main thread)
function createEarthTexture(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas
): void {
  try {
    validateCanvasContext(ctx, "createEarthTexture");
    validateCanvasDimensions(canvas);

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
  } catch (error) {
    handleCanvasError("createEarthTexture", error);
  }
}

function createMarsTexture(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas
): void {
  try {
    validateCanvasContext(ctx, "createMarsTexture");
    validateCanvasDimensions(canvas);

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
  } catch (error) {
    handleCanvasError("createMarsTexture", error);
  }
}

function createGasGiantTexture(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  color: string
): void {
  try {
    validateCanvasContext(ctx, "createGasGiantTexture");
    validateCanvasDimensions(canvas);

    const baseColor = parseColor(color);

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
  } catch (error) {
    handleCanvasError("createGasGiantTexture", error);
  }
}

// Helper function to parse hex color to RGB values
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

// Create sun texture with gradient, granulation, sunspots, and solar flares
function createSunTexture(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas
): void {
  try {
    validateCanvasContext(ctx, "createSunTexture");
    validateCanvasDimensions(canvas);

    // Base gradient from center to edge (more realistic solar colors)
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width, canvas.height) / 2
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
      const maxDistance = Math.min(canvas.width, canvas.height) / 2;
      const normalizedDistance = distance / maxDistance;

      // Brighter granules in center, darker at edges
      const brightness = Math.min(1.0, 0.8 + (1 - normalizedDistance) * 0.4);
      const red = Math.min(255, Math.floor(255 * brightness));
      const green = Math.min(255, Math.floor(200 * brightness));
      const blue = Math.min(255, Math.floor(50 * brightness));

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
      Math.min(canvas.width, canvas.height) / 2
    );
    limbGradient.addColorStop(0, "#00000000");
    limbGradient.addColorStop(0.7, "#00000000");
    limbGradient.addColorStop(1, "#0000004D");
    ctx.fillStyle = limbGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } catch (error) {
    handleCanvasError("createSunTexture", error);
  }
}

// Create ice giant texture (Uranus, Neptune)
function createIceGiantTexture(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  color: string
): void {
  try {
    validateCanvasContext(ctx, "createIceGiantTexture");
    validateCanvasDimensions(canvas);

    // Parse the base color
    const baseColor = parseColor(color);

    // Fill with base color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add atmospheric bands (subtle for ice giants)
    for (let i = 0; i < 8; i++) {
      const y = (i / 8) * canvas.height;
      const height = canvas.height / 8;

      // Vary the color slightly for each band
      const variation = (Math.random() - 0.5) * 0.3;
      const r = Math.max(0, Math.min(1, baseColor.r + variation));
      const g = Math.max(0, Math.min(1, baseColor.g + variation));
      const b = Math.max(0, Math.min(1, baseColor.b + variation));

      ctx.fillStyle = `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}`;

      ctx.fillRect(0, y, canvas.width, height);
    }

    // Add subtle atmospheric features
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 2 + Math.random() * 6;

      const variation = (Math.random() - 0.5) * 0.2;
      const r = Math.max(0, Math.min(1, baseColor.r + variation));
      const g = Math.max(0, Math.min(1, baseColor.g + variation));
      const b = Math.max(0, Math.min(1, baseColor.b + variation));

      ctx.fillStyle = `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}80`;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  } catch (error) {
    handleCanvasError("createIceGiantTexture", error);
  }
}

// Create rocky planet texture (Mercury, Venus)
function createRockyPlanetTexture(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  color: string
): void {
  try {
    validateCanvasContext(ctx, "createRockyPlanetTexture");
    validateCanvasDimensions(canvas);

    // Parse the base color
    const baseColor = parseColor(color);

    // Fill with base color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add surface features (craters, mountains, plains)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 1 + Math.random() * 8;

      // Different types of surface features
      const featureType = Math.random();

      if (featureType > 0.8) {
        // Craters (darker)
        const darkVariation = -0.3 - Math.random() * 0.2;
        const r = Math.max(0, Math.min(1, baseColor.r + darkVariation));
        const g = Math.max(0, Math.min(1, baseColor.g + darkVariation));
        const b = Math.max(0, Math.min(1, baseColor.b + darkVariation));

        ctx.fillStyle = `#${Math.floor(r * 255)
          .toString(16)
          .padStart(2, "0")}${Math.floor(g * 255)
          .toString(16)
          .padStart(2, "0")}${Math.floor(b * 255)
          .toString(16)
          .padStart(2, "0")}`;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (featureType > 0.6) {
        // Mountains (lighter)
        const lightVariation = 0.1 + Math.random() * 0.2;
        const r = Math.max(0, Math.min(1, baseColor.r + lightVariation));
        const g = Math.max(0, Math.min(1, baseColor.g + lightVariation));
        const b = Math.max(0, Math.min(1, baseColor.b + lightVariation));

        ctx.fillStyle = `#${Math.floor(r * 255)
          .toString(16)
          .padStart(2, "0")}${Math.floor(g * 255)
          .toString(16)
          .padStart(2, "0")}${Math.floor(b * 255)
          .toString(16)
          .padStart(2, "0")}`;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Plains (subtle variation)
        const variation = (Math.random() - 0.5) * 0.1;
        const r = Math.max(0, Math.min(1, baseColor.r + variation));
        const g = Math.max(0, Math.min(1, baseColor.g + variation));
        const b = Math.max(0, Math.min(1, baseColor.b + variation));

        ctx.fillStyle = `#${Math.floor(r * 255)
          .toString(16)
          .padStart(2, "0")}${Math.floor(g * 255)
          .toString(16)
          .padStart(2, "0")}${Math.floor(b * 255)
          .toString(16)
          .padStart(2, "0")}80`;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } catch (error) {
    handleCanvasError("createRockyPlanetTexture", error);
  }
}

// Handle all worker messages
self.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  try {
    const { type } = event.data;

    switch (type) {
      case "GENERATE_TEXTURE": {
        const { textureType, width, height, id } = event.data;

        // Validate input parameters
        if (!width || !height || width <= 0 || height <= 0) {
          throw new Error(`Invalid dimensions: ${width}x${height}`);
        }

        // Validate that dimensions are integers to prevent silent flooring
        if (!Number.isInteger(width) || !Number.isInteger(height)) {
          throw new Error(`Dimensions must be integers: ${width}x${height}`);
        }

        if (width > 4096 || height > 4096) {
          throw new Error(
            `Dimensions too large: ${width}x${height} (max: 4096x4096)`
          );
        }

        // Create offscreen canvas for texture generation
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        // Generate texture based on type
        switch (textureType) {
          case "earth":
            createEarthTexture(ctx, canvas);
            break;
          case "mars":
            createMarsTexture(ctx, canvas);
            break;
          case "sun":
            createSunTexture(ctx, canvas);
            break;
          case "gas-giant":
          case "ice-giant":
          case "rocky-planet": {
            // TypeScript now ensures color exists for these texture types
            const { color } = event.data as TextureGenerationRequestWithColor;
            switch (textureType) {
              case "gas-giant":
                createGasGiantTexture(ctx, canvas, color);
                break;
              case "ice-giant":
                createIceGiantTexture(ctx, canvas, color);
                break;
              case "rocky-planet":
                createRockyPlanetTexture(ctx, canvas, color);
                break;
            }
            break;
          }
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

        self.postMessage(response, { transfer: [imageBitmap] });
        break;
      }

      case "INIT_WORKER":
        self.postMessage({ type: "WORKER_READY" });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    const errorResponse: WorkerErrorResponse = {
      type: "TEXTURE_ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      id: "id" in event.data ? event.data.id : "unknown",
    };
    self.postMessage(errorResponse);
  }
});

export type {
  TextureGenerationRequest,
  InitWorkerRequest,
  WorkerRequest,
  TextureGenerationResponse,
  WorkerErrorResponse,
};
