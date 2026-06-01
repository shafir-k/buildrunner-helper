# Build Runner Helper

**Build Runner Helper** runs `build_runner` for your Flutter and Dart projects from one click in the status bar — no copying long terminal commands, no guessing flags.

Perfect when you use **Freezed**, **Riverpod**, **json_serializable**, **Retrofit**, **go_router**, or any package that needs code generation.

Works in **Visual Studio Code**, **Cursor**, **VSCodium**, and other editors that support VS Code extensions.

---

## Install

| Editor | Link |
|--------|------|
| **VS Code** | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ShafirK.buildrunner-helper) |
| **Cursor** | [Cursor Marketplace](https://marketplace.cursorapi.com/items/?itemName=ShafirK.buildrunner-helper) |

Open **Extensions**, search **Build Runner Helper**, and install.

---

## What problem does it solve?

`build_runner` commands are long and easy to get wrong, for example:

```text
fvm flutter pub run build_runner build --delete-conflicting-outputs
```

You run them many times a day after editing models, providers, or routes. This extension:

- Puts every common action in the **status bar**
- Runs commands in a dedicated **Build Runner** terminal
- Can target **only the files that have errors** in the Problems panel (faster than a full rebuild)
- Shows a **spinning icon** while a build or watch is active
- Lets you choose **FVM**, **flutter pub run**, or **dart run** in settings

---

## How to use it

1. Open your project **root folder** (the one that contains `pubspec.yaml`).
2. Find **Build Runner** on the **bottom status bar** (left side by default).
3. **Click** it to open the menu.
4. Choose what you want to run.

While a command is running, the status bar icon **spins**. For a one-time **build**, it stops when the terminal command finishes. For **watch**, it keeps spinning until you stop it with **Ctrl+C** in the terminal.

Hover the status bar item to see status (**Idle** / **Running**) and your **last command**.

---

## Everything the extension can do

### Full project build

Runs a **one-time** codegen for the **entire project**.

**Use when:**

- You changed `pubspec.yaml` or `build.yaml`
- Many areas of the app changed
- A scoped build did not generate everything you need
- You want a clean full regeneration

Runs with `--delete-conflicting-outputs` by default (can be turned off in settings).

---

### Full project watch

Runs **continuous** codegen for the **entire project**. Stays active until you stop it.

**Use when:**

- You are actively developing and want `.g.dart` / `.freezed.dart` files updated as you save

You may be asked to confirm before watch starts (setting: **Confirm full watch**).

**To stop:** open the **Build Runner** terminal and press **Ctrl+C**.

---

### Build for error files

Looks at the **Problems** panel, finds **Dart files with Errors** under `lib/` (and optionally `test/`), groups them by folder, and runs **one scoped build** with the right `--build-filter` paths — so only those areas are rebuilt.

**Use when:**

- You see red errors on generated files (`.g.dart`, `.freezed.dart`, etc.)
- You fixed source files and only need codegen for files that still show errors
- You want a **faster** build than full project

**Example:** errors in `lib/features/shop/models/` → build_runner runs with a filter like `lib/features/shop/models/**`.

If there are **no** Dart errors under `lib/`, the extension tells you and does not run a command.

---

### Watch for error files

Same idea as **Build for error files**, but in **watch** mode for those scoped folders only.

**Use when:**

- You are fixing errors in one feature and want codegen to update automatically for that scope only

You may be asked to confirm before watch starts. Stop with **Ctrl+C** in the **Build Runner** terminal.

---

### Help

Opens a short **in-editor guide** (commands, settings, how to stop watch).

---

### About

Shows the extension **version**, **developer**, and compatibility note.

---

## Status bar

| What you see | Meaning |
|--------------|---------|
| Class icon + **Build Runner** | Ready (idle) |
| Spinning icon | Build or watch is running |
| Tooltip | Status, last command run |

You can move the item to the **right** side of the status bar or hide the text label in settings.

---

## If build_runner is already running

Before starting another job, the extension may warn you that `build_runner` is already running. You can:

- **Show terminal** — jump to the running session  
- **Run anyway** — start another command  
- **Cancel** — do nothing  

---

## Requirements

- A Flutter or Dart project with **`pubspec.yaml`** in the workspace  
- **`build_runner`** (and your generators) added to the project  
- **`fvm`**, **`flutter`**, or **`dart`** working in the integrated terminal  

The extension only appears when your workspace contains `pubspec.yaml`.

---

## Settings

Open **Settings** (Ctrl+,) and search **Build Runner Helper**.

| Setting | Default | What it does |
|---------|---------|----------------|
| **Command runner** | `fvm` | `fvm` → `fvm flutter pub run build_runner …` · `flutter-pub` → `flutter pub run …` · `dart-run` → `dart run build_runner …` |
| **Delete conflicting outputs** | On | Adds `--delete-conflicting-outputs` to every run |
| **Extra args** | (empty) | Add your own flags after `build` / `watch` |
| **Confirm full watch** | On | Ask before starting a full-project watch |
| **Show run notifications** | On | Small message when a command starts |
| **Lib directory** | `lib` | Where to scan for files with errors |
| **Include test errors** | Off | Include `test/` in “error files” actions |
| **Error filter mappings** | (empty) | Advanced: map custom folder paths to build filters |
| **Status bar alignment** | `left` | `left` or `right` |
| **Status bar priority** | `50` | Position on the status bar (lower = further left) |
| **Show label** | On | Show “Build Runner” text next to the icon |

### Custom error filter mappings (advanced)

Only needed for unusual folder layouts. Example in settings JSON:

```json
"buildrunnerHelper.errorFilterMappings": [
  {
    "pathPrefix": "lib/features/shop/",
    "buildFilter": "lib/features/shop/**"
  }
]
```

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| No **Build Runner** in status bar | Open the project root (folder with `pubspec.yaml`), then **Developer: Reload Window** |
| Command fails in terminal | Run `fvm flutter doctor` or `dart --version` in the terminal; check `build_runner` is in `pubspec.yaml` |
| Watch never stops spinning | Press **Ctrl+C** in the **Build Runner** terminal |
| “No Dart errors” for error files | Only **Error** severity counts (not warnings); files must be under `lib/` |
| Wrong command (FVM vs dart) | Change **Command runner** in settings |
| Extension not in Cursor search | Install from the [Cursor Marketplace link](https://marketplace.cursorapi.com/items/?itemName=ShafirK.buildrunner-helper) above |

---

## Feedback and support

- [Report a bug or request a feature](https://github.com/shafir-k/buildrunner-helper/issues)
- [Discussions](https://github.com/shafir-k/buildrunner-helper/discussions)

---

**Build Runner Helper** · by [Shafir K](https://github.com/shafir-k)
