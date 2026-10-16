# WCAG 2.1 AA Report

Accessibility audit of the movie search app against WCAG 2.1 Level AA. The `accessibility-expert` agent ([.claude/agents/accessibility-expert.md](.claude/agents/accessibility-expert.md)) uses it as its list of known issues and updates the **Status** column as issues are fixed.

**Status values**

- **Open** — found by code review, no test yet
- **Verified failing** — a Playwright test reproduces the issue
- **Verified passing** — fixed, and a Playwright test confirms it
- **Manual check** — can't be automated reliably; needs a person to check visually or with a screen reader

---

## Summary

| ID | Component | Issue | WCAG SC | Status | Test |
|---|---|---|---|---|---|
| ISSUE-01 | `RatingFilter` | Checkboxes used for single-select | 1.3.1, 4.1.2 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-01`) |
| ISSUE-02 | `CardDetails` | `<dt>` labels hidden on mobile | 1.3.1 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-02`) |
| ISSUE-03 | `Input`, `Dropdown` | Focus outline removed | 2.4.7 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-03`) |
| ISSUE-04 | Buttons | No visible focus indicator | 2.4.7 | Manual check | `tests/wcag-issues.spec.js` (`@ISSUE-04`) |
| ISSUE-05 | Skip link | No visible focus styling | 2.4.7, 2.4.1 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-05`) |
| ISSUE-06 | `CardDetails` | "Overview" is a `<p>`, not a heading | 1.3.1, 2.4.6 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-06`) |
| ISSUE-07 | `CardGrid` | No announcement when results update | 4.1.3 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-07`) |
| ISSUE-08 | `CardSkeleton` / `CardGrid` | Loading list missing `aria-busy` | 4.1.3 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-08`) |
| ISSUE-09 | `CardDetailSkeleton` | Decorative skeleton not hidden | 1.3.1 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-09`) |
| ISSUE-11 | `YearRangeFilter` | No validation error messages | 3.3.1, 3.3.3 | Verified failing | `tests/wcag-issues.spec.js` (`@ISSUE-11`) |

---

## Issues

### ISSUE-01 — Rating filter uses checkboxes for a single choice

**File:** [src/components/layout/FilterSidebar/RatingFilter.jsx](src/components/layout/FilterSidebar/RatingFilter.jsx)
**SC:** 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-01`. Rating panel has 5 checkboxes, 0 radios.

Only one rating can be active (`checked={value === r}`), but each option is a checkbox. Screen readers announce them as independent toggles, so checking "7+" silently unchecks "8+". The group is a `<div role="group">`, not a radio group.

**Fix:** Use `<input type="radio">` with a shared `name` inside a `<fieldset>` and `<legend>`, plus an "Any" option to clear the filter.

### ISSUE-02 — Detail labels hidden on mobile

**File:** [src/components/features/CardDetails/CardDetails.scss](src/components/features/CardDetails/CardDetails.scss) (`&__meta-label`)
**SC:** 1.3.1 Info and Relationships
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-02`. At 375px every `<dt>` computes to `display: none`.

`.card-details__meta-label` has `display: none` under `mobile-only`, which removes the `<dt>` from the accessibility tree. On mobile, screen readers read values like "2014" or "169 min" with no "Release date" / "Runtime" term.

**Fix:** Replace `display: none` with the `.visually-hidden` utility so the label stays available to assistive tech.

### ISSUE-03 — Focus outline removed on inputs and dropdowns

**Files:** [src/components/ui/Form/Input/Input.scss](src/components/ui/Form/Input/Input.scss), [src/components/ui/Form/Dropdown/Dropdown.scss](src/components/ui/Form/Dropdown/Dropdown.scss)
**SC:** 2.4.7 Focus Visible
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-03`. Search input, sort select and year input all have `outline-style: none` on keyboard focus.

Both set `outline: none` on `:focus`, and the only replacement is changing `border-color` to white, which is a subtle 1px change that can be hard to see.

**Fix:** Add a `:focus-visible` outline (e.g. `outline: 2px solid $color-accent; outline-offset: 2px`).

### ISSUE-04 — Buttons have no clear focus indicator

**Files:** [src/components/layout/FilterSidebar/FilterSidebar.scss](src/components/layout/FilterSidebar/FilterSidebar.scss), [src/components/ui/Search/Search.scss](src/components/ui/Search/Search.scss), [src/styles/base/_reset.scss](src/styles/base/_reset.scss)
**SC:** 2.4.7 Focus Visible
**Status:** Manual check. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-04`. Chromium still draws its default focus ring (1px `auto` outline) on these buttons, so the outline is not removed as described. The test fails only on the 2px outline threshold from the suggested fix, which is stricter than 2.4.7. Check the default ring visually against the dark background in each browser.

