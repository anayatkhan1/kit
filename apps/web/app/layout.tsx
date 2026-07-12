import type { Metadata } from "next"
import localFont from "next/font/local"
import Script from "next/script"

import { META_THEME_COLORS, siteConfig } from "@/lib/config"
import { fontVariables } from "@/lib/fonts"
import { defaultOgImage } from "@/lib/metadata"
import { cn, getSiteUrl } from "@/lib/utils"
import { LayoutProvider } from "@/hooks/use-layout"
import { Toaster } from "@/components/ui/sonner"
import { ActiveThemeProvider } from "@/components/active-theme"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeController } from "@/components/theme-controller"

import "@/styles/globals.css"

const Gilroy = localFont({
  variable: "--font-gilroy",
  display: "swap",
  src: [
    {
      path: "../fonts/gilroy-semibold.woff",
      weight: "600",
      style: "semibold",
    },
    {
      path: "../fonts/gilroy-bold.woff2",
      weight: "700",
      style: "bold",
    },
  ],
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteUrl),
  description: siteConfig.description,
  keywords: [
    "AI agents",
    "AgentCN",
    "CLI",
    "agent registry",
    "Vercel AI SDK",
    "TypeScript",
    "open source",
  ],
  authors: [
    {
      name: "AgentCN",
      url: "https://agentcn.dev",
    },
  ],
  creator: "AgentCN",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultOgImage.url],
    creator: `@${siteConfig.social.twitterHandle}`,
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />

        <Script
          defer
          data-website-id="687e053db3e2eeb18a627f44"
          data-domain="agentcn.dev"
          src="/js/script.js"
          strategy="afterInteractive"
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={cn(
          "text-foreground group/body bg-background overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
          Gilroy.variable,
          fontVariables
        )}
      >
        <ThemeController>
          <LayoutProvider>
            <ActiveThemeProvider>
              {children}
              <TailwindIndicator />
              <Toaster position="top-center" />
            </ActiveThemeProvider>
          </LayoutProvider>
        </ThemeController>
      </body>
    </html>
  )
}
