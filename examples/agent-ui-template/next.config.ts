import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	// Keep Turbopack rooted to this template app.
	turbopack: {
		root: path.resolve(projectRoot, "../.."),
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
