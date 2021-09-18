import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips the current playing song"),
	guildOnly: true,
	async execute(int, client) {
		// first, we need to check if the queue is ready to skip
		const metadata = client.queueMetadatas.get(int.guild!.id);
		const tracksLeft = metadata?.queue.tracks.length;
		if (tracksLeft == 0 || !tracksLeft) {
			return "There's nothing I can skip to the next song.";
		}
		metadata.queue.skip();
		return `Moving to the next track!`;
	},
});
