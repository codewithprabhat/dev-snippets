# Current Feature

Stats & Sidebar — Real Data

## Status

In Progress

## Goals

- Display stats from database data, keeping current design/layout
- Display item types in sidebar with their icons, linking to /items/[typename]
- Add "View all collections" link under the collections list that goes to /collections
- Keep star icons for favorite collections; for recents, show colored circle based on most-used item type
- Create `src/lib/db/items.ts` with database functions

## Notes

- Spec: @context/features/stats-sidebar-spec.md
- Reference: @src/lib/db/collections.ts

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-13 — **Initial Setup** — Next.js (React 19) + TypeScript + Tailwind CSS v4 scaffolded
- 2026-04-13 — **Dashboard UI — Phase 1 ✅** — ShadCN initialized, dark-mode dashboard shell at `/dashboard` with display-only top bar and Sidebar/Main placeholders
- 2026-04-14 — **Dashboard UI — Phase 2 ✅** — Collapsible sidebar with item types (colored icons, counts, links), collapsible collections (favorites + all), user avatar area, mobile Sheet drawer, TopBar toggle wired via SidebarContext
- 2026-04-14 — **Dashboard UI — Phase 3 ✅** — Main content area with 4 stats cards, collection grid with dominant-type colored left border glow, pinned items with tags, and recent items list
- 2026-04-14 — **Prisma + Neon PostgreSQL Setup ✅** — Prisma 7 installed with `@prisma/adapter-pg`; schema with all app models (User, Item, ItemType, Collection, Tag, ItemTag) + NextAuth models (Account, Session, VerificationToken); `prisma.config.ts` for migration URL; `lib/db.ts` singleton; `.env.example` with DATABASE_URL and DIRECT_URL; build passes
- 2026-04-15 — **Database Seed Script ✅** — `scripts/seed.ts` with demo user, 7 system item types, 16 tags, 5 collections, 20 items, 36 item-tag associations; `scripts/test-db.ts` for connection testing; `db:seed`, `db:test`, `db:studio` npm scripts; bcryptjs for password hashing
- 2026-04-15 — **Dashboard Collections — Real Data ✅** — `lib/db/collections.ts` with data fetching functions; collections fetched in server component; card border color derived from dominant item type; small type icons shown per collection; collection stats updated with real data
- 2026-04-16 — **Dashboard Items — Real Data ✅** — `lib/db/items.ts` with `getPinnedItems`, `getRecentItems`, `getItemStats`; all four data calls run in parallel via `Promise.all`; pinned and recent items fetched in server component; item icon/color derived from item type; tags displayed on pinned items; type badge on recent items; pinned section hidden when empty; mock-data removed from Main.tsx
