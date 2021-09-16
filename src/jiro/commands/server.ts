import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	builder: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Shows about the server info"),
	async execute(int) {
		if (int.guild == undefined) {
			return await int.reply(
				`You're typing on a non-server channel, please execute this any server only`,
			);
		}
		return await int.reply(
			`Server name: ${int.guild.name}\nTotal members: ${int.guild.memberCount}`,
		);
	},
});
