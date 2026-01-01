# Dockerfile para deployment
FROM node:20-alpine

# Instalar dependencias del sistema para compilar librerías nativas + yt-dlp
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg \
    libsodium-dev \
    opus-dev \
    libtool \
    autoconf \
    automake \
    yt-dlp

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Limpiar cache de npm
RUN npm cache clean --force

# Copiar el código
COPY . .

# Variables de entorno para discord-player
ENV DP_FORCE_YTDL_MOD="@distube/ytdl-core"

# Comando para iniciar
CMD ["node", "bot.js"]
