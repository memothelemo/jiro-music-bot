import { Log, LogLevel } from "@memolemo-studios/log";

export function errorFromFunc(funcName: string, message: string) {
	logger.error(`${funcName}(): ${message}`);
}

export const logger = new Log();
logger.setMinLevel(LogLevel.Verbose);
