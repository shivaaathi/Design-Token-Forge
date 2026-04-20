# Two-File Structural Analysis: complete.html vs mockup-v2.html

## EXECUTIVE SUMMARY

**complete.html** (2496 lines) is a **production-grade design token explorer** with full feature parity to a design system portal — it showcases a real app mockup with 4 interactive "zones" and provides complete token coverage matrices.

**mockup-v2.html** (921 lines) is a **cinematic design language showcase** focusing on pure visual interactions and token context with an onboarding intro sequence and simplified inspector/token browser.

Both share the same token system (607 tokens, 4 tiers, 9 surfaces, 6 roles, 10 densities) but serve different purposes.

---

## FILE 1: complete.html (2496 lines) — PRODUCTION PORTAL

### Overall Structure
- **Purpose**: Full feature portal for exploring & understanding design tokens through a **live interactive demo app + token matrices**
- **Layout**: 3-column grid (sidebar 232px | main content flex | topbar 48px)
- **Key Paradigm**: "Zone-based preview" — demonstrates how the same token set resolves differently across 4 different surface contexts (Navigation, Page, Users, Invites)

### CSS Architecture (Major Sections)

#### 1. **Reset & Root Tokens** (~50 lines)
- CSS reset + box-sizing
- Root CSS variables for colors, borders, typography scales, radius
- Light/dark theme variable overrides (`.app.portal-light`)

#### 2. **App Grid Layout** (~100 lines)
- `.app` — 232px sidebar + flex content, 48px topbar + flex body
- `.topbar` — fixed header with logo, search, breadcrumb, Export button
- `.sidebar` — scrollable nav with sections (Overview, Explore, Scale, Reference)
- `.main` — flex container for views
- `.vbar` — sub-navigation bar for tabs within views

#### 3. **Primitives Gallery** (~150 lines)
- `.prim-g`, `.sw-row`, `.sw`, `.sw-col`, `.sw-meta` — color swatches arranged horizontally
- `.g-lbl` with divider line
- Hover animations: scale up, shadow lift
- Click to copy hex value

#### 4. **Roles Display** (~120 lines)
- `.rc` (role chips) — 6 semantic roles with colored dots
- `.rex` (role explorer) — 3-column breakdown (content/component/container tokens)
- `.role-chips` + `.role-demo-grid` — 2 panels per role showing light + dark previews
- Token cards with split light/dark swatches

#### 5. **Surfaces & Contexts** (~150 lines)
- `.sp-pills` — 9 surface environment tabs
- `.demo-grid` — 2×2 grid of UI component previews per surface
- `.demo-panel`, `.demo-btn`, `.demo-input`, `.demo-badge`, `.demo-list-item`
- Each surface has a unique background, text colors, component styling

#### 6. **Numbers (Spacing/Typo/Sizes)** (~180 lines)
- `.sp-scale` — spacing scale with bar visualization + copy button
- `.typo-table-wrap` — table for font sizes with preview column
- `.cs-scroll` + `.cs-table` — component size matrix (sticky left column for names)
- `.num-section`, `.num-chip` — grouping and filtering

#### 7. **Export Panel** (~140 lines)
- `.exp-wrap` — 2-column layout (format options left | code right)
- `.fmt-opts`, `.fmt-o` — radio button style options (JSON, CSS, Tailwind, etc.)
- `.exp-code-wrap`, `.exp-code-body` — syntax-highlighted code block
- `.exp-chk` — checkboxes for selective export
- Color-coded tokens: `.cs-code` (primary), `.cp` (brand), `.cv` (success), `.cc` (comment)

#### 8. **Search Results Overlay** (~80 lines)
- `.search-results` — absolute positioned dropdown overlay
- `.sr-group`, `.sr-item`, `.sr-sw` (swatch), `.sr-name`, `.sr-tag`
- Appears on topbar search focus, hides with `display:none` by default

