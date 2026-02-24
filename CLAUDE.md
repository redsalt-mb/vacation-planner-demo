# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite on 127.0.0.1)
- **Build**: `npm run build` (runs `tsc -b && vite build`)
- **Preview production build**: `npm run preview`
- **Type check only**: `npx tsc -b`

No test runner or linter is configured.

## Architecture

Single-page React 19 vacation planner for Vipiteno/Sterzing (South Tyrol). Vite 7 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite` plugin). No router — uses tab-based navigation.

### State Management

All user state lives in the `usePlanner` hook (`src/hooks/usePlanner.ts`), which wraps `useLocalStorage` (key: `vipiteno-planner`). The `Planner` type (exported as `ReturnType<typeof usePlanner>`) is passed as props to view components. State tracks:
- Activity statuses: `none` → `want` → `done` (tri-state toggle)
- Itinerary: ordered days, each with ordered activity IDs
- Notes: per-activity text

### Component Structure

`App` renders four tab views, each receiving the `planner` prop:
- **ExploreView** — browsable/filterable activity list or map view. Manages local filter state. Opens `ActivityDetail` modal.
- **MyListView** — shows "want" and "done" lists using `ActivityCard`.
- **ItineraryView** — day-by-day planner with drag-to-reorder. Uses `DayPlanner` per day. Supports loading pre-built templates from `src/data/itinerary-templates.ts`.
- **InfoView** — static destination info + `WeatherInfo` (reads `src/data/weather.ts`).

Small reusable components: `CategoryBadge`, `KidRating`, `MapLink`, `ActivityCard`, `ActivityDetail`.

### Data

Activity data is a static array in `src/data/activities.ts` (~28 entries). Each activity has a `category` (`food | outdoors | kids | culture`), `kidFriendliness` (1–5), location with optional lat/lng, and optional German name (`nameDE`).

### Styling

Tailwind v4 with a custom `@theme` in `src/index.css` defining color palettes: `alpine-*` (warm neutrals), `forest-*` (greens), `sky-*` (blues), `sunset-*` (oranges). Headings use `font-heading` (Georgia/serif). Categories are color-coded: food=sunset, outdoors=forest, kids=sky, culture=alpine.

### Map

Uses `react-leaflet` with OpenStreetMap tiles. `MapView` creates category-colored div markers and auto-fits bounds on filter changes via an internal `MapBoundsUpdater` component. Leaflet CSS is imported in `index.css`.
