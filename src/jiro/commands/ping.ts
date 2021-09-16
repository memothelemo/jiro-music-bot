import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with `pong` response"),
	async execute(interaction) {
		interaction.reply("Pong!");
	},
});
