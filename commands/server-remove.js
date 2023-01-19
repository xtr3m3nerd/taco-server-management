const { SlashCommandBuilder } = require('discord.js');
const { remove_server } = require('../serverfile.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-remove')
		.setDescription('Remove server from the server list')
		.addStringOption(option => option.setName('name').setDescription('The name of the server').setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');

		const guildId = interaction.guildId;
		await interaction.deferReply({ ephemeral: true });
		try {
			await remove_server(guildId, name);
			return interaction.editReply({ content: `Server ${name} has been removed`, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to remove server', ephemeral: true });
		}

	},
};
