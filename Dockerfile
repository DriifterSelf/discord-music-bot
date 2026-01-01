# Dockerfile para deployment
FROM node:20-alpine

# Instalar dependencias necesarias para discord-player y voice
RUN apk add --no-cache python3 make g++ ffmpeg libsodium-dev opus-dev

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código
COPY . .

# Comando para iniciar
CMD ["node", "bot.js"]