#### 9. **Preview & Playground** (~250 lines)
- `.pv-controls` — theme toggle, accent role selector, density chips, status badge select
- `.pv-stage` — container for Section A (demo app) + Section B (matrices)
- **Section A: Interactive Demo App** (676×464px logical mockup)
  - Grid: 22% nav sidebar + flex content
  - **Zone 1 (Navigation)**: Profile section, Applicants tree, Schools list, Org/Insights/Settings, footer icons
  - **Zone 2 (Page Content)**: Topbar (title + bell/mail), Settings heading, 3 tabs (General/Users/Security), content area
  - **Zone 3 (Users Card)**: Table-like rows with avatar + name/email + role dropdown + trash icon
  - **Zone 4 (Invites Card)**: Similar rows but with Pending badges + Resend/Revoke buttons
  - **Dialog overlay**: "Invite a new member" form (email input, role select)
  - Uses **density tokens** to scale all sizes proportionally (buttons, padding, fonts scale with density slider)
  - Uses **zone surface contexts** — each zone can have different surface assigned, token values resolve accordingly
  - Uses **accent role** for CTA buttons throughout
  - Uses **status role** for pending invite badges
  - Uses **semantic danger role** for Revoke button
  - **Dynamic CSS injection**: `.pv-dynamic-styles` element receives CSS for hover/active/transition states
- **Section B: Token Coverage Matrices** (4 sub-sections)
  - **B1**: Surface tokens (9 surfaces × 34 sub-tokens per surface in grid)
  - **B2**: Semantic role tokens (6 roles × 18 token variations)
  - **B3**: Component size tokens (grouped by component, shows current density values)
  - **B4**: Roles × Components gallery (6 cards, each showing buttons/tags/badges/controls in all states)
  - **B5**: Utility tokens (special purpose tokens, clickable for copy)

#### 10. **Light Theme Overrides** (~100 lines)
- `.app.portal-light` — swaps all CSS variables to light equivalents
- Affects topbar, sidebar, buttons, cards, swatches, modals

#### 11. **Responsive Design** (~50 lines)
- @media 900px: sidebar becomes fixed overlay, grid becomes 1 column with auto rows
- @media 600px: tab padding reduced, heading sizes reduced

---

### JavaScript Functions (Grouped by Feature)

#### **View Switching**
- `switchView(viewId, navElement)` — shows/hides views, updates sidebar active state
- `toggleSidebar()` — mobile overlay sidebar toggle
- `numTab(category)` — switches between Spacing/Typo/Sizes tabs

#### **Preview/Playground Building** (1400+ lines)
- `buildPreview()` — **MASSIVE FUNCTION** that renders Section A (demo app) + Section B (matrices)
  - Extracts current control values: theme, accent role, density mode, status role, zone surfaces, state
  - Builds surface lookup: zNav, zPage, zUsers, zInvites from selected surface IDs
  - Calculates component size tokens dynamically (button height, padding, radius, etc.)
  - Builds spacing + typography from scales
  - Creates HTML string `h` with inline styles using resolved token values
  - **Section A layout**:
    - 22/78 sidebar+content grid
    - Zone 1 (Nav): profile section, applicants tree (with SVG branch connectors), schools list with colored dots, org/insights/settings items, footer icon buttons
    - Zone 2 (Page): topbar + heading + tabs + content scrollable area
    - Zone 3 (Users): flex rows with dropdowns (role selector menus) + trash buttons
    - Zone 4 (Invites): similar rows but with status badge + Resend/Revoke button pair
    - Dialog overlay (conditional display)
  - **Section B matrices**: renders text/grid content for all 4 coverage sections
  - Uses helper functions: `S()` (surface lookup), `sz()` (component size getter), `roleC()` (role token resolver), `cmBg()`/`smBg()` (state-aware resolvers)
  - **Dynamic CSS for interactions**: hover/active/transition rules injected into `#pv-dynamic-styles`
  - Uses SVG icon helpers: `chevDown()`, `plusIcon()`, `icoHomeSmile()`, `icoSettings()`, etc.
  - Float dropdown menu builder: `floatMenu(menuId, items, width, align)`
  - **Density scaling**: all dimensions multiplied by `dS = btnH/32` factor
  - **State awareness**: handles `st` (default/hover/pressed) with resolvers for each token type

