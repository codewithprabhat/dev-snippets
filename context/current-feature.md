# Current Feature

<!-- Feature name goes here -->

## Status

Not Started

## Goals

<!-- - Goal 1 -->
<!-- - Goal 2 -->

## Notes

<!-- - Note 1 -->
<!-- - Note 2 -->

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-13 — **Initial Setup** — Next.js (React 19) + TypeScript + Tailwind CSS v4 scaffolded
- 2026-04-13 — **Dashboard UI — Phase 1 ✅** — ShadCN initialized, dark-mode dashboard shell at `/dashboard` with display-only top bar and Sidebar/Main placeholders
- 2026-04-14 — **Dashboard UI — Phase 2 ✅** — Collapsible sidebar with item types (colored icons, counts, links), collapsible collections (favorites + all), user avatar area, mobile Sheet drawer, TopBar toggle wired via SidebarContext
- 2026-04-14 — **Dashboard UI — Phase 3 ✅** — Main content area with 4 stats cards, collection grid with dominant-type colored left border glow, pinned items with tags, and recent items list
- 2026-04-14 — **Prisma + Neon PostgreSQL Setup ✅** — Prisma 7 installed with `@prisma/adapter-pg`; schema with all app models (User, Item, ItemType, Collection, Tag, ItemTag) + NextAuth models (Account, Session, VerificationToken); `prisma.config.ts` for migration URL; `lib/db.ts` singleton; `.env.example` with DATABASE_URL and DIRECT_URL; build passes
- 2026-04-15 — **Database Seed Script ✅** — `scripts/seed.ts` with demo user, 7 system item types, 16 tags, 5 collections, 20 items, 36 item-tag associations; `scripts/test-db.ts` for connection testing; `db:seed`, `db:test`, `db:studio` npm scripts; bcryptjs for password hashing
