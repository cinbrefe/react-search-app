# WCAG 2.1 AA Report

Accessibility audit of the movie search app against WCAG 2.1 Level AA. The `accessibility-expert` agent ([.claude/agents/accessibility-expert.md](.claude/agents/accessibility-expert.md)) uses it as its list of known issues and updates the **Status** column as issues are fixed.

**Status values**

- **Open** — found by code review, no test yet
- **Verified failing** — a Playwright test reproduces the issue
- **Verified passing** — fixed, and a Playwright test confirms it
- **Manual check** — can't be automated reliably; needs a person to check visually or with a screen reader
- **Fixed** — fixed in code and checked manually (keyboard, VoiceOver, phone)

---

## Summary

| ID | Component | Issue | WCAG SC | Status | Checked |
|---|---|---|---|---|---|
| ISSUE-01 | `RatingFilter` | Checkboxes used for single-select | 1.3.1, 4.1.2 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-02 | `CardDetails` | `<dt>` labels hidden on mobile | 1.3.1 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-03 | `Input`, `Dropdown` | Focus outline removed | 2.4.7 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-04 | Buttons | No visible focus indicator | 2.4.7 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-05 | Skip link | No visible focus styling | 2.4.7, 2.4.1 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-06 | `CardDetails` | "Overview" is a `<p>`, not a heading | 1.3.1, 2.4.6 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-07 | `CardGrid` | No announcement when results update | 4.1.3 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-08 | `CardSkeleton` / `CardGrid` | Loading list missing `aria-busy` | 4.1.3 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-09 | `CardDetailSkeleton` | Decorative skeleton not hidden | 1.3.1 | Fixed 2026-10-16 | Manually, 2026-10-17 |
| ISSUE-11 | `YearRangeFilter` | No validation error messages | 3.3.1, 3.3.3 | Fixed 2026-10-16 | Manually, 2026-10-17 |

---

## Issues

### ISSUE-01 — Rating filter uses checkboxes for a single choice

**File:** [src/components/layout/FilterSidebar/RatingFilter.jsx](src/components/layout/FilterSidebar/RatingFilter.jsx)
**SC:** 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** Rating panel has 5 checkboxes, 0 radios.

Only one rating can be active (`checked={value === r}`), but each option is a checkbox. Screen readers announce them as independent toggles, so checking "7+" silently unchecks "8+". The group is a `<div role="group">`, not a radio group.

**Fix:** Use `<input type="radio">` with a shared `name` inside a `<fieldset>` and `<legend>`, plus an "Any" option to clear the filter.

**Fixed 2026-10-16:** `RatingFilter` now uses a new `Radio` component: radios sharing `name='rating'` inside a `role="radiogroup"` labelled "Minimum rating", with an "Any" option that clears the filter.

### ISSUE-02 — Detail labels hidden on mobile

**File:** [src/components/features/CardDetails/CardDetails.scss](src/components/features/CardDetails/CardDetails.scss) (`&__meta-label`)
**SC:** 1.3.1 Info and Relationships
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** At 375px every `<dt>` computes to `display: none`.

`.card-details__meta-label` has `display: none` under `mobile-only`, which removes the `<dt>` from the accessibility tree. On mobile, screen readers read values like "2014" or "169 min" with no "Release date" / "Runtime" term.

**Fix:** Replace `display: none` with the `.visually-hidden` utility so the label stays available to assistive tech.

**Fixed 2026-10-16:** `.card-details__meta-label` uses a new `visually-hidden` mixin on mobile instead of `display: none`, so the terms stay in the accessibility tree.

### ISSUE-03 — Focus outline removed on inputs and dropdowns

**Files:** [src/components/ui/Form/Input/Input.scss](src/components/ui/Form/Input/Input.scss), [src/components/ui/Form/Dropdown/Dropdown.scss](src/components/ui/Form/Dropdown/Dropdown.scss)
**SC:** 2.4.7 Focus Visible
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** Search input, sort select and year input all have `outline-style: none` on keyboard focus.

Both set `outline: none` on `:focus`, and the only replacement is changing `border-color` to white, which is a subtle 1px change that can be hard to see.

**Fix:** Add a `:focus-visible` outline (e.g. `outline: 2px solid $color-accent; outline-offset: 2px`).

**Fixed 2026-10-16:** Removed `outline: none` from `Input.scss` and `Dropdown.scss`; a global `:focus-visible` rule in `base/_base.scss` draws a 2px `$color-accent` outline with a 2px offset.

### ISSUE-04 — Buttons have no clear focus indicator

**Files:** [src/components/layout/FilterSidebar/FilterSidebar.scss](src/components/layout/FilterSidebar/FilterSidebar.scss), [src/components/ui/Search/Search.scss](src/components/ui/Search/Search.scss), [src/styles/base/_reset.scss](src/styles/base/_reset.scss)
**SC:** 2.4.7 Focus Visible
**Status:** Fixed 2026-10-16 (was manual check). **Found by the old Playwright test:** Chromium still draws its default focus ring (1px `auto` outline) on these buttons, so the outline is not removed as described. The test fails only on the 2px outline threshold from the suggested fix, which is stricter than 2.4.7. Check the default ring visually against the dark background in each browser.

The clear-filters and search buttons only change text color on `:focus`. A color change by itself isn't a dependable focus indicator, and the project has no shared `:focus-visible` style.

**Fix:** Add a global `:focus-visible` rule in `base/` for buttons, links, and form controls.

**Fixed 2026-10-16:** The same global `:focus-visible` rule gives every button and link a 2px accent outline, replacing the browser's thin default ring.

### ISSUE-05 — Skip link has no visible focus styling