- `tglMenu(id)` — toggle floating menu by ID (controls shown/hidden menus)
- `copyVal(hex)` — copies color hex to clipboard, shows toast

#### **Primitive Management**
- `buildPrimTabs()` — generates product tabs for color families
- `setPrimFilter(key, el)` — filters primitives by family
- `buildPrims()` — renders color swatch grid for selected family

#### **Role Management**
- `buildRoles()` — generates semantic role chips
- Sets `activeRole` global
- `buildRoleDetail()` — renders detailed token breakdown for selected role (3-column layout)
- `buildRoleDemo()` — renders 2-panel light/dark preview with buttons, badges, content hierarchy for role

#### **Surface Management**
- `buildSurfs()` — generates 9 surface pills, updates `curSurf` global
- For each surface, builds demo grid with themed UI components
- `buildSurfaces()` (extended) — renders full token detail cards for selected surface

#### **Spacing/Typography/Sizes**
- `buildSpacing()` — renders spacing scale with bar visualization, copy buttons
- `buildTypo()` — renders font family + weights, then type scale table
- `buildSizes()` — renders component size tokens grouped by component type

#### **Export Functionality**
- `buildExport()` — generates export panel with format options: JSON, CSS, Tailwind, Sass, TypeScript
- `genJsonExport()`, `genCssExport()`, `genTailwindExport()`, `genSassExport()`, etc.
- `exportData()` — downloads selected format to file
- Checkboxes allow selective export (which token categories to include)

#### **Search**
- `doSearch(query)` — searches across token names/values
- `handleSearchInput(el)` — debounced search input handler
- `showSearchResults(items)` — renders dropdown with search hits grouped by category (Primitives, Roles, Surfaces, Numbers)
- Both items and categories have colors/icons
- Click item to copy or navigate to section

#### **Theme Toggle**
- `togglePortalTheme()` — toggles `.app.portal-light` class
- `setTheme(t)` — syncs theme across all inline theme toggles
- Rebuilds affected views if visible

#### **Dialog/Modal Management**
- `showModal()`, `closeModal()` — visibility toggle for modals (if any used in future)

#### **Utility/Helpers**
- `copyVal(hex)` — clipboard copy with toast confirmation
- `contrastBadge(hex, bgRef)` — calculates WCAG contrast ratio, renders pass/fail badge
- `displayName(key, nameMap)` — friendly display names for token keys
- `hexToRgb(hex)` — color conversion

---

### UI Modes/Features

1. **Preview Tab** (default)
   - Token Playground intro + Section A (zone-based demo app) + Section B (token matrices)
   - Interactive controls at top: theme, accent role, density, status, zone surfaces

2. **Primitives Tab**
   - Color family tabs + swatch grid
   - Searchable with family filter
   - 148 colors across 8 families

3. **Semantic Roles Tab**
   - 6 role chips (primary, brand, success, warning, danger, info)
   - Detail panel showing 3 token groups (content, component, container)
   - 2-panel light/dark preview for selected role
   - Live component rendering

4. **Surfaces Tab**
   - 9 surface pills
   - Demo grid showing same UI adapted to surface context
   - Full token detail cards for selected surface

5. **Numbers Tab**
   - Spacing: 39 values in scale with bar + copy
   - Typography: font family + weights + 13-size scale table
   - Component Sizes: grouped by component (button, input, tag, etc.)

6. **Documentation Tab** (stub)
   - Likely for future content/guides

7. **Export Tab**
   - Format selector (JSON, CSS, Tailwind, Sass, TS)
   - Code preview with syntax coloring
   - Selective export checkboxes
   - Download button

