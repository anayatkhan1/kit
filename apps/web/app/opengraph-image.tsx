import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/config"

export const alt = siteConfig.name
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"
export const runtime = "edge"

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
          padding: "56px 64px",
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft light — top right */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-120px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(250,250,250,0.09) 0%, rgba(250,250,250,0) 68%)",
          }}
        />
        {/* Soft light — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-140px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(161,161,170,0.10) 0%, rgba(9,9,11,0) 70%)",
          }}
        />
        {/* Faint grid lines for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.045,
            backgroundImage:
              "linear-gradient(to right, #fafafa 1px, transparent 1px), linear-gradient(to bottom, #fafafa 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            position: "relative",
          }}
        >
          <svg
            width="40"
            height="40"
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
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            AgentCN
          </span>
        </div>

        {/* Center copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            position: "relative",
            maxWidth: "920px",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            Installable AI agents for your workflow
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: "12px",
              padding: "16px 22px",
              borderRadius: "14px",
              background: "rgba(24,24,27,0.9)",
              border: "1px solid #27272a",
              fontSize: 22,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              color: "#e4e4e7",
            }}
          >
            <span style={{ color: "#71717a" }}>$</span>
            <span>npx agentcn add web-agent</span>
          </div>
        </div>

        {/* Footer — one quiet line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            fontSize: 18,
            color: "#71717a",
            letterSpacing: "0.01em",
          }}
        >
          <span>CLI · Registry · Editable source</span>
          <span>agentcn.dev</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
