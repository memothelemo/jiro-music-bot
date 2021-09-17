import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Sends a response to `pong`"),
	guildOnly: false,
	async execute() {
		return "Pong!";
	},
});