---

### Data Dependencies

External data files loaded (referenced but may be injected):
- `PRIMS` — primitive color families + names
- `ROLES` — 6 semantic roles with token arrays (light/dark variants)
- `SURFS_LIGHT`, `SURFS_DARK` — 9 surface objects with full token sets
- `SPACING_PRIMS` — spacing scale (39 values)
- `TYPO_SCALE` — typography scale (13 sizes)
- `COMP_SIZE_DATA` — component size tokens (93 items)
- `UTILITY` — utility tokens for special purposes
- `MODES` — 10 density mode names
- `PALETTE_NAMES`, `SURFACE_LABELS` — display name maps
- `STATUS_TEXT` — pending/rejected/selected badge text + colors
- `AVATAR_IMAGES` — optional image URLs for user avatars (referenced as `AVATAR_IMAGES.navProfile`, `.user0`, `.user1`, etc.)

---

### Key Interactions

1. **Theme Toggle** (light/dark) → triggers full rebuild
2. **Accent Role Select** → CTA buttons + badges change color
3. **Density Slider** → all component sizes scale proportionally
4. **Zone Surface Selects** → tokens resolve to different values per zone
5. **Status Badge Select** → pending invite styling changes
6. **Search** → filters across all token names + values
7. **Copy Tokens** → hex/values copied to clipboard, toast confirmation
8. **Float Dropdowns** → role selectors, menu buttons (tglMenu)
9. **Tab Navigation** → switches between views (preview, prims, roles, surfaces, numbers, docs, export)
10. **Dialog** → "Invite People" form overlay (pvDialog flag)

---

---

## FILE 2: mockup-v2.html (921 lines) — CINEMATIC SHOWCASE

### Overall Structure
- **Purpose**: Beautiful onboarding + interactive token playground with visual exploration
- **Layout**: 2-column grid (228px tool panel | flex canvas), 48px topbar + 1fr main
- **Key Paradigm**: "Progressive disclosure" — intro sequence reveals the 4 tiers of the token system, then launches into a simplified but elegant explorer

### CSS Architecture (Major Sections)

#### 1. **Reset & Root Variables** (~50 lines)
- Same as complete.html (identical CSS custom properties)
- Identical color/font/radius tokens

#### 2. **Intro Sequence** (~150 lines)
- `.intro` — full-screen overlay (inset:0), fixed positioning, 999z-index
- `.intro::before` — radial gradient glow effect
- Slides: 6 full-screen centered moments
  - Slide 0: Logo (large, animated)
  - Slide 1-4: Tier slides (badge + large swatch + headline + body + token name)
  - Slide 5: Enter button + stats grid (607 tokens, 4 tiers, 9 surfaces, 6 roles, 10 densities)
- `.intro-nav` — bottom controls: back/next arrows + dot indicators (progress)
- Auto-advance: 3.5s on logo, then 5s per slide
- `enterPortal()` removes intro with `.gone` class (opacity:0, visibility:hidden)

#### 3. **Main Shell** (~80 lines)
- `.shell` — 2-column grid: 228px tool panel + 1fr canvas
- 48px topbar + 1fr main area
- topbar: logo-z (228px fixed width), search, spacer, mode pills (Play/Compare/Export), X-Ray button, Explore Tokens action button

#### 4. **Top Bar** (~100 lines)
- `.topbar` — fixed header with search input
- `.logo-z`, `.logo-m`, `.logo-w` — same as complete.html
- `.tb-search` — unified search (280px width)
- `.mode-pills` — Play (default), Compare, Export tabs
- `.xray-btn` — toggles X-Ray mode on canvas with `.xray-active` class
- `.tb-btn` — "Explore Tokens" CTA

