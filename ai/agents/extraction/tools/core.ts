import * as fs from "fs";
import * as path from "path";

export const EXTRACTION_AGENT_BASE_DIR = path.join(
  process.cwd(),
  "data",
  "extraction-agent.local"
);

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function safeFileName(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
}

/** Resolve a user path inside the extraction workspace; reject traversal. */
export function resolveWorkspacePath(filePath: string) {
  ensureDir(EXTRACTION_AGENT_BASE_DIR);
  const base = path.resolve(EXTRACTION_AGENT_BASE_DIR);
  const fullPath = path.resolve(base, filePath);
  if (!fullPath.startsWith(base + path.sep) && fullPath !== base) {
    throw new Error(
      `Access denied: path "${filePath}" is outside the extraction workspace.`
    );
  }
  return fullPath;
}

export function readWorkspaceFile(filePath: string) {
  const fullPath = resolveWorkspacePath(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(fullPath);
}

export function writeWorkspaceFile(
  filePath: string,
  contents: string | Buffer
) {
  const fullPath = resolveWorkspacePath(filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, contents);
  return path.relative(EXTRACTION_AGENT_BASE_DIR, fullPath);
}

export function getImageMediaType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const mediaType = IMAGE_MIME_BY_EXT[ext];
  if (!mediaType) {
    throw new Error(
      `Unsupported image type "${ext}". Use png, jpg, jpeg, webp, or gif.`
    );
  }
  return mediaType;
}

export function saveArtifact(folder: string, fileName: string, payload: unknown) {
  const relative = path.join(folder, fileName);
  const body =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  return writeWorkspaceFile(relative, body);
}

export function buildTaskMetadata(taskName: string) {
  return {
    task_name: safeFileName(taskName),
    created_at: new Date().toISOString(),
  };
}

export async function extractPdfPages(
  sourcePdfDoc: import("pdf-lib").PDFDocument,
  startPage: number,
  endPage: number
) {
  const { PDFDocument } = await import("pdf-lib");
  if (
    typeof startPage !== "number" ||
    typeof endPage !== "number" ||
    startPage <= 0 ||
    endPage < startPage
  ) {
    throw new Error(
      "Invalid page range. Start must be <= end, and both must be positive."
    );
  }

  const totalPages = sourcePdfDoc.getPageCount();
  if (startPage > totalPages || endPage > totalPages) {
    throw new Error(
      `Invalid page range: the document only has ${totalPages} pages.`
    );
  }

  const newPdfDoc = await PDFDocument.create();
  const startIndex = startPage - 1;
  const pageIndices = Array.from(
    { length: endPage - startIndex },
    (_, i) => startIndex + i
  );
  const copiedPages = await newPdfDoc.copyPages(sourcePdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdfDoc.addPage(page));
  return newPdfDoc;
}
