import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.agentcn.dev",
      },
    ],
  },
  redirects() {
    return [
      {
        source: "/r/styles/:path*",
        destination: "/ui-r/styles/:path*",
        permanent: false,
      },
      {
        source: "/components",
        destination: "/docs/agents/web-agent",
        permanent: true,
      },
      {
        source: "/docs/components",
        destination: "/docs/agents/web-agent",
        permanent: true,
      },
      {
        source: "/docs/components/:path*",
        destination: "/docs/agents/web-agent",
        permanent: true,
      },
      {
        source: "/docs/primitives/:path*",
        destination: "/docs/agents/web-agent",
        permanent: true,
      },
      {
        source: "/docs/pro-plan",
        destination: "/docs/scope",
        permanent: true,
      },
      {
        source: "/figma",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/forms",
        destination: "/docs/agents/web-agent",
        permanent: false,
      },
      {
        source: "/docs/forms/react-hook-form",
        destination: "/docs/agents/web-agent",
        permanent: false,
      },
      {
        source: "/sidebar",
        destination: "/docs/agents/web-agent",
        permanent: true,
      },
      {
        source: "/react-19",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/charts",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/view/styles/:style/:name",
        destination: "/view/:name",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://datafa.st/js/script.js",
      },
      {
        source: "/api/events",
        destination: "https://datafa.st/api/events",
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
