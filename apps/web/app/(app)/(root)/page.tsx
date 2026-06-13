import { createStaticOGMetadata } from "@/lib/metadata"
import { Announcement } from "@/components/announcement"
import { Benefits } from "@/components/marketing/benefits"
import { CallToAction } from "@/components/marketing/call-to-action"
import { FAQ } from "@/components/marketing/faq"
import { GithubSection } from "@/components/marketing/github-section"
import { HeroBackground } from "@/components/marketing/hero-background"
import { HeroBadge } from "@/components/marketing/hero-badge"
import { HeroButtons } from "@/components/marketing/hero-buttons"
import {
  OpenSourceIcon,
  RegistryIcon,
  TypeScriptIcon,
  VercelIcon,
} from "@/components/marketing/hero-icons"
import { HeroImage } from "@/components/marketing/hero-image"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

const title = "Installable AI agents for your Workflow"
const description =
  "AgentCN is an open source kit with a CLI and agent registry. Pull agent source into your project, run it locally, and change prompts and tools in your own codebase as the library grows."

export const dynamic = "force-static"
export const revalidate = false

export const metadata = createStaticOGMetadata(title, description)

const tags = [
  { name: "TypeScript", icon: <TypeScriptIcon /> },
  { name: "Vercel AI SDK", icon: <VercelIcon /> },
  { name: "Agent registry", icon: <RegistryIcon /> },
  { name: "Open source", icon: <OpenSourceIcon /> },
]

export default function IndexPage() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      <div className="relative">
        <HeroBackground />
        <div className="relative z-10">
          <PageHeader className="border-transparent px-4 pb-12 md:pb-16">
            <Announcement link="/docs">
              Docs, registry, and CLI install guide
            </Announcement>
            <PageHeaderHeading>{title}</PageHeaderHeading>
            <PageHeaderDescription>{description}</PageHeaderDescription>
            <PageActions className="relative z-5">
              <HeroButtons />
            </PageActions>
            <div className="mt-5 flex max-w-md flex-wrap items-center justify-center gap-2">
              {tags.map((tag) => (
                <HeroBadge key={tag.name} icon={tag.icon}>
                  {tag.name}
                </HeroBadge>
              ))}
            </div>
          </PageHeader>
          <HeroImage />
        </div>
      </div>
      <Benefits />
      <GithubSection />
      <FAQ />
      <CallToAction />
    </div>
  )
}
