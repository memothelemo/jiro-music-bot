import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stops the music session"),
	guildOnly: true,
	async execute(int, client) {
		if (!client.isGuildInSession(int.guild!)) {
			return "Cannot stop while I'm not playing music!";
		}
		client.stopGuildPlayerSession(int.guild!);
		return `Successfully stopped the player`;
	},
});
