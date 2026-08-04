import { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { createStaticOGMetadata } from "@/lib/metadata"

const title = "Terms of Service"
const description =
  "Terms for using the AgentCN website, documentation, and open source agent registry."

export const metadata: Metadata = {
  ...createStaticOGMetadata(
    `AgentCN • ${title}`,
    description,
    "/terms-of-service"
  ),
}

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl">
      <div className="px-4 py-16">
        <h1 className="font-gilroy text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Last updated: May 19, 2026
        </p>

        <div className="text-muted-foreground mt-10 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
              {siteConfig.url} (the &quot;Website&quot;) operated by AgentCN
              (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By using the
              Website, you agree to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              What the Website provides
            </h2>
            <p>
              AgentCN publishes documentation, a hosted agent registry, and
              links to open source agent source code you can install with the
              CLI. The Website is provided for information and developer use. No
              account is required to read the docs or browse the registry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use the Website for unlawful purposes.</li>
              <li>
                Attempt to disrupt, scrape, or overload the site or registry in
                a way that harms other users.
              </li>
              <li>
                Misrepresent your relationship with AgentCN or imply endorsement
                without permission.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Open source software
            </h2>
            <p>
              Agent source code in our GitHub repository is licensed under the
              MIT License with an additional restriction: you may not sell
              unmodified or minimally modified versions of the software for
              commercial purposes. Substantially modified versions may be sold.
              The original software must remain freely available to the public.
            </p>
            <p>
              See the full license in the{" "}
              <a
                href={`${siteConfig.links.github}/blob/main/apps/web/LICENSE.md`}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                repository
              </a>
              . Your use of the code is governed by that license, not only by
              these Website Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              No warranties
            </h2>
            <p>
              The Website, documentation, registry payloads, and related
              materials are provided &quot;as is&quot; without warranties of any
              kind. We do not guarantee that agents will meet your requirements,
              operate without error, or be suitable for production in every
              environment. You use the Website and any downloaded code at your
              own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, AgentCN is not liable for
              indirect, incidental, or consequential damages arising from your
              use of the Website or agent source code, including loss of data,
              revenue, or business interruption.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              External links
            </h2>
            <p>
              The Website may link to third-party services (for example{" "}
              <a
                href={siteConfig.links.github}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              ,{" "}
              <a
                href={siteConfig.links.discord}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
              , or{" "}
              <a
                href={siteConfig.links.twitter}
                className="text-foreground underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              ). We are not responsible for their content or policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">Changes</h2>
            <p>
              We may update these Terms at any time. Changes take effect when
              posted on this page with an updated date. Continued use of the
              Website means you accept the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">
              Governing law
            </h2>
            <p>
              These Terms are governed by applicable law in your jurisdiction,
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-base font-medium">Contact</h2>
            <p>Questions about these Terms:</p>
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
