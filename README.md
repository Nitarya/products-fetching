# Nitya's Products — Product Catalog

A **client-ready product catalog** built with **React 19 + Vite + Tailwind CSS v4**.
This project started from the official `create-vite` React template and was rebuilt
from the ground up into a polished, production-style e-commerce listing page that
fetches real data from the [DummyJSON](https://dummyjson.com) API.

It demonstrates **clean, optimized, and maintainable React**: minimal state,
derived data with `useMemo`, memoized components, stable callbacks, a reusable
fetch hook, proper loading / error / empty states, and a fully responsive UI.

---

## Table of Contents

1. [What was built](#what-was-built)
2. [Tech stack](#tech-stack)
3. [Features](#features)
4. [Project structure](#project-structure)
5. [Deep dive: component-by-component](#deep-dive-component-by-component)
6. [State & data-flow design](#state--data-flow-design)
7. [Performance & optimization decisions](#performance--optimization-decisions)
8. [UI / design decisions](#ui--design-decisions)
9. [Edge cases handled](#edge-cases-handled)
10. [Getting started](#getting-started)
11. [Available scripts](#available-scripts)
12. [Verification](#verification)
13. [Known limitations](#known-limitations)

---

## What was built

The default Vite + React starter page (logo spinners and a "Vite + React" counter)
was completely replaced with a real product catalog site:

- A **sticky navigation bar** with brand, nav links, cart icon and sign-in button.
- A **gradient hero section** with live product/category stats and a curved
  transition into the page body.
- A **sticky search/filter toolbar** with:
  - text search by product name,
  - horizontal category filter pills (scrollable),
  - a sort-by-price dropdown (Low → High / High → Low).
- A **responsive product grid** of polished cards showing image, category,
  name, star rating, price (with discount), stock status and an add-to-cart
  button.
- **Client-side pagination** (10 products per page) with ellipsis-aware page
  numbers, prev/next controls, and a "Showing X–Y of Z products" summary.
- **Loading skeletons**, an **error state with retry**, and an **empty state**
  for no search results.
- A **footer** with brand, link columns, and attribution.

The site is branded **"Nitya's Products."** and is designed to look like a real
storefront that could be shown to a client.

---

## Tech stack

| Layer      | Choice                                        | Why                                                                 |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------- |
| Build      | [Vite 8](https://vite.dev)                    | Fast dev server + production builds, standard for React apps         |
| UI         | [React 19](https://react.dev)                 | Component model, hooks, `memo` for render control                   |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com)    | Utility-first styling, CSS-first `@theme` config, zero runtime CSS   |
| Language   | JavaScript (JSX)                              | Matches the task brief and keeps the setup minimal                  |
| Linting    | ESLint 10 + `eslint-plugin-react-hooks` v7    | Enforces modern React rules (including `setState`-in-effect checks) |
| Data       | [DummyJSON Products API](https://dummyjson.com/docs/products) | Free, realistic demo product data            |
| Fonts      | Google Fonts: **Inter** (body) + **Sora** (display)          | Clean, modern typography            |

> **Tailwind v4 wiring:** Tailwind v4 is integrated through the official
> `@tailwindcss/vite` plugin (see `vite.config.js`) rather than the browser CDN.
> This gives full build-time processing, purging, and CSS-first theming.
> The theme (fonts, keyframe animations) lives in `src/index.css` under `@theme`.

---

## Features

### Functional (from the task brief)

- ✅ Fetch products from the API (`https://dummyjson.com/products?limit=0`)
- ✅ Display: **Image, Name, Price, Category, Rating, Stock**
- ✅ **Search** by product name (case-insensitive, whitespace-trimmed)
- ✅ **Filter** by category (single-select pill row)
- ✅ **Sort** by price — Low → High and High → Low
- ✅ **Pagination** — exactly 10 items per page
- ✅ **Loading** state — skeleton cards
- ✅ **Error** state — friendly message + "Try again" retry button
- ✅ **Empty** state — contextual message + "Clear filters" action
- ✅ Tailwind CSS for all UI

### Polish (added beyond the brief)

- Discount badges (`-X%`) and struck-through original prices
- Precise fractional star ratings (e.g. 4.3 stars filled exactly)
- Low-stock ("Only 3 left") and out-of-stock treatment (overlay + disabled button)
- "Showing X–Y of Z" result summary and a "Clear filters" quick action
- Lazy-loaded images with a graceful fallback when an image fails to load
- Smooth entry animation (staggered card fade-up)
- Hover micro-interactions (lift, shadow, image zoom, button states)
- Sticky, blurred header + toolbar so controls stay reachable while scrolling
- Hero stats that update live from the fetched data

---

## Project structure

```
.
├── index.html                  # Entry HTML: title, meta, Google Fonts
├── vite.config.js              # Vite + React + Tailwind v4 plugins
├── eslint.config.js            # ESLint flat config (react-hooks v7 rules)
├── package.json                # Dependencies & scripts
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx                # React root render
    ├── index.css               # Tailwind import + @theme (fonts, animation)
    ├── App.jsx                 # Page shell: owns the single data fetch
    ├── ProductList.jsx         # Main feature component (search/filter/sort/pagination)
    ├── hooks/
    │   └── useProducts.js      # Reusable fetch hook (loading/error/refetch)
    └── components/
        ├── Navbar.jsx          # Sticky top navigation
        ├── Hero.jsx            # Gradient hero with live stats
        ├── Footer.jsx          # Site footer
        ├── ProductCard.jsx     # Memoized product card (memo(ProductCard))
        ├── Stars.jsx           # Fractional 5-star rating display
        ├── Pagination.jsx      # Ellipsis-aware page controls
        ├── SkeletonGrid.jsx    # Loading placeholder cards
        └── States.jsx          # EmptyState + ErrorState
```

---

## Deep dive: component-by-component

### `src/hooks/useProducts.js` — the data layer

A small, reusable hook that owns the whole fetch lifecycle:

- **State:** `products` (array), `loading` (bool), `error` (string | null),
  plus an internal `reloadKey` counter used to re-trigger the effect.
- **Fetch:** requests `https://dummyjson.com/products?limit=0` — `limit=0` asks
  DummyJSON for the *complete* catalog (~190 products) in a single request.
- **Robustness:**
  - checks `res.ok` and throws a meaningful error message on non-2xx,
  - validates the payload shape (`Array.isArray(data.products)`),
  - normalizes unknown errors into a friendly string.
- **Cancellation:** each effect run creates an `AbortController`; the cleanup
  aborts the in-flight request *and* sets a `cancelled` flag so no state is
  written after unmount or after a newer request has started.
- **No `setState` in effect body:** loading is toggled from event handlers
  (initial `useState(true)` + `refetch`), and the effect only calls `setState`
  asynchronously after the request settles — keeping the strict
  `react-hooks/set-state-in-effect` rule satisfied.

### `src/App.jsx` — single source of truth

- Calls `useProducts()` **once** and passes `products`, `loading`, `error` and
  `onRetry` down to `<ProductList />` as props. This guarantees the API is hit
  exactly once even though two consumers need the data (hero stats + the list).
- Derives `categoryCount` for the hero from the same fetched data.
- Renders the page shell: `Navbar` → `Hero` → `ProductList` → `Footer`.

### `src/ProductList.jsx` — the core feature component

This is the "Product List" deliverable. It is a **controlled** component:
all data comes in via props; all interactivity is local state.

- **State (minimal, exactly 4 pieces):** `search`, `category`, `sort`, `page`.
  Everything else is derived — there is no duplicated "filtered list" state.
- **Derived data via `useMemo`:**
  - `categories` — distinct, alphabetically sorted category list for the pills,
  - `filteredProducts` — the full search → filter → sort pipeline
    (search is case-insensitive and whitespace-trimmed; sort copies the array
    before mutating so the original `products` array is never modified),
  - `pageItems` — the 10-item slice for the current page.
- **Page management:**
  - every search/filter/sort change resets `page` to 1 **inside the event
    handler** (no effect needed),
  - a render-time adjustment keeps `page` in range if the result set shrinks
    (`if (page > totalPages) setPage(totalPages)` — the documented React
    "adjust state during render" pattern),
  - `handlePageChange` scrolls the catalog back into view smoothly on page turn.
- **Toolbar UI:** search input with icon, sort `<select>` with custom chevron,
  category pills (active pill highlighted, click toggles off). The whole toolbar
  is sticky (`top-16`, matching the 64px navbar) with a frosted-glass backdrop.
- **States:** skeleton grid while loading → error card with retry on failure →
  empty state (with `hasFilters` so the copy/actions make sense) → product grid.
- **Result summary:** "Showing X–Y of Z products" plus a "Clear filters" link
  that appears only when a filter/search/sort is actually active.

### `src/components/ProductCard.jsx` — the memoized card

Wrapped in `React.memo` so cards only re-render when their own `product` prop
changes — not when you type in the search box or flip pages.

- **Image:** lazy-loaded, `object-cover` in an `aspect-square` frame, zoom on
  hover, and an inline SVG fallback if the image fails to load (`onError`).
- **Discounts:** `-X%` badge derived from `discountPercentage`; original price
  recomputed as `price / (1 - discount/100)` and shown struck-through.
- **Rating:** fractional stars (see `Stars.jsx`).
- **Stock states:** green "In stock", amber "Only X left" (≤ 10), or a
  "Out of stock" overlay that also disables the add-to-cart button.
- **Guarded values:** `price`, `rating`, `stock`, `discountPercentage` are all
  coerced with `Number(x) || 0` so a bad API value can never crash `.toFixed()`.
- **Staggered entry:** the fade-up animation delay is derived from the stable
  `product.id` (`(id % 8) * 40ms`) — not the grid position — so shifting cards
  during search don't re-render (and re-animate) unnecessarily.

### `src/components/Stars.jsx` — fractional rating

Renders 5 gray stars with an absolutely-positioned amber overlay clipped to the
exact fill percentage (`rating / 5 * 100`). This gives a precise 4.3-star look
without needing half-star assets. Includes an `aria-label` for accessibility.

### `src/components/Pagination.jsx` — ellipsis-aware controls

- `buildPageItems()` generates the page list with `…` gaps, e.g.
  `[1, '…', 4, 5, 6, '…', 19]`, so the page numbers never overflow the layout
  even with ~19 pages.
- Active page is highlighted; prev/next are disabled at the bounds.
- Hidden entirely when there is only one page. Memoized with `React.memo`.

### `src/components/States.jsx` — error & empty states

- **`ErrorState`** — soft red card with warning icon, the error message, and a
  "Try again" button wired to `refetch`.
- **`EmptyState`** — dashed-border card with a search icon; the copy and the
  "Clear filters" button only show when filters are active (`hasFilters` prop),
  otherwise it reads as "the catalog is empty right now".

### `src/components/Navbar.jsx`, `Hero.jsx`, `Footer.jsx` — the site shell

- **Navbar:** sticky with backdrop blur; gradient brand mark; decorative nav
  links; cart button with a badge; sign-in button.
- **Hero:** indigo→violet→fuchsia gradient, radial dot pattern, decorative glow
  blobs, live stats (`{productCount}+` products, categories, delivery), and a
  curved bottom edge that transitions smoothly into the page background.
- **Footer:** brand + description, three link columns, copyright with
  DummyJSON attribution.

### `src/index.css` — Tailwind v4 theme

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ...;
  --font-display: "Sora", "Inter", ...;
  --animate-fade-up: fade-up 0.5s ease-out both;
  @keyframes fade-up { ... }
}
```

Defines the Inter/Sora font stack, the `font-display` utility, and the
`animate-fade-up` animation used by the cards. Also contains a small
`.no-scrollbar` helper so the category pill row scrolls horizontally without
visible scrollbars.

---

## State & data-flow design

```
DummyJSON API
      │  (useProducts hook — AbortController, cancelled flag)
      ▼
App.jsx  ── products, loading, error, onRetry ──►  ProductList
      │                                              │  local state:
      │                                              │  search, category, sort, page
      │                                              ▼
      │                                   useMemo: categories → filtered → pageItems
      │                                              │
      │                                              ▼
      │                        ProductCard (memo) · Pagination · States · Skeletons
      └── productCount, categoryCount ──► Hero
```

Key properties of this design:

1. **Single fetch.** Only `App.jsx` talks to the network; everything else is
   pure props + derived state.
2. **No duplicate state.** The filtered list, page slice, page count and
   result range are all *computed* from the 4 pieces of source state.
3. **Derived-state purity.** `filteredProducts` is a pure function of
   `[products, search, category, sort]` — it can never drift out of sync.
4. **All rendering is data-driven.** Cards, pagination and states re-render
   automatically as the derived values change.

---

## Performance & optimization decisions

| Technique | Where | Why |
| --------- | ----- | --- |
| `React.memo(ProductCard)` | `ProductCard.jsx` | Prevents re-rendering 10 cards on every search keystroke — only changed `product` references re-render |
| Stable stagger key (`product.id % 8`) | `ProductCard.jsx` | The delay prop stays constant per product, so memoization isn't defeated by position shifts |
| `useMemo` for pipeline | `ProductList.jsx` | Search+filter+sort and page slicing only recompute when their inputs actually change |
| `useCallback` for handlers | `ProductList.jsx`, `useProducts.js` | Stable function identities for memoized children and effect deps |
| Page reset in handlers, not effects | `ProductList.jsx` | One fewer render cascade; no `setState`-in-effect lint violations |
| Render-time page clamp | `ProductList.jsx` | Documented React pattern; terminates (strictly decreasing) with no loops |
| `AbortController` + cancelled flag | `useProducts.js` | No state writes after unmount or stale overwrites after a refetch |
| Lazy images (`loading="lazy"`) | `ProductCard.jsx` | Off-screen product images are deferred by the browser |
| Minimal state (4 values) | `ProductList.jsx` | Less state = less to keep in sync, fewer re-renders |

---

## UI / design decisions

- **Design language:** clean light theme (slate + white), rounded-2xl cards,
  soft shadows and 1px borders — the look of preline.co / flowbite-style
  component libraries.
- **Accent:** indigo→violet→fuchsia gradient used sparingly (brand mark, hero,
  active pill, hover states) for a premium feel without overwhelming the content.
- **Typography:** Inter for body text (excellent readability), Sora for the
  display/brand type; loaded from Google Fonts with a system-ui fallback stack.
- **Layout:** `max-w-7xl` centered container; product grid goes
  `1 → 2 → 3 → 4` columns across breakpoints; toolbar stacks on mobile.
- **Sticky chrome:** navbar (`top-0`) + toolbar (`top-16`) both use
  `backdrop-blur` so controls remain usable while scrolling long result sets.
- **Motion:** subtle, staggered card entrance; hover lift + shadow; image zoom;
  active-scale on buttons. Nothing that would annoy a real shopper.
- **Accessibility touches:** `aria-label`s on icons/ratings, `sr-only` labels on
  form controls, `aria-current="page"` on the active pagination button,
  semantic `<article>`, `<nav>`, `<main>`, `<footer>` elements.

---

## Edge cases handled

- Search with only whitespace → treated as no search.
- Search/filter that matches nothing → empty state with contextual copy.
- Page number beyond range (e.g. results shrink after refetch) → clamped.
- Filter changes while on page 5 → reset to page 1.
- Product image fails to load → SVG placeholder, layout doesn't jump.
- Product with 0 stock → overlay, disabled add-to-cart, red indicator.
- Product with low stock (≤ 10) → amber "Only X left" hint.
- `price`/`rating` returned as strings or missing → coerced to numbers, never crash.
- API returns non-2xx or malformed payload → error state with retry.
- Component unmounts / refetch during an in-flight request → request aborted,
  no stale state.
- Single-page result set → pagination hidden entirely.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build (outputs to dist/)
npm run build

# 4. Preview the production build locally
npm run preview
```

> Note: this project already has `node_modules` installed and was verified with
> Node 24 / npm 11 on Windows.

---

## Available scripts

| Script           | Command            | Description                                  |
| ---------------- | ------------------ | -------------------------------------------- |
| `dev`            | `vite`             | Start the dev server with HMR                 |
| `build`          | `vite build`       | Create a production bundle in `dist/`         |
| `preview`        | `vite preview`     | Serve the production build locally            |
| `lint`           | `eslint .`         | Run ESLint (includes react-hooks v7 rules)    |

---

## Verification

The final state of this project was verified as follows:

- **Lint:** `npm run lint` → 0 errors, 0 warnings.
  (This required a deliberate refactor to satisfy the new
  `react-hooks/set-state-in-effect` rule: page reset moved into event handlers,
  and the fetch effect only sets state asynchronously.)
- **Build:** `npm run build` → succeeds; `dist/` produced (~66 kB gzipped JS).
- **Preview:** `npm run preview` → serves the built app at HTTP 200 with the
  correct page title.
- **Code review:** an independent review pass was run on the diff; all flagged
  items (memoization defeat by positional props, unguarded `.toFixed()` calls,
  missing request cancellation, empty-state copy) were fixed and re-verified.
- **Template cleanup:** unused starter files were removed
  (`src/App.css`, `src/assets/*` template images) and the default README/title
  were replaced.

---

## Known limitations

- **Demo data & links:** nav/footer/cart links are decorative (`href="#"`) —
  they are placeholders for a real storefront and have no routing or cart state.
- **Fonts require network:** Inter/Sora load from Google Fonts at runtime;
  the system font fallback covers offline viewing.
- **Full-catalog fetch:** the client requests all ~190 products at once
  (`?limit=0`) and paginates client-side. For a very large catalog, server-side
  pagination would be the next step.
- **No tests:** the filter/sort/pagination pipeline is pure logic and would be
  the ideal candidate for a couple of unit tests in a follow-up.

---

*Built with React 19, Vite 8, and Tailwind CSS v4. Demo data courtesy of
[DummyJSON](https://dummyjson.com).*
