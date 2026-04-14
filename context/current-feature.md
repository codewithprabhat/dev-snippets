# Current Feature

Dashboard UI — Phase 3

## Status

In Progress

## Goals

- Main content area to the right of sidebar
- Recent collections section
- Pinned items section
- 10 recent items
- 4 stats cards (items, collections, favorite items, favorite collections)

## Notes

- Spec: @context/features/dashboard-phase-3-spec.md
- Screenshot: @context/screenshots/dashboard-ui-main.png
- Mock data: @src/lib/mock-data.js

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-13 — **Initial Setup** — Next.js (React 19) + TypeScript + Tailwind CSS v4 scaffolded
- 2026-04-13 — **Dashboard UI — Phase 1 ✅** — ShadCN initialized, dark-mode dashboard shell at `/dashboard` with display-only top bar and Sidebar/Main placeholders
- 2026-04-14 — **Dashboard UI — Phase 2 ✅** — Collapsible sidebar with item types (colored icons, counts, links), collapsible collections (favorites + all), user avatar area, mobile Sheet drawer, TopBar toggle wired via SidebarContext
