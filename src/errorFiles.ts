import * as path from 'path';
import * as vscode from 'vscode';
import { getExtensionConfig } from './config';
import { RunnerMode } from './command';
import { getFlutterWorkspaceFolder, requireFlutterWorkspace } from './workspace';
import { runBuildRunner } from './runner';

export interface ErrorDartFile {
  readonly relativePath: string;
  readonly errorCount: number;
}

function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

function normalizeLibDir(libDirectory: string): string {
  const trimmed = libDirectory.replace(/^\/+|\/+$/g, '');
  return trimmed.length > 0 ? trimmed : 'lib';
}

/** Dart files under lib/ (and optionally test/) with Error severity in Problems. */
export function collectDartFilesWithErrors(
  workspaceFolder: vscode.WorkspaceFolder,
): ErrorDartFile[] {
  const config = getExtensionConfig();
  const libDir = normalizeLibDir(config.libDirectory);
  const root = toPosix(workspaceFolder.uri.fsPath);
  const prefixes = [`${root}/${libDir}/`];

  if (config.includeTestErrors) {
    prefixes.push(`${root}/test/`);
  }

  const byPath = new Map<string, number>();

  for (const [uri, diagnostics] of vscode.languages.getDiagnostics()) {
    if (uri.scheme !== 'file') {
      continue;
    }

    const fsPath = toPosix(uri.fsPath);
    const matchedPrefix = prefixes.find((p) => fsPath.startsWith(p));
    if (!matchedPrefix || !fsPath.endsWith('.dart')) {
      continue;
    }

    const errorCount = diagnostics.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error,
    ).length;
    if (errorCount === 0) {
      continue;
    }

    const relativePath = fsPath.slice(root.length + 1);
    byPath.set(relativePath, (byPath.get(relativePath) ?? 0) + errorCount);
  }

  return [...byPath.entries()]
    .map(([relativePath, errorCount]) => ({ relativePath, errorCount }))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

/** Directory glob filter for a project-relative Dart path. */
export function buildFilterForPath(relativePath: string): string {
  const normalized = toPosix(relativePath);
  const config = getExtensionConfig();

  let best: string | undefined;
  let bestPrefixLen = -1;

  for (const mapping of config.errorFilterMappings) {
    const prefix = toPosix(mapping.pathPrefix).replace(/\/\*\*$/, '');
    if (normalized.startsWith(prefix) && prefix.length > bestPrefixLen) {
      best = toPosix(mapping.buildFilter);
      bestPrefixLen = prefix.length;
    }
  }

  if (best) {
    return best;
  }

  const dir = path.posix.dirname(normalized);
  return `${dir}/**`;
}

export function buildFiltersForErrorFiles(
  files: readonly ErrorDartFile[],
): string[] {
  const unique = new Set<string>();
  for (const file of files) {
    unique.add(buildFilterForPath(file.relativePath));
  }
  return [...unique].sort((a, b) => a.localeCompare(b));
}

export function summarizeErrorFilesForMenu(): string {
  const folder = getFlutterWorkspaceFolder();
  if (!folder) {
    return 'Open a Flutter/Dart workspace';
  }

  const files = collectDartFilesWithErrors(folder);
  if (files.length === 0) {
    const libDir = normalizeLibDir(getExtensionConfig().libDirectory);
    return `No Dart errors under ${libDir}/ in Problems`;
  }

  const filters = buildFiltersForErrorFiles(files);
  return `${files.length} file(s) → ${filters.length} filter(s)`;
}

async function runOnErrorFiles(mode: RunnerMode): Promise<void> {
  const folder = requireFlutterWorkspace();
  if (!folder) {
    return;
  }

  const files = collectDartFilesWithErrors(folder);
  if (files.length === 0) {
    const libDir = normalizeLibDir(getExtensionConfig().libDirectory);
    void vscode.window.showInformationMessage(
      `Build Runner Helper: no Dart errors under ${libDir}/ in Problems.`,
    );
    return;
  }

  const combinedFilters = buildFiltersForErrorFiles(files);
  const modeLabel = mode === 'build' ? 'build' : 'watch';

  await runBuildRunner({
    mode,
    combinedFilters,
    label: `Error files ${modeLabel} (${files.length} files, ${combinedFilters.length} filters)`,
    scopedWatch: mode === 'watch',
  });
}

export function runBuildRunnerOnErrorFiles(): Promise<void> {
  return runOnErrorFiles('build');
}

export function runWatchRunnerOnErrorFiles(): Promise<void> {
  return runOnErrorFiles('watch');
}
