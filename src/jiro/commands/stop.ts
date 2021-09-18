import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stops the music session"),
	guildOnly: true,
	async execute(int, client) {
		client.stopGuildPlayerSession(int.guild!);
		return `Successfully stopped the player`;
	},
});
