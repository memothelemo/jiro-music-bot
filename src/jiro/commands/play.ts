import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";
import { assert } from "../shared";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays some music with the argument of song")
		.addStringOption(option =>
			option
				.setName("song")
				.setDescription("The song you want to request the bot to play")
				.setRequired(true),
		) as SlashCommandBuilder,
	guildOnly: true,
	async execute(int, client) {
		// no empty option stuff
		const songName = int.options.get("song");
		if (!songName || !songName.value) {
			return "You need to type the song you want to play!";
		}

		// attempting to play tsome music
		const songArgument = songName.value as string;
		const { member } = int;
		assert(member);
		assert(int.channel);

		if (!("voice" in member)) {
			return "Unexpected error!";
		}

		return await client.addQueueOrPlay(
			member as GuildMember,
			int.user,
			int.channel,
			songArgument,
		);
	},
});
