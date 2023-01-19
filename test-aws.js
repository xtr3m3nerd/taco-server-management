const aws = require('aws-sdk');
const ec2 = new aws.EC2({ region: 'us-east-1' });

const instanceId = 'i-04f5e8cff364d01ef';

(async function() {
	const params = {
		InstanceIds: [instanceId],
	};
	try {
		const request = ec2.describeInstances(params);

		request
			.on('success', function(response) {
				console.log('Success!');
				const instance = response.data.Reservations[0].Instances[0];
				if (instance.State.Name !== 'stopped') {
					console.log('running');
				}
				else {
					console.log('stopped');
				}
			})
			.on('error', function(error, response) {
				console.log('Error! ', error);
			})
			.send();
	}
	catch (error) {
		console.log('Error: ', error);
	}
})();
