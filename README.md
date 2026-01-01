# Bot de Música para Discord

Bot de música con temática cyberpunk que reproduce desde YouTube/YouTube Music.

## Instalación

### 1. Instalar Node.js
Si no lo tienes, descarga desde: https://nodejs.org/ (versión LTS)

### 2. Crear la aplicación en Discord

1. Ve a https://discord.com/developers/applications
2. Click en "New Application"
3. Ponle un nombre (ej: "Cyberpunk Music")
4. Ve a la pestaña "Bot"
5. Click en "Add Bot"
6. **Activa estos 3 intents IMPORTANTES:**
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
7. Copia el TOKEN (guárdalo, lo necesitarás)
8. Ve a "OAuth2" > "URL Generator"
9. Selecciona: `bot`
10. Permisos: `Send Messages`, `Connect`, `Speak`, `Use Voice Activity`
11. Copia la URL generada y ábrela para invitar el bot a tu servidor

### 3. Configurar el proyecto

1. Abre una terminal en esta carpeta
2. Instala las dependencias:
```bash
npm install
```

3. Copia `.env.example` a `.env`:
```bash
copy .env.example .env
```

4. Edita `.env` y pega tu token:
```
DISCORD_TOKEN=tu_token_aqui
CLIENT_ID=tu_client_id_aqui
```

### 4. Ejecutar el bot

```bash
npm start
```

## Comandos

- `!play <canción/URL>` - Reproduce música de YouTube/YT Music
- `!skip` - Salta la canción actual
- `!stop` - Detiene y limpia la cola
- `!pause` - Pausa la reproducción
- `!resume` - Reanuda la reproducción
- `!queue` - Muestra las próximas canciones
- `!np` - Muestra la canción actual
- `!volume <0-100>` - Ajusta el volumen
- `!help` - Lista de comandos

## Soporte

El bot funciona con:
- ✅ YouTube
- ✅ YouTube Music
- ✅ Playlists
- ✅ URLs directas
- ✅ Búsquedas por texto

## Troubleshooting

**Error: "Cannot find package 'discord.js'"**
- Ejecuta `npm install` de nuevo

**El bot no responde**
- Verifica que el Message Content Intent está activado en el Developer Portal
- Revisa que el token en `.env` es correcto

**No se escucha audio**
- El bot necesita permisos para conectarse y hablar en canales de voz
- Prueba con `!volume 100` por si el volumen está muy bajo
