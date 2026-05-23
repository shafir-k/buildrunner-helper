import * as vscode from 'vscode';
import { describeDefaultBuildCommand } from './command';
import { getExtensionConfig } from './config';
import { summarizeErrorFilesForMenu } from './errorFiles';

export type MenuAction =
  | { type: 'fullBuild' }
  | { type: 'fullWatch' }
  | { type: 'buildErrorFiles' }
  | { type: 'help' }
  | { type: 'about' };

interface MenuPickItem extends vscode.QuickPickItem {
  action: MenuAction;
}

export async function showBuildRunnerMenu(): Promise<MenuAction | undefined> {
  const config = getExtensionConfig();
  const runner = config.commandRunner;

  const items: MenuPickItem[] = [
    {
      label: 'Full project build',
      description: describeDefaultBuildCommand(),
      action: { type: 'fullBuild' },
    },
    {
      label: 'Full project watch',
      description: `${runner} watch`,
      action: { type: 'fullWatch' },
    },
    {
      label: 'Build for error files',
      description: summarizeErrorFilesForMenu(),
      action: { type: 'buildErrorFiles' },
    },
    {
      label: 'Help',
      description: 'Usage and settings',
      action: { type: 'help' },
    },
    {
      label: 'About',
      description: 'Version and compatibility',
      action: { type: 'about' },
    },
  ];

  const picked = await vscode.window.showQuickPick(items, {
    title: 'Build Runner Helper',
    placeHolder: 'Choose an action',
    matchOnDescription: true,
  });

  return picked?.action;
}
