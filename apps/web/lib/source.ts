import { docs } from "@/.source"
import { loader } from "fumadocs-core/source"

const docsSource = docs.toFumadocsSource()
const docsSourceRuntime = docsSource as unknown as {
  files?: unknown
}
const normalizedDocsSource =
  typeof docsSourceRuntime.files === "function"
    ? ({
        ...(docsSource as unknown as Record<string, unknown>),
        files: (docsSourceRuntime.files as () => unknown)(),
      } as typeof docsSource)
    : docsSource

export const source: ReturnType<typeof loader> = loader({
  baseUrl: "/docs",
  source: normalizedDocsSource,
})
