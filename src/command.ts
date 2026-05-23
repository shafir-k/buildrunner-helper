import { commandRunnerLabel, getExtensionConfig } from './config';

export type RunnerMode = 'build' | 'watch';

export interface BuildCommandOptions {
  readonly mode: RunnerMode;
  readonly filter?: string;
  readonly combinedFilters?: readonly string[];
}

export function buildShellCommand(options: BuildCommandOptions): string {
  const config = getExtensionConfig();
  const parts = [resolveRunnerPrefix(config), options.mode];

  if (config.deleteConflictingOutputs) {
    parts.push('--delete-conflicting-outputs');
  }

  for (const arg of config.extraArgs) {
    if (arg.trim().length > 0) {
      parts.push(arg.trim());
    }
  }

  const filters =
    options.combinedFilters && options.combinedFilters.length > 0
      ? options.combinedFilters
      : options.filter
        ? [options.filter]
        : [];

  const filterArgs = filters.map((f) => `--build-filter="${f}"`);
  return [...parts, ...filterArgs].join(' ');
}

function resolveRunnerPrefix(
  config: ReturnType<typeof getExtensionConfig>,
): string {
  switch (config.commandRunner) {
    case 'fvm':
      return 'fvm flutter pub run build_runner';
    case 'flutter-pub':
      return 'flutter pub run build_runner';
    case 'dart-run':
      return 'dart run build_runner';
  }
}

export function describeDefaultBuildCommand(): string {
  const config = getExtensionConfig();
  return `${commandRunnerLabel(config.commandRunner)} build${
    config.deleteConflictingOutputs ? ' --delete-conflicting-outputs' : ''
  }`;
}
