# Backend: Node 20 + ffmpeg + yt-dlp (standalone binary, no Python needed)
FROM node:20-slim

# ffmpeg for audio extraction
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl unzip \
    && rm -rf /var/lib/apt/lists/*

# deno: JS runtime required by yt-dlp for YouTube extraction
RUN curl -L https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip -o /tmp/deno.zip \
    && unzip /tmp/deno.zip -d /usr/local/bin \
    && chmod a+rx /usr/local/bin/deno \
    && rm /tmp/deno.zip

# yt-dlp standalone binary (self-updating via latest release)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json ./
RUN npm ci

# Build TypeScript
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/server.js"]
