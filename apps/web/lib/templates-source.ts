import { templates } from "@/.source"
import { loader } from "fumadocs-core/source"

const templatesDocsSource = templates.toFumadocsSource()
const templatesDocsSourceRuntime = templatesDocsSource as unknown as {
  files?: unknown
}
const normalizedTemplatesDocsSource =
  typeof templatesDocsSourceRuntime.files === "function"
    ? ({
        ...(templatesDocsSource as unknown as Record<string, unknown>),
        files: (templatesDocsSourceRuntime.files as () => unknown)(),
      } as typeof templatesDocsSource)
    : templatesDocsSource

export const templatesSource = loader({
  baseUrl: "/templates",
  source: normalizedTemplatesDocsSource,
})
