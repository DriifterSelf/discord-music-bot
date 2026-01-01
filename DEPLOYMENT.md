# Guía de Deployment

## Opción 1: Railway.app (Recomendado - MÁS FÁCIL)

### Paso 1: Subir a GitHub
```bash
cd C:\Users\uwu\discord-music-bot
git init
git add .
git commit -m "Initial commit - Music bot"
```

Luego crea un repositorio en GitHub (puede ser privado) y sube el código:
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### Paso 2: Deploy en Railway
1. Ve a https://railway.app/
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio `discord-music-bot`
6. Railway detectará automáticamente que es Node.js

### Paso 3: Configurar Variables
1. En el proyecto, ve a "Variables"
2. Agrega:
   - `DISCORD_TOKEN` = tu token del bot
   - `CLIENT_ID` = tu client ID
3. Click en "Deploy"

**¡LISTO!** El bot estará online 24/7.

---

## Opción 2: Render.com (GRATIS SIEMPRE)

### Paso 1: Subir a GitHub (igual que arriba)

### Paso 2: Deploy en Render
1. Ve a https://render.com/
2. Inicia sesión con GitHub
3. Click en "New +" > "Web Service"
4. Conecta tu repositorio
5. Configuración:
   - Name: `discord-music-bot`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node bot.js`
   - Plan: **Free**

### Paso 3: Variables de Entorno
En "Environment":
- `DISCORD_TOKEN` = tu token
- `CLIENT_ID` = tu client ID

Click en "Create Web Service"

**Nota:** Render free tier se duerme después de 15 min de inactividad, pero los bots de Discord cuentan como "activos" así que estará siempre despierto.

---

## Opción 3: Fly.io (Avanzado pero bueno)

```bash
# Instalar Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login
fly auth login

# Deploy
fly launch
fly secrets set DISCORD_TOKEN="tu_token"
fly secrets set CLIENT_ID="tu_client_id"
fly deploy
```

---

## Si tienes VPS/Hosting con tu dominio

Si tu dominio viene con un VPS o servidor, podemos instalarlo ahí también:

```bash
# Conectar por SSH a tu servidor
ssh usuario@tudominio.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar el repo
git clone https://github.com/TU_USUARIO/discord-music-bot.git
cd discord-music-bot

# Instalar dependencias
npm install

# Configurar .env
nano .env
# (pegar tu token aquí)

# Instalar PM2 para mantenerlo corriendo
sudo npm install -g pm2

# Iniciar el bot
pm2 start bot.js --name music-bot
pm2 save
pm2 startup
```

---

## ¿Cuál elegir?

| Servicio | Pros | Contras |
|----------|------|---------|
| **Railway** | Super fácil, deploy automático desde GitHub | 500h gratis/mes (suficiente) |
| **Render** | 100% gratis siempre | Se duerme a veces (pero bots de Discord no) |
| **Fly.io** | Muy bueno, escalable | Setup un poco más complejo |
| **VPS Propio** | Control total, puedes hacer dashboard web | Requiere mantener servidor |

**Recomendación:** Empieza con Railway, es literalmente 3 clicks después de subir a GitHub.
