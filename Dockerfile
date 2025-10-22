## Dockerfile (Node 22.16.0 + npm) - Debian based to avoid musl/native addon issues
FROM node:22.16.0-slim AS base
WORKDIR /app

# Optionally install OpenSSL (Prisma runtime depends on it)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package*.json ./
# Install with dev deps so prisma CLI is available in runner
RUN npm ci

FROM base AS build
# Reuse node_modules from deps to avoid reinstall
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

FROM base AS runner
USER node
WORKDIR /app
# Production environment for runtime
ENV NODE_ENV=production
# Bring full node_modules (incl. dev) so prisma CLI is present
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
# Bring generated client artifacts
COPY --from=build --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
# Copy app source
COPY --chown=node:node . .
ENV PORT=4000
EXPOSE 4000
CMD sh -c "npx prisma migrate deploy && node server.js"
