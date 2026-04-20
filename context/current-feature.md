# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility (`auth.config.ts` + `auth.ts`)
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes via Next.js 16 proxy (`src/proxy.ts`)
- Redirect unauthenticated users to NextAuth's default sign-in page
- Extend Session type with `user.id`

## Notes

### Files to Create

1. `src/auth.config.ts` — Edge-compatible config (providers only, no adapter)
2. `src/auth.ts` — Full config with Prisma adapter and JWT strategy
3. `src/app/api/auth/[...nextauth]/route.ts` — Export handlers from `auth.ts`
4. `src/proxy.ts` — Route protection with redirect logic
5. `src/types/next-auth.d.ts` — Extend Session type with `user.id`

### Key Gotchas

Use Context7 to verify the newest config and conventions.

- Use `next-auth@beta` (not `@latest`, which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` — not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page

### Environment Variables

```
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

### Testing

1. Go to `/dashboard` → should redirect to sign-in
2. Click "Sign in with GitHub"
3. Verify redirect back to `/dashboard` after auth

### References

- Edge compatibility: https://authjs.dev/getting-started/installation#edge-compatibility
- Prisma adapter: https://authjs.dev/getting-started/adapters/prisma

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
- 2026-04-18 — **Add Pro Badge to Sidebar ✅** — ShadCN `Badge` added next to File and Image item types in sidebar; subtle amber outline style; shown in both expanded row and collapsed tooltip
- 2026-04-18 — **Code Review Quick Wins ✅** — `orderBy: { name: "asc" }` added to `getItemTypes`; unused tags include removed from `getRecentItems`; `$queryRawUnsafe` replaced with safe tagged-template form in `test-db.ts`; `app/dashboard/loading.tsx` and `app/dashboard/error.tsx` added
