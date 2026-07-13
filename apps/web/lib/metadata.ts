import { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"

export const defaultOgImage = {
  url: absoluteUrl(siteConfig.ogImage),
  width: 1200,
  height: 630,
  alt: siteConfig.name,
}

export const createStaticOGMetadata = (
  title: string,
  description: string
): Partial<Metadata> => ({
  title,
  description,
  openGraph: {
    title,
    description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultOgImage.url],
  },
})