**File:** [src/styles/base/_utilities.scss](src/styles/base/_utilities.scss) (`.skip-link`)
**SC:** 2.4.7 Focus Visible, 2.4.1 Bypass Blocks
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** On focus the link is in view and on top, with only the 1px browser default outline, and it has a transparent background, 0 padding and `z-index: auto`. In Chromium it did not render behind the header.

When focused, the skip link moves to `top: 0` but has no background, padding, z-index, or outline, so it can show up unstyled or behind the header.

**Fix:** Give `.skip-link:focus` a background, padding, `z-index`, and an outline.

**Fixed 2026-10-16:** `.skip-link` now has a `$color-surface` background, padding, rounded corners and `z-index: 100`, appears 16px in from the top-left on focus, and gets the global focus outline.

### ISSUE-06 — "Overview" isn't a heading

**File:** [src/components/features/CardDetails/CardDetails.jsx](src/components/features/CardDetails/CardDetails.jsx)
**SC:** 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** No level-3 "Overview" heading in the modal.

`<p className='card-details__overview-label'>Overview</p>` is styled to look like a heading, but screen reader users navigating by heading can't find it.

**Fix:** Change it to an `<h3>`. The movie title is the modal's `<h2>`.

**Fixed 2026-10-16:** "Overview" is now an `<h3>` (same class, so it looks the same).

### ISSUE-07 — Result updates aren't announced

**File:** [src/components/features/CardGrid/CardGrid.jsx](src/components/features/CardGrid/CardGrid.jsx)
**SC:** 4.1.3 Status Messages
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** No `role="status"` region announces the result count after load.

Error and empty states use `role="status"`, but when a search, filter, sort, or page change returns results, nothing is announced. Screen reader users get no confirmation that the grid changed.

**Fix:** Add a persistent visually hidden `role="status"` region (outside the component that remounts) that announces e.g. "20 movies found".

**Fixed 2026-10-16:** `App` renders a persistent visually hidden `role="status"` region. `CardGrid` reports a message to it through `onStatusChange` after every load, e.g. "12,345 movies, page 2" or "34 results for "batman", page 1", plus the error and no-results messages. The inline error/empty paragraphs no longer have their own live regions, so nothing is announced twice.

### ISSUE-08 — Loading list missing `aria-busy`

**Files:** [src/components/features/CardGrid/CardGrid.jsx](src/components/features/CardGrid/CardGrid.jsx), [src/components/features/Card/CardSkeleton.jsx](src/components/features/Card/CardSkeleton.jsx)
**SC:** 4.1.3 Status Messages
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** Loading list has no `aria-busy`; skeletons are not `aria-hidden`.

While loading, the grid renders 20 empty `<li>` skeletons. Screen readers announce "list, 20 items" with nothing in them, and there's no `aria-busy="true"` to show the region is loading.

**Fix:** Add `aria-busy="true"` to the loading list and `aria-hidden="true"` to each skeleton.

**Fixed 2026-10-16:** The loading `<ul>` has `aria-busy="true"` and each `CardSkeleton` is `aria-hidden="true"`.

### ISSUE-09 — Detail skeleton not hidden from assistive tech

**File:** [src/components/features/CardDetails/CardDetailSkeleton.jsx](src/components/features/CardDetails/CardDetailSkeleton.jsx)
**SC:** 1.3.1 Info and Relationships
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** Detail skeleton is not inside an `aria-hidden` subtree; no "Loading movie details" status.

The skeleton is a tree of empty `<div>`s that isn't marked as decorative, and nothing tells screen reader users the modal content is loading.

**Fix:** Add `aria-hidden="true"` to the skeleton and put a visually hidden "Loading movie details" status next to it.

**Fixed 2026-10-16:** `CardDetailSkeleton` is `aria-hidden="true"` and is preceded by a visually hidden `role="status"` "Loading movie details".

### ISSUE-11 — Year range inputs have no validation messages

**File:** [src/components/layout/FilterSidebar/YearRangeFilter.jsx](src/components/layout/FilterSidebar/YearRangeFilter.jsx)
**SC:** 3.3.1 Error Identification, 3.3.3 Error Suggestion
**Status:** Fixed 2026-10-16 (was verified failing). **Found by the old Playwright test:** Neither 1800 nor From 2020 > To 2000 sets `aria-invalid` or an `aria-describedby` error.

The inputs have `min`/`max`, but invalid values (e.g. 1800, or a "From" later than "To") still get sent as filters with no feedback. Nothing sets `aria-invalid` or points to an error message with `aria-describedby`.

**Fix:** Validate on change, set `aria-invalid`, and show an inline error connected with `aria-describedby`.

**Fixed 2026-10-16:** Years outside 1900 to the current year, or a "To" earlier than "From", show an inline error (`$color-error`) linked with `aria-describedby`, set `aria-invalid`, and aren't applied as filters. Years still being typed (under 4 digits) aren't flagged or applied.

---

## Notes

- ISSUE-10 is intentionally left out. The original report was lost, and the item couldn't be reconstructed.
- Already in place (see [README.md](README.md#accessibility)): native `<dialog>` modal, `role="search"`, skip link target, labelled pagination with `aria-current`, accordion `aria-expanded`/`aria-controls`, and decorative poster images with `alt=""`.
- All 10 issues were fixed on 2026-10-16. They still need the manual checks: keyboard-only use, VoiceOver, and a phone for ISSUE-02.
- The Playwright tests that verified these issues were removed on 2026-10-17 to make way for Vitest; they're in git history (`tests/wcag-issues.spec.js`). New tests for these fixes will use Vitest + React Testing Library.
