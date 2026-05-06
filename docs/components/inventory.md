# L1 Component Inventory

## Complete List

35 L1 components organized by category. Each links to its variable spec.

**Density modes**: micro, tiny, small, base, medium, large, big, huge, mega, ultra (not all components support all 10).

---

### Inputs & Controls (13)

| # | Component | Prefix | Sizes | Variants | Key design surface |
|---|-----------|--------|-------|----------|--------------------|
| 1 | Button | `btn` | all 10 | primary,secondary,tertiary,ghost,danger,success,warning | Most visible brand expression |
| 2 | IconButton | `icon-btn` | all 10 | primary,secondary,ghost,danger,neutral,outline | Square/circle shape critical |
| 3 | SplitButton | `split-btn` | all 10 | primary,secondary,danger,neutral | Action + dropdown trigger, divider, menu integration |
| 4 | MenuButton | `menu-btn` | all 10 | primary,secondary,ghost,neutral | Icon+chevron, text+chevron, icon+text+chevron trigger |
| 5 | Toggle/Switch | `switch` | all 10 | filled,outlined | Track + thumb shape variation huge |
| 6 | Checkbox | `checkbox` | all 10 | filled,outlined | Square vs rounded vs circle debate |
| 7 | Radio ✅ | `radio` | all 10 | filled,outlined | Always circular, dot indicator, group support |
| 8 | Input/TextField | `input` | all 10 | outline,filled,underline | Underline (Material) vs outline vs filled |
| 9 | Textarea ✅ | `textarea` | all 10 | outline,filled | Resize handle, min/max rows, auto+fixed height |
| 10 | Select | `select` | all 10 | outline,filled | Dropdown indicator, option styling |
| 11 | Slider | `slider` | small→large | default | Track + thumb + mark + range |
| 12 | DatePicker | `datepicker` | micro→ultra | outline,filled | Calendar grid, day cell shape |
| 13 | FileUpload | `file-upload` | base→large | button,dropzone | Dropzone border pattern |

### Display & Feedback (10)

| # | Component | Prefix | Sizes | Variants | Key design surface |
|---|-----------|--------|-------|----------|--------------------|
| 14 | Avatar | `avatar` | all 10 | default | Circle vs squircle vs rounded-square |
| 15 | Badge/Tag | `badge` | micro→medium | filled,outline,soft,dot | Pill vs rounded vs square |
| 16 | Tooltip | `tooltip` | small→base | default,error | Arrow shape, placement |
| 17 | Alert | `alert` | base | info,success,warning,danger | Left-border accent pattern |
| 18 | Toast | `toast` | base | info,success,warning,danger | Position, entrance animation |
| 19 | Progress Bar | `progress` | micro→large | default | Track + fill radius matching |
| 20 | Progress Circle | `progress-ring` | small→large | default | Stroke width, cap style |
| 21 | Spinner | `spinner` | micro→large | default | Stroke, speed, color |
| 22 | Skeleton | `skeleton` | base | text,rect,circle | Animation style, radius |
| 23 | KBD | `kbd` | small→base | default | Key cap shape (3D border effect) |

### Layout & Structure (7)

| # | Component | Prefix | Sizes | Variants | Key design surface |
|---|-----------|--------|-------|----------|--------------------|
| 24 | Card | `card` | micro→ultra | flat,raised,strong,outline | Shadow + radius = brand signature |
| 25 | Divider | `divider` | all 10 | solid,dashed,dotted | Orientation, label slot |
| 26 | Accordion | `accordion` | base | default,bordered,separated | Expand icon, border pattern |
| 27 | Tabs | `tabs` | small→large | underline,boxed,pills | Active indicator shape/position |
| 28 | Table | `table` | small→large | default,striped,bordered | Header, row, cell density |
| 29 | List/ListItem | `list` | small→large | default | Interactive vs static, indent |
| 30 | Pagination | `pagination` | small→large | default | Active page shape |

### Navigation (4)

| # | Component | Prefix | Sizes | Variants | Key design surface |
|---|-----------|--------|-------|----------|--------------------|
| 31 | Link | `link` | small→large | default,muted | Underline style, hover effect |
| 32 | Breadcrumb | `breadcrumb` | small→base | default | Separator character/icon |
| 33 | Menu/Dropdown | `menu` | small→base | default | Item hover shape, dividers |
| 34 | Navbar | `navbar` | base | default | Height, shadow, blur backdrop |

### Overlay (4)

| # | Component | Prefix | Sizes | Variants | Key design surface |
|---|-----------|--------|-------|----------|--------------------|
| 35 | Modal/Dialog | `modal` | small→ultra | default | Backdrop, radius, shadow |
| 36 | Drawer | `drawer` | small→large | default | Position, slide animation |
| 37 | Popover | `popover` | small→base | default | Arrow, shadow, placement |
| 38 | Sheet | `sheet` | small→large | bottom,side | Handle bar, snap points |

---

## Spec Completion Tracker

| Component | Spec | Tokens CSS | Component CSS | Demo | React | Vue | Svelte |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Button | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| IconButton | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| SplitButton | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| MenuButton | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Toggle/Switch | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Checkbox | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Radio | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Input | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Textarea | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Select | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| Slider | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| DatePicker | ✅ | ✅ | ✅ | ✅ | ⬜ | ⬜ | ⬜ |
| FileUpload | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Avatar | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Badge/Tag | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Tooltip | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Alert | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Toast | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Progress Bar | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Progress Circle | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Spinner | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Skeleton | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| KBD | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Card | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Divider | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Accordion | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Tabs | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Table | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| List/ListItem | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Pagination | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Link | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Breadcrumb | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Menu/Dropdown | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Navbar | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Modal/Dialog | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Drawer | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Popover | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Sheet | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

**Progress: 12/38 components (Phase 1 CSS-first pipeline)**

_Button: 246 vars · 10 variants · 10 sizes | Input: 172 vars · 3 variants · 10 sizes_
