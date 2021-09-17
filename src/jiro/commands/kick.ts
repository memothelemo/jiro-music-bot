import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../../types/client";
import { identity } from "../../utility/identity";
import { toString } from "../../utility/toString";

export = identity<Command>({
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks the player of the server")
		.addUserOption(options =>
			options
				.setName("user")
				.setDescription("The user you want to kick")
				.setRequired(true),
		) as SlashCommandBuilder,
	guildOnly: true,
	async execute(int, client) {
		const member = int.options.get("member");
		const me = int.guild!.me!;

		if (!member || !member.value)
			return "You need to mention the member you want to kick him";
		if (!me.permissions.has("KICK_MEMBERS"))
			return "I can't kick this user.";

		const memberVal = member.value as string;
		const userInfo = client.users.cache.get(memberVal.toString());

		return await int
			.guild!.members.kick(memberVal)
			.then(() => `${userInfo!.username} is successfully kicked!`)
			.catch(reason => {
				// which means the bot is higher than the owner
				if (
					toString(reason) === "DiscordAPIError: Missing Permissions"
				) {
					return `I cannot kick that user!`;
				}
				return reason;
			});
	},
});
