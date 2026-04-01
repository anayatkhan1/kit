export type RegistryFile = {
  path: string;
  type: string;
  target?: string;
  content: string;
};

export type RegistryItem = {
  schemaVersion: number;
  name: string;
  type: string;
  description: string;
  title?: string;
  categories?: string[];
  dependencies?: string[];
  envVars?: Record<string, string>;
  files: RegistryFile[];
};

export type RegistryIndexItem = {
  name: string;
  description: string;
  categories?: string[];
};

export type RegistryIndex = {
  schemaVersion: number;
  name: string;
  homepage?: string;
  items: RegistryIndexItem[];
};

export type AddOptionsInput = {
  registry?: string;
  dryRun?: boolean;
  overwrite?: boolean;
  yes?: boolean;
  verbose?: boolean;
  cwd?: string;
};

export type AddOptions = {
  registry?: string;
  dryRun: boolean;
  overwrite: boolean;
  yes: boolean;
  verbose: boolean;
  cwd: string;
};

export type PlannedFileAction = {
  sourcePath: string;
  targetPath: string;
  absoluteTargetPath: string;
  content: string;
  action: "create" | "update" | "skip";
};
