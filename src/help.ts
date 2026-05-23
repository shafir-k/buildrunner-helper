import * as vscode from 'vscode';
import { describeDefaultBuildCommand } from './command';
import { commandRunnerLabel, getExtensionConfig } from './config';

export function showHelp(): void {
  const config = getExtensionConfig();
  const runner = commandRunnerLabel(config.commandRunner);

  void vscode.window.showInformationMessage(
    'Build Runner Helper',
    {
      modal: true,
      detail: [
        'Works in VS Code, Cursor, VSCodium, and other editors compatible with the VS Code extension API.',
        '',
        'Full project build',
        `  ${describeDefaultBuildCommand()}`,
        '',
        'Full project watch',
        `  ${runner} watch (runs until stopped)`,
        '',
        'Build for error files',
        '  Dart files with Errors in Problems → scoped build with --build-filter per directory.',
        '',
        'Watch for error files',
        '  Same scoped filters, but watch mode (runs until Ctrl+C).',
        '',
        'Stop a running process',
        '  Focus the "Build Runner" terminal and press Ctrl+C.',
        '',
        'Settings (search "Build Runner Helper"):',
        '  commandRunner — fvm | flutter-pub | dart-run',
        '  deleteConflictingOutputs, extraArgs, libDirectory, errorFilterMappings, …',
        '',
        'Requires: Flutter/Dart project with pubspec.yaml and build_runner.',
      ].join('\n'),
    },
  );
}

export function showAbout(context: vscode.ExtensionContext): void {
  const pkg = context.extension.packageJSON as {
    displayName?: string;
    version?: string;
    publisher?: string;
    description?: string;
  };

  void vscode.window.showInformationMessage(
    pkg.displayName ?? 'Build Runner Helper',
    {
      modal: true,
      detail: [
        pkg.description ?? '',
        '',
        `Version ${pkg.version ?? 'unknown'}`,
        `Publisher: ${pkg.publisher ?? 'unknown'}`,
        '',
        'Compatible with VS Code 1.85+ and forks (Cursor, VSCodium, etc.).',
      ].join('\n'),
    },
  );
}
