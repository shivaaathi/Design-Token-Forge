# UI Quality Checklist

## Reference: button.html is the gold standard

Every demo page should match the visual quality, interactivity, and section depth of button.html.

## Required Demo Sections (Minimum 9)

### 1. Hero Preview with Inspector (`#sec-hero`)
- [ ] Split layout: preview (left) + inspector (right)
- [ ] Inspector shows resolved token values in monospace
- [ ] Inspector updates LIVE when pill-bar controls change
- [ ] Inspector shows: height, padding-x, padding-y, border-radius, gap, font-size, bg-color, border-color, shadow, transition-duration
- [ ] Inspector title reflects current variant/size state

### 2. Variant/Role Gallery (`#sec-variants` or `#sec-roles`)
- [ ] Shows ALL variants/roles side by side in cards
- [ ] Each card labeled with variant/role name
- [ ] Cards use `.variant-card` + `.variant-label` pattern
- [ ] For role-based: show each role × each structural variant (e.g. info-filled, info-outline, info-soft)

### 3. Density Scale (`#sec-density`)
- [ ] All 10 sizes shown: micro, tiny, small, base, medium, large, big, huge, mega, ultra
- [ ] Uses `.density-strip` + `.density-item` + `.density-meta` pattern
- [ ] Meta label shows actual resolved dimension (px value or size name)
- [ ] Visual progression is clear (small → large flow)

### 4. State Matrix (`#sec-states`) — CRITICAL, COMMONLY MISSED
- [ ] CSS grid layout: variant/role labels as rows, states as columns
- [ ] Column headers: Default, Hover, Active/Pressed, Focus, Disabled, Error (if applicable)
- [ ] Row headers: each variant or role
- [ ] Every cell contains a live component instance in that state
- [ ] Hover state: apply via `title="Hover me"` tooltip or JS hover simulation
- [ ] Disabled: `data-disabled` attribute set
- [ ] Error: `data-error` attribute set (if applicable)
- [ ] Uses `.state-grid` + `.state-header` + `.state-row-label` pattern

### 5. Surface Context (`#sec-surface`) — CRITICAL, COMMONLY MISSED
- [ ] Shows component on 3 different background levels
- [ ] Panel 1: `surface-base-bg` (lightest / default)
- [ ] Panel 2: `surface-base-hover` (mid-tone)
- [ ] Panel 3: `surface-base-pressed` (darkest)
- [ ] Uses `.surface-strip` + `.surface-panel` pattern
- [ ] Component must be VISIBLE on all 3 backgrounds
- [ ] Labels show which surface token is applied

### 6. Shape & Shadow (`#sec-shape`)
- [ ] Radius scale: show component at each radius level
- [ ] Shadow presets: none, xs, sm, DEFAULT, md, lg
- [ ] If component supports `data-rounded` / `data-square`: show both

### 7. Slots & Anatomy (`#sec-slots`)
- [ ] Every sub-element shown in isolation and in context
- [ ] Icon slots: leading, trailing, icon-only (where applicable)
- [ ] Label/text slots: title, description, helper
- [ ] Action slots: close button, action button, link
- [ ] Show with and without optional slots

### 8. Accessibility (`#sec-a11y`)
- [ ] 4 cards with `.a11y-grid` layout
- [ ] Card 1: **Focus Ring** — live focusable component (Tab to it)
- [ ] Card 2: **Disabled** — live disabled instance
- [ ] Card 3: **Reduced Motion** — note about `prefers-reduced-motion`
- [ ] Card 4: **Forced Colors** — note about system color keywords
- [ ] Each card has live component demo, not just text description

### 9. Framework Snippets (`#sec-framework`)
- [ ] 4 tabs: React, Vue, HTML, CSS Tokens
- [ ] React: JSX with `className`, `data-*={prop}`, conditional attributes
- [ ] Vue: template with `:data-*`, `v-if`, `<slot />`
- [ ] HTML: static markup showing all data attributes
- [ ] CSS Tokens: full token reference grouped by axis
- [ ] HTML tab REACTIVE — updates when global pill-bar controls change (see button.html pattern)

### Optional but recommended:
- [ ] Context Playground (`#sec-playground`) — interactive role/surface/variant switcher
- [ ] Motion (`#sec-motion`) — animation demos with play/pause

## Global Controls (Pill Bars)

- [ ] All pill bars are REACTIVE — changing a pill re-renders ALL sections
- [ ] `applyGlobals()` function calls every render function
- [ ] Pill bar listeners use `data-ctrl-{axis}` pattern
- [ ] Default pill has `aria-pressed="true"`
- [ ] Controls include at minimum: variant/role + size
- [ ] Shape control if component supports `data-rounded`/`data-shape`

## Visibility & Contrast

- [ ] Component NOT invisible on page background (test both light and dark themes)
- [ ] Soft/ghost variants visible on white background (use outline or shadow if needed)
- [ ] Icons/text have sufficient contrast against component background
- [ ] Disabled state clearly distinguishable (opacity, not just color change)
- [ ] Theme toggle works — all sections re-render correctly in dark mode

## Animation & Interaction Demos

- [ ] Every animation in CSS has a LIVE interactive demo (not just code)
- [ ] Dismiss animations: click-to-dismiss with fade/slide out
- [ ] Enter/exit animations: show/hide toggle
- [ ] Indeterminate/loading: continuous loop visible
- [ ] Progress: interactive slider to drag 0→100%
- [ ] Auto-dismiss: live countdown with progress bar

## Layout Quality

- [ ] No touching elements without gap (use gap tokens)
- [ ] Flex/grid wrapping works on narrower viewports
- [ ] Demo-only styles in `<style>` block, NOT in component CSS
- [ ] Consistent padding/spacing between sections
- [ ] `.section-body` has adequate padding for visual breathing room

## Text Overflow

- [ ] Long labels/text tested — truncation or wrapping handled
- [ ] Ellipsis shown where applicable
- [ ] Multi-line body text doesn't break layout
- [ ] File names, badge labels, toast messages tested with 200+ char strings
