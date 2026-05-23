# Publishing Build Runner Helper

Publish **once** to two registries so the extension is installable in **VS Code** and **Cursor** (and VSCodium):

| Registry | Used by | Extension ID |
|----------|---------|----------------|
| [Visual Studio Marketplace](https://marketplace.visualstudio.com/vscode) | VS Code | `ShafirK.buildrunner-helper` |
| [Open VSX](https://open-vsx.org) | Cursor, VSCodium, Gitpod, … | `ShafirK.buildrunner-helper` |

Cursor’s built-in Extensions panel syncs from **Open VSX** (with security review). VS Code uses the **Visual Studio Marketplace** only.

---

## Before you publish

1. **Publisher ID** in `package.json` is `ShafirK` — must match your Marketplace / Open VSX publisher exactly (IDs cannot be changed later).
2. **Display name** on marketplace profiles: set to **Shafir K** (publisher *name*, separate from ID).
3. **Version** — bump `version` in `package.json` for every release (`1.0.2`, `1.0.3`, …).
4. **Icon (recommended)** — add `images/icon.png` (128×128 PNG, not SVG) and in `package.json`:

   ```json
   "icon": "images/icon.png"
   ```

5. **Build & test**

   ```bash
   npm install
   npm run compile
   npm run package
   ```

6. **GitHub** — repo: https://github.com/shafir-k/buildrunner-helper (already linked in `package.json`).

---

## A. Visual Studio Marketplace (VS Code)

Official guide: [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### 1. Create a publisher

1. Sign in: https://marketplace.visualstudio.com/manage  
2. **Create publisher**
   - **ID:** `ShafirK` (must match `package.json` → `"publisher"`)
   - **Name:** `Shafir K`

### 2. Personal Access Token (PAT)

1. https://dev.azure.com → your organization → **User settings** → **Personal access tokens**
2. **New token** → Custom scopes → **Marketplace** → **Manage**
3. Copy the token (shown once).

### 3. Log in and publish

```bash
npm install -g @vscode/vsce
cd buildrunner-helper
vsce login ShafirK
# paste PAT when prompted

npm run compile
vsce publish
# or: npm run publish:vscode
```

### 4. Verify

- Marketplace: https://marketplace.visualstudio.com/items?itemName=ShafirK.buildrunner-helper  
- VS Code → Extensions → search **Build Runner Helper**

Users install with:

```bash
code --install-extension ShafirK.buildrunner-helper
```

---

## B. Open VSX (Cursor & VSCodium)

Official wiki: [Publishing Extensions](https://github.com/EclipseFdn/open-vsx.org/wiki/Publishing-Extensions)

### 1. Eclipse account & namespace

1. Sign in: https://open-vsx.org  
2. **Profile** → link GitHub (recommended)  
3. Create namespace **`ShafirK`** (must match `publisher` in `package.json`)

### 2. Access token

1. Open VSX → **Profile** → **Access Tokens**  
2. Generate a token with publish rights for namespace `ShafirK`.

### 3. Log in and publish

```bash
npm install -g ovsx
cd buildrunner-helper

ovsx login ShafirK
# paste Open VSX token

npm run compile
ovsx publish
# or: npm run publish:openvsx
```

### 4. Verify

- Registry: https://open-vsx.org/extension/ShafirK/buildrunner-helper  
- Cursor → Extensions → search **Build Runner Helper**

Users install with:

```bash
cursor --install-extension ShafirK.buildrunner-helper
```

### Cursor sync delay

After Open VSX publish, Cursor may take **hours** (or need a [forum review](https://forum.cursor.com/c/help/)) before the extension appears in search. If missing:

- Install from Open VSX **Download** → **Install from VSIX** in Cursor, or  
- Ask Cursor support to sync namespace `ShafirK` / extension `buildrunner-helper`.

---

## Release checklist (every version)

- [ ] Update `CHANGELOG.md`
- [ ] Bump `version` in `package.json`
- [ ] `npm run compile` && `npm run package` (smoke-test VSIX locally)
- [ ] `git tag v1.0.x && git push origin v1.0.x`
- [ ] `vsce publish` (VS Code Marketplace)
- [ ] `ovsx publish` (Open VSX / Cursor)
- [ ] Confirm both marketplaces show the new version

---

## Optional: CI publish (GitHub Actions)

Store secrets in the repo:

- `VSCE_PAT` — Azure DevOps PAT (Marketplace Manage)
- `OVSX_PAT` — Open VSX access token

Trigger `vsce publish` and `ovsx publish` on tag push `v*`. (Add a workflow file when you are ready.)

---

## Unpublish / deprecate

```bash
vsce unpublish ShafirK.buildrunner-helper
ovsx unpublish ShafirK.buildrunner-helper <version>
```

---

## Support links (marketplace)

Users will see:

- **Repository:** https://github.com/shafir-k/buildrunner-helper  
- **Issues:** https://github.com/shafir-k/buildrunner-helper/issues  
- **Q&A:** https://github.com/shafir-k/buildrunner-helper/discussions  
