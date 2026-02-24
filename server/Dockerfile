# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install OS-level dependencies needed by Prisma + SQLite
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# ─── deps stage: install production dependencies ───────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install --omit=dev

# ─── build stage: compile TypeScript ──────────────────────────────────────
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm install
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./
RUN npx prisma generate
RUN npm run build

# ─── runtime stage: lean production image ─────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

# Copy Prisma client + migration from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Ensure the data directory exists for SQLite persistence (mounted as volume)
RUN mkdir -p ./prisma

# Sync schema and start the server
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]

EXPOSE 3001
