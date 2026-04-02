# Build Setup Checklist

## Tool Selection

The project uses **pure CSS** — no Sass, Less, or CSS-in-JS. Choose the lightest tool that does what's needed.

**Recommended stack:**
- **PostCSS** for: autoprefixer + css-nano (minification) + import inlining
- **Alternatives that are also acceptable:** Lightning CSS (faster, fewer plugins)

## PostCSS Configuration

### Root `postcss.config.js`
- [ ] File: project root `postcss.config.js`
- [ ] Plugin: `postcss-import` — resolves `@import` into single file
- [ ] Plugin: `autoprefixer` — adds vendor prefixes for browser support
- [ ] Plugin: `cssnano` — minifies (whitespace, comments, shorthand merging)
- [ ] **cssnano preset**: Use `cssnano-preset-lite` or `default` with these DISABLED:
  - `cssDeclarationSorter: false` — order matters for readability
  - `mergeRules: false` — can break cascade order
  - `discardComments: { removeAllButFirst: true }` — keep license/attribution comments
- [ ] **CRITICAL**: Do NOT use any plugin that mangles custom property names

### Browser Targets
- [ ] File: `.browserslistrc` or `browserslist` in package.json
- [ ] Target: `>= 0.5%, last 2 versions, not dead, not ie 11`
- [ ] This gives: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+

### Verification Command
```bash
# After configuring, run:
npx postcss packages/tokens/src/primitives.css --no-map -o /tmp/test.css
# Check output still has --custom-property-name intact:
grep "^  --prim-" /tmp/test.css | head -5
# If custom properties are missing → cssnano is too aggressive → fix config
```

## Build Scripts (per package)

### `packages/tokens/`
- [ ] Script: `"build": "postcss src/index.css -o dist/index.css --no-map && postcss src/primitives.css -o dist/primitives.css --no-map && postcss src/semantic.css -o dist/semantic.css --no-map && postcss src/surfaces.css -o dist/surfaces.css --no-map && postcss src/extras.css -o dist/extras.css --no-map"`
- [ ] OR single-command: Use a small Node script that processes all files in `src/` to `dist/`
- [ ] `dist/index.css` — all-in-one (imports inlined)
- [ ] `dist/primitives.css`, `dist/semantic.css`, `dist/surfaces.css`, `dist/extras.css` — individual layers
- [ ] `"prepublishOnly": "npm run build"` — ensures dist/ exists before publish

### `packages/components/`
- [ ] Script: similar pattern — process each component CSS to dist
- [ ] `dist/index.css` — all-in-one (all components + their tokens)
- [ ] `dist/{component}/index.css` — per-component (tokens + CSS combined)
- [ ] Per-component files enable tree-shaking: team only imports what they use

### `packages/generator/`
- [ ] Different — this is Node.js, not CSS
- [ ] Script: `"build": "echo 'generator is pure JS, no build needed'"` OR use `tsc` if/when converting to TypeScript
- [ ] Entry point: `src/index.js` (CLI entry)

## Directory Structure (AFTER build)

```
packages/tokens/
├── src/                    # Source (committed)
│   ├── index.css
│   ├── primitives.css
│   ├── semantic.css
│   ├── surfaces.css
│   └── extras.css
├── dist/                   # Built (gitignored, created by build)
│   ├── index.css           # All-in-one minified
│   ├── primitives.css
│   ├── semantic.css
│   ├── surfaces.css
│   └── extras.css
└── package.json

packages/components/
├── src/                    # Source (committed)
│   ├── index.css
│   └── button/
│       ├── button.tokens.css
│       ├── button.css
│       └── index.css
├── dist/                   # Built (gitignored)
│   ├── index.css           # All-in-one
│   └── button/
│       └── index.css       # Per-component bundle
└── package.json
```

## Gitignore Update
- [ ] `packages/tokens/dist/` added to `.gitignore`
- [ ] `packages/components/dist/` added to `.gitignore`
- [ ] `packages/generator/dist/` added to `.gitignore`

## Dependencies to Install
```bash
cd /Users/sridhar-2917/Design-Token-Forge
pnpm add -D -w postcss postcss-cli postcss-import autoprefixer cssnano
```
- [ ] All 5 devDependencies installed at workspace root
- [ ] Verify: `npx postcss --version` outputs a version number
