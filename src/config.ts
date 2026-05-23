import * as vscode from 'vscode';

export type CommandRunner = 'fvm' | 'flutter-pub' | 'dart-run';

export interface FilterMapping {
  readonly pathPrefix: string;
  readonly buildFilter: string;
}

export interface ExtensionConfig {
  readonly commandRunner: CommandRunner;
  readonly deleteConflictingOutputs: boolean;
  readonly extraArgs: readonly string[];
  readonly confirmFullWatch: boolean;
  readonly showRunNotifications: boolean;
  readonly libDirectory: string;
  readonly includeTestErrors: boolean;
  readonly errorFilterMappings: readonly FilterMapping[];
  readonly statusBarAlignment: 'left' | 'right';
  readonly statusBarPriority: number;
  readonly showLabel: boolean;
}

const SECTION = 'buildrunnerHelper';

export function getExtensionConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration(SECTION);

  return {
    commandRunner: config.get<CommandRunner>('commandRunner', 'fvm'),
    deleteConflictingOutputs: config.get<boolean>(
      'deleteConflictingOutputs',
      true,
    ),
    extraArgs: config.get<string[]>('extraArgs', []),
    confirmFullWatch: config.get<boolean>('confirmFullWatch', true),
    showRunNotifications: config.get<boolean>('showRunNotifications', true),
    libDirectory: config.get<string>('libDirectory', 'lib'),
    includeTestErrors: config.get<boolean>('includeTestErrors', false),
    errorFilterMappings: config.get<FilterMapping[]>(
      'errorFilterMappings',
      [],
    ),
    statusBarAlignment: config.get<'left' | 'right'>(
      'statusBarAlignment',
      'left',
    ),
    statusBarPriority: config.get<number>('statusBarPriority', 50),
    showLabel: config.get<boolean>('showLabel', true),
  };
}

export function onConfigChange(
  listener: (e: vscode.ConfigurationChangeEvent) => void,
): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration(SECTION)) {
      listener(e);
    }
  });
}

export function commandRunnerLabel(runner: CommandRunner): string {
  switch (runner) {
    case 'fvm':
      return 'fvm flutter pub run build_runner';
    case 'flutter-pub':
      return 'flutter pub run build_runner';
    case 'dart-run':
      return 'dart run build_runner';
  }
}
