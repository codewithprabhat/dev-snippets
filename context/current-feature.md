# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

Completed

## Goals

- Set up Prisma ORM with Neon PostgreSQL (serverless)
- Create initial schema based on data models in `context/project-overview.md` (will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Use Prisma 7 (has breaking changes — follow upgrade guide)

## Notes

- Always use `prisma migrate dev` — never `db push` unless explicitly specified
- `DATABASE_URL` points to the **development** branch on Neon; a separate production branch will be used for prod
- Prisma 7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Quickstart reference: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-13 — **Initial Setup** — Next.js (React 19) + TypeScript + Tailwind CSS v4 scaffolded
- 2026-04-13 — **Dashboard UI — Phase 1 ✅** — ShadCN initialized, dark-mode dashboard shell at `/dashboard` with display-only top bar and Sidebar/Main placeholders
- 2026-04-14 — **Dashboard UI — Phase 2 ✅** — Collapsible sidebar with item types (colored icons, counts, links), collapsible collections (favorites + all), user avatar area, mobile Sheet drawer, TopBar toggle wired via SidebarContext
- 2026-04-14 — **Dashboard UI — Phase 3 ✅** — Main content area with 4 stats cards, collection grid with dominant-type colored left border glow, pinned items with tags, and recent items list
- 2026-04-14 — **Prisma + Neon PostgreSQL Setup ✅** — Prisma 7 installed with `@prisma/adapter-pg`; schema with all app models (User, Item, ItemType, Collection, Tag, ItemTag) + NextAuth models (Account, Session, VerificationToken); `prisma.config.ts` for migration URL; `lib/db.ts` singleton; `.env.example` with DATABASE_URL and DIRECT_URL; build passes