#### 5. **Tool Panel** (~180 lines)
- `.tool-panel` — left sidebar with scrollable sections + footer stats
- `.tool-section` — 4 major control groups:
  1. **Token Theme** — light/dark toggle
  2. **Zone Surfaces** — Nav/Page/Users/Invites dropdowns with zone labels (colored dots)
  3. **Accent** — 6 role pills
  4. **Density** — range slider (0-9) with labels (micro → ultra)
  5. **Status Badge** — Pending/Rejected/Selected pills
  6. **Explore** — links to Token Browser for Colors, Spacing, Typography, Component Sizes
- `.zone-row` — compact zone selector with colored dot + name + dropdown
- `.role-pills` — pill-style role selector (4 or 6 pills depending on section)
- `.density-track` — range slider with custom styling
- `.tool-stats` — footer: 4-grid showing 607 tokens, 4 tiers, 9 surfaces, 10 densities

#### 6. **Canvas Area** (~100 lines)
- `.canvas-area` — flex column for main content
- `.demo-canvas` — flex container with centered content
- `.demo-frame` — bordered frame with mock app inside
- `.mock-app` — 2-column grid (200px nav + 1fr content)
  - Minimalist mock: nav with profile + items + topbar + content area
  - Uses data attributes for X-Ray: `data-xr="token path"` labels
- `.zone-label` — positioned labels showing zone + surface when X-Ray is active

#### 7. **Inspector (Token Tracer)** (~150 lines)
- `.inspector` — bottom collapsible panel (max-height:0 → max-height:260px)
- `.insp-head` — title + close button
- `.insp-body` — shows token resolution trace + specimen strip
  - **Trace**: T0 (Primitive) → T1 (Semantic) → T2 (Surface) → Resolved (with arrows)
  - Each trace tier shows: label + tier name + swatch + hex value
  - **Specimen strip**: same element rendered in all 6 roles side-by-side
- Opens when clicking elements in the demo (via `openInspector()`)

#### 8. **Token Browser Modal** (~200 lines)
- `.token-browser` — full-screen modal overlay (inset:0, opacity:0/1 toggle)
- `.tb-panel` — centered panel with 2-column body
- `.tb-header` — title + close button
- Left: `.tb-cats` — 6 category buttons (Colors, Spacing, Typography, Sizes, Surfaces, Roles)
- Right: `.tb-tokens` — scrollable token list
- **Token Card Design** (`.token-card`)
  - Left: visual swatch (color block, bar, or type preview)
  - Center: name + description + value
  - Right: tier badge + copy button
  - Expandable: click to show tier resolution trace below card
  - Hover: border brightens, shadow lifts
- `.tc-swatch`, `.tc-info`, `.tc-extra` — card sections
- `.tc-expansion` — collapsible trace section

#### 9. **Hint Bubble** (~30 lines)
- `.hint-bubble` — fixed bottom-center tooltip
- Shows contextual hints about current interaction
- Auto-dismisses after 4.5s
- Has close button

#### 10. **X-Ray Mode** (~50 lines)
- `.xray-active` — applied to demo-frame to enable visual indicators
- `.mock-app [data-xr]` — elements with data attribute show outline + hover label
- `.zone-label` — becomes visible with `display:block`

#### 11. **Responsive** (~100 lines)
- @media 900px: tool panel hides, token browser adjusts
- @media: simplified view for smaller screens

---

### JavaScript Functions (Grouped by Feature)

#### **Intro Sequence** (~80 lines)
- `goSlide(n)` — shows slide n, updates dots, updates arrows disabled state
- `nextSlide()` — advances to next slide (stops auto-play if triggered manually)
- `prevSlide()` — goes back to previous slide
- `updateArrows()` — enables/disables prev/next arrows based on current slide
- `enterPortal()` — removes intro overlay with animation, shows hint

#### **Canvas Interactions** (~60 lines)
- `toggleXray()` — toggles `.xray-active` class on demo-frame, includes `.on` toggle on button
- `openInspector(type)` — sets element name in inspector title, shows inspector (adds `.open` class)
- `closeInspector()` — hides inspector (removes `.open` class)

