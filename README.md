# Build Runner Helper

Run **build_runner** from your editor’s status bar — no more copying long terminal commands.

Works in **VS Code**, **Cursor**, **VSCodium**, and other compatible editors.

## Install

**VS Code** — [Get it on the Marketplace](https://marketplace.visualstudio.com/items?itemName=ShafirK.buildrunner-helper)

**Cursor** — [Get it on the Cursor Marketplace](https://marketplace.cursorapi.com/items/?itemName=ShafirK.buildrunner-helper)

Or open **Extensions**, search **Build Runner Helper**, and install.

## Quick start

1. Open a Flutter/Dart project (folder with `pubspec.yaml`).
2. Look at the **bottom status bar** for **Build Runner** (left side by default).
3. **Click it** and pick an action.

The icon spins while a build or watch is running. When it stops, the command has finished (or watch is still active until you stop it).

## What you can do

| Menu item | When to use it |
|-----------|----------------|
| **Full project build** | Run codegen once for the whole app (after big changes or `pubspec` updates). |
| **Full project watch** | Keep codegen running while you work (stops when you press Ctrl+C in the terminal). |
| **Build for error files** | You have red **Errors** in Problems — runs build_runner only for those files/folders. |
| **Watch for error files** | Same as above, but in watch mode for those scopes. |
| **Help** | Short guide inside the editor. |
| **About** | Version and extension info. |

Commands run in a terminal named **Build Runner**.

## Stop a running watch

1. Open the **Build Runner** terminal (bottom panel).
2. Press **Ctrl+C**.

## What you need

- A Flutter/Dart project with `build_runner` set up (Freezed, Riverpod, JSON serializable, etc.).
- `fvm`, `flutter`, or `dart` available in your terminal (configurable in settings).

## Settings (optional)

Open **Settings** and search **Build Runner Helper**.

| Setting | What it does |
|---------|----------------|
| **Command runner** | How to run build_runner: `fvm` (default), `flutter pub run`, or `dart run`. |
| **Delete conflicting outputs** | Adds `--delete-conflicting-outputs` (recommended). |
| **Confirm full watch** | Ask before starting a full-project watch. |
| **Lib directory** | Where to look for error files (default: `lib`). |
| **Include test errors** | Also include `test/` when using “error files” actions. |
| **Status bar alignment** | Show the icon on the left or right of the status bar. |
| **Show label** | Show “Build Runner” text next to the icon. |

### Custom folders for “error files”

If you use custom project layout, you can map folders to build filters in settings (`errorFilterMappings`). Most users can leave this empty.

## Problems?

- **No “Build Runner” in the status bar** — Open the project root (where `pubspec.yaml` is) and reload the window.
- **Command fails in terminal** — Check that `fvm` / `flutter` / `dart` works in the integrated terminal and that `build_runner` is in your project.
- **Still see analyzer errors after build** — Fix the Dart issues first, then run **Build for error files** again or use a full project build.

**Feedback:** [GitHub issues](https://github.com/shafir-k/buildrunner-helper/issues)

---

By **Shafir K**
