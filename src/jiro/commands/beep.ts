import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	builder: new SlashCommandBuilder()
		.setName("beep")
		.setDescription("Replies with `boop` response"),
	async execute(interaction) {
		interaction.reply("Boop!");
	},
});
