import { createStaticOGMetadata } from "@/lib/metadata"

const title = "Production Ready Templates"
const description =
  "Open source starter templates for AI agents and modern web apps. Clone, customize, and ship with AgentCN."

export const metadata = createStaticOGMetadata(title, description, "/templates")

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container-wrapper max-w-6xl flex-1">
      <div className="container">{children}</div>
    </div>
  )
}
