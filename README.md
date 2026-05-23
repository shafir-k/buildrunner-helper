# Build Runner Helper

Run [build_runner](https://pub.dev/packages/build_runner) from the editor status bar for Flutter and Dart projects.

**Developer:** Shafir K  
**Publisher:** `ShafirK`

Compatible with **Visual Studio Code**, **Cursor**, **VSCodium**, **Gitpod**, and any editor that supports the [VS Code extension API](https://code.visualstudio.com/api).

## Install from marketplace

| Editor | Marketplace | Install |
|--------|-------------|---------|
| **VS Code** | [Visual Studio Marketplace](https://marketplace.visualstudio.com/vscode) | Extensions → search **Build Runner Helper** |
| **Cursor** | [Open VSX](https://open-vsx.org) (synced to Cursor) | Extensions → search **Build Runner Helper** |

```bash
# VS Code
code --install-extension ShafirK.buildrunner-helper

# Cursor
cursor --install-extension ShafirK.buildrunner-helper
```

Or install from a `.vsix` — see [Development](#development) below.

**Publishing / updating the public listing:** see [PUBLISHING.md](./PUBLISHING.md).

## Features

- **Full project build** — one-shot codegen for the whole package
- **Full project watch** — continuous codegen (with optional confirmation)
- **Build for error files** — scoped build using `--build-filter` for directories with analyzer **Errors** in Problems
- **Watch for error files** — same scoped filters in watch mode
- **Help / About** — usage and version info

Click **Build Runner** in the status bar (left by default) to open the menu.

The status icon spins while a build or watch is running and returns to idle when the terminal command finishes.

## Requirements

- A workspace folder containing `pubspec.yaml`
- `build_runner` (and generators such as `freezed`, `json_serializable`, `riverpod_generator`, etc.) in your project
- A shell where your chosen runner command is available (`fvm`, `flutter`, or `dart`)

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `buildrunnerHelper.commandRunner` | `fvm` | `fvm`, `flutter-pub`, or `dart-run` |
| `buildrunnerHelper.deleteConflictingOutputs` | `true` | Add `--delete-conflicting-outputs` |
| `buildrunnerHelper.extraArgs` | `[]` | Extra CLI arguments |
| `buildrunnerHelper.confirmFullWatch` | `true` | Confirm before full watch |
| `buildrunnerHelper.showRunNotifications` | `true` | Toast when a run starts |
| `buildrunnerHelper.libDirectory` | `lib` | Root for error-file scan |
| `buildrunnerHelper.includeTestErrors` | `false` | Include `test/` in error scan |
| `buildrunnerHelper.errorFilterMappings` | `[]` | Custom path → filter mappings |
| `buildrunnerHelper.statusBarAlignment` | `left` | `left` or `right` |
| `buildrunnerHelper.statusBarPriority` | `50` | Status bar ordering |
| `buildrunnerHelper.showLabel` | `true` | Show text next to icon |

### Custom error filters

By default, each file with errors maps to a directory glob (`lib/some/path/**`). Override with:

```json
{
  "buildrunnerHelper.errorFilterMappings": [
    {
      "pathPrefix": "lib/features/shop/",
      "buildFilter": "lib/features/shop/**"
    }
  ]
}
```

## Development

```bash
npm install
npm run compile
```

Press **F5** in VS Code or Cursor to launch an Extension Development Host.

## Package (local VSIX)

```bash
npm run package
```

Install the generated `.vsix` via **Extensions → Install from VSIX**.

## Publish publicly

See **[PUBLISHING.md](./PUBLISHING.md)** for step-by-step instructions to publish to:

- Visual Studio Marketplace (VS Code)
- Open VSX (Cursor, VSCodium, …)

## License

MIT — Copyright (c) Shafir K

MIT
