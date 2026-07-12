import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/config"

export const alt = siteConfig.name
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(145deg, #09090b 0%, #18181b 45%, #09090b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg
            width="56"
            height="56"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 21.5C7.5 12.8 13.2 7.5 19.8 10.6C24.2 12.8 25.8 18.8 23.4 23.6C21.8 26.6 18.4 28.2 14.6 27.8"
              stroke="#fafafa"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.2 9.8L25.4 22.2"
              stroke="#fafafa"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="23.4" cy="6.8" r="2.1" fill="#fafafa" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>
            AgentCN
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            Installable AI agents for your workflow
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#a1a1aa",
              maxWidth: "820px",
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#a1a1aa",
          }}
        >
          <span>agentcn.dev</span>
          <span>CLI · Registry · Docs</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
