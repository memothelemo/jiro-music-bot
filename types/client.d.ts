import { SlashCommandBuilder } from "@discordjs/builders";
import { SharedSlashCommandOptions } from "@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptions";
import { CommandInteraction, Message } from "discord.js";
import { Client } from "../src/base/client";

type Command = {
	data: SlashCommandBuilder;
	guildOnly: boolean;
	execute(
		interaction: CommandInteraction,
		client: Client,
	): Promise<void | string>;
};
