import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	serverExternalPackages: [
		'pg',
		'drizzle-orm',
		'viyv-db-client',
		'viyv-db-postgres',
		'viyv-db-core',
	],
	transpilePackages: [
		'@viyv/agent-ui-schema',
		'@viyv/agent-ui-engine',
		'@viyv/agent-ui-react',
		'@viyv/agent-ui-components',
		'@viyv/agent-ui-server',
	],
	webpack: (config) => {
		// Workspace packages use .js extension imports (NodeNext convention)
		// but webpack needs to resolve them to .ts source files
		config.resolve.extensionAlias = {
			'.js': ['.ts', '.tsx', '.js'],
		};
		return config;
	},
};

export default nextConfig;
