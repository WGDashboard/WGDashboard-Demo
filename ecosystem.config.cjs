require('dotenv').config()

module.exports = {
	apps: [{
		name: 'WGDashboard Demo',
		script: './.output/server/index.mjs',
		instances: 1,
		exec_mode: 'cluster',
		env: {
			NODE_ENV: 'production',
			...process.env // Spread all loaded env vars
		}
	}]
}