const { SlashCommandBuilder } = require('discord.js');
const { get_server } = require('../serverfile.js');
const { restart_server } = require('../aws-actions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-restart')
		.setDescription('Restart server')
		.addStringOption(option => option.setName('name').setDescription('The name of the server').setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');

		const guildId = interaction.guildId;
		await interaction.deferReply({ ephemeral: true });
		try {
			const server = await get_server(guildId, name);
			await restart_server(server.instance);
			return interaction.editReply({ content: `Server ${name} has been restarted`, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to restart server', ephemeral: true });
		}

	},
};
