const { SlashCommandBuilder } = require('discord.js');
const { get_server } = require('../serverfile.js');
const { get_time } = require('../aws-actions.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('server-time')
	.setDescription('Get time since server started')
	.addStringOption(option => option.setName('name').setDescription('The name of the server').setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');

		const guildId = interaction.guildId;
		await interaction.deferReply({ ephemeral: true });
		try {
			const server = await get_server(guildId, name);
			const launch_time = await get_time(server.instance);
			const time = timeSince(launch_time);
			return interaction.editReply({ content: `Server ${name} has been running since ${time}`, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to get server time', ephemeral: true });
		}

	},
};

function timeSince(date) {

	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}
