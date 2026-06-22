# Style Guide

Design tokens and conventions for this project. All variables are defined in `src/styles/abstracts/_variables.scss` and mixins in `src/styles/abstracts/_mixins.scss`.

---

## Colors

| Variable | Value | Usage |
|---|---|---|
| `$color-background` | `#0f0f0f` | Page background |
| `$color-surface` | `#1a1a1a` | Cards, modals, dropdowns |
| `$color-border` | `#2e2e2e` | Borders and dividers |
| `$color-text` | `#f5f5f5` | Primary text |
| `$color-text-muted` | `#888888` | Secondary text, placeholders, icons |
| `$color-disabled` | alias of `$color-text-muted` | Disabled states |
| `$color-accent` | `#00b3e5` | Interactive elements, active states, focus |
| `$color-white` | `#ffffff` | Pure white when needed |
| `$color-black` | `#000000` | Pure black when needed |

---

## Typography

**Font family:** `DM Sans`, sans-serif (self-hosted via `@font-face` in `_typography.scss`)

| Variable | Value | Usage |
|---|---|---|
| `$font-size-base` | `16px` | Root font size (set on `html`) |
| `$font-size-xs` | `0.75rem` (12px) | Labels, uppercase tags |
| `$font-size-sm` | `0.875rem` (14px) | Secondary text, captions |
| `$font-size-md` | `1rem` (16px) | Body text |
| `$font-size-lg` | `1.25rem` (20px) | Subheadings |
| `$font-size-xl` | `1.5rem` (24px) | Section titles |
| `$font-size-2xl` | `2rem` (32px) | Page headings |

---

## Spacing

Based on a 4px base unit, scaled in rem.

| Variable | Value | px equivalent |
|---|---|---|
| `$spacing-xs` | `0.25rem` | 4px |
| `$spacing-sm` | `0.5rem` | 8px |
| `$spacing-md` | `1rem` | 16px |
| `$spacing-lg` | `1.5rem` | 24px |
| `$spacing-xl` | `2rem` | 32px |
| `$spacing-2xl` | `3rem` | 48px |

---

## Breakpoints

Mobile-first. Use `respond-to` mixin to apply styles from a breakpoint upwards.

| Variable | Value | Target |
|---|---|---|
| `$breakpoint-sm` | `576px` | Small devices |
| `$breakpoint-md` | `768px` | Tablets and up |
| `$breakpoint-lg` | `992px` | Small desktops |
| `$breakpoint-xl` | `1200px` | Large desktops |

---

## Border Radius

| Variable | Value | Usage |
|---|---|---|
| `$border-radius-sm` | `4px` | Small elements |
| `$border-radius-md` | `8px` | Cards, modals, inputs |
| `$border-radius-lg` | `16px` | Large containers |
| `$border-radius-full` | `9999px` | Pills, circular elements |

---

## Shadows

| Variable | Value | Usage |
|---|---|---|
| `$shadow-sm` | `0 1px 3px rgba(0,0,0,0.12)` | Subtle elevation |
| `$shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `$shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, overlays |

---

## Mixins

### `respond-to($breakpoint)`
Applies styles from the given breakpoint upwards (min-width).

```scss
@include respond-to(md) {
  // styles for 768px and up
}
```

Accepted values: `sm`, `md`, `lg`, `xl`

---

### `mobile-only`
Applies styles only on screens below the `md` breakpoint (max-width: 767px).

```scss
@include mobile-only {
  // styles for mobile only
}
```

---

### `flex($direction, $justify, $align, $wrap)`
Shorthand for flex container. All parameters are optional.

```scss
@include flex(row, space-between, center);
// direction: row | column (default: row)
// justify: flex-start | center | space-between ... (default: flex-start)
// align: stretch | center | flex-start ... (default: stretch)
// wrap: nowrap | wrap (default: nowrap)
```

---

### `icon($size)`
Controls icon size. Used on the wrapper class of SVG icons.
**Do not use the `size` prop on Lucide icons** — use this mixin via a class instead so CSS takes control.

```scss
@include icon(20px); // default: 20px
```

---

### `shimmer`
Applies a shimmer animation for skeleton loading states.
The `@keyframes shimmer` is defined globally in `src/styles/base/_animations.scss`.

```scss
@include shimmer;
```

---

### `truncate`
Truncates overflowing text with an ellipsis.

```scss
@include truncate;
```

---

## BEM Conventions

This project follows [BEM](https://getbem.com/) (Block, Element, Modifier) naming.

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

**Rules followed in this project:**

- Each component has its own SCSS file with a single root block matching the component name (e.g. `.card`, `.modal`, `.pagination`)
- Elements use `__` (e.g. `.card__image`, `.modal__close`)
- Modifiers use `--` (e.g. `.pagination__btn--active`, `.accordion__icon--open`)
- No deep nesting of elements — `.block__element__sub` is not valid BEM; use `.block__sub` instead
- Skeletons are their own blocks: `.card-skeleton`, `.card-details-skeleton`
- Utility classes (`.container`, `.visually-hidden`, `.error-message`) live in `src/styles/base/_utilities.scss`

---

## File Structure

```
src/styles/
├── abstracts/
│   ├── _variables.scss   # Design tokens
│   ├── _mixins.scss      # Reusable mixins
├── base/
│   ├── _reset.scss       # CSS reset
│   ├── _base.scss        # Base element styles (html, body, a, etc.)
│   ├── _typography.scss  # @font-face declarations
│   ├── _animations.scss  # @keyframes definitions
│   ├── _utilities.scss   # Global utility classes
├── layouts/
│   ├── _main.scss        # App layout (.app, .container)
└── main.scss             # Entry point — imports all partials
```
