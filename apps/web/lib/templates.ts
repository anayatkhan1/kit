import { templatesSource } from "./templates-source"

export interface Template {
  name: string
  title: string
  description?: string
  tags?: string[]
  actionButtons?: string[]
  githubUrl?: string
  openSource?: boolean
  image?: string
  slug: string
  url: string
}

export function getAllTemplates(): Template[] {
  const pages = templatesSource.getPages()

  return pages.map((page) => ({
    name: page.slugs[0] || "index",
    title: page.data.title || "Untitled",
    description: page.data.description,
    tags: page.data.tags as string[] | undefined,
    actionButtons: page.data.actionButtons as string[] | undefined,
    githubUrl: page.data.githubUrl as string | undefined,
    openSource: page.data.openSource as boolean | undefined,
    slug: page.slugs[0] || "index",
    image: page.data.image as string | undefined,
    url: page.url,
  }))
}

export function getTemplate(slug: string) {
  return templatesSource.getPage([slug])
}
