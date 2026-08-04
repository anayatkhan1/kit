import { Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { absoluteUrl, getSiteUrl } from "@/lib/utils"

export const defaultOgImage = {
  url: absoluteUrl(siteConfig.ogImage),
  width: 1200,
  height: 630,
  alt: siteConfig.name,
  type: "image/png" as const,
}

/**
 * Full Open Graph + Twitter card metadata.
 * Next.js shallow-merges `openGraph` / `twitter` objects, so page-level
 * metadata must include every field we care about — parent layout values
 * are not kept when a child sets the same key.
 */
export const createStaticOGMetadata = (
  title: string,
  description: string,
  path = "/"
): Metadata => {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
      creator: `@${siteConfig.social.twitterHandle}`,
    },
    // Helps some crawlers resolve relative asset URLs consistently
    metadataBase: new URL(getSiteUrl()),
  }
}
