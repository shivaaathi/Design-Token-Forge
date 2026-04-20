# Multi-Project Migration — QC Plan & Risk Register

## Project: Desktop PDF Editor (Project Zero)

> **Goal:** Convert the current single-project DTF system into the first named project
> ("Desktop PDF Editor"), validate end-to-end, then use it as the template for future projects.

---

## Phase 0 — Pre-Migration Snapshot (Do First)

### Checklist

| # | Action | How to verify | Status |
|---|--------|--------------|--------|
| 0.1 | Git tag current working state | `git tag v1.0-pre-multiproject` | ✅ |
| 0.2 | Export current `tokens.json` as baseline | `cp dist/tokens.json dist/tokens-baseline.json` (250299 bytes) | ✅ |
| 0.3 | Record current Figma variable count | 610 variables, 6 collections | ✅ |
| 0.4 | Screenshot all 6 Figma collections | Manual — document current mode count per collection | ☐ |
| 0.5 | Record `status.json` hash | `contentHash: 2f02a55f6c79` | ✅ |
| 0.6 | Run `node demo/validate-sizes.js` | Must exit 0 with no violations | ☐ |
| 0.7 | Note all files in `dist/` | `find dist/ -type f | wc -l` | ☐ |

**Why:** If anything breaks during migration, you can diff against this snapshot to find exactly what changed.

---

## Phase 1 — Create Project Config (Code Only, No Figma Impact)

### What changes
- Create `projects/desktop-pdf-editor/config.json` with current palette keys and mappings
- Modify `build-static.js` to read project config instead of hardcoded paths
- Output goes to `dist/desktop-pdf-editor/tokens.json` and `dist/desktop-pdf-editor/status.json`

### Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R1.1** Config.json has wrong palette key hex values | Generated primitives won't match current | Medium | Diff new `tokens.json` vs baseline — must be byte-identical |
| **R1.2** Semantic mapping (T1) has wrong step references | Light/Dark theme colors shift | High | The current semantic.css hardcodes hex values in Light/Dark — these must be traced back to exact primitive step names |
| **R1.3** Surface mapping (T2) loses a mode | A surface context disappears | Low | Count modes: must be exactly 9 surface modes, 6 status modes |
| **R1.4** Build path changes break GitHub Pages deploy | Plugin can't find tokens.json | Medium | Update GitHub Actions workflow to deploy `dist/desktop-pdf-editor/` |
| **R1.5** Component tokens (comp size) get dropped | 10 density modes lost | Low | Verify comp size collection has exactly 10 modes in output |

### QC Gate — Phase 1 Complete When:
- [x] `diff dist/desktop-pdf-editor/tokens.json dist/tokens-baseline.json` shows **zero differences** (only `_exportMs` timing differ)
- [x] `status.json` contentHash matches baseline: `2f02a55f6c79` = `2f02a55f6c79`
- [x] Old `dist/tokens.json` still exists (backward compatible — copied from project output)

---

## Phase 2 — Update Plugin to Support Project Selection

### What changes
- Plugin UI gets a project selector dropdown
- Plugin sends `projectId` in the URL: `/projects/{id}/status.json`
- Plugin can also auto-detect via `figma.fileKey` if a mapping exists

### Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R2.1** Plugin fetches wrong project's tokens | Wrong colors applied to file | High | Show project name prominently in plugin UI with visual confirmation |
| **R2.2** Old plugin version polls old URL path | Plugin stops syncing after deploy | High | Keep old `dist/tokens.json` as a redirect/symlink to `dist/desktop-pdf-editor/tokens.json` during transition |
| **R2.3** `figma.fileKey` is undefined in some contexts | Auto-detect fails | Medium | Always allow manual project selection as fallback |
| **R2.4** Multiple designers open different projects in same file | Token conflicts | Low | Plugin should warn if file already has DTF variables from a different project |

### QC Gate — Phase 2 Complete When:
- [ ] Plugin can select "Desktop PDF Editor" from dropdown
- [ ] Sync produces identical variable count to pre-migration
- [ ] All 6 collections update correctly
- [ ] No new variables created (all update-in-place)
- [ ] No orphaned variables left behind

---

## Phase 3 — Admin Customization (Palette Keys + T1/T2 Mapping)

### What changes
- Color system page gets a project context
- Admin can change palette key colors per project
- Admin can customize which primitive step maps to which semantic token (T1)
- Admin can customize surface context mappings (T2)

### Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R3.1** Admin sets a palette key that fails WCAG certification | Generated palette has contrast violations | High | Run `certifyPalette()` on every key change — block save if any test fails |
| **R3.2** T1 mapping points to non-existent step name | `var()` references resolve to nothing | High | Validate all step references against `STEP_NAMES` array before saving |
| **R3.3** T1 Light/Dark mapping uses same step for both | No visual difference between themes | Medium | Warn if Light and Dark values are identical for content/bg tokens |
| **R3.4** T2 surface mode accidentally deleted | Components using that surface context break | High | Never allow deleting the 9 core surface modes — only allow adding new ones |
| **R3.5** Admin changes primary key color — all downstream tokens shift | Entire UI color scheme changes unexpectedly | Medium | Show a preview diff before applying — "These 47 tokens will change" |
| **R3.6** Greyscale/Desaturated palettes diverge from primary hue | Neutral tones look wrong alongside primary | Medium | Auto-derive desaturated from primary hue (current behavior) — warn if admin overrides |
| **R3.7** Custom component overrides conflict with size tier system | Component renders incorrectly at certain sizes | Low | Validate overrides against `validate-sizes.js` rules |