The clear-filters and search buttons only change text color on `:focus`. A color change by itself isn't a dependable focus indicator, and the project has no shared `:focus-visible` style.

**Fix:** Add a global `:focus-visible` rule in `base/` for buttons, links, and form controls.

### ISSUE-05 — Skip link has no visible focus styling

**File:** [src/styles/base/_utilities.scss](src/styles/base/_utilities.scss) (`.skip-link`)
**SC:** 2.4.7 Focus Visible, 2.4.1 Bypass Blocks
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-05`. On focus the link is in view and on top, with only the 1px browser default outline, and it has a transparent background, 0 padding and `z-index: auto`. In Chromium it did not render behind the header.

When focused, the skip link moves to `top: 0` but has no background, padding, z-index, or outline, so it can show up unstyled or behind the header.

**Fix:** Give `.skip-link:focus` a background, padding, `z-index`, and an outline.

### ISSUE-06 — "Overview" isn't a heading

**File:** [src/components/features/CardDetails/CardDetails.jsx](src/components/features/CardDetails/CardDetails.jsx)
**SC:** 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-06`. No level-3 "Overview" heading in the modal.

`<p className='card-details__overview-label'>Overview</p>` is styled to look like a heading, but screen reader users navigating by heading can't find it.

**Fix:** Change it to an `<h3>`. The movie title is the modal's `<h2>`.

### ISSUE-07 — Result updates aren't announced

**File:** [src/components/features/CardGrid/CardGrid.jsx](src/components/features/CardGrid/CardGrid.jsx)
**SC:** 4.1.3 Status Messages
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-07`. No `role="status"` region announces the result count after load.

Error and empty states use `role="status"`, but when a search, filter, sort, or page change returns results, nothing is announced. Screen reader users get no confirmation that the grid changed.

**Fix:** Add a persistent visually hidden `role="status"` region (outside the component that remounts) that announces e.g. "20 movies found".

### ISSUE-08 — Loading list missing `aria-busy`

**Files:** [src/components/features/CardGrid/CardGrid.jsx](src/components/features/CardGrid/CardGrid.jsx), [src/components/features/Card/CardSkeleton.jsx](src/components/features/Card/CardSkeleton.jsx)
**SC:** 4.1.3 Status Messages
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-08`. Loading list has no `aria-busy`; skeletons are not `aria-hidden`.

While loading, the grid renders 20 empty `<li>` skeletons. Screen readers announce "list, 20 items" with nothing in them, and there's no `aria-busy="true"` to show the region is loading.

**Fix:** Add `aria-busy="true"` to the loading list and `aria-hidden="true"` to each skeleton.

### ISSUE-09 — Detail skeleton not hidden from assistive tech

**File:** [src/components/features/CardDetails/CardDetailSkeleton.jsx](src/components/features/CardDetails/CardDetailSkeleton.jsx)
**SC:** 1.3.1 Info and Relationships
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-09`. Detail skeleton is not inside an `aria-hidden` subtree; no "Loading movie details" status.

The skeleton is a tree of empty `<div>`s that isn't marked as decorative, and nothing tells screen reader users the modal content is loading.

**Fix:** Add `aria-hidden="true"` to the skeleton and put a visually hidden "Loading movie details" status next to it.

### ISSUE-11 — Year range inputs have no validation messages

**File:** [src/components/layout/FilterSidebar/YearRangeFilter.jsx](src/components/layout/FilterSidebar/YearRangeFilter.jsx)
**SC:** 3.3.1 Error Identification, 3.3.3 Error Suggestion
**Status:** Verified failing. **Test:** `tests/wcag-issues.spec.js`, tag `@ISSUE-11`. Neither 1800 nor From 2020 > To 2000 sets `aria-invalid` or an `aria-describedby` error.

The inputs have `min`/`max`, but invalid values (e.g. 1800, or a "From" later than "To") still get sent as filters with no feedback. Nothing sets `aria-invalid` or points to an error message with `aria-describedby`.

**Fix:** Validate on change, set `aria-invalid`, and show an inline error connected with `aria-describedby`.

---

## Notes

- ISSUE-10 is intentionally left out. The original report was lost, and the item couldn't be reconstructed.
- Already in place (see [README.md](README.md#accessibility)): native `<dialog>` modal, `role="search"`, skip link target, labelled pagination with `aria-current`, accordion `aria-expanded`/`aria-controls`, and decorative poster images with `alt=""`.
- Tests run on chromium against the dev server with mocked `/api/tmdb/*` responses: `npx playwright test tests/wcag-issues.spec.js --project=chromium --reporter=list`. The same file has an axe-core WCAG 2.1 A/AA baseline (`@axe`) for the home page and the details modal. Both scans pass, so none of the issues above are caught by axe.
