import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function getFlutterWorkspaceFolder():
  | vscode.WorkspaceFolder
  | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    return undefined;
  }

  for (const folder of folders) {
    if (hasPubspecAt(folder.uri.fsPath)) {
      return folder;
    }
  }

  return undefined;
}

export function hasFlutterWorkspace(): boolean {
  return getFlutterWorkspaceFolder() !== undefined;
}

export function hasPubspecAt(rootPath: string): boolean {
  return fs.existsSync(path.join(rootPath, 'pubspec.yaml'));
}

export function requireFlutterWorkspace(): vscode.WorkspaceFolder | undefined {
  const folder = getFlutterWorkspaceFolder();
  if (!folder) {
    void vscode.window.showErrorMessage(
      'Build Runner Helper: open a workspace folder that contains pubspec.yaml.',
    );
  }
  return folder;
}
