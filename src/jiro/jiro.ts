import { REST } from "@discordjs/rest";
import { Player } from "discord-player";
import fs from "fs";
import { errorFromFunc, logger } from "../shared";
import { Client } from "./base/client";
import { COMMANDS_PATH } from "./shared/constants";
import { Routes } from "discord-api-types/v9";
import { Command } from "../../types/client";
import { toString } from "../utility/toString";
import type { CommandInteraction } from "discord.js/typings";

const client = new Client({});
const cmdFiles = fs
	.readdirSync(COMMANDS_PATH)
	.filter(file => file.endsWith(".js"));

const jsonCmds = new Array<unknown>();
const player = new Player(client);
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

// functions
async function replyInteraction(
	interaction: CommandInteraction,
	message: string,
) {
	await interaction.reply({ content: message, ephemeral: true });
}

async function loadSlashCommands() {
	logger.verbose(
		`Started refreshing application (/) commands from ${
			process.env.NODE_ENV === "production"
				? "globally"
				: "testing server"
		}`,
	);
	try {
		if (process.env.NODE_ENV === "production") {
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: jsonCmds,
			});
		} else {
			await rest.put(
				Routes.applicationGuildCommands(
					process.env.CLIENT_ID,
					process.env.TESTING_SERVER_ID,
				),
				{
					body: jsonCmds,
				},
			);
		}
	} catch (err) {
		errorFromFunc(
			"loadSlashCommands",
			`Got an error while loading application commands: ${err}`,
		);
	}

	logger.verbose("Successfully reloaded application (/) commands");
}

function loadAppCommands() {
	// load those commandos
	for (const file of cmdFiles) {
		const command = require(`./commands/${file}`) as Command;
		client.commands.set(command.builder.name, command);
		jsonCmds.push(command.builder.toJSON());
	}
}

client.on("ready", () => {
	loadSlashCommands();
	logger.info("Jiro is now deployed!");
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) {
		return replyInteraction(
			interaction,
			`Command not found: /${interaction.commandName}`,
		);
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		if (err) {
			logger.error(toString(err));
		}
		return replyInteraction(
			interaction,
			`There's something wrong while running this command!`,
		);
	}
});

client.on("shardReconnecting", () => {
	logger.info("Reconnecting");
});

client.once("shardDisconnect", () => {
	logger.info("Session end!");
});

loadAppCommands();
client.login(process.env.TOKEN);
