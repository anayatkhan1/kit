import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { siteConfig } from "@/lib/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || siteConfig.url
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${path}`
}
