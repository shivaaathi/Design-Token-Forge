# Demo Build Guide

## Overview

Demo pages are interactive showcases for each component. They follow the gold-standard pattern established by `demo/button.html`.

## File Location
`demo/{component}.html`

## Required Sections (11 minimum, in order)

| # | Section ID | Section Name | Purpose |
|---|---|---|---|
| 1 | `sec-hero` | Hero & Inspector | Preview component + live token resolver |
| 2 | `sec-variants` | Variants & Roles | All structural variants × semantic roles |
| 3 | `sec-density` | Density Scale | All 10 sizes side-by-side |
| 4 | `sec-states` | State Matrix | Every variant × state (default, hover, active, disabled, error) |
| 5 | `sec-surface` | Surface Context | Component on bright, base, dim backgrounds |
| 6 | `sec-shape` | Shape & Shadow | Radius/shadow variations |
| 7 | `sec-slots` | Slots & Anatomy | Sub-elements shown individually |
| 8 | `sec-motion` | Motion & Animation | Interactive transitions demo |
| 9 | `sec-playground` | Context Playground | Interactive role/surface/variant switcher |
| 10 | `sec-a11y` | Accessibility | Focus, forced-colors, min-tap, screen reader info |
| 11 | `sec-framework` | Framework Snippets | React, Vue, HTML, CSS Tokens tabs |

## HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Component} — Design Token Forge</title>

  <!-- Tokens -->
  <link rel="stylesheet" href="../packages/tokens/src/primitives.css">
  <link rel="stylesheet" href="../packages/tokens/src/semantic.css">
  <link rel="stylesheet" href="../packages/tokens/src/surfaces.css">
  <link rel="stylesheet" href="../packages/tokens/src/extras.css">

  <!-- Component -->
  <link rel="stylesheet" href="../packages/components/src/{component}/{component}.tokens.css">
  <link rel="stylesheet" href="../packages/components/src/{component}/{component}.css">

  <!-- Demo chrome -->
  <link rel="stylesheet" href="shared.css">

  <style>
    /* Demo-only layout styles (NOT component styles) */
  </style>
</head>
<body>
  <!-- Nav bar (copy from button.html, update aria-current) -->
  <nav class="explorer-nav"> ... </nav>

  <div class="page-layout">
    <!-- Sidebar nav -->
    <aside class="sidebar-nav"> ... </aside>

    <main class="demo-main">
      <!-- Global pill bars -->
      <div class="control-strip"> ... </div>

      <!-- Section 1: Hero -->
      <section class="section" id="sec-hero"> ... </section>

      <!-- Sections 2-11 -->
      ...
    </main>
  </div>

  <script src="shared.js"></script>
  <script>
  (function() {
    'use strict';
    // Component-specific JS
    // IIFE pattern — no globals leaked
    // DTF.onThemeChange hook for theme-aware refreshes
  })();
  </script>
</body>
</html>
```

## Critical Implementation Details

### CSS Import Order (MUST be exact)
1. `primitives.css` — T0 raw values
2. `semantic.css` — T1 roles (light/dark)
3. `surfaces.css` — T2 contexts
4. `extras.css` — radius, shadow, motion
5. `{component}.tokens.css` — component defaults
6. `{component}.css` — component structure
7. `shared.css` — demo chrome (LAST)

### Nav Dropdown
- Copy the nav from `button.html` (most up-to-date)
- Set `aria-current="page"` on THIS component's link only
- Remove `aria-current` from all other links
- Include ALL existing component links

### Pill Bars (controls)
```html
<div class="pill-bar" data-bar="structBar" role="radiogroup" aria-label="Structure">
  <button class="pill" type="button" role="radio" aria-pressed="true" data-ctrl-struct="filled">Filled</button>
  <button class="pill" type="button" role="radio" aria-pressed="false" data-ctrl-struct="outlined">Outlined</button>
</div>
```
- **ALWAYS** use `<button>` with `aria-pressed`, NOT `<input type="radio">`
- Default selection: `aria-pressed="true"` on the default pill
- Size bar: default = `base` (NOT micro)
- Event delegation: listen on `.pill-bar` container, use `e.target.closest('.pill')`

### Hero Inspector (3-column token resolver)
```
Variable Name          →  Token Alias           →  Computed Value
--{comp}-height-base   →  var(--spacing-36)     →  36px
--{comp}-radius-base   →  var(--radius-md)      →  8px
```
- Use `getComputedStyle()` on the **actual component element** (not wrapper)
- Update on: pill-bar change, theme toggle
- Show at least 8-12 key tokens

### State Matrix Layout
```
         default    hover    active    disabled    error
