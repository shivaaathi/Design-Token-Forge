# Tap-Target Checklist

## Rule

Every interactive element must have a minimum 44×44px touch target (WCAG 2.5.8 Target Size Level AA). This is especially important at small density modes (micro, tiny, small).

## Implementation Pattern

```css
/* For components that can be smaller than 44px (micro, tiny, small sizes): */
.{comp} {
  position: relative;
  /* ...existing styles... */
}

/* Invisible touch target expansion */
.{comp}::after {
  content: '';
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  min-inline-size: var(--{comp}-min-tap-target);
  min-block-size: var(--{comp}-min-tap-target);
}
```

This creates an invisible hitbox that's always at least 44×44px, even when the visual component is 20px (micro).

## Components That Need This

Any component with density modes where `height < 44px`:

| Size | Height | Needs Tap Expansion |
|---|---|---|
| micro | 20px | YES |
| tiny | 24px | YES |
| small | 28px | YES |
| base | 36px | YES |
| medium | 40px | YES |
| large | 44px | NO (exactly 44px) |
| big | 48px | NO |
| huge+ | 52px+ | NO |

## Per-Component Check

Interactive components that need tap target enforcement:
- [ ] button, icon-button, split-button, menu-button
- [ ] toggle, checkbox, radio
- [ ] input, textarea, select (trigger area)
- [ ] slider (thumb)
- [ ] file-upload (trigger)
- [ ] alert close button
- [ ] toast close button
- [ ] pagination buttons
- [ ] tab buttons
- [ ] accordion triggers

## Verification

```bash
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  tokens="$dir/${comp}.tokens.css"
  if grep -q "min-tap-target" "$tokens" 2>/dev/null; then
    if grep -q "min-tap-target\|min-inline-size.*44\|min-block-size.*44" "$css" 2>/dev/null; then
      echo "✅ $comp: token + enforcement"
    else
      echo "⚠️  $comp: token defined but NOT enforced in CSS"
    fi
  else
    echo "❌ $comp: no min-tap-target token defined"
  fi
done
```
