import Link from "next/link"
import { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { createStaticOGMetadata } from "@/lib/metadata"

const title = "About"
const description =
  "AgentCN is an open source kit for installable AI agents: CLI, registry, docs, and editable source in your repo."

export const metadata: Metadata = {
  ...createStaticOGMetadata(`AgentCN • ${title}`, description),
  metadataBase: new URL(siteConfig.url),
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <div className="px-4 py-16">
        <h1 className="font-gilroy text-3xl font-semibold tracking-tight">
          About AgentCN
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          AgentCN is an open source kit for adding AI agents to your codebase.
          We publish agent source through a CLI and registry, with docs and live
          previews so you can install, test locally, and edit prompts and tools
          in your own project.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-foreground text-lg font-medium">What we ship</h2>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground font-medium">CLI</strong>{" "}
                to install agents into your repo (
                <code className="text-foreground text-xs">
                  npx agentcn@latest add &lt;agent&gt;
                </code>
                )
              </li>
              <li>
                <strong className="text-foreground font-medium">
                  Registry
                </strong>{" "}
                at{" "}
                <a
                  href={`${siteConfig.url}/r`}
                  className="text-foreground underline underline-offset-4"
                >
                  {siteConfig.url}/r
                </a>
              </li>
              <li>
                <strong className="text-foreground font-medium">
                  Documentation
                </strong>{" "}
                with setup steps and previews for each agent
              </li>
              <li>
                <strong className="text-foreground font-medium">
                  Open source repo
                </strong>{" "}
                on{" "}
                <a
                  href={siteConfig.links.github}
                  className="text-foreground underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-lg font-medium">
              Starter template
            </h2>
            <p className="text-muted-foreground">
              If you want a full app shell (auth, chat UI, database), see{" "}
              <Link
                href="/templates/agentkit-starter"
                className="text-foreground underline underline-offset-4"
              >
                AgentKit
              </Link>
              , our open source starter template listed on the templates page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-lg font-medium">
              Community and feedback
            </h2>
            <p className="text-muted-foreground">
              Suggest new agents, report bugs, or share feedback in{" "}
              <a
                href={siteConfig.discussions.agentSuggestions}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Discussions
              </a>
              . You can also reach us on{" "}
              <a
                href={siteConfig.links.discord}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>{" "}
              or{" "}
              <a
                href={siteConfig.links.twitter}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-lg font-medium">Contact</h2>
            <p className="text-muted-foreground">
              Email{" "}
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="text-foreground underline underline-offset-4"
              >
                {siteConfig.links.email}
              </a>{" "}
              for support or partnership questions.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
