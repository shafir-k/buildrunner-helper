# Changelog

## 1.0.2

- Set publisher ID to `ShafirK` to match Visual Studio Marketplace account

## 1.0.1

- Split error-file actions into **Build for error files** and **Watch for error files**

## 1.0.0

- Production-ready refactor for general Flutter/Dart projects
- Compatible with VS Code, Cursor, VSCodium, and VS Code–compatible editors
- Configurable command runner: FVM, `flutter pub run`, or `dart run`
- Five menu actions: full build, full watch, build for error files, help, about
- Error-file builds use directory-based `--build-filter` (optional custom mappings)
- Status bar spinner tracks actual command lifecycle via shell integration
- Hides status bar when no `pubspec.yaml` is in the workspace
- Settings for notifications, watch confirmation, lib path, and extra CLI args
