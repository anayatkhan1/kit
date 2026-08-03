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
          padding: "64px 72px",
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Atmosphere */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(250,250,250,0.10) 0%, rgba(250,250,250,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-160px",
            left: "-100px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(161,161,170,0.12) 0%, rgba(9,9,11,0) 70%)",
          }}
        />

        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg
              width="52"
              height="52"
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
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              AgentCN
            </span>
          </div>
          <span
            style={{
              fontSize: 22,
              color: "#a1a1aa",
              letterSpacing: "0.02em",
            }}
          >
            agentcn.dev
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            position: "relative",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
            }}
          >
            Installable AI agents for your workflow
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.45,
              color: "#a1a1aa",
              maxWidth: "820px",
            }}
          >
            Pull source into your repo with one CLI command. Own the prompts,
            tools, and runtime.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: "12px",
              marginTop: "8px",
              padding: "14px 22px",
              borderRadius: "12px",
              background: "#18181b",
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

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#71717a",
            position: "relative",
          }}
        >
          <span>Open source · CLI · Registry · Docs</span>
          <span>npx agentcn</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
