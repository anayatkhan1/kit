export function fetchAgent(name: string): string {
  return `Fetching ${name}...`;
}

export function depsNeeded(agentLabel: string, packages: string[]): string {
  const count = packages.length;
  const list = packages.join(", ");
  const noun = count === 1 ? "package" : "packages";
  return `${agentLabel} needs ${count} ${noun} to run:\n${list}`;
}

export function depsInstallConfirm(): string {
  return "Install them now?";
}

export function depsReady(): string {
  return "Dependencies ready";
}

export function depsInstalling(packages: string[]): string {
  if (packages.length <= 2) {
    return `Installing ${packages.join(", ")}...`;
  }
  return `Installing ${packages.length} packages...`;
}

export function depsInstallingWithPm(
  pm: string,
  packages: string[]
): string {
  return `${depsInstalling(packages)} (${pm})`;
}

export function depsInstalled(): string {
  return "Dependencies installed";
}

export function envNeeded(agentLabel: string, keys: string[]): string {
  return `${agentLabel} needs these environment variables:\n${keys.join(", ")}`;
}

export function envConfirm(): string {
  return "Add them to .env.example?";
}

export function envUpdating(): string {
  return "Updating .env.example...";
}

export function envUpdated(keys: string[]): string {
  return `Added ${keys.join(", ")} to .env.example`;
}

export function envAlreadySet(): string {
  return ".env.example already has required keys";
}

export function filesAdding(): string {
  return "Adding agent files...";
}

export function filesDone(count: number, folder: string): string {
  if (count === 0) return `No new files added under ${folder}/`;
  if (count === 1) return `1 file added to ${folder}/`;
  return `${count} files added to ${folder}/`;
}

export function buildOutroMessage(
  agentLabel: string,
  dryRun: boolean,
  options: {
    envKeys: string[];
    agentImportPath: string;
  }
): string {
  const status = dryRun ? "install preview complete" : "installed successfully";
  const steps: string[] = [];
  if (options.envKeys.length > 0) {
    steps.push(
      "Copy keys from .env.example → .env.local and add your API keys"
    );
  }
  steps.push(
    `Import the agent in your chat route (e.g. ${options.agentImportPath})`
  );
  steps.push("Run your app and test the agent");
  return `${agentLabel} ${status}.\n${steps.map((step) => `• ${step}`).join("\n")}`;
}
