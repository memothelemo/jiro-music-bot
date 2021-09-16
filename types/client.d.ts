import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Message } from "eris";
import { Client } from "../src/jiro/base/client";

type Command = {
	builder: SlashCommandBuilder;
	execute(interaction: CommandInteraction): void;
};
