import { Command } from "../../types/client";
import { Client } from "../base/client";
import { logger } from "../shared";
import { t } from "../utility/t";
import { CMDS, CONFIG } from "./shared";
import { parseTextToCommand } from "./utility/cmd";

const client = new Client();

// load commandos
CMDS.forEach(command => client.commands.set(command.data.name, command));

client.on("ready", () => {
	logger.info("Jiro is now deployed!");
});

// when someone replied
client.on("interactionCreate", async int => {
	if (!int.isCommand()) return;

	// load that command right up
	const { commandName } = int;
	const data = client.commands.get(commandName);
	if (data === undefined) {
		int.reply(`Unknown command: ${commandName}`);
		return;
	}

	// if command is server required, we need to verify the guild from interaction
	if (int.guildId == undefined && data.guildOnly) {
		int.reply(`Sorry, this command should be ran on server.`);
		return;
	}

	await int.reply(":hammer: Working on it!");

	// execute that
	await data
		.execute(int, client)
		.then(async result => {
			if (t.string(result)) {
				return int.editReply(result);
			}
			return int.editReply("**Success!**");
		})
		.catch(async reason => {
			logger.error(`Interaction Error: ${reason}`);
			// maybe there's an error
			if (!int.replied) {
				if (
					CONFIG.DEV_MODE ||
					int.member?.user.id === CONFIG.OWNER_ID
				) {
					return await int.editReply(`\`${reason}\``);
				}
				return await int.editReply(
					`There's something wrong here? Please try again.`,
				);
			}
		});
});

client.on("messageCreate", async message => {
	const result = parseTextToCommand(message);
	if (result === undefined) {
		return;
	}

	let commandInfo: Command | undefined;

	for (const cmd of CMDS) {
		const { name } = cmd.data;
		if (result.command === name) {
			commandInfo = cmd;
			break;
		}
	}

	if (commandInfo === undefined) {
		await message.reply(`Unknown command: ${result.command}`);
		return;
	}

	// message them with an error
	message.reply(`Legacy commands are not supported yet!`);
});

if (CONFIG.DEV_MODE) {
	logger.warn(`Jiro is running under development`);
}

client.login(CONFIG.TOKEN);

process.on("beforeExit", () => {
	client.cleanup();
	client.destroy();
});