filled   [comp]    [comp]   [comp]    [comp]      [comp]
outlined [comp]    [comp]   [comp]    [comp]      [comp]
soft     [comp]    [comp]   [comp]    [comp]      [comp]
ghost    [comp]    [comp]   [comp]    [comp]      [comp]
```
- Use CSS grid: `grid-template-columns: auto repeat(5, 1fr)`
- Hover/active states: use `data-force-hover`, `data-force-active` attributes + CSS

### Surface Context Section
```html
<div class="surface-demo" style="background: var(--surface-bright-bg);">
  <div class="{comp}" data-variant="filled">On Bright</div>
</div>
<div class="surface-demo" style="background: var(--surface-base-bg);">
  <div class="{comp}" data-variant="filled">On Base</div>
</div>
<div class="surface-demo" style="background: var(--surface-dim-bg);">
  <div class="{comp}" data-variant="filled">On Dim</div>
</div>
```

### Framework Tabs
```html
<div class="fw-snippet-tabs">
  <button class="fw-snippet-tab" aria-selected="true" data-fw="react">React</button>
  <button class="fw-snippet-tab" data-fw="vue">Vue</button>
  <button class="fw-snippet-tab" data-fw="html">HTML</button>
  <button class="fw-snippet-tab" data-fw="css">CSS Tokens</button>
</div>
```
- `shared.js` handles tab switching automatically
- Code blocks use `<pre><code>` with proper escaping

### JavaScript Pattern
```javascript
(function() {
  'use strict';

  /* ── helpers ───────────────────────────────────── */
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ── pill-bar wiring ───────────────────────────── */
  function wirePillBar(barSelector, callback) {
    const bar = $(barSelector);
    if (!bar) return;
    bar.addEventListener('click', e => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      bar.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false'));
      pill.setAttribute('aria-pressed', 'true');
      callback(pill);
    });
  }

  /* ── inspector update ──────────────────────────── */
  function updateInspector() {
    const el = $('.{comp}.synced-{comp}');
    if (!el) return;
    const cs = getComputedStyle(el);
    // Read and display resolved values
  }

  /* ── wire controls ─────────────────────────────── */
  wirePillBar('[data-bar="structBar"]', pill => {
    $$('.synced-{comp}').forEach(el => el.dataset.variant = pill.dataset.ctrlStruct);
    updateInspector();
  });
  // ... wire size, role, rounded bars

  /* ── theme change hook ─────────────────────────── */
  window.DTF = window.DTF || {};
  window.DTF.onThemeChange = () => { updateInspector(); };

  /* ── initial state ─────────────────────────────── */
  updateInspector();
})();
```

## Validation Commands

```bash
COMP="{component}"

# 1. All 11 sections present
for sec in sec-hero sec-variants sec-density sec-states sec-surface sec-shape sec-slots sec-motion sec-playground sec-a11y sec-framework; do
  grep -q "id=\"$sec\"" "demo/$COMP.html" && echo "✅ $sec" || echo "❌ MISSING $sec"
done

# 2. Correct import order (tokens before component, shared.css last)
grep -n "stylesheet" "demo/$COMP.html" | head -10

# 3. Pill bars use button pattern (NOT radio)
grep -c 'type="radio"' "demo/$COMP.html"
echo "(should be 0 — pill bars use button+aria-pressed)"

# 4. Base is default size
grep 'data-ctrl-size="base".*aria-pressed="true"' "demo/$COMP.html" | head -1
echo "(should find base pill with aria-pressed=true)"

# 5. aria-current on own link only
grep -c 'aria-current="page"' "demo/$COMP.html"
echo "(should be exactly 1)"

# 6. IIFE pattern
grep -c "(function()" "demo/$COMP.html"
echo "(should be >= 1)"

# 7. DTF.onThemeChange hook
grep -q "DTF.onThemeChange" "demo/$COMP.html" && echo "✅ theme hook" || echo "❌ theme hook MISSING"
```
