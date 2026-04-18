---
name: DevSnippet Project Architecture
description: Key architectural facts about the DevSnippet codebase — file layout, conventions, and stack details discovered during audit
type: project
---

Files live at project root (not under src/): `app/`, `components/`, `lib/`, `scripts/`, `prisma/`.

**Why:** Standard Next.js scaffold without a src/ wrapper.
**How to apply:** Always glob from root when searching for source files.

Key conventions observed:
- Prisma client generated at `prisma/generated/prisma/` (custom output path), imported as `../prisma/generated/prisma/client` or `@/prisma/generated/prisma/client`
- DB singleton at `lib/db.ts` exported as `db`
- Data-fetching helpers under `lib/db/collections.ts` and `lib/db/items.ts`
- Dashboard layout at `app/dashboard/layout.tsx` does parallel data fetching with Promise.all for sidebar (itemTypes + collections)
- Dashboard page at `app/dashboard/page.tsx` renders `<Main />` which also does its own parallel Promise.all (collections + pinnedItems + recentItems + itemStats)
- Mock data still lives in `lib/mock-data.ts` — no longer imported anywhere in the live app but the file is not deleted
- `SidebarContext.tsx` manages collapsed/mobileOpen state for the sidebar shell
- PRO_TYPES is a hardcoded Set in `Sidebar.tsx`: `new Set(["file", "image"])`
- `iconMap` is duplicated between `Main.tsx` and `Sidebar.tsx`
- Auth is not yet implemented — all DB queries are unscoped (no userId filter)
- `currentUser` is a hardcoded placeholder object in `Sidebar.tsx`
- No loading.tsx or error.tsx files exist anywhere in app/
- `$queryRawUnsafe("SELECT 1")` used only in `scripts/test-db.ts` (dev script, not app code)
