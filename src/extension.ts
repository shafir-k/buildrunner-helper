import * as vscode from 'vscode';
import {
  runBuildRunnerOnErrorFiles,
  runWatchRunnerOnErrorFiles,
} from './errorFiles';
import { showAbout, showHelp } from './help';
import { showBuildRunnerMenu } from './menu';
import {
  describeRunning,
  disposeRunner,
  getLastCommand,
  isBuildRunnerRunning,
  onBuildRunnerRunningChange,
  registerRunnerListeners,
  runBuildRunner,
} from './runner';
import { onConfigChange } from './config';
import { hasFlutterWorkspace } from './workspace';

const STATUS_BAR_ID = 'buildrunnerHelper';

let statusBarItem: vscode.StatusBarItem | undefined;

export function activate(context: vscode.ExtensionContext): void {
  registerCommands(context);
  registerRunnerListeners(context);

  context.subscriptions.push(
    onBuildRunnerRunningChange(() => updateStatusBarPresentation()),
  );

  context.subscriptions.push(
    onConfigChange(() => {
      recreateStatusBar();
      updateStatusBarPresentation();
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      syncStatusBarVisibility();
      updateStatusBarPresentation();
    }),
  );

  recreateStatusBar();
  context.subscriptions.push({
    dispose: () => statusBarItem?.dispose(),
  });
  updateStatusBarPresentation();
}

export function deactivate(): void {
  statusBarItem?.dispose();
  statusBarItem = undefined;
  disposeRunner();
}

function recreateStatusBar(): void {
  statusBarItem?.dispose();

  const config = vscode.workspace.getConfiguration('buildrunnerHelper');
  const alignment =
    config.get<string>('statusBarAlignment', 'left') === 'right'
      ? vscode.StatusBarAlignment.Right
      : vscode.StatusBarAlignment.Left;
  const priority = config.get<number>('statusBarPriority', 50);

  statusBarItem = vscode.window.createStatusBarItem(
    STATUS_BAR_ID,
    alignment,
    priority,
  );
  statusBarItem.name = 'Build Runner Helper';
  statusBarItem.command = 'buildrunnerHelper.showMenu';

  syncStatusBarVisibility();
}

function syncStatusBarVisibility(): void {
  if (!statusBarItem) {
    return;
  }
  if (hasFlutterWorkspace()) {
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

function updateStatusBarPresentation(): void {
  if (!statusBarItem) {
    return;
  }

  const config = vscode.workspace.getConfiguration('buildrunnerHelper');
  const showLabel = config.get<boolean>('showLabel', true);
  const running = describeRunning();
  const isRunning = isBuildRunnerRunning();

  const icon = isRunning ? '$(sync~spin)' : '$(symbol-class)';
  statusBarItem.text = showLabel ? `${icon} Build Runner` : icon;
  statusBarItem.command = 'buildrunnerHelper.showMenu';
  statusBarItem.tooltip = [
    'Build Runner Helper',
    'Click to open menu (VS Code, Cursor, VSCodium, …)',
    `Status: ${running}`,
    lastCommandTooltip(),
  ].join('\n');
}

function lastCommandTooltip(): string {
  const cmd = getLastCommand();
  return cmd ? `Last: ${cmd}` : 'Last: (none)';
}

function registerCommands(context: vscode.ExtensionContext): void {
  const register = (
    id: string,
    handler: (...args: unknown[]) => void | Promise<void>,
  ) => {
    context.subscriptions.push(vscode.commands.registerCommand(id, handler));
  };

  const afterRunner = async (
    fn: () => void | Promise<void>,
  ): Promise<void> => {
    await fn();
    updateStatusBarPresentation();
  };

  register('buildrunnerHelper.showMenu', async () => {
    if (!hasFlutterWorkspace()) {
      void vscode.window.showWarningMessage(
        'Build Runner Helper: open a folder containing pubspec.yaml.',
      );
      return;
    }

    const action = await showBuildRunnerMenu();
    if (!action) {
      return;
    }

    switch (action.type) {
      case 'fullBuild':
        await afterRunner(() =>
          runBuildRunner({ mode: 'build', label: 'Full project' }),
        );
        break;
      case 'fullWatch':
        await afterRunner(() =>
          runBuildRunner({ mode: 'watch', label: 'Full project' }),
        );
        break;
      case 'buildErrorFiles':
        await afterRunner(() => runBuildRunnerOnErrorFiles());
        break;
      case 'watchErrorFiles':
        await afterRunner(() => runWatchRunnerOnErrorFiles());
        break;
      case 'help':
        showHelp();
        break;
      case 'about':
        showAbout(context);
        break;
    }
  });

  register('buildrunnerHelper.fullBuild', () =>
    afterRunner(() =>
      runBuildRunner({ mode: 'build', label: 'Full project' }),
    ),
  );

  register('buildrunnerHelper.fullWatch', () =>
    afterRunner(() =>
      runBuildRunner({ mode: 'watch', label: 'Full project' }),
    ),
  );

  register('buildrunnerHelper.buildErrorFiles', () =>
    afterRunner(() => runBuildRunnerOnErrorFiles()),
  );

  register('buildrunnerHelper.watchErrorFiles', () =>
    afterRunner(() => runWatchRunnerOnErrorFiles()),
  );

  register('buildrunnerHelper.help', () => showHelp());
  register('buildrunnerHelper.about', () => showAbout(context));
}