### QC Gate — Phase 3 Complete When:
- [ ] Changing a palette key regenerates all 3 CSS files (primitives, semantic, surfaces)
- [ ] WCAG certification passes 7/7 for all palettes after any change
- [ ] Preview diff shows before/after for every affected token
- [ ] Invalid step references are blocked at input time
- [ ] Reverting config.json to original values produces byte-identical output

---

## Phase 4 — Deploy & Sync to Figma

### What changes
- Push project config + generated tokens to GitHub
- Plugin fetches project-specific tokens.json
- Figma variables update in-place

### Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R4.1** Figma variables get deleted instead of updated | All component bindings break permanently | **CRITICAL** | Never delete variables — only update values. This is enforced in `syncAll()` — verify with a dry-run flag |
| **R4.2** New palette step (350) creates extra variable | Unexpected variable appears in Figma | Low | Expected — but verify it gets correct scopes and visibility |
| **R4.3** Collection name changes during restructure | Plugin creates duplicate collections | High | Keep exact collection names: `T0 Primitive Colors`, `T1 Color Tokens`, etc. — never rename |
| **R4.4** Mode count mismatch | Plugin creates extra modes or misses existing | Medium | Assert mode count per collection before and after sync |
| **R4.5** Alias resolution fails (target variable not found) | Token shows raw hex instead of linked variable | Medium | Pass 2 error log must be zero — any unresolved alias is a blocker |
| **R4.6** GitHub Pages cache serves stale tokens.json | Plugin doesn't see the update | Low | Plugin already uses cache-bust param (`?_cb=timestamp`) — verify it's working |

### QC Gate — Phase 4 Complete When:
- [ ] Figma variable count = baseline count + 8 (the new 350 step × 8 palettes)
- [ ] All 6 collections present with correct mode counts
- [ ] Spot-check: 10 random component instances still show correct bound colors
- [ ] Publish library → open a consuming file → verify colors update
- [ ] Plugin status shows "Synced" with matching hash

---

## Ongoing QC — After Multi-Project is Live

### Per-Deploy Checklist

| # | Check | Method |
|---|-------|--------|
| 1 | All palettes pass 7/7 certification | `certifyPalette()` output in build log |
| 2 | Token count hasn't dropped | Compare `status.json` totalVariables with previous |
| 3 | No orphaned aliases (100% coverage) | Run alias coverage check in build |
| 4 | Semantic tokens all resolve to valid primitives | Automated in build pipeline |
| 5 | `validate-sizes.js` passes | `node demo/validate-sizes.js` exits 0 |
| 6 | Plugin sync completes with 0 errors | Check plugin error count after sync |

### Monthly Audit

| # | Check | Method |
|---|-------|--------|
| 1 | No unused Figma variables | Compare Figma variable list against tokens.json |
| 2 | No hardcoded colors in Figma file | Figma lint plugin or manual spot-check |
| 3 | All consuming files on latest library version | Figma library update notifications |
| 4 | WCAG contrast still passing with any palette changes | Re-run certification |

---

## Token Count Reference (Current Baseline)

| Collection | Variables | Modes | Total Values |
|---|---|---|---|
| T0 Primitive Colors | ~176 (8 palettes × 22 steps) | 1 | 176 |
| T1 Color Tokens | ~252 (surfaces + semantic) | 2 | 504 |
| T2 Surface Context | ~16 props | 9 | 144 |
| T3 Status Context | ~18 props | 6 | 108 |
| primitives-numbers | ~112 (spacing + radius + font + etc.) | 1 | 112 |
| comp size | varies per component | 10 | varies |

---

## Critical Rules (Never Violate)

1. **NEVER delete a Figma variable** — always update-in-place. Deletion severs bindings permanently.
2. **NEVER rename a collection** — the plugin identifies DTF collections by name prefix.
3. **NEVER change mode names** — components reference modes by name, not ID.
4. **ALWAYS diff tokens.json** against baseline before deploying.
5. **ALWAYS run certification** after any palette key change.
6. **ALWAYS keep backward-compatible URLs** during migration (old paths redirect to new).

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | Name first project "Desktop PDF Editor" | Use existing system as project zero to validate multi-project pipeline |
| 2026-04-08 | Use full generation (not inheritance) | Each project generates complete standalone token set — simpler, no cross-project dependencies |
| 2026-04-08 | Keep old dist/ paths during transition | Prevents plugin breakage for anyone using current GitHub Pages URL |
| | | |
