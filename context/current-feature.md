# Current Feature: Auth Phase 2 — Credentials (Email/Password) Provider

## Status

In Progress

## Goals

- Add NextAuth Credentials provider for email/password authentication alongside existing GitHub OAuth
- Add `password` field to `User` model via Prisma migration (if not already present)
- Update `auth.config.ts` with a Credentials provider placeholder (`authorize: () => null`) to stay edge-compatible
- Override the Credentials provider in `auth.ts` with real bcryptjs validation logic
- Create `POST /api/auth/register` route that validates input, checks for existing user, hashes password with bcryptjs, and creates the user
- Verify registration via curl, sign-in via `/api/auth/signin`, redirect to `/dashboard`, and confirm GitHub OAuth still works

## Notes

- Use `bcryptjs` (already installed) for password hashing
- Split-config pattern: placeholder in `auth.config.ts` (edge-safe), real logic in `auth.ts`
- Registration payload: `{ name, email, password, confirmPassword }` — validate passwords match and user does not already exist
- Return `{ success, error }`-style JSON responses from the register route
- Reference: https://authjs.dev/getting-started/authentication/credentials

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
- 2026-04-20 — **Auth Phase 1 — NextAuth + GitHub Provider ✅** — `next-auth@beta` + `@auth/prisma-adapter` installed; split config (`auth.config.ts` edge-compat + `auth.ts` with Prisma adapter, JWT strategy, jwt/session callbacks adding `user.id`); `app/api/auth/[...nextauth]/route.ts` exports `{GET, POST}` from `handlers`; `proxy.ts` redirects unauthenticated `/dashboard/*` to NextAuth default sign-in with callbackUrl; `types/next-auth.d.ts` augments `Session.user.id` and `JWT.id`; `.env.example` updated with `AUTH_SECRET`/`AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`; files at project root (no `src/` dir)
