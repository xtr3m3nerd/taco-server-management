const { readFileSync, writeFileSync } = require('node:fs');

const server_filepath = './servers.json';

module.exports = {
	async set_server(guildId, name, instance, game, fqdn, port, type) {
		const servers = load(guildId);
		servers[guildId][name] = {
			'instance': instance,
			'game': game,
			'fqdn': fqdn,
			'port': port,
			'type': type,
		};
		save(servers);
	},
	async remove_server(guildId, name) {
		const servers = load(guildId);
		if (servers[guildId][name]) delete servers[guildId][name];
		save(servers);
	},
	async get_servers(guildId) {
		const servers = load(guildId);
		return servers[guildId];
	},
	async get_server(guildId, name) {
		const servers = load(guildId);
		return servers[guildId][name];
	},
};

function load(guildId) {
	const data = readFileSync(server_filepath);
	let servers = JSON.parse(data);

	if (!servers) servers = {};

	if (!servers[guildId]) servers[guildId] = {};

	return servers;
}

function save(servers) {
	writeFileSync(server_filepath, JSON.stringify(servers, null, 2), 'utf8');
}
