import dotenv from "dotenv";
import { toString } from "./utility/toString";
import { logger } from "./shared";

// load dotenv
dotenv.config();

// node.js v16 deprecates unhandled promise rejections
// we can take advantage of this
process.on("unhandledRejection", reason => {
	logger.warn(`Unhandled rejection: ${toString(reason)}`);
});

// load jiro into the scene
require("./jiro/jiro.js");