#### **Mode Switching** (~20 lines)
- `setMode(el)` — activates mode pill (Play/Compare/Export)
- Likely triggers different view states (not fully implemented in mockup)

#### **Tool Panel Controls** (~80 lines)
- `pickOpt(el)` — theme option selector (light/dark)
- `pickPill(el)` — accent/status role selector
- `updateDensity(value)` — updates density label + presumably triggers re-render
- `showHint(text)` — displays hint bubble with fade-in/out
- `hideHint()` — closes hint immediately
- `MODES` — array of 10 density names (micro, tiny, small, base, medium, large, big, huge, mega, ultra)

#### **Token Browser** (~180 lines)
- `openTokenBrowser(cat)` — shows modal, switches to category (or 'colors' default)
- `closeTokenBrowser()` — hides modal
- `switchCat(el, cat)` — switches category without closing
- `buildTokenCards(cat)` — populates token list based on category
  - Includes filter bar (search input)
  - Renders different card types by category:
    - **Colors**: primitives (brand palette), semantic roles, surfaces
    - **Spacing**: spacing scale with bar + copy
    - **Typography**: font family + weights, type scale cards
    - **Sizes**: component sizes grouped by component
    - **Surfaces**: 9 surface cards with sub-token counts
    - **Roles**: 6 role cards with token counts
  - Calls helper builders: `tokenCardColor()`, `tokenCardSpacing()`, `tokenCardType()`, `tokenCardSize()`, `tokenCardSurface()`, `tokenCardRole()`
- `tokenCardColor()` — creates color card HTML with tier badge + value + expansion trace
- `tokenCardSpacing()` — creates spacing card with bar visualization
- `tokenCardType()` — creates typography card with preview size
- `tokenCardSize()` — creates size card with bar
- `tokenCardSurface()` — creates surface card showing all sub-tokens
- `tokenCardRole()` — creates role card showing token breakdown
- Card expansion (click to toggle `.expanded` class) shows tier-by-tier resolution trace

#### **Util Helpers** (~30 lines)
- `hexToRgbStr(hex)` — converts hex to comma-separated RGB for rgba()

---

### UI Modes/Features

1. **Intro Sequence** (before entering)
   - 6 cinematic slides showing token tiers (T0→T1→T2→T3)
   - Auto-advance with manual controls
   - "Enter the playground" button

2. **Play Mode** (default, active)
   - Interactive demo app with 4 zones
   - Tool panel with theme/zone/accent/density/status controls
   - Canvas showing mock app
   - Inspector at bottom (opens on element click)
   - X-Ray mode shows token names on hover
   - Hint system guides discovery

3. **Compare Mode** (UI exists, not implemented)
   - Likely for side-by-side feature comparison

4. **Export Mode** (UI exists, not implemented)
   - Likely for token export functionality

5. **Token Browser** (modal)
   - 6 categories: Colors, Spacing, Typography, Sizes, Surfaces, Roles
   - Card-based presentation with visual swatches
   - Expandable cards showing token resolution trace
   - Search/filter within category
   - Copy to clipboard (implied by design)

---

### Data Dependencies

Same as complete.html, but used more sparingly:
- `AVATAR_IMAGES` — optional user avatars
- Zone + role data likely built into control options
- Token data referenced but not fully extracted in this view (relies on Token Browser modal for details)

---

---

## COMPARISON MATRIX

