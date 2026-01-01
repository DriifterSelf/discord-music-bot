import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { Player, QueryType } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Inicializar el reproductor SIN ytdl
const player = new Player(client, {
    skipFFmpeg: false,
});

// SOLO registrar YoutubeiExtractor (evita ytdl-core completamente)
await player.extractors.register(YoutubeiExtractor, {
    // PoToken para evitar bloqueos de YouTube
    generateWithPoToken: true,
    streamOptions: {
        useClient: 'WEB', // Requerido para PoToken
        highWaterMark: 1 << 25
    }
});

console.log('🎵 Extractor de YouTube configurado (Youtubei - sin ytdl-core)');

// Crear servidor HTTP simple para que Render no mate el proceso
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'online',
        bot: client.user?.tag || 'connecting...',
        uptime: Math.floor(process.uptime()),
        servers: client.guilds.cache.size
    }));
});

server.listen(PORT, () => {
    console.log(`🌐 Health check server running on port ${PORT}`);
});

client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
    console.log(`👥 Usuarios: ${client.users.cache.size}`);
    console.log(`🎵 Sistema de música activado`);
    console.log(`💚 Bot completamente operacional`);
    client.user.setActivity('!play <canción>', { type: 2 });
});

// Comandos de música
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // !play <búsqueda o URL>
    if (command === 'play' || command === 'p') {
        if (!message.member.voice.channel) {
            return message.reply('❌ Necesitas estar en un canal de voz primero');
        }

        if (!args.length) {
            return message.reply('❌ Uso: `!play <canción/URL>`');
        }

        const query = args.join(' ');

        console.log(`[BUSQUEDA] Usuario: ${message.author.tag} | Query: "${query}"`);

        try {
            const searchResult = await player.search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO
            });

            console.log(`[RESULTADO] Encontrado: ${searchResult?.tracks?.length || 0} pistas`);

            if (!searchResult || !searchResult.tracks.length) {
                return message.reply(`❌ **No se encontró nada**\n\n**Búsqueda:** \`${query}\`\n**Intenta con:**\n- Nombre de la canción y artista\n- URL directa de YouTube\n- Buscar algo más específico`);
            }

            const queue = player.nodes.create(message.guild, {
                metadata: {
                    channel: message.channel,
                    client: message.guild.members.me,
                    requestedBy: message.user
                },
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            });

            try {
                if (!queue.connection) await queue.connect(message.member.voice.channel);
            } catch {
                player.nodes.delete(message.guild.id);
                return message.reply('❌ No pude conectarme al canal de voz');
            }

            searchResult.playlist ? queue.addTrack(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

            if (!queue.isPlaying()) await queue.node.play();

            const embed = new EmbedBuilder()
                .setColor('#00ff9f')
                .setTitle('🎵 Agregado a la cola')
                .setDescription(searchResult.playlist ?
                    `**Playlist:** ${searchResult.playlist.title}\n**${searchResult.tracks.length} canciones**` :
                    `**${searchResult.tracks[0].title}**\n${searchResult.tracks[0].author}`
                )
                .setThumbnail(searchResult.tracks[0].thumbnail)
                .setFooter({ text: `Solicitado por ${message.author.tag}` });

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('[ERROR REPRODUCCION]', error);

            let errorMsg = '❌ **Error al reproducir**\n\n';

            if (error.message?.includes('Sign in to confirm')) {
                errorMsg += '**Causa:** YouTube está bloqueando el acceso\n**Solución:** Intenta con otra canción o URL diferente';
            } else if (error.message?.includes('video unavailable')) {
                errorMsg += '**Causa:** Video no disponible o privado\n**Solución:** Verifica que el video sea público';
            } else if (error.message?.includes('No extractor')) {
                errorMsg += '**Causa:** No se pudo extraer el audio\n**Solución:** Intenta con un video diferente';
            } else {
                errorMsg += `**Error:** \`${error.message}\`\n**Query:** \`${query}\`\n\nIntenta con:\n- Otra URL de YouTube\n- Buscar por nombre en vez de URL\n- Un video diferente`;
            }

            message.reply(errorMsg);
        }
    }

    // !skip
    if (command === 'skip' || command === 's') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) {
            return message.reply('❌ No hay nada reproduciéndose');
        }
        queue.node.skip();
        message.reply('⏭️ Canción saltada');
    }

    // !stop
    if (command === 'stop') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue) {
            return message.reply('❌ No hay nada reproduciéndose');
        }
        queue.delete();
        message.reply('⏹️ Música detenida y cola limpiada');
    }

    // !pause
    if (command === 'pause') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) {
            return message.reply('❌ No hay nada reproduciéndose');
        }
        queue.node.pause();
        message.reply('⏸️ Pausado');
    }

    // !resume
    if (command === 'resume' || command === 'r') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue) {
            return message.reply('❌ No hay nada en la cola');
        }
        queue.node.resume();
        message.reply('▶️ Resumido');
    }

    // !queue o !q
    if (command === 'queue' || command === 'q') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.tracks.toArray().length) {
            return message.reply('❌ La cola está vacía');
        }

        const tracks = queue.tracks.toArray().slice(0, 10);
        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setTitle('📜 Cola de reproducción')
            .setDescription(
                `**Reproduciendo:**\n${queue.currentTrack.title}\n\n` +
                `**Siguiente:**\n${tracks.map((track, i) => `${i + 1}. ${track.title}`).join('\n')}`
            );

        message.reply({ embeds: [embed] });
    }

    // !np (now playing)
    if (command === 'np' || command === 'nowplaying') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.currentTrack) {
            return message.reply('❌ No hay nada reproduciéndose');
        }

        const track = queue.currentTrack;
        const progress = queue.node.createProgressBar();

        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setTitle('🎵 Reproduciendo ahora')
            .setDescription(`**${track.title}**\n${track.author}`)
            .setThumbnail(track.thumbnail)
            .addFields({ name: 'Progreso', value: progress })
            .setFooter({ text: `Solicitado por ${track.requestedBy.tag}` });

        message.reply({ embeds: [embed] });
    }

    // !volume o !v
    if (command === 'volume' || command === 'v') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue) {
            return message.reply('❌ No hay música reproduciéndose');
        }

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply('❌ Uso: `!volume <0-100>`');
        }

        queue.node.setVolume(volume);
        message.reply(`🔊 Volumen establecido a ${volume}%`);
    }

    // !help
    if (command === 'help' || command === 'h') {
        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setTitle('🎵 Comandos de Música')
            .setDescription('Lista de comandos disponibles:')
            .addFields(
                { name: '!play <canción/URL>', value: 'Reproduce una canción o playlist', inline: true },
                { name: '!skip', value: 'Salta la canción actual', inline: true },
                { name: '!stop', value: 'Detiene la música', inline: true },
                { name: '!pause', value: 'Pausa la música', inline: true },
                { name: '!resume', value: 'Reanuda la música', inline: true },
                { name: '!queue', value: 'Muestra la cola', inline: true },
                { name: '!np', value: 'Canción actual', inline: true },
                { name: '!volume <0-100>', value: 'Ajusta el volumen', inline: true },
            );

        message.reply({ embeds: [embed] });
    }
});

// Event listeners del reproductor
player.events.on('playerStart', (queue, track) => {
    const embed = new EmbedBuilder()
        .setColor('#00ff9f')
        .setTitle('▶️ Reproduciendo')
        .setDescription(`**${track.title}**\n${track.author}`)
        .setThumbnail(track.thumbnail);

    queue.metadata.channel.send({ embeds: [embed] });
});

player.events.on('audioTrackAdd', (queue, track) => {
    // Opcional: notificar cuando se agrega una canción
});

player.events.on('error', (queue, error) => {
    console.error('Error en el reproductor:', error);
    queue.metadata.channel.send('❌ Ocurrió un error al reproducir la música');
});

player.events.on('playerError', (queue, error) => {
    console.error('Error en la reproducción:', error);
    queue.metadata.channel.send('❌ No pude reproducir esta canción');
});

client.login(process.env.DISCORD_TOKEN);
