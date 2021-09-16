import { inspect } from "util";
import dotenv from "dotenv";
import { logger } from "./shared";
import { toString } from "./utility/toString";

// load dotenv
dotenv.config();

// node.js v16 is going to deprecate unhandled promise rejections
process.on("unhandledRejection", reason => {
	logger.warn(`Unhandled rejection: ${toString(reason)}`);
});

// load jiro into the scene
require("./jiro/jiro.js");
