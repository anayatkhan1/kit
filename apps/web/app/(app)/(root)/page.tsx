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

const title = "Installable AI agents for your stack"
const description =
  "Open-source agents you install like components. Pull source into your repo, run it locally, and ship with prompts and tools you actually own."

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
          <PageHeader className="border-transparent px-4 pb-10 md:pb-14">
            <Announcement link="/docs">
              Now shipping · Web Agent + CLI registry
            </Announcement>
            <PageHeaderHeading className="max-w-3xl">
              {title}
            </PageHeaderHeading>
            <PageHeaderDescription className="max-w-xl text-pretty">
              {description}
            </PageHeaderDescription>
            <PageActions className="relative z-5">
              <HeroButtons />
            </PageActions>
            <div className="mt-6 flex max-w-lg flex-wrap items-center justify-center gap-2">
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
