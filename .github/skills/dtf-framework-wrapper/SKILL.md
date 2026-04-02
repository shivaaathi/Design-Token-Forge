---
name: dtf-framework-wrapper
description: "Create framework wrapper components (React, Vue, Svelte) for Design Token Forge CSS components. Use when: building React/Vue/Svelte components, writing typed wrappers, creating prop-to-data-attribute mappers, adding IDE autocomplete support, generating TypeScript definitions for component props, implementing framework-specific a11y, or connecting DTF CSS to any JavaScript framework."
---

# DTF Framework Wrappers — React/Vue/Svelte

## Purpose

Create thin, typed framework wrappers that map component props to data-attributes. All visual logic stays in CSS — the wrapper only handles: prop mapping, ARIA attributes, event forwarding, and TypeScript types.

## When to Use

- Building a new React/Vue/Svelte component wrapper
- Adding TypeScript types for a DTF component
- Setting up the framework package infrastructure

## Core Principle

**Wrappers are THIN.** They do NOT:
- Contain any visual styling (no `style=`, no className logic)
- Manage state (unless for a11y — e.g., aria-expanded on disclosure)
- Compute values (all computation is in CSS custom properties)
- Import CSS (consumer imports CSS separately)

**Wrappers DO:**
- Map props → data-attributes (e.g., `variant="primary"` → `data-variant="primary"`)
- Forward refs
- Forward events
- Set ARIA attributes
- Provide TypeScript types/intellisense

## Package Structure

```
packages/react/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts            # Re-exports all components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── IconButton.tsx
│   └── ...
├── dist/                   # Built output (gitignored)
│   ├── index.js
│   ├── index.d.ts
│   └── Button.d.ts
└── README.md
```

## Procedure

### Step 1: Package Setup

Follow [Package Setup Checklist](./references/wrapper-package-setup.md).

### Step 2: Component Wrapper

Follow [Component Wrapper Checklist](./references/wrapper-component-checklist.md).

### Step 3: TypeScript Types

Follow [TypeScript Types Checklist](./references/wrapper-types-checklist.md).

### Step 4: Verification

Follow [Wrapper Verification Checklist](./references/wrapper-verify-checklist.md).

## Architecture Rules (NEVER violate)

1. **No CSS in wrappers** — zero styled-components, zero Emotion, zero className conditionals
2. **Data-attribute API** — all visual config flows through `data-*` attributes in the DOM
3. **Forward all refs** — `React.forwardRef`, Vue `defineExpose`, Svelte `bind:this`
4. **Separate CSS import** — consumer imports CSS and wrapper independently
5. **Props mirror data-attributes** — prop names = data-attribute names (no translation layer)
6. **Optional chaining for slots** — children/slots are optional, wrapper renders conditionally

## Prop → Data-Attribute Mapping Reference

| Prop | Data Attribute | Values |
|---|---|---|
| `size` | `data-size` | micro, tiny, small, base, medium, large, big, huge, mega, ultra |
| `variant` | `data-variant` | filled, outlined, soft, ghost (component-specific) |
| `role` | `data-role` | primary, danger, success, warning, brand, info, neutral |
| `rounded` | `data-rounded` | boolean (present/absent) |
| `disabled` | `data-disabled` + native `disabled` | boolean |
| `error` | `data-error` | boolean |
| `loading` | `data-loading` | boolean |
