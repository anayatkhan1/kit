import * as fs from "fs";
import * as path from "path";
import type { PlannedFileAction, RegistryItem } from "../types.js";

export function planInstall(
  item: RegistryItem,
  cwd: string,
  options: { overwrite: boolean }
): PlannedFileAction[] {
  return item.files.map((file) => {
    const targetPath = file.target ?? file.path;
    const absoluteTargetPath = path.join(cwd, targetPath);
    const exists = fs.existsSync(absoluteTargetPath);
    const action = exists
      ? options.overwrite
        ? "update"
        : "skip"
      : "create";
    return {
      sourcePath: file.path,
      targetPath,
      absoluteTargetPath,
      content: file.content,
      action,
    };
  });
}

export function applyInstallPlan(actions: PlannedFileAction[]): {
  created: string[];
  updated: string[];
  skipped: string[];
} {
  const created: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];

  for (const action of actions) {
    if (action.action === "skip") {
      skipped.push(action.targetPath);
      continue;
    }
    fs.mkdirSync(path.dirname(action.absoluteTargetPath), { recursive: true });
    fs.writeFileSync(action.absoluteTargetPath, action.content, "utf-8");
    if (action.action === "create") created.push(action.targetPath);
    if (action.action === "update") updated.push(action.targetPath);
  }

  return { created, updated, skipped };
}
