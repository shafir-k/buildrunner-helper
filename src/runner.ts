import * as vscode from 'vscode';
import { buildShellCommand, RunnerMode } from './command';
import { getExtensionConfig } from './config';
import { requireFlutterWorkspace } from './workspace';

const TERMINAL_NAME = 'Build Runner';
const BUILD_RUNNER_MARKERS = [
  'build_runner',
  'build-runner',
  'pub run build_runner',
  'dart run build_runner',
];

export interface RunOptions {
  readonly mode: RunnerMode;
  readonly filter?: string;
  readonly combinedFilters?: readonly string[];
  readonly label: string;
  /** Error-file (or other) scoped watch — show scoped watch confirmation. */
  readonly scopedWatch?: boolean;
}

interface RunningSession {
  readonly terminal: vscode.Terminal;
  readonly mode: RunnerMode;
}

let lastCommand = '';
let managedTerminal: vscode.Terminal | undefined;
let runningSession: RunningSession | undefined;
let buildSafetyTimer: ReturnType<typeof setTimeout> | undefined;
let pendingBuildTerminal: vscode.Terminal | undefined;

const runningStateChange = new vscode.EventEmitter<void>();
export const onBuildRunnerRunningChange = runningStateChange.event;

function notifyRunningChange(): void {
  runningStateChange.fire();
}

function cancelBuildSafetyClear(): void {
  if (buildSafetyTimer) {
    clearTimeout(buildSafetyTimer);
    buildSafetyTimer = undefined;
  }
}

/** Fallback when shell integration never reports command end. */
function scheduleBuildSafetyClear(terminal: vscode.Terminal): void {
  cancelBuildSafetyClear();
  buildSafetyTimer = setTimeout(() => {
    if (runningSession?.terminal === terminal && runningSession.mode === 'build') {
      clearRunningSession();
    }
    buildSafetyTimer = undefined;
  }, 30 * 60 * 1000);
}

function clearRunningSession(): void {
  if (!runningSession) {
    return;
  }
  runningSession = undefined;
  pendingBuildTerminal = undefined;
  cancelBuildSafetyClear();
  notifyRunningChange();
}

function commandLineLooksLikeBuildRunner(commandLine: string): boolean {
  const lower = commandLine.toLowerCase();
  return BUILD_RUNNER_MARKERS.some((m) => lower.includes(m));
}

function markRunning(terminal: vscode.Terminal, mode: RunnerMode): void {
  runningSession = { terminal, mode };
  pendingBuildTerminal = undefined;
  if (mode === 'build') {
    scheduleBuildSafetyClear(terminal);
  } else {
    cancelBuildSafetyClear();
  }
  notifyRunningChange();
}

function trackRunningAfterCommand(
  terminal: vscode.Terminal,
  mode: RunnerMode,
): void {
  if (mode === 'watch') {
    markRunning(terminal, mode);
    return;
  }

  pendingBuildTerminal = terminal;

  if (terminal.shellIntegration) {
    markRunning(terminal, mode);
    return;
  }

  const startListener = vscode.window.onDidStartTerminalShellExecution((event) => {
    if (event.terminal !== terminal) {
      return;
    }
    if (!commandLineLooksLikeBuildRunner(event.execution.commandLine.value)) {
      return;
    }
    startListener.dispose();
    markRunning(terminal, 'build');
  });

  const siListener = vscode.window.onDidChangeTerminalShellIntegration((event) => {
    if (event.terminal !== terminal || !event.terminal.shellIntegration) {
      return;
    }
    if (pendingBuildTerminal === terminal) {
      markRunning(terminal, 'build');
    }
    siListener.dispose();
  });

  setTimeout(() => {
    startListener.dispose();
    siListener.dispose();
    pendingBuildTerminal = undefined;
  }, 30_000);
}

export function isBuildRunnerRunning(): boolean {
  if (!runningSession) {
    return false;
  }
  if (!vscode.window.terminals.includes(runningSession.terminal)) {
    clearRunningSession();
    return false;
  }
  return true;
}

