# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_TALKS_DIR=/talks
ENV VITE_TALKS_DIR=$VITE_TALKS_DIR
RUN npm run build

# Distroless nodejs runtime, already configured to run as the non-root
# "nonroot" user (uid 65532) — no OS shell, package manager, or root user.
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runtime
WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/server.js ./server.js

ENV PORT=8080
EXPOSE 8080

CMD ["server.js"]
