---
name: dtf-token-interop
description: "Design token format interoperability for Design Token Forge. Use when: exporting W3C DTCG format tokens, creating Style Dictionary config, generating Tailwind CSS presets, converting DTF tokens to other formats, creating JSON token files, building cross-tool compatibility, or integrating DTF tokens with external design tools (Penpot, Sketch, Tokens Studio)."
---

# DTF Token Interop — Cross-Format Export

## Purpose

Export DTF tokens in industry-standard formats so teams using Tailwind, Style Dictionary, or other design tools can consume them.

## When to Use

- Exporting tokens to W3C Design Token Community Group (DTCG) format
- Creating a Tailwind CSS preset from DTF tokens
- Setting up Style Dictionary compatibility
- Building JSON token files for non-CSS consumers
- Integrating with Tokens Studio for Figma

## Export Formats

### 1. W3C DTCG (`.tokens.json`)

The emerging standard. Used by Tokens Studio, Specify, and growing tool ecosystem.

Follow [W3C DTCG Checklist](./references/w3c-dtcg-checklist.md).

### 2. Tailwind CSS Preset

Map DTF tokens to a `tailwind.config.js` preset.

Follow [Tailwind Checklist](./references/tailwind-checklist.md).

### 3. Style Dictionary

Translate DTF tokens into Style Dictionary format for multi-platform output.

Follow [Style Dictionary Checklist](./references/style-dictionary-checklist.md).

## Architecture Rule

**CSS custom properties are the source of truth.** All other formats are GENERATED from the CSS files. Never hand-edit a JSON/Tailwind export — regenerate from source.

Pipeline:
```
packages/tokens/src/*.css  →  scripts/export-{format}.js  →  dist/{format}/
```

## What Gets Exported

| Token Layer | Export? | Why |
|---|---|---|
| T0 Primitives | YES | Base palette + spacing + font |
| T0 Extras | YES | Radius, shadow, motion, z-index |
| T1 Semantic | YES | Color roles (light + dark) |
| T2 Surfaces | OPTIONAL | Context tokens (many tools don't support modes) |
| Component tokens | NO | These are CSS-only implementation detail |
