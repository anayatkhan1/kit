import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	// Keep Turbopack rooted to this template app.
	turbopack: {
		root: path.resolve(projectRoot, "../.."),
	},
	async headers() {
		return [
			{
				source: "/embed/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value:
							"frame-ancestors 'self' http://localhost:3000 https://agentcn.dev https://www.agentcn.dev",
					},
				],
			},
		];
	},
	cacheComponents: true,
	// TypeScript configuration
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// Only enable this if you want to proceed with type errors
		ignoreBuildErrors: false,
	},
};

export default nextConfig;
