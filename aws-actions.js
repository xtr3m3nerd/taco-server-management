const aws = require('aws-sdk');
const ec2 = new aws.EC2({ region: 'us-east-1' });

module.exports = {
	async start_server(instance, time) {
		console.log(`Starting server ${instance} for ${time}`);
		const params = {
			InstanceIds: [instance],
		};
		try {
			await ec2.startInstances(params).promise();
		}
		catch (error) {
			console.log(error);
		}
	},
	async add_time_to_server(instance, time) {
		console.log(`Adding ${time} to server ${instance}`);
		// const params = {
		// 	InstanceIds: [instance],
		// };
		// const request = ec2.startInstances(params);

		// request
		// 	.on('success', function(response) {
		// 		console.log('Success!');
		// 	})
		// 	.on('error', function(error, response) {
		// 		console.log('Error! ', error);
		// 	})
		// 	.send();
	},
	async stop_server(instance) {
		console.log(`Stopping server ${instance}`);
		const params = {
			InstanceIds: [instance],
		};
		try {
			await ec2.stopInstances(params).promise();
		}
		catch (error) {
			console.log(error);
		}
	},
	async restart_server(instance) {
		console.log(`Restarting server ${instance}`);
		const params = {
			InstanceIds: [instance],
		};
		try {
			await ec2.stopInstances(params).promise();
			await ec2.startInstances(params).promise();
		}
		catch (error) {
			console.log(error);
		}
	},
	async get_status(instanceId) {
		console.log(`Getting server status ${instanceId}`);
		const params = {
			InstanceIds: [instanceId],
		};
		try {
			const data = await ec2.describeInstances(params).promise();
			console.log(data);
			const instance = data.Reservations[0].Instances[0];
			if (instance.State.Name !== 'stopped') {
				return 'running';
			}
			else {
				return 'stopped';
			}
		}
		catch (error) {
			console.log(error);
			return 'error';
		}
	},
	async get_time(instanceId) {
		console.log(`Getting server status ${instanceId}`);
		const params = {
			InstanceIds: [instanceId],
		};
		try {
			const data = await ec2.describeInstances(params).promise();
			console.log(data);
			const instance = data.Reservations[0].Instances[0];
			return instance.LaunchTime;
		}
		catch (error) {
			console.log(error);
			return 'error';
		}
	},
};
