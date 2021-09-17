import { Message } from "discord.js";
import { CONFIG } from "../shared";

export interface ParsedCommandResult {
	command: string;
	args: string[];
}

export function parseTextToCommand(
	message: Message,
): ParsedCommandResult | undefined {
	if (!message.content.startsWith(CONFIG.PREFIX)) return undefined;

	// cut with spaces
	const initialArgs = message.content.split(" ");

	// if the first member of the array is just a prefix, return nothing
	let command = initialArgs[0];
	if (command === CONFIG.PREFIX) {
		return undefined;
	}

	command = command.substring(CONFIG.PREFIX.length, command.length);
	initialArgs.shift();

	return {
		command: command,
		args: initialArgs,
	};
}
