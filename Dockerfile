# ============================================
# Vinext (Next.js API on Vite) — multi-stage Docker build
# ============================================
# Unlike `next build` + `output: "standalone"`, Vinext runs `vinext build` (Vite).
# Production output: dist/client, dist/server — served by `vinext start`.
#
# Node.js: bump NODE_VERSION to the current LTS slim image when you maintain this file.
ARG NODE_VERSION=24.13.0-slim

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build (vinext build)
# ============================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

RUN corepack enable pnpm

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN --mount=type=cache,target=/app/node_modules/.vite \
    pnpm run build

# ============================================
# Stage 3: Run (vinext start → Node prod server)
# ============================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

RUN corepack enable pnpm

ENV NODE_ENV=production
ENV PORT=3000
# vinext start defaults hostname to 0.0.0.0; PORT is respected from env

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

RUN chown -R node:node /app

USER node

EXPOSE 3000

# No curl/wget in -slim; Node has global fetch.
# Accept 2xx–3xx (not only response.ok: 304 and some 3xx are !ok but still healthy).
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.status>=200&&r.status<400?0:1)).catch(()=>process.exit(1))"

CMD ["node", "node_modules/vinext/dist/cli.js", "start"]
