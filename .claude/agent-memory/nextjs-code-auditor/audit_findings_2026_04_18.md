---
name: First Code Audit Findings — 2026-04-18
description: Issues discovered in the first full audit covering dashboard UI, Prisma setup, data fetching, and seed script
type: project
---

Audit covered: dashboard UI (sidebar, main, topbar), lib/db.ts, lib/db/collections.ts, lib/db/items.ts, scripts/seed.ts, scripts/test-db.ts, prisma/schema.prisma

Recurring issues to watch in future sessions:
- DB queries in lib/db/* have no userId scoping — will need auth guards added when NextAuth is wired up
- getCollections() fetches ALL item data (include items + type) just to compute counts/colors in JS — should be rewritten with aggregation queries when data grows
- iconMap is duplicated in Main.tsx and Sidebar.tsx — a shared constant is needed
- lib/mock-data.ts is dead code (no longer imported) but not deleted
- No loading.tsx or error.tsx anywhere — unhandled DB errors will surface as uncaught exceptions

**Why:** Auth not implemented yet; mock data was used during Phase 1/2 before real DB was wired in.
**How to apply:** When auth lands, cross-check every db/* function for missing where: { userId } clauses.
