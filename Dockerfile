# Backend: Node 20 + ffmpeg + yt-dlp (standalone binary, no Python needed)
FROM node:20-slim

# ffmpeg for audio extraction
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

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
