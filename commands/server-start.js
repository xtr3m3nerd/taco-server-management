const { SlashCommandBuilder } = require('discord.js');
const { get_server } = require('../serverfile.js');
const { start_server } = require('../aws-actions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-start')
		.setDescription('Start server')
		.addStringOption(option => option.setName('name').setDescription('The name of the server').setRequired(true))
		.addNumberOption(option =>
			option
				.setName('time')
				.setDescription('Time to add to server shutdown')
				.setMinValue(0)
				.setMaxValue(8)),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const time = interaction.options.getNumber('time') ?? 0;

		const guildId = interaction.guildId;
		await interaction.deferReply({ ephemeral: true });
		try {
			const server = await get_server(guildId, name);
			if (!server) return interaction.editReply({ content: `Unknown server: ${name}`, ephemeral: true });
			await start_server(server.instance, time);
			return interaction.editReply({ content: `Server ${name} has been started`, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to start server', ephemeral: true });
		}

	},
};
