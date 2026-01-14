import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { Manager } from 'erela.js';
import dotenv from 'dotenv';
import http from 'http';
import pino from 'pino';

dotenv.config();

const logger = pino({
    level: process.env.LOG_LEVEL || 'info'
});


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Lavalink Manager
const manager = new Manager({
    nodes: [{
        host: process.env.LAVALINK_HOST || 'localhost',
        port: parseInt(process.env.LAVALINK_PORT) || 2333,
        password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
        secure: process.env.LAVALINK_SECURE === 'true'
    }],
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    }
});

// Event listeners de Lavalink
manager.on('nodeConnect', node => {
    logger.info(`🔗 Lavalink node conectado: ${node.options.host}`);
});

manager.on('nodeError', (node, error) => {
    logger.error(`❌ Error en Lavalink node ${node.options.host}: ${error.message}`);
});

manager.on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    const embed = new EmbedBuilder()
        .setColor('#00ff9f')
        .setTitle('▶️ Reproduciendo')
        .setDescription(`**${track.title}**\n${track.author}`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `Solicitado por ${track.requester.tag}` });

    channel?.send({ embeds: [embed] });
});

manager.on('queueEnd', (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    channel?.send('✅ Cola finalizada, saliendo del canal de voz');
    player.destroy();
});

// Crear servidor HTTP simple para que Render no mate el proceso
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'online',
        bot: client.user?.tag || 'connecting...',
        uptime: Math.floor(process.uptime()),
        servers: client.guilds.cache.size,
        lavalink: manager.nodes.map(n => ({
            host: n.options.host,
            connected: n.connected
        }))
    }));
});

server.listen(PORT, () => {
    logger.info(`🌐 Health check server running on port ${PORT}`);
});

client.once('ready', () => {
    logger.info(`✅ Bot conectado como ${client.user.tag}`);
    logger.info(`📊 Servidores: ${client.guilds.cache.size}`);
    logger.info(`👥 Usuarios: ${client.users.cache.size}`);
    logger.info(`🎵 Inicializando Lavalink manager...`);

    manager.init(client.user.id);
    client.user.setActivity('!play <canción>', { type: 2 });

    logger.info(`💚 Bot completamente operacional`);
});

client.on('raw', d => manager.updateVoiceState(d));

// Comandos de música
const argsRegex = / +/;
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(argsRegex);
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
        logger.info(`[BUSQUEDA] Usuario: ${message.author.tag} | Query: "${query}"`);

        try {
            // Crear o obtener player
            const player = manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
                volume: 80
            });

            // Conectar si no está conectado
            if (player.state !== 'CONNECTED') player.connect();

            // Buscar canción
            const searchQuery = /^https?:\/\//.test(query) ? query : `ytsearch:${query}`;
            const res = await manager.search(searchQuery, message.author);

            logger.info(`[RESULTADO] Encontrado: ${res.tracks.length} pistas`);

            if (res.loadType === 'LOAD_FAILED') {
                return message.reply('❌ Error al cargar la canción');
            }

            if (res.loadType === 'NO_MATCHES') {
                return message.reply(`❌ **No se encontró nada**\n\n**Búsqueda:** \`${query}\`\n**Intenta con:**\n- Nombre de la canción y artista\n- URL directa de YouTube\n- Buscar algo más específico`);
            }

            // Agregar a cola
            if (res.loadType === 'PLAYLIST_LOADED') {
                player.queue.add(res.tracks);
                const embed = new EmbedBuilder()
                    .setColor('#00ff9f')
                    .setTitle('🎵 Playlist agregada a la cola')
                    .setDescription(`**${res.playlist.name}**\n**${res.tracks.length} canciones**`)
                    .setFooter({ text: `Solicitado por ${message.author.tag}` });

                message.reply({ embeds: [embed] });
            } else {
                const track = res.tracks[0];
                player.queue.add(track);

                const embed = new EmbedBuilder()
                    .setColor('#00ff9f')
                    .setTitle('🎵 Agregado a la cola')
                    .setDescription(`**${track.title}**\n${track.author}`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Solicitado por ${message.author.tag}` });

                message.reply({ embeds: [embed] });
            }

            // Reproducir si no está reproduciendo
            if (!player.playing && !player.paused) player.play();

        } catch (error) {
            logger.error({ err: error }, '[ERROR REPRODUCCION]');
            message.reply(`❌ **Error al reproducir**\n\n**Error:** \`${error.message}\``);
        }
    }

    // !skip
    if (command === 'skip' || command === 's') {
        const player = manager.get(message.guild.id);
        if (!player || !player.queue.current) {
            return message.reply('❌ No hay nada reproduciéndose');
        }
        player.stop();
        message.reply('⏭️ Canción saltada');
    }

    // !stop
    if (command === 'stop') {
        const player = manager.get(message.guild.id);
        if (!player) {
            return message.reply('❌ No hay nada reproduciéndose');
        }
        player.queue.clear();
        player.destroy();
        message.reply('⏹️ Música detenida y cola limpiada');
    }

    // !pause
    if (command === 'pause') {
        const player = manager.get(message.guild.id);
        if (!player || !player.queue.current) {
            return message.reply('❌ No hay nada reproduciéndose');
        }
        player.pause(true);
        message.reply('⏸️ Pausado');
    }

    // !resume
    if (command === 'resume' || command === 'r') {
        const player = manager.get(message.guild.id);
        if (!player || !player.queue.current) {
            return message.reply('❌ No hay nada en la cola');
        }
        player.pause(false);
        message.reply('▶️ Resumido');
    }

    // !queue o !q
    if (command === 'queue' || command === 'q') {
        const player = manager.get(message.guild.id);
        if (!player || !player.queue.current) {
            return message.reply('❌ La cola está vacía');
        }

        const queue = player.queue;
        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setTitle('📜 Cola de reproducción')
            .setDescription(
                `**Reproduciendo:**\n${queue.current.title}\n\n` +
                `**Siguiente:**\n${queue.slice(0, 10).map((track, i) => `${i + 1}. ${track.title}`).join('\n') || 'Nada en cola'}`
            );

        message.reply({ embeds: [embed] });
    }

    // !np (now playing)
    if (command === 'np' || command === 'nowplaying') {
        const player = manager.get(message.guild.id);
        if (!player || !player.queue.current) {
            return message.reply('❌ No hay nada reproduciéndose');
        }

        const track = player.queue.current;
        const position = player.position;
        const duration = track.duration;
        const bar = createProgressBar(position, duration);

        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setTitle('🎵 Reproduciendo ahora')
            .setDescription(`**${track.title}**\n${track.author}`)
            .setThumbnail(track.thumbnail)
            .addFields({ name: 'Progreso', value: bar })
            .setFooter({ text: `Solicitado por ${track.requester.tag}` });

        message.reply({ embeds: [embed] });
    }

    // !volume o !v
    if (command === 'volume' || command === 'v') {
        const player = manager.get(message.guild.id);
        if (!player) {
            return message.reply('❌ No hay música reproduciéndose');
        }

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply('❌ Uso: `!volume <0-100>`');
        }

        player.setVolume(volume);
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

// Helper para crear barra de progreso
function createProgressBar(current, total) {
    const percentage = (current / total) * 100;
    const progress = Math.round((percentage / 100) * 15);
    const emptyProgress = 15 - progress;

    const progressText = '▇'.repeat(progress);
    const emptyProgressText = '—'.repeat(emptyProgress);

    return `${formatTime(current)} ${progressText}${emptyProgressText} ${formatTime(total)}`;
}

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

client.login(process.env.DISCORD_TOKEN);