| Aspect | complete.html | mockup-v2.html |
|--------|---------------|---|
| **Lines** | 2496 | 921 |
| **Purpose** | Production portal | Cinematic showcase |
| **Layout** | 3-column (sidebar 232px \| main \| topbar) | 2-column (tool 228px \| canvas) + intro |
| **Intro** | None | 6-slide cinematic sequence |
| **Main Views** | 7 tabs (Preview, Prims, Roles, Surfaces, Numbers, Docs, Export) | Single Play/Compare/Export view |
| **Primitives Display** | Tab with family filter + swatch grid | Modal token browser |
| **Roles Exploration** | Dedicated tab with chips + detail panel | Tool panel pill selector + inspector |
| **Surfaces** | Dedicated tab with 9 pills + demo grid | Tool panel zone dropdowns |
| **Numbers (Spacing/Typo)** | Dedicated tab with multiple sub-tabs | Modal token browser |
| **Export** | Dedicated tab with format options + code | Not implemented (UI placeholder) |
| **Search** | Top bar search with dropdown results | Modal filter within token browser |
| **Demo App Mockup** | Section A within Preview tab (676×464px) | Canvas frame showing simplified mock |
| **Inspector** | None | Bottom collapsible panel with trace + specimens |
| **Token Browser** | Not modal; embedded in tabs | Full-screen modal with card-based UI |
| **X-Ray Mode** | None | Visual overlays showing token names on hover |
| **CSS Complexity** | ~1400 lines | ~900 lines |
| **JS Complexity** | ~900 lines (massive buildPreview) | ~400 lines (lighter, modal-driven) |
| **Density Scaling** | Full responsive scaling in demo app | Tool slider (UI only, no effect on mockup) |
| **Interactive Elements** | Dropdowns, tabs, chips, buttons, copiers | Intro dots, mode pills, role/surface selectors, inspector |
| **Color Coding** | Roles by color + tier badges | Tier badges + role colors in cards |
| **State Awareness** | Default/Hover/Pressed states in Section A | Simplified (X-Ray labels only) |
| **Accessibility** | ARIA roles, semantic HTML, focus styles | Basic (intro dots clickable, but less ARIA) |

---

## MERGE STRATEGY: What to Preserve & What to Adopt

### FROM complete.html → KEEP (Must be preserved)
1. **Full feature set**:
   - All 7 tabs (Preview, Prims, Roles, Surfaces, Numbers, Docs, Export)
   - Export functionality with format options (JSON, CSS, Tailwind, Sass, TS)
   - Search system with dropdown results
   - All role/surface/number explorers

2. **buildPreview() mega-function** (the interactive demo app with all 4 zones)
   - Section A: 22% sidebar + content grid with all zone details
   - Density scaling (all component sizes proportional)
   - State-aware resolvers (default/hover/pressed)
   - Dynamic CSS injection for interactions
   - Dialog overlay (Invite form)

3. **Complete token coverage matrices** (Section B1-B5):
   - Surface matrix (9×34)
   - Role matrix (6×18)
   - Component sizes (grouped)
   - Roles × Components gallery
   - Utility tokens

4. **Accessibility** (ARIA, semantic HTML, focus styles)

### FROM mockup-v2.html → ADOPT (Design/UX improvements)
1. **Intro Sequence**:
   - 6-slide cinematic onboarding (T0→T3 tier progression)
   - Auto-advance with manual controls
   - Beautiful visuals + storytelling

2. **Token Browser Modal**:
   - Card-based (not raw matrix tables)
   - Visual swatches on left + info on right
   - Expandable tier-trace reveal
   - Better UX than tab-based approach
   - 6 categories with icons

3. **Inspector**:
   - Bottom collapsible panel (not on-click popover)
   - Token resolution trace (T0 → Resolved arrow flow)
   - Specimen strip (same element in all 6 roles)
   - Elegant design with labels

4. **X-Ray Mode**:
   - `data-xr` attribute labels
   - Hover-to-reveal design (not always visible)
   - Zone labels in corners

5. **Tool Panel**:
   - Compact zone selectors with colored dots
   - Density slider (UI-driven, ties into Section A)
   - Clean sidebar organization

6. **Visual Polish**:
   - Better color coding (tier badges in token cards)
   - Radial gradient intro glow
   - Slide transitions (cubic-bezier easing)
   - Hint bubble system
   - Card hovering/expansion (not full modal page)

### ARCHITECTURE DECISIONS

**Recommended structure for merged version:**

