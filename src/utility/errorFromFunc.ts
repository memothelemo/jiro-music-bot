import { logger } from "../shared";

export function errorFromFunc(funcName: string, message: string) {
	logger.error(`${funcName}(): ${message}`);
}
