import { createStaticOGMetadata } from "@/lib/metadata"
import { Announcement } from "@/components/announcement"
import { Benefits } from "@/components/marketing/benefits"
import { CallToAction } from "@/components/marketing/call-to-action"
import { FAQ } from "@/components/marketing/faq"
import { GithubSection } from "@/components/marketing/github-section"
import { HeroBadge } from "@/components/marketing/hero-badge"
import { HeroButtons } from "@/components/marketing/hero-buttons"
import {
  MotionIcon,
  NextIcon,
  ReactIcon,
  ShadcnIcon,
  TailwindIcon,
  TypeScriptIcon,
} from "@/components/marketing/hero-icons"
import { HeroImage } from "@/components/marketing/hero-image"
import { Testimonials } from "@/components/marketing/testimonials"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

const title = "Installable AI agents for real workflows."
const description =
  "AgentCN is an open-source, shadcn-style library of reusable AI agents you can install via CLI, copy into your codebase, and customize freely-built TypeScript-first for Next.js."

export const dynamic = "force-static"
export const revalidate = false

export const metadata = createStaticOGMetadata(title, description)

const tags = [
  { name: "TypeScript", icon: <ReactIcon /> },
  { name: "Next.js", icon: <NextIcon /> },
  { name: "Vercel AI SDK", icon: <TailwindIcon /> },
  { name: "Install via CLI", icon: <ShadcnIcon /> },
  { name: "Editable agents", icon: <MotionIcon /> },
  { name: "Provider adapters", icon: <TypeScriptIcon /> },
]

export default function IndexPage() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      <PageHeader className="px-4 pb-12 md:pb-16">
        <Announcement link="/docs/changelog">
          Open source. Own the code. No lock-in.
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
      <Benefits />
      <GithubSection />
      <Testimonials
        src="https://cdn.agentcn.dev/pro/leander-pp.webp"
        name="Engineering Team"
        title="Startup / Product"
        border
        imgClassName="invert-0 dark:invert h-11 w-11"
        text="We shipped AI workflows faster by installing an agent like a component. The best part is owning the prompts, tools, and code-no black boxes."
      />
      <FAQ />
      <CallToAction />
    </div>
  )
}
