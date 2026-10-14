# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22.23.3-alpine3.24.2@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402

FROM ${NODE_IMAGE} AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

# Build needs devDependencies (tailwind, postcss).
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["npm", "run", "dev"]

FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN npm run build \
 && test -d .next/standalone \
 || (echo "ERROR: .next/standalone missing — check output: 'standalone' in next.config.js" && exit 1)
RUN mkdir -p public

FROM base AS runtime
ARG GIT_SHA=unknown
LABEL org.opencontainers.image.title="salon-frontend" \
      org.opencontainers.image.revision="${GIT_SHA}"
# HOSTNAME=0.0.0.0 so the standalone server listens on all interfaces.
ENV NODE_ENV=production \
    PORT=3001 \
    HOSTNAME=0.0.0.0 \
    GIT_SHA=${GIT_SHA}

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

RUN addgroup -S app && adduser -S -G app app
USER app
EXPOSE 3001
CMD ["node", "server.js"]
