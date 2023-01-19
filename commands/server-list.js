const { SlashCommandBuilder } = require('discord.js');
const { get_servers } = require('../serverfile.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-list')
		.setDescription('Retrieve list of servers'),
	async execute(interaction) {
		const guildId = interaction.guildId;
		await interaction.deferReply({ ephemeral: true });
		try {
			const servers = await get_servers(guildId);

			console.log(servers);
			let reply = 'Servers: \n';
			let count = 0;
			for (const name in servers) {
				// const instance = servers[name].instance;
				// const type = servers[name].type;

				count++;
				reply += `   ${count}. ${name}\n`;
			}
			return interaction.editReply({ content: reply, ephemeral: true });
		}
		catch (error) {
			console.log('An error has occured: ', error);
			return interaction.editReply({ content: 'Failed to list servers', ephemeral: true });
		}
	},
};
