# Dockerfile (Node 22.16.0 + npm)
FROM node:22.16.0-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate

FROM base AS runner
USER node
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
ENV PORT=4000
EXPOSE 4000
CMD sh -c "npx prisma migrate deploy && node src/server.js"