export function registerRunnerListeners(
  context: vscode.ExtensionContext,
): void {
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((terminal) => {
      if (managedTerminal === terminal) {
        managedTerminal = undefined;
      }
      if (runningSession?.terminal === terminal) {
        clearRunningSession();
      }
      if (pendingBuildTerminal === terminal) {
        pendingBuildTerminal = undefined;
      }
    }),
  );

  context.subscriptions.push(
    vscode.window.onDidEndTerminalShellExecution((event) => {
      if (!runningSession || event.terminal !== runningSession.terminal) {
        return;
      }
      if (!commandLineLooksLikeBuildRunner(event.execution.commandLine.value)) {
        return;
      }
      if (runningSession.mode === 'build') {
        clearRunningSession();
      }
    }),
  );
}

export function disposeRunner(): void {
  clearRunningSession();
  runningStateChange.dispose();
  managedTerminal = undefined;
}

export function getLastCommand(): string {
  return lastCommand;
}

export function describeRunning(): string {
  if (!isBuildRunnerRunning() || !runningSession) {
    return 'Idle';
  }
  return `Running (${runningSession.mode})`;
}

function notifyRun(label: string, mode: RunnerMode): void {
  if (!getExtensionConfig().showRunNotifications) {
    return;
  }
  void vscode.window.showInformationMessage(
    `Build Runner Helper: ${label} (${mode})`,
  );
}

export async function runBuildRunner(options: RunOptions): Promise<void> {
  if (options.combinedFilters && options.combinedFilters.length > 0) {
    await executeRun(
      buildShellCommand({
        mode: options.mode,
        combinedFilters: options.combinedFilters,
      }),
      options,
    );
    return;
  }

  await executeRun(
    buildShellCommand({
      mode: options.mode,
      filter: options.filter,
    }),
    options,
  );
}

async function executeRun(command: string, options: RunOptions): Promise<void> {
  lastCommand = command;

  if (isBuildRunnerRunning()) {
    const choice = await vscode.window.showWarningMessage(
      `build_runner is already running (${runningSession?.mode ?? 'unknown'}). Start another anyway?`,
      { modal: true },
      'Show terminal',
      'Run anyway',
      'Cancel',
    );
    if (choice === 'Cancel' || choice === undefined) {
      return;
    }
    if (choice === 'Show terminal') {
      runningSession?.terminal.show();
      return;
    }
  }

  if (options.mode === 'watch' && getExtensionConfig().confirmFullWatch) {
    if (options.scopedWatch && options.combinedFilters?.length) {
      const watchChoice = await vscode.window.showWarningMessage(
        `Start build_runner watch for ${options.combinedFilters.length} scoped filter(s)? Runs until Ctrl+C in the terminal.`,
        'Start watch',
        'Cancel',
      );
      if (watchChoice !== 'Start watch') {
        return;
      }
    } else if (!options.filter && !options.combinedFilters) {
      const watchChoice = await vscode.window.showWarningMessage(
        'Start a full-project build_runner watch? It runs until you stop it (Ctrl+C in the terminal).',
        'Start watch',
        'Cancel',
      );
      if (watchChoice !== 'Start watch') {
        return;
      }
    }
  }

  const folder = requireFlutterWorkspace();
  if (!folder) {
    return;
  }

  let terminal = managedTerminal;
  if (!terminal || !vscode.window.terminals.includes(terminal)) {
    terminal = vscode.window.createTerminal({
      name: TERMINAL_NAME,
      cwd: folder.uri.fsPath,
    });
    managedTerminal = terminal;
  }

  terminal.show();
  terminal.sendText(command, true);
  trackRunningAfterCommand(terminal, options.mode);
  notifyRun(options.label, options.mode);
}

export async function stopBuildRunner(): Promise<void> {
  const terminals = new Set<vscode.Terminal>();

  if (managedTerminal && vscode.window.terminals.includes(managedTerminal)) {
    terminals.add(managedTerminal);
  }

  for (const terminal of vscode.window.terminals) {
    if (terminal.name.toLowerCase().includes('build runner')) {
      terminals.add(terminal);
    }
  }

  if (terminals.size === 0 && !isBuildRunnerRunning()) {
    void vscode.window.showInformationMessage(
      'Build Runner Helper: no Build Runner terminal found.',
    );
    return;
  }

  for (const terminal of terminals) {
    terminal.show();
    terminal.sendText('\x03', false);
  }

  clearRunningSession();

  void vscode.window.showInformationMessage(
    'Build Runner Helper: sent stop signal (Ctrl+C).',
  );
}
