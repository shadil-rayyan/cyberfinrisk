# Stage 1: Build
FROM node:20-bookworm-slim AS builder

# Install only what’s needed (build tools for native deps)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libc6-dev \
    build-essential \
    python3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build


# Stage 2: Runtime
FROM node:20-bookworm-slim AS runner

# Add tini (for proper process handling inside containers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tini \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Set non-root user
USER node

# Expose Next.js default port
EXPOSE 3000

# Run with tini to avoid zombie processes
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
