import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { errorFromFunc, logger } from "../shared";
import { toString } from "../utility/toString";
import { CMDS, CONFIG } from "./shared";

// load json cmds
const jsonCmds = new Array<unknown>();
const rest = new REST({ version: "9" }).setToken(CONFIG.TOKEN);

CMDS.forEach(cmd => jsonCmds.push(cmd.data.toJSON()));

process.on("unhandledRejection", reason => {
	logger.warn(`Unhandled rejection: ${toString(reason)}`);
});

async function main() {
	logger.info(
		`Started refreshing application (/) commands from ${
			process.env.NODE_ENV === "production" ? "global" : "testing server"
		}`,
	);
	try {
		const requestInfo = { body: jsonCmds };
		if (CONFIG.DEV_MODE) {
			await rest.put(
				Routes.applicationCommands(CONFIG.CLIENT_ID),
				requestInfo,
			);
		} else {
			await rest.put(
				Routes.applicationGuildCommands(
					CONFIG.CLIENT_ID,
					CONFIG.TESTING_SERVER_ID,
				),
				requestInfo,
			);
		}
	} catch (err) {
		return errorFromFunc(
			"loadSlashCommands",
			`Got an error while loading application commands: ${err}`,
		);
	}
	logger.info("Successfully reloaded application (/) commands");
}

main();
