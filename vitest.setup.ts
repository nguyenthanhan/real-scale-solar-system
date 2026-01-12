/**
 * Vitest setup file
 * Provides polyfills and global setup for tests
 */

import "@testing-library/jest-dom/vitest";

// Polyfill for ResizeObserver (required by @react-three/fiber)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock HTMLCanvasElement.getContext for Three.js
const mock2DContext = {
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({
    data: new Array(4),
  }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fillText: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  rect: () => {},
  clip: () => {},
} as unknown as CanvasRenderingContext2D;

HTMLCanvasElement.prototype.getContext = function (contextId: string) {
  if (contextId === "2d") {
    return mock2DContext;
  }
  if (contextId === "webgl" || contextId === "webgl2") {
    return {
      getExtension: () => null,
      getParameter: () => null,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      useProgram: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enable: () => {},
      viewport: () => {},
      clear: () => {},
      clearColor: () => {},
      getUniformLocation: () => ({}),
      uniform1i: () => {},
      uniform1f: () => {},
      uniform2f: () => {},
      uniform3f: () => {},
      uniform4f: () => {},
      uniformMatrix4fv: () => {},
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      generateMipmap: () => {},
      activeTexture: () => {},
      drawArrays: () => {},
      drawElements: () => {},
      getAttribLocation: () => 0,
      vertexAttribPointer: () => {},
      enableVertexAttribArray: () => {},
      canvas: {},
    } as unknown as WebGLRenderingContext;
  }
  return null;
} as unknown;
