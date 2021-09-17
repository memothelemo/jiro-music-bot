import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("bong")
		.setDescription("Does nothing"),
	guildOnly: false,
	async execute() {
		return "Bong!";
	},
});
