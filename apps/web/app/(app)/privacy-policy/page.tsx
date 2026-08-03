import { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { createStaticOGMetadata } from "@/lib/metadata"

const title = "Privacy Policy"
const description =
  "How AgentCN collects and uses information when you visit agentcn.dev and use our docs and registry."

export const metadata: Metadata = {
  ...createStaticOGMetadata(
    `AgentCN • ${title}`,
    description,
    "/privacy-policy"
  ),
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <div className="px-4 py-16">
        <h1 className="font-gilroy text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Last updated: May 19, 2026
        </p>

        <div className="text-muted-foreground mt-10 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <p>
              This Privacy Policy explains how AgentCN (&quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;) handles information when you
              visit {siteConfig.url} (the &quot;Website&quot;), read our docs,
              or use links to our open source repository and registry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Information we collect
            </h2>
            <p>
              We do not require an account to browse the Website or read the
              documentation. We do not run a newsletter signup on this site.
            </p>
            <p>
              If you email us at{" "}
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="text-foreground underline underline-offset-4"
              >
                {siteConfig.links.email}
              </a>
              , we receive whatever you choose to send (for example your email
              address and message content) so we can reply.
            </p>
            <p>
              We use privacy-focused analytics to understand general site usage
              (such as page views and basic interaction events). This helps us
              improve docs and see which pages people use most. We do not use
              this analytics to build advertising profiles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              How we use information
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>To respond to support or feedback emails you send us.</li>
              <li>
                To measure aggregated traffic and improve the Website and
                documentation.
              </li>
              <li>To maintain security and reliability of the site.</li>
            </ul>
            <p>We do not sell your personal information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Hosting and third-party links
            </h2>
            <p>
              The Website is hosted on Vercel. When you follow links to GitHub,{" "}
              X, Discord, or other third-party sites, their privacy policies
              apply instead of this one.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Open source code
            </h2>
            <p>
              AgentCN agent source is published on GitHub. If you clone, fork,
              or install agents into your own project, you handle any data your
              application collects under your own policies, not this Website
              policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Children
            </h2>
            <p>
              The Website is not directed at children under 13. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">Changes</h2>
            <p>
              We may update this policy from time to time. The &quot;Last
              updated&quot; date at the top will change when we do. Continued
              use of the Website after an update means you accept the revised
              policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">Contact</h2>
            <p>Questions about this policy:</p>
            <ul className="list-none space-y-1">
              <li>
                Email:{" "}
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-foreground underline underline-offset-4"
                >
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                X:{" "}
                <a
                  href={siteConfig.links.twitter}
                  className="text-foreground underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{siteConfig.social.twitterHandle}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
