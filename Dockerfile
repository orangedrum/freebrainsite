# ─── Build stage ───────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (uses lockfile for reproducible installs)
COPY package.json package-lock.json* bun.lock* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ─── Production serve stage ────────────────────────────────────
# Serves the static dist/ folder with nginx (tiny, fast)
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback: send all routes to index.html
RUN printf 'server {\n\
  listen 80;\n\
  location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
