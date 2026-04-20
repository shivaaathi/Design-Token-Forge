# Getting Started Documentation Checklist

## Purpose

Write documentation that takes a developer from zero to working component in under 30 minutes.

## File Location
`docs/getting-started.md`

## Required Sections (in order)

### 1. What is Design Token Forge? (3-5 sentences)
- [ ] One sentence: what it is
- [ ] One sentence: what makes it different (variable-exhaustive, 10 density modes)
- [ ] One sentence: how it works (CSS custom properties, no JS runtime)

### 2. Installation
```bash
# Install tokens + components
npm install @design-token-forge/tokens @design-token-forge/components

# Optional: React wrappers
npm install @design-token-forge/react
```
- [ ] Show npm, pnpm, and yarn commands
- [ ] Mention peer dependencies if any

### 3. Import CSS (3 options)

#### Option A: All-in-one
```css
@import '@design-token-forge/tokens';
@import '@design-token-forge/components';
```

#### Option B: Individual layers
```css
@import '@design-token-forge/tokens/primitives';
@import '@design-token-forge/tokens/semantic';
@import '@design-token-forge/tokens/surfaces';
@import '@design-token-forge/tokens/extras';
@import '@design-token-forge/components/button';
@import '@design-token-forge/components/input';
```

#### Option C: In a bundler (Vite, Next.js, etc.)
```javascript
// main.js or layout.tsx
import '@design-token-forge/tokens';
import '@design-token-forge/components';
```

### 4. Use Your First Component (HTML example)
```html
<button class="btn" data-size="base" data-variant="filled">
  Click me
</button>
```
- [ ] Show the simplest possible example
- [ ] Explain data-size and data-variant briefly

### 5. Use with React (if wrapper exists)
```tsx
import { Button } from '@design-token-forge/react';

function App() {
  return (
    <Button size="base" variant="filled" colorRole="primary">
      Click me
    </Button>
  );
}
```

### 6. Customize for Your Brand
```bash
npx dtf --color "#E53F28" --name "myapp" --output ./src/theme.css
```
Then import the generated theme:
```css
@import '@design-token-forge/tokens';
@import './theme.css';       /* Your brand overrides */
@import '@design-token-forge/components';
```
- [ ] Show the 3-step process: generate → import → done
- [ ] Emphasize: "one command to rebrand the entire system"

### 7. Dark Mode
```html
<html data-theme="dark">
```
- [ ] Single attribute toggles everything
- [ ] No extra CSS needed

### 8. Density Modes
```html
<button class="btn" data-size="small">Small</button>
<button class="btn" data-size="base">Base (default)</button>
<button class="btn" data-size="large">Large</button>
```
- [ ] Show 3 sizes side by side
- [ ] List all 10 modes

### 9. Available Components (link table)
| Component | Import | Demo |
|---|---|---|
| Button | `@design-token-forge/components/button` | [Demo](demo link) |
| etc. | | |

### 10. Next Steps
- [ ] Link to architecture overview
- [ ] Link to full component demos
- [ ] Link to CSS API reference
- [ ] Link to customization guide

## Writing Rules

- [ ] No jargon without explanation
- [ ] Every code sample must be copy-pasteable
- [ ] Assume the reader has never seen DTF before
- [ ] Show the SIMPLEST way first, advanced options second
- [ ] Test every code sample — it must actually work
