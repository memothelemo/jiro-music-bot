import fs from "fs";
import path from "path";
import { Command } from "../../types/client";
import { DIST_DIR, logger, ROOT_DIR } from "../shared";
import { t } from "../utility/t";

/** Checks the truthiness of the value */
export function assert(value: unknown, message?: string): asserts value {
	if (!value) {
		logger.error(`Assertion failed${` ${message}!` ?? "!"}`);
	}
}

export interface JiroConfig {
	DEV_MODE: boolean;
	CLIENT_ID: string;
	PREFIX: string;
	TOKEN: string;
	TESTING_SERVER_ID: string;
	OWNER_ID: string;
}

const configCheck = t.objectRequired<JiroConfig>({
	DEV_MODE: t.boolean,
	CLIENT_ID: t.string,
	PREFIX: t.string,
	TOKEN: t.string,
	TESTING_SERVER_ID: t.string,
	OWNER_ID: t.string,
});

// validating config.json file
export const CONFIG = process.env;
export const CMDS = fs
	.readdirSync(path.join(DIST_DIR, "jiro", "commands"))
	.filter(file => file.endsWith(".js"))
	.map(file => require(`./commands/${file}`) as Command);
