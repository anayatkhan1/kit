import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"

const baseUrl = getSiteUrl()

interface LinkType {
  href: string
  label: string
}

interface LinkSectionProps {
  title: string
  links: LinkType[]
}

const CURRENT_YEAR = new Date().getFullYear()

const SOCIAL_LINKS = [
  {
    href: siteConfig.links.github,
    label: "GitHub",
    icon: Icons.gitHub,
  },
  {
    href: siteConfig.links.twitter,
    label: "Twitter",
    icon: Icons.twitter,
  },
  {
    href: siteConfig.links.discord,
    label: "Discord",
    icon: Icons.discord,
  },
] as const

const FOOTER_SECTIONS: LinkSectionProps[] = [
  {
    title: "Product",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs/agents/web-agent", label: "Agents" },
      { href: "/templates", label: "Templates" },
      { href: "/docs/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: siteConfig.links.github, label: "GitHub" },
      { href: siteConfig.links.discord, label: "Discord" },
      { href: siteConfig.links.twitter, label: "Twitter" },
    ],
  },
]

function FooterLink({ href, label }: LinkType) {
  const isExternal = href.startsWith("http")

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-muted-foreground hover:text-foreground inline-flex transition-colors duration-200"
    >
      {label}
    </Link>
  )
}

function LinkSection({ title, links }: LinkSectionProps) {
  return (
    <nav
      aria-label={title}
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <h3
        className="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase"
        itemProp="name"
      >
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <FooterLink {...link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function FooterSocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: (props: React.HTMLAttributes<SVGElement>) => React.JSX.Element
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md border border-transparent transition-all duration-200",
        "hover:border-border/60 hover:bg-foreground/4"
      )}
    >
      <Icon className="size-4" />
    </Link>
  )
}

export function SiteFooter() {
  const logoUrl = `${siteConfig.url}/agentcn-logo.svg`

  return (
    <footer
      className="border-border/60 bg-muted/10 w-full border-t"
      aria-label="Footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div
        className="mx-auto max-w-7xl px-6 pt-14 pb-10 lg:px-8"
        itemScope
        itemType="https://schema.org/Organization"
        itemID="#organization"
      >
        <meta itemProp="name" content="AgentCN" />
        <link itemProp="url" href={baseUrl} />
        <meta itemProp="logo" content={logoUrl} />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:gap-16">
          <div className="flex max-w-sm flex-col gap-5">
            <Link
              href="/"
              className="text-foreground group inline-flex w-fit items-center gap-2.5"
            >
              <span className="bg-foreground/5 ring-border/50 flex size-8 items-center justify-center rounded-lg ring-1 transition-colors duration-200 group-hover:bg-foreground/8">
                <Icons.logo className="size-4" />
              </span>
              <span className="font-gilroy text-lg font-semibold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p
              className="text-muted-foreground text-sm leading-relaxed text-pretty"
              itemProp="description"
            >
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-1.5">
              {SOCIAL_LINKS.map((social) => (
                <FooterSocialLink key={social.label} {...social} />
              ))}
            </div>
            <div itemScope itemType="https://schema.org/ContactPoint">
              <meta itemProp="email" content={siteConfig.links.email} />
              <meta itemProp="contactType" content="customer service" />
              <meta itemProp="url" content={baseUrl} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
            {FOOTER_SECTIONS.map((section) => (
              <LinkSection key={section.title} {...section} />
            ))}
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {CURRENT_YEAR} {siteConfig.name}. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  )
}
