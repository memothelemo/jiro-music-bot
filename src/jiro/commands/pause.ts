import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pauses the current player"),
	guildOnly: true,
	async execute(int, client) {
		if (!client.isGuildInSession(int.guild!)) {
			return "Cannot skip while I'm not playing music!";
		}
		const metadata = client.queueMetadatas.get(int.guild!.id);
		if (metadata!.queue.playing) {
			metadata!.queue.setPaused(true);
		} else {
			metadata!.queue.setPaused(false);
		}
		return "Successfully un/paused music";
	},
});
