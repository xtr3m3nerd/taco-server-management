const { SlashCommandBuilder } = require('discord.js');
const { set_server } = require('../serverfile.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-update')
		.setDescription('Update existing server')
		.addStringOption(option => option.setName('name').setDescription('The name of the server').setRequired(true))
		.addStringOption(option => option.setName('instance').setDescription('Ec2 instance id').setRequired(true))
		.addStringOption(option => option.setName('game').setDescription('Server game').setRequired(true))
		.addStringOption(option => option.setName('fqdn').setDescription('Address or ip of server').setRequired(true))
		.addStringOption(option => option.setName('port').setDescription('Game port').setRequired(true))
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Server shutdown types')),
// 				.addChoices(
// 					{ name: 'Timed', value: 'TIMED' },
// 					{ name: 'Watched', value: 'WATCHED' },
// 				)),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const instance = interaction.options.getString('instance');
		const game = interaction.options.getString('game');
		const fqdn = interaction.options.getString('fqdn');
		const port = interaction.options.getString('port');
		const type = interaction.options.getString('type') ?? 'TIMED';

		const guildId = interaction.guildId;
		await interaction.deferReply({ ephemeral: true });
		try {
			await set_server(guildId, name, instance, game, fqdn, port, type);
			return interaction.editReply({ content: `Server ${name} has been added`, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to add server', ephemeral: true });
		}

	},
};
