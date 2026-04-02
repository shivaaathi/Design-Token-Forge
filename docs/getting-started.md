# Getting Started with Design Token Forge

## Quick Start (5 minutes)

### 1. Install

```bash
# In your project
npm install @design-token-forge/tokens @design-token-forge/components
```

### 2. Import CSS

Add to your main CSS file (or HTML `<link>`):

```css
/* All tokens (primitives + semantic + surfaces) */
@import '@design-token-forge/tokens';

/* All components */
@import '@design-token-forge/components';
```

### 3. Use a Component

```html
<button class="btn" data-variant="filled" data-size="base">
  Click me
</button>
```

That's it — you have a fully-themed, accessible, density-aware button.

---

## Import Only What You Need

Don't want all components? Import individually:

```css
/* Tokens are always required */
@import '@design-token-forge/tokens';

/* Import only the components you use */
@import '@design-token-forge/components/button';
@import '@design-token-forge/components/input';
@import '@design-token-forge/components/select';
```

You can also import token layers individually:

```css
@import '@design-token-forge/tokens/primitives';
@import '@design-token-forge/tokens/semantic';
@import '@design-token-forge/tokens/surfaces';
@import '@design-token-forge/tokens/extras';
```

---

## Customize for Your Brand

### Option A: Generate a full brand theme (recommended)

```bash
npx @design-token-forge/generator --color "#E53F28" --name "acme" --output ./src/acme-theme.css
```

This generates a complete CSS override file with WCAG-certified color palettes. Then import it after the tokens:

```css
@import '@design-token-forge/tokens';
@import './acme-theme.css';            /* Your brand overrides */
@import '@design-token-forge/components';
```

### Option B: Manual override (for fine control)

Create a CSS file with just the tokens you want to change:

```css
/* my-brand.css */
:root {
  /* Override the primary palette (all 21 steps) */
  --prim-primary-500: #E53F28;
  --prim-primary-600: #AE1C00;
  /* ... other steps ... */

  /* Override typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
}
```

---

## Component API

Every DTF component uses **data attributes** for configuration:

| Attribute | Purpose | Example Values |
|---|---|---|
| `data-variant` | Visual style | `filled`, `outline`, `ghost`, `underline` |
| `data-size` | Density mode | `micro`, `tiny`, `small`, `base`, `medium`, `large`, `big`, `huge`, `mega`, `ultra` |
| `data-role` | Semantic role | `primary`, `brand`, `danger`, `warning`, `info`, `success` |
| `data-state` | Visual state | `hover`, `active`, `disabled` |
| `data-disabled` | Disabled state | (presence = disabled) |
| `data-rounded` | Pill/round shape | (presence = rounded) |

### Example: Full button

```html
<button class="btn" data-variant="filled" data-size="medium" data-role="danger" data-rounded>
  <svg class="btn__icon">...</svg>
  <span class="btn__label">Delete</span>
</button>
```

### Example: Input with label

```html
<div class="input-group" data-variant="outline" data-size="base">
  <label class="input__label">Email</label>
  <div class="input-field">
    <input type="email" placeholder="you@example.com" />
  </div>
</div>
```

---

## Dark Mode

DTF supports dark mode via `data-theme="dark"` on any ancestor:

```html
<!-- Whole page dark -->
<body data-theme="dark">
  ...
</body>

<!-- Section-level dark -->
<div data-theme="dark">
  <button class="btn" data-variant="filled">Dark button</button>
</div>
```

No extra CSS needed — the semantic token layer handles light/dark switching automatically.

---

## Override Any Component Token

Every visual property is a CSS custom property. Override at any scope:

```css
/* Global: all buttons get rounder */
.btn {
  --btn-radius-base: 999px;
}

/* Scoped: only in this section */
.hero .btn {
  --btn-font-weight: 700;
  --btn-height-base: 52px;
}

/* Inline: one specific button */
<button class="btn" style="--btn-radius-base: 0">Square button</button>
```

---

## Available Components

| Category | Components |
|---|---|
| **Controls** | button, icon-button, split-button, menu-button, toggle, checkbox, radio |
| **Inputs** | input, textarea, select, datepicker, slider, file-upload |
| **Display** | avatar, badge, tooltip, alert, toast, progress-bar, progress-ring |

Each component has a demo page in the `demo/` directory showing all variants, states, and density modes.

---

## File Structure

```
@design-token-forge/tokens
├── dist/index.css        ← All-in-one (use this)
├── dist/primitives.css   ← T0: colors, spacing, typography
├── dist/semantic.css     ← T1: role-based color aliases
├── dist/surfaces.css     ← T2: contextual surface modes
└── dist/extras.css       ← T0: numbers (radii, shadows, etc.)

@design-token-forge/components
├── dist/index.css        ← All components bundled
├── dist/button/index.css ← Individual per-component
├── dist/input/index.css
└── dist/...
```
