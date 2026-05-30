import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

interface LinkType {
  href: string
  label: string
  itemProp?: string
}

interface LinkSectionProps {
  title: string
  links: LinkType[]
}

const CURRENT_YEAR = new Date().getFullYear()

const LinkSection: React.FC<LinkSectionProps> = ({ title, links }) => {
  return (
    <nav
      aria-label={title}
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="flex flex-col md:text-sm">
        <h3 className="text-foreground mb-6 font-medium" itemProp="name">
          {title}
        </h3>
        <ul className="text-muted-foreground space-y-3 text-[13.5px]">
          {links.map(({ href, label }) => {
            const isExternal = href.startsWith("http")

            return (
              <li key={href}>
                <Link
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-sidebar-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

const FOOTER_SECTIONS: { title: string; links: LinkType[] }[] = [
  {
    title: "Products",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs/agents/web-agent", label: "Agents" },
      { href: "/docs/templates", label: "Templates" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/docs", label: "Documentation" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: siteConfig.links.discord, label: "Discord" },
      { href: siteConfig.links.twitter, label: "Twitter" },
      { href: siteConfig.links.github, label: "GitHub" },
    ],
  },
  {
    title: "Company",
    links: [{ href: "/", label: "About" }],
  },
]

export function SiteFooter() {
  const logoUrl = `${siteConfig.url}/agentcn-logo.svg`

  return (
    <footer
      className="w-full border-t"
      aria-label="Footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div
        className="mx-auto max-w-7xl px-6 pt-12 pb-12 lg:px-8"
        itemScope
        itemType="https://schema.org/Organization"
        itemID="#organization"
      >
        <meta itemProp="name" content="AgentCN" />
        <link itemProp="url" href={baseUrl} />
        <meta itemProp="logo" content={logoUrl} />

        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:gap-20">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="size-5" />
              <span className="font-gilroy text-lg font-bold">
                {siteConfig.name}
              </span>
            </Link>
            <p
              className="text-muted-foreground md:text-sm"
              itemProp="description"
            >
              Installable AI agents for real business workflows.
            </p>
            <div itemScope itemType="https://schema.org/ContactPoint">
              <meta itemProp="email" content={siteConfig.links.email} />
              <meta itemProp="contactType" content="customer service" />
              <meta itemProp="url" content={baseUrl} />
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-8 md:w-auto lg:grid-cols-4">
            {FOOTER_SECTIONS.map((section) => (
              <LinkSection
                key={section.title}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>
        </div>
        <div className="text-muted-foreground mt-12 border-t pt-8 text-sm">
          <p>
            © {CURRENT_YEAR} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
