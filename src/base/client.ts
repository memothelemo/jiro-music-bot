import { Player, Queue } from "discord-player";
import {
	Client as DiscordJSClient,
	ClientOptions,
	Collection,
	Channel,
	GuildMember,
	User,
	TextBasedChannels,
	Guild,
	GuildChannel,
} from "discord.js";
import { Command } from "../../types/client";
import { assert } from "../jiro/shared";

interface QueueData {
	queue: Queue;
	channelId: string;
	listening: boolean;
}

export class Client extends DiscordJSClient {
	commands = new Collection<string, Command>();
	queueMetadatas = new Map<string, QueueData>();
	player: Player;

	constructor(config?: Omit<ClientOptions, "intents">) {
		super({
			...config,
			intents: ["GUILD_VOICE_STATES", "GUILDS", "GUILD_MESSAGES"],
		});

		this.player = new Player(this, {});
	}

	cleanup() {
		this.queueMetadatas.forEach(metadata => metadata.queue.destroy());
	}

	stopGuildPlayerSession(guild: Guild) {
		const metadata = this.queueMetadatas.get(guild.id);
		if (metadata) {
			metadata.queue.stop();
		}
	}

	createQueueFromGuild(guild: Guild, channel: GuildChannel) {
		const metadata = {
			channelId: channel.id,
			queue: this.player.createQueue(guild, {
				metadata: {
					channel: channel,
				},
			}),
			listening: this.queueMetadatas.has(guild.id) ?? true,
		};

		this.queueMetadatas.set(guild.id, metadata);
		return metadata.queue;
	}

	async addQueueOrPlay(
		member: GuildMember,
		botUser: User,
		channel: Channel | TextBasedChannels,
		query: string,
	) {
		// making sure the user is in the channel
		const voiceChannel = member.voice.channel;
		if (!voiceChannel) {
			return "You need to be in a voice channel to play music!";
		}

		// checking for permissions
		const permissions = voiceChannel.permissionsFor(botUser);
		assert(permissions);

		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			return "I need the permissions to join and speak in your voice channel!";
		}

		const queue = this.createQueueFromGuild(
			member.guild,
			channel as GuildChannel,
		);
		try {
			if (!queue.connection) await queue.connect(member.voice.channel);
		} catch {
			queue.destroy();
			this.queueMetadatas.delete(member.guild.id);
			return "Could not join your voice channel!";
		}

		const track = await this.player
			.search(query, {
				requestedBy: member,
			})
			.then(x => x.tracks[0]);

		if (!track) return `❌ | Track **${query}** not found!`;
		queue.play(track);

		return `Now playing: \`${track.title}\``;
	}
}
