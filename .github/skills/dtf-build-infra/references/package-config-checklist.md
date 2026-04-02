# Package Configuration Checklist

## `packages/tokens/package.json`

### Required Fields
- [ ] `"name": "@design-token-forge/tokens"`
- [ ] `"version"`: Current version (start at `"0.1.0"` for first real release)
- [ ] `"private": false` — **CRITICAL**: Remove or set to false to allow publishing
- [ ] `"description": "Design Token Forge — CSS custom property token system (primitives, semantic roles, surfaces, extras)"`
- [ ] `"license": "MIT"` (or project license)
- [ ] `"repository"`: `{ "type": "git", "url": "https://github.com/SridharRavi90/Design-Token-Forge.git", "directory": "packages/tokens" }`
- [ ] `"keywords": ["design-tokens", "css-variables", "custom-properties", "design-system", "theming"]`

### Exports Map
```json
{
  "exports": {
    ".": "./dist/index.css",
    "./primitives": "./dist/primitives.css",
    "./semantic": "./dist/semantic.css",
    "./surfaces": "./dist/surfaces.css",
    "./extras": "./dist/extras.css"
  }
}
```
- [ ] All exports point to `dist/` not `src/`
- [ ] `"."` — all-in-one import
- [ ] Individual layer imports for tree-shaking

### Files Field
```json
{
  "files": ["dist/"]
}
```
- [ ] Only `dist/` is published (not src, not node_modules)

### Scripts
```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "prepublishOnly": "npm run build"
  }
}
```
- [ ] Build script exists and works
- [ ] prepublishOnly ensures dist exists before npm publish

### Verification
```bash
cd packages/tokens
npm run build
ls dist/  # Should show: index.css, primitives.css, semantic.css, surfaces.css, extras.css
cat dist/index.css | head -5  # Should show minified CSS with custom properties intact
npm pack --dry-run  # Shows what would be published — should only include dist/ and package.json
```

---

## `packages/components/package.json`

### Required Fields
- [ ] `"name": "@design-token-forge/components"`
- [ ] `"version"`: Same as tokens (keep packages in lockstep)
- [ ] `"private": false`
- [ ] `"description": "Design Token Forge — Variable-exhaustive CSS components (button, input, select, etc.)"`
- [ ] `"peerDependencies": { "@design-token-forge/tokens": "^0.1.0" }`

### Why peerDependency
Tokens are consumed via CSS custom properties, not JS imports. But the consumer's app MUST have the token CSS loaded. `peerDependencies` tells the consumer: "you need to also install tokens." This prevents duplicate token CSS in the bundle.

### Exports Map
```json
{
  "exports": {
    ".": "./dist/index.css",
    "./button": "./dist/button/index.css",
    "./input": "./dist/input/index.css"
  }
}
```
- [ ] `"."` — all components in one CSS file
- [ ] Per-component exports — consumers pick only what they need
- [ ] **EVERY component** that has a CSS file in src/ gets an export entry

### Files Field
```json
{
  "files": ["dist/"]
}
```

### Verification
```bash
cd packages/components
npm run build
ls dist/  # Should show: index.css + per-component directories
ls dist/button/  # Should show: index.css
cat dist/button/index.css | head -5  # Minified component CSS
npm pack --dry-run
```

---

## `packages/generator/package.json`

### Required Fields
- [ ] `"name": "@design-token-forge/generator"`
- [ ] `"version"`: Same as other packages
- [ ] `"private": false`
- [ ] `"bin": { "dtf": "./src/cli.js" }` — CLI entry point (when CLI is built)
- [ ] `"type": "module"` — uses ES modules
- [ ] `"description": "Design Token Forge — Token generator CLI (brand themes, palette generation)"`

---

## Root `package.json` Updates

### Add Build-All Script
```json
{
  "scripts": {
    "build": "pnpm -r build",
    "build:tokens": "node packages/sync-server/build-static.js",
    "build:packages": "pnpm --filter @design-token-forge/tokens build && pnpm --filter @design-token-forge/components build"
  }
}
```
- [ ] `build:packages` runs tokens first (components may need processed tokens)
- [ ] Root `build` still works for all packages

### Verify Cross-Package Build
```bash
cd /Users/sridhar-2917/Design-Token-Forge
pnpm run build:packages
# Both dist/ folders should be populated
ls packages/tokens/dist/
ls packages/components/dist/
```
