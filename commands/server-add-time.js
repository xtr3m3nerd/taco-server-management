const { SlashCommandBuilder } = require('discord.js');
const { get_server } = require('../serverfile.js');
const { add_time_to_server } = require('../aws-actions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-add-time')
		.setDescription('Add time to server')
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
			await add_time_to_server(server.instance, time);
			return interaction.editReply({ content: `Server ${name} time has been extended by ${time} hours`, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to add time to server', ephemeral: true });
		}

	},
};
