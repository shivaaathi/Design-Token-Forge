# Design Token Forge — 8-Component Quality Audit

**Date:** 2026-03-26  
**Gold Standard:** Button (243 vars, 11 demo sections, all axes)

---

## 1. Token File Summary

| Component | Total Vars | vs Button (243) | Per-Size Radius | Per-Size Height/Size | Per-Size Icon | Per-Size Font | Per-Size Gap | Per-Size Pad-X/Y |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Button** (gold) | **243** | 100% | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 | 20/20 |
| Alert | 66 | 27% | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 | 6 (3 sizes) |
| Badge | 116 | 48% | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 |
| Toast | 56 | 23% | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 |
| Tooltip | 51 | 21% | 0/10 | 0/10 | 3/10 | 3/10 | 0/10 | 6 (3 sizes) |
| Avatar | 86 | 35% | 10/10 | 10/10 | 10/10 | 10/10 | 0/10 | 0/10 |
| Progress Bar | 39 | 16% | 0/10 | 10/10 | 0/10 | 0/10 | 0/10 | 0/10 |
| Progress Ring | 43 | 18% | 0/10 | 10/10 | 0/10 | 0/10 | 0/10 | 0/10 |
| File Upload | 157 | 65% | 10/10 | 20/20† | 10/10 | 10/10 | 10/10 | 20/20 |

† File Upload has both btn-height (10) and drop-min-height (10) per density.

---

## 2. Axis Headers in Token Files (7 axes)

| Component | 📐 SHAPE | 📏 DIMENSION | 🎨 SURFACE | ✏️ TYPOGRAPHY | 🧩 SLOTS | ⚡ MOTION | ♿ A11Y | Score |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Button** (gold) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 7/7 |
| Alert | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **7/7** |
| Badge | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **7/7** |
| Toast | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **7/7** |
| Tooltip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **7/7** |
| Avatar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **7/7** |
| Progress Bar | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | **6/7** |
| Progress Ring | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | **6/7** |
| File Upload | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **7/7** |

---

## 3. Variants / Roles Defined

| Component | Variants (structural) | Roles (semantic) | Total Distinct |
|---|---|---|---:|
| **Button** (gold) | primary, secondary, tertiary, ghost, outline | danger, success, warning, neutral, brand | 10 |
| Alert | — | info, success, warning, danger | 4 |
| Badge | filled, outline, soft, dot | danger, success, warning, neutral | 8 |
| Toast | — | info, success, warning, danger | 4 |
| Tooltip | default(dark), light, error, success | — | 4 |
| Avatar | — | primary, brand, danger, success, warning | 5 |
| Progress Bar | — | primary, success, warning, danger, neutral | 5 |
| Progress Ring | — | primary, success, warning, danger, neutral | 5 |
| File Upload | outline, filled | — | 2 |

---

## 4. CSS File Audit

| Component | Lines | Readable? | @keyframes | @media forced-colors | @media reduced-motion | :has() | Per-variant states |
|---|---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Button** (gold) | 586 | ✅ | ✅ (1) | ✅ | ✅ | ✅ (2) | ✅ extensive |
| Alert | 237 | ⚠️ partial† | ❌ | ✅ | ✅ | ✅ (1) | ✅ (3) |
| Badge | 220 | ⚠️ partial† | ❌ | ✅ | ✅ | ❌ | ✅ (7) |
| Toast | 266 | ✅ | ❌ | ✅ | ✅ | ✅ (1) | ✅ (3) |
| Tooltip | 208 | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Avatar | 192 | ⚠️ partial† | ❌ | ✅ | ✅ | ❌ | ✅ (1) |
| Progress Bar | 161 | ✅ | ✅ (2) | ✅ | ✅ | ❌ | ❌ |
| Progress Ring | 145 | ✅ | ✅ (2) | ✅ | ✅ | ❌ | ❌ |
| File Upload | 530 | ✅ | ❌ | ✅ | ✅ | ✅ (5) | ✅ (13) |

