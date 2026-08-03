import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { createStaticOGMetadata } from "@/lib/metadata"
import { getAllTemplates } from "@/lib/templates"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Announcement } from "@/components/announcement"
import { Icons } from "@/components/icons"
import TemplateGithubButton from "@/components/marketing/template-github-button"
import TemplateLiveDemoButton from "@/components/marketing/template-live-demo-button"
import { AnimatedTemplatePreview } from "@/components/marketing/animated-template-preview"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const dynamic = "force-static"
export const revalidate = false

const title = "Production Ready Templates"
const description =
  "Complete starter templates for AI agents and modern web apps. Open source and production-ready — clone, customize, and ship fast."

export const metadata = createStaticOGMetadata(title, description, "/templates")

export default async function TemplatesPage() {
  const templates = getAllTemplates()

  return (
    <>
      <PageHeader>
        <Announcement link="/docs">Install agents with the CLI</Announcement>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="lg" variant="gradient" className="rounded-lg px-4">
            <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="flex flex-col gap-16 pt-6 pb-14 md:pt-0 lg:pb-24">
        {templates.map((template) => {
          return (
            <div
              key={template.slug}
              className="grid grid-cols-1 gap-8 rounded-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-16"
            >
              <div className="relative col-span-2 flex h-full flex-col items-start justify-center">
                <Badge variant="accent">
                  <Icons.star className="h-4 w-4" />
                  Open Source
                </Badge>
                <h3 className="font-gilroy mt-6 text-2xl leading-none font-bold">
                  {template.title}
                </h3>
                <span className="text-muted-foreground mt-3">
                  {template.description}
                </span>
                <Link
                  href={`/templates/${template.name}`}
                  className="group/link text-foreground/90 mt-4 flex items-center gap-0.5 text-sm font-medium"
                >
                  View Details{" "}
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {template.githubUrl ? (
                    <TemplateGithubButton href={template.githubUrl} />
                  ) : null}
                  {template.actionButtons &&
                    template.actionButtons.map((button, index) => (
                      <TemplateLiveDemoButton
                        href={button}
                        index={index}
                        label={
                          template.actionButtons?.length === 1
                            ? "Try Demo"
                            : undefined
                        }
                        key={button}
                      />
                    ))}
                </div>
              </div>
              <Link
                href={`/templates/${template.name}`}
                className="col-span-3 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {template.image ? (
                  <AnimatedTemplatePreview
                    src={template.image}
                    alt={template.title}
                  />
                ) : (
                  <div className="bg-secondary flex aspect-video items-center justify-center overflow-hidden rounded-lg">
                    <span className="text-muted-foreground text-sm">
                      Preview
                    </span>
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}
