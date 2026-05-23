# Build Runner Helper

Run [build_runner](https://pub.dev/packages/build_runner) from the editor status bar for Flutter and Dart projects.

Compatible with **Visual Studio Code**, **Cursor**, **VSCodium**, **Gitpod**, and any editor that supports the [VS Code extension API](https://code.visualstudio.com/api).

## Features

- **Full project build** — one-shot codegen for the whole package
- **Full project watch** — continuous codegen (with optional confirmation)
- **Build for error files** — scoped build using `--build-filter` for directories that contain files with analyzer **Errors** in the Problems panel
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

## Package

```bash
npm run package
```

Install the generated `.vsix` via **Extensions → Install from VSIX**.

## License

MIT
