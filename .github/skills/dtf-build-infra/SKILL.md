---
name: dtf-build-infra
description: "Build and packaging infrastructure for Design Token Forge. Use when: setting up CSS bundling, configuring Vite/PostCSS/esbuild, publishing npm packages, creating dist/ outputs, minifying CSS, adding autoprefixer, setting up semantic versioning, adding CHANGELOG automation, configuring package.json exports, creating build scripts, setting up CI/CD for publishing, or making packages installable via npm."
---

# DTF Build Infrastructure — Packaging & Distribution

## Purpose

Make Design Token Forge installable via `npm install @design-token-forge/tokens` and `npm install @design-token-forge/components`. This skill covers the entire build→bundle→publish pipeline.

## When to Use

- Setting up build tooling for any DTF package
- Writing or updating `vite.config.js`, `postcss.config.js`, or build scripts
- Modifying `package.json` exports, main, types, or files fields
- Adding CSS minification or autoprefixing
- Setting up semantic versioning or CHANGELOG automation
- Publishing packages to npm (even as beta)
- Configuring CI/CD for automated publishing

## Current State (as of last audit)

- All 3 packages have `private: true` — **blocks npm publish**
- Build scripts say `"TODO: configure build"` — **no dist/ output exists**
- `exports` point to `src/` — **consumers get unprocessed source**
- Zero CSS processing tooling — **no PostCSS, no autoprefixer, no minification**
- No versioning — **all 0.0.1, no CHANGELOG**

## Architecture Constraints (NEVER violate)

1. **CSS-only output** — Tokens and components are pure CSS. No JavaScript runtime. No CSS-in-JS.
2. **Three packages** — `@design-token-forge/tokens`, `@design-token-forge/components`, `@design-token-forge/generator`
3. **`tokens` depends on nothing** — it's the foundation layer
4. **`components` depends on `tokens`** — component CSS references global token variables
5. **`generator` is a Node.js CLI** — produces CSS files, not consumed as CSS
6. **Zero hardcoded values** — build process must NOT inline CSS custom properties
7. **Preserve variable names** — minification must NOT mangle `--custom-property` names
8. **Layered imports preserved** — consumers must be able to import individual layers or all-in-one

## Procedure

### Phase 1: CSS Build Tooling

Follow [Build Setup Checklist](./references/build-setup-checklist.md).

### Phase 2: Package Configuration

Follow [Package Config Checklist](./references/package-config-checklist.md).

### Phase 3: Versioning & Changelog

Follow [Versioning Checklist](./references/versioning-checklist.md).

### Phase 4: CI/CD Publishing

Follow [CI Publishing Checklist](./references/ci-publish-checklist.md).

### Phase 5: Verification

Follow [Build Verification Checklist](./references/build-verify-checklist.md).

## Anti-Patterns (NEVER do these)

| Anti-Pattern | Why It's Wrong | Correct Approach |
|---|---|---|
| Inline CSS custom properties during build | Destroys the cascade — consumers can't override | Minify whitespace/comments only |
| Bundle tokens INTO component CSS | Consumers get duplicate tokens | Keep tokens and components as separate entry points |
| Use `tsc` for CSS packages | There's no TypeScript in CSS packages | Use PostCSS or Lightning CSS |
| Set `"type": "module"` and use `import` for CSS | CSS isn't JS — bundlers handle CSS imports | Use `@import` in CSS, `exports` map in package.json |
| Publish `src/` directly | No minification, messy file structure | Build to `dist/`, publish only dist |
| Mangle class names (CSS Modules) | Component CSS uses BEM classes that consumers rely on | Never use CSS Modules or class mangling |