```
complete.html (enhanced)
├─ Intro Sequence (from mockup-v2, 150 lines)
├─ Topbar (from complete.html, with mode pills from mockup-v2, 100 lines)
├─ Sidebar (from complete.html, with compact zones from mockup-v2, 160 lines)
├─ Main Views (from complete.html):
│  ├─ Preview Tab:
│  │  ├─ Intro re-trigger button (optional)
│  │  ├─ Section A: Demo app (from complete, keep all zones + density)
│  │  └─ Section B: Token matrices (from complete, keep all)
│  ├─ Primitives Tab → Replace with modal token browser modal (from mockup, category filter)
│  │  └─ Use same card-based UI for better UX
│  ├─ Roles Tab → Keep, but link to modal for card view
│  ├─ Surfaces Tab → Keep, but link to modal
│  ├─ Numbers Tab → Keep, but link to modal
│  ├─ Docs Tab (stub) → Keep as-is
│  └─ Export Tab (keep format options + code, from complete)
├─ Token Browser Modal (from mockup-v2, 180 lines)
│  ├─ 6 categories with card-based presentation
│  ├─ Expandable cards with tier traces
│  └─ Filter/search
├─ Inspector Panel (from mockup-v2, 120 lines)
│  ├─ Token resolution trace (T0→Resolved)
│  ├─ Specimen strip (all 6 roles)
│  └─ Collapsible height animation
├─ X-Ray Mode (from mockup-v2, simple overlay)
└─ CSS & JS (merged, ~3200 lines total)
```

**Key integration points:**
1. Intro sequence auto-plays on first load (can be dismissed or re-triggered)
2. Tab navigation remains, but some tabs can link to modal for condensed card view
3. Token Browser modal is universal entry point for exploring any category
4. Inspector appears at bottom only in Preview tab, triggered by clicking demo app elements or token cards
5. Density slider in tool panel directly affects Section A rendering
6. Zone selectors in tool panel update Section A rendering
7. All copy-to-clipboard actions preserved with toast confirmations

---

## CRITICAL FUNCTIONS FOR MERGE

### From complete.html (must be preserved):
- `switchView()` — view navigation
- `buildPreview()` — **CORE** demo app + matrices renderer
- `buildPrims()`, `buildRoles()`, `buildSurfs()`, `buildSpacing()`, `buildTypo()`, `buildSizes()` — tab content builders
- `buildExport()`, `genJsonExport()`, etc. — export logic
- `doSearch()`, `handleSearchInput()` — search system
- `copyVal()` — clipboard utility
- `contrastBadge()` — WCAG checker
- `setTheme()` — theme toggler

### From mockup-v2.html (to add):
- Intro: `goSlide()`, `nextSlide()`, `prevSlide()`, `enterPortal()`
- Inspector: `openInspector()`, `closeInspector()`
- TokenBrowser: `openTokenBrowser()`, `closeTokenBrowser()`, `buildTokenCards()`, `tokenCardColor()`, etc.
- XRay: `toggleXray()`
- Hints: `showHint()`, `hideHint()`
- Mode switching: `setMode()`, `pickOpt()`, `pickPill()`, `updateDensity()`

---

## SUMMARY

**complete.html is the FOUNDATION** — it contains all the features, the massive interactive demo, and all token explorers.

**mockup-v2.html is the DESIGN POLISH & UX** — it provides a beautiful cinematic intro, card-based token browser, elegant inspector, and X-Ray mode.

**The merge should:**
1. Keep complete.html's feature completeness as the base
2. Overlay mockup-v2.html's UX patterns (intro, modal token browser, inspector, X-Ray)
3. Integrate tool panel from mockup with zone/density controls
4. Maintain all 7 tabs but make some link to enhanced modals
5. Keep buildPreview() but use it more efficiently with the inspector pattern
6. Result: A 3200-3500 line HTML file that is BOTH feature-complete AND beautifully designed
