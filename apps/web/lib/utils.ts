import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { siteConfig } from "@/lib/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "")
  }
  return siteConfig.url
}

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}