† "partial" = ≥10 lines exceeding 200 chars (semi-minified variant/role selectors).

---

## 5. Demo Page Audit

| Component | Sections | Hero Inspector | State Matrix | Surface Context | Shape & Shadow | Slots | Motion | Playground | Framework | A11Y |
|---|---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Button** (gold) | **11** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Alert | 8 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Badge | 9 | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Toast | 8 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Tooltip | 7 | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Avatar | 9 | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Progress Bar | 8 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Progress Ring | 6 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| File Upload | 10 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Demo section detail:

| Component | Named Sections |
|---|---|
| Button (gold) | hero, variants, density, states, surface, shape, slots, motion, playground, a11y, framework |
| Alert | hero, roles, variants, sizes, accent, dismiss, a11y, framework |
| Badge | hero, variants, shapes, density, roles, dot, dismiss, a11y, framework |
| Toast | hero, roles, anatomy, positions, actions, progress, a11y, framework |
| Tooltip | hero, variants, placement, sizes, rich, a11y, framework |
| Avatar | hero, content, shapes, density, roles, badges, group, a11y, framework |
| Progress Bar | hero, roles, density, striped, indeterminate, label, a11y, framework |
| Progress Ring | hero, roles, density, indeterminate, a11y, framework |
| File Upload | hero, variants, modes, density, states, filelist, surface, shape, a11y, framework |

---

## 6. Completeness Score (vs Button Gold Standard)

Scoring methodology — 100 points total across 6 categories:
- **Token count** (15 pts): proportional to button's 243
- **Per-size scaling** (25 pts): 5pts each for icon/10, font/10, gap/10, padding/10, radius/10
- **Axis headers** (10 pts): 7/7 = 10pts
- **CSS features** (20 pts): 4pts each for @keyframes, forced-colors, reduced-motion, :has(), per-variant-states
- **Demo sections** (20 pts): ~2pts each for hero-inspector, state-matrix, surface, shape+shadow, slots, motion, playground, framework, a11y, density
- **Variants depth** (10 pts): proportional to button's 10 variants/roles

| Component | Tokens /15 | Per-Size /25 | Axes /10 | CSS /20 | Demo /20 | Variants /10 | **TOTAL** | **Grade** |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
| **Button** (gold) | 15.0 | 25.0 | 10.0 | 20.0 | 20.0 | 10.0 | **100** | 🏆 |
| **File Upload** | 9.7 | 25.0 | 10.0 | 16.0 | 14.0 | 2.0 | **76.7** | A− |
| **Badge** | 7.2 | 25.0 | 10.0 | 12.0 | 8.0 | 8.0 | **70.2** | B+ |
| **Avatar** | 5.3 | 15.0 | 10.0 | 8.0 | 8.0 | 5.0 | **51.3** | C |
| **Alert** | 4.1 | 0.0 | 10.0 | 12.0 | 4.0 | 4.0 | **34.1** | D+ |
| **Toast** | 3.5 | 0.0 | 10.0 | 12.0 | 4.0 | 4.0 | **33.5** | D+ |
| **Tooltip** | 3.1 | 3.0 | 10.0 | 8.0 | 6.0 | 4.0 | **34.1** | D+ |
| **Progress Bar** | 2.4 | 0.0 | 8.6 | 12.0 | 4.0 | 5.0 | **32.0** | D |
| **Progress Ring** | 2.7 | 0.0 | 8.6 | 12.0 | 4.0 | 5.0 | **32.3** | D |

---

## 7. Key Findings & Gaps

### ✅ Universally Present
- All 8 have `@media (forced-colors: active)` — excellent
- All 8 have `@media (prefers-reduced-motion: reduce)` — excellent
- All 8 have framework snippet and a11y sections in demos
- 6/8 have all 7 axis headers (only Progress Bar/Ring missing 🧩 SLOTS)

