# Dockerfile para deployment
FROM node:20-alpine

# Instalar dependencias del sistema para compilar librerías nativas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg \
    libsodium-dev \
    opus-dev \
    libtool \
    autoconf \
    automake

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Limpiar cache de npm
RUN npm cache clean --force

# Copiar el código
COPY . .

# Comando para iniciar
CMD ["node", "bot.js"]
