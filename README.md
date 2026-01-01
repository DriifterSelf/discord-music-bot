<div align="center">

# 🎵 Cyberpunk Music Bot

### *Discord bot de música sin anuncios con temática cyberpunk*

[![GitHub Stars](https://img.shields.io/github/stars/DriifterSelf/discord-music-bot?style=for-the-badge&logo=github&color=ff00ff)](https://github.com/DriifterSelf/discord-music-bot/stargazers)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-7289da?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/DriifterSelf/discord-music-bot?style=for-the-badge&color=00ff9f)](./LICENSE)

[![Deploy on Railway](https://img.shields.io/badge/Deploy%20on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/new/template?template=https://github.com/DriifterSelf/discord-music-bot)
[![Deploy on Render](https://img.shields.io/badge/Deploy%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=00FF9F&center=true&vCenter=true&width=600&lines=Bot+de+m%C3%BAsica+sin+anuncios;YouTube+%2B+YouTube+Music;100%25+Gratis+y+Open+Source;Deploy+24%2F7+incluido" alt="Typing SVG" />

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎧 Audio de Calidad
- Extracción directa desde YouTube/YT Music
- **Sin anuncios** - ni uno solo
- Calidad de audio optimizada
- Soporte para playlists completas

</td>
<td width="50%">

### ⚡ Rendimiento
- Respuesta instantánea
- Cola de reproducción eficiente
- Auto-reconexión
- Bajo uso de recursos

</td>
</tr>
<tr>
<td width="50%">

### 🎮 Fácil de Usar
- Comandos simples e intuitivos
- Embeds visuales cyberpunk
- Búsqueda por nombre o URL
- Control completo del reproductor

</td>
<td width="50%">

### 🚀 Deploy Fácil
- Deploy con 1 click en Railway/Render
- Configuración en menos de 5 minutos
- Hosting gratuito 24/7
- Actualización automática desde GitHub

</td>
</tr>
</table>

---

## 🎯 Comandos

```yaml
🎵 Reproducción:
  !play <canción/URL>  # Reproduce música de YouTube o YT Music
  !skip               # Salta a la siguiente canción
  !stop               # Detiene y limpia la cola
  !pause              # Pausa la reproducción
  !resume             # Reanuda la música

📜 Información:
  !queue              # Muestra las próximas canciones
  !np                 # Canción reproduciéndose actualmente
  !help               # Lista completa de comandos

🔊 Control:
  !volume <0-100>     # Ajusta el volumen
```

---

## 🚀 Quick Start

### Opción 1️⃣: Deploy Instantáneo (Recomendado)

<div align="center">

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/DriifterSelf/discord-music-bot)

**O manualmente:**

</div>

1. **Fork este repositorio**
2. **Crea tu bot en Discord:**
   - Ve a [Discord Developer Portal](https://discord.com/developers/applications)
   - Click en **New Application** → Dale un nombre
   - Pestaña **Bot** → **Add Bot**
   - ⚠️ **Activa estos 3 intents:**
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent
   - Copia el **TOKEN**
3. **Deploy en Railway:**
   - Login en [Railway.app](https://railway.app) con GitHub
   - **New Project** → **Deploy from GitHub**
   - Selecciona tu fork
   - En **Variables**, agrega:
     - `DISCORD_TOKEN` = tu token
     - `CLIENT_ID` = tu client ID
4. **Invita el bot:**
   - En Discord Developer Portal → **OAuth2** → **URL Generator**
   - Marca: `bot`
   - Permisos: `Send Messages`, `Connect`, `Speak`
   - Abre la URL generada

### Opción 2️⃣: Local (Para desarrollo)

```bash
# 1. Clona el repositorio
git clone https://github.com/DriifterSelf/discord-music-bot.git
cd discord-music-bot

# 2. Instala dependencias
npm install

# 3. Configura las variables
cp .env.example .env
# Edita .env con tu token

# 4. Ejecuta el bot
npm start
```

---

## 📦 Stack Tecnológico

<div align="center">

| Librería | Versión | Propósito |
|----------|---------|-----------|
| ![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white) | `^14.14.1` | Framework de Discord |
| ![Discord Player](https://img.shields.io/badge/discord--player-v6-FF69B4?style=flat-square) | `^6.6.7` | Sistema de música |
| ![YouTube](https://img.shields.io/badge/youtubei-extractor-FF0000?style=flat-square&logo=youtube&logoColor=white) | `^4.4.7` | Extracción de audio |
| ![Node.js](https://img.shields.io/badge/node.js-20+-339933?style=flat-square&logo=node.js) | `20+` | Runtime |

</div>

---

## 🎨 Preview

<div align="center">

### Embed de "Reproduciendo"
<img src="https://via.placeholder.com/500x200/0a0a0a/00ff9f?text=%F0%9F%8E%B5+Reproduciendo%0A%0ACancion+-+Artista" alt="Playing embed preview" />

### Cola de reproducción
<img src="https://via.placeholder.com/500x250/0a0a0a/00ff9f?text=%F0%9F%93%9C+Cola+de+reproducci%C3%B3n%0A%0A1.+Cancion+1%0A2.+Cancion+2%0A3.+Cancion+3" alt="Queue preview" />

</div>

---

## 🛠️ Configuración Avanzada

<details>
<summary><b>⚙️ Variables de Entorno</b></summary>

```env
# Requeridas
DISCORD_TOKEN=tu_token_aqui        # Token del bot
CLIENT_ID=tu_client_id_aqui        # Client ID de la aplicación

# Opcionales (próximamente)
SPOTIFY_CLIENT_ID=                 # Para integración con Spotify
SPOTIFY_CLIENT_SECRET=             # Para integración con Spotify
```

</details>

<details>
<summary><b>🐳 Docker</b></summary>

```bash
# Build
docker build -t music-bot .

# Run
docker run -d \
  -e DISCORD_TOKEN="tu_token" \
  -e CLIENT_ID="tu_client_id" \
  --name music-bot \
  music-bot
```

</details>

<details>
<summary><b>🔧 Personalización</b></summary>

**Cambiar el color de los embeds:**
```javascript
// En bot.js, busca:
.setColor('#00ff9f')  // Verde cyberpunk
// Cambia a tu color favorito
```

**Cambiar el prefijo de comandos:**
```javascript
// En bot.js, busca:
if (!message.content.startsWith('!')) return;
// Cambia '!' por tu prefijo preferido
```

</details>

---

## 🤝 Contribuir

¿Encontraste un bug o tienes una idea? ¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📝 To-Do

- [ ] Integración con Spotify
- [ ] Sistema de favoritos por usuario
- [ ] Comandos slash (/)
- [ ] Panel web de control
- [ ] Sistema de DJ roles
- [ ] Ecualizador personalizable
- [ ] Letras de canciones en tiempo real
- [ ] Integración con Helldivers 2 API

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

---

## ⭐ Agradecimientos

- [discord.js](https://discord.js.org/) - Framework de Discord
- [discord-player](https://discord-player.js.org/) - Sistema de música
- Comunidad de Discord

---

<div align="center">

### 💜 Hecho con amor y cafeína

Si te gusta este proyecto, considera darle una ⭐

[![GitHub Stars](https://img.shields.io/github/stars/DriifterSelf/discord-music-bot?style=social)](https://github.com/DriifterSelf/discord-music-bot/stargazers)

**[📚 Documentación](./DEPLOYMENT.md)** • **[🐛 Reportar Bug](https://github.com/DriifterSelf/discord-music-bot/issues)** • **[💡 Solicitar Feature](https://github.com/DriifterSelf/discord-music-bot/issues)**

</div>