### 🔴 Critical Gaps (most components miss these)

1. **Per-size scaling (micro→ultra) is sparse.** Only Badge, Avatar, and File Upload have all 10 density steps for icon/font. Alert, Toast, Tooltip, Progress Bar, Progress Ring have NO per-size icon scaling at all.

2. **Demo pages missing gold-standard sections:**
   - **Hero Inspector:** Only 4/8 have it (Badge, Tooltip, Avatar, File Upload)
   - **State Matrix:** Only 1/8 has it (File Upload)
   - **Surface Context:** Only 1/8 has it (File Upload)
   - **Shape & Shadow:** Only 3/8 have it (Badge, Avatar, File Upload)
   - **Slots section:** 0/8 have it
   - **Motion section:** Only 1/8 has it (Tooltip)
   - **Playground:** 0/8 have it

3. **@keyframes missing:** Only Progress Bar (2) and Progress Ring (2) have keyframe animations. Alert, Badge, Toast, Tooltip, Avatar, File Upload all lack them.

4. **:has() selectors sparse:** Only Alert (1), Toast (1), and File Upload (5) use `:has()`. Badge, Tooltip, Avatar, Progress Bar, Progress Ring have none.

5. **Per-variant state selectors weak:** Tooltip, Progress Bar, Progress Ring have zero per-variant hover/active/disabled state handling in CSS.

### 🟡 Component-Specific Issues

| Component | Specific Issues |
|---|---|
| **Alert** | No per-density scaling at all (only 3 size-modes: small/base/large). Missing hero inspector, state matrix, surface, shape sections in demo. No @keyframes for dismiss animation. |
| **Badge** | Good per-size scaling but no :has() selectors. Missing state matrix, surface, motion in demo. Semi-minified CSS (10 lines >200 chars). |
| **Toast** | No per-density scaling. No @keyframes for enter/exit despite having motion tokens. Missing hero inspector and most demo sections. |
| **Tooltip** | Only 3-size (small/base/large) instead of 10. No @keyframes for show/hide. No per-variant state selectors. |
| **Avatar** | Missing gap/padding per-density. No @keyframes. No :has(). Semi-minified CSS (10 lines >200 chars). |
| **Progress Bar** | Missing 🧩 SLOTS axis. No per-size icon/font/gap/padding/radius. Only has per-size height. |
| **Progress Ring** | Missing 🧩 SLOTS axis. No per-size icon/font/gap/padding/radius. Only has per-size diameter + stroke. Fewest demo sections (6). |
| **File Upload** | Best overall (76.7%). Good per-size scaling & CSS features. Missing @keyframes, motion section, playground, slots section. Only 2 variants (needs role colors?). |

---

## 8. Priority Remediation

### Tier 1 — High Impact (bring all to ≥60%)
1. Add per-size icon/font/gap/padding/radius tokens to **Alert, Toast, Tooltip, Progress Bar, Progress Ring** (10 entries each, micro→ultra)
2. Add **hero inspector** to Alert, Toast, Progress Bar, Progress Ring demos
3. Add **state matrix** section to all demos except File Upload
4. Add **surface context** section to all demos except File Upload

### Tier 2 — Medium Impact (CSS completeness)
5. Add `@keyframes` to Alert (dismiss), Toast (enter/exit), Tooltip (show/hide), Avatar (fade), File Upload (drop)
6. Add `:has()` selectors to Badge, Tooltip, Avatar, Progress Bar, Progress Ring
7. Add `🧩 SLOTS` axis to Progress Bar & Progress Ring token files
8. Add per-variant state selectors to Tooltip, Progress Bar, Progress Ring CSS

### Tier 3 — Demo Parity
9. Add **shape & shadow** section to Alert, Toast, Tooltip, Progress Bar, Progress Ring
10. Add **slots** section to all 8 demos
11. Add **motion** section to all demos except Tooltip
12. Add **playground** section to all 8 demos
