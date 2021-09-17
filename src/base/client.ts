import {
	Client as DiscordJSClient,
	ClientOptions,
	Collection,
} from "discord.js";
import { Command } from "../../types/client";

export interface GuildQueueMetadata {
	guildId: string;
}

export class Client extends DiscordJSClient {
	commands = new Collection<string, Command>();
	queue = new Map<string, GuildQueueMetadata>();

	constructor(config?: Omit<ClientOptions, "intents">) {
		super({
			...config,
			intents: ["GUILD_VOICE_STATES", "GUILDS", "GUILD_MESSAGES"],
		});
	}
}
