# Focus-Visible Checklist

## Rule

Every interactive component MUST have a `:focus-visible` selector that shows a visible focus ring. This is WCAG 2.4.7 (Focus Visible) — Level AA.

## Pattern A: Direct Interactive Element (button, link)

```css
.{comp}:focus-visible {
  outline: var(--{comp}-focus-outline-width) solid var(--{comp}-focus-outline-color);
  outline-offset: var(--{comp}-focus-outline-offset);
}
```

## Pattern B: Composed Element (input inside wrapper)

For components where the native input is hidden/styled and a visual wrapper exists:

```css
/* Focus shows on the WRAPPER when the hidden INPUT gets focus */
.{comp}:has(.{comp}__input:focus-visible) {
  outline: var(--{comp}-focus-outline-width) solid var(--{comp}-focus-outline-color);
  outline-offset: var(--{comp}-focus-outline-offset);
}
```

## Pattern C: Close/Action Button Inside Component

For components like Alert, Toast that have a close button:

```css
.{comp}__close:focus-visible {
  outline: 2px solid var(--primary-component-outline-default);
  outline-offset: 2px;
}
```

## Components to Fix

### input.css
- [ ] Add: `.input:has(.input__field:focus-visible)` for wrapper focus ring
- [ ] Verify native `<input>` `:focus` doesn't show double ring (set `outline: none` on `.input__field:focus`)

### select.css
- [ ] Add: `.select:has(.select__trigger:focus-visible)` for wrapper focus ring
- [ ] Or use `.select__trigger:focus-visible` directly if trigger is the focusable element

### textarea.css
- [ ] Add: `.textarea:has(.textarea__field:focus-visible)` for wrapper focus ring
- [ ] Same pattern as input — native element gets `outline: none`, wrapper shows ring

### tooltip.css
- [ ] Tooltip itself isn't interactive, but:
- [ ] If trigger element is inside tooltip wrapper → add focus-visible to trigger
- [ ] If tooltip has `tabindex` for accessibility → add focus-visible to the tooltip root

## Verification

```bash
# Check all component CSS files for focus-visible
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  if grep -q "focus-visible" "$css"; then
    echo "✅ $comp"
  else
    echo "❌ $comp — MISSING focus-visible"
  fi
done
```

## Anti-Pattern: Bare :focus

```css
/* ❌ WRONG — shows focus ring on mouse click too */
.comp:focus {
  outline: 2px solid blue;
}

/* ✅ CORRECT — keyboard only */
.comp:focus-visible {
  outline: 2px solid var(--comp-focus-outline-color);
}
```
