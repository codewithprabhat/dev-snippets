import "dotenv/config";
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const KEEP_EMAIL = "demo@devstash.io";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const dryRun = !process.argv.includes("--confirm");

async function main() {
  const demo = await prisma.user.findUnique({
    where: { email: KEEP_EMAIL },
    select: { id: true, name: true, email: true },
  });
  if (!demo) {
    throw new Error(`Demo user "${KEEP_EMAIL}" not found — refusing to run.`);
  }

  const targets = await prisma.user.findMany({
    where: { email: { not: KEEP_EMAIL } },
    select: {
      id: true,
      email: true,
      _count: {
        select: {
          items: true,
          collections: true,
          tags: true,
          itemTypes: true,
          accounts: true,
          sessions: true,
        },
      },
    },
    orderBy: { email: "asc" },
  });

  const orphanTokens = await prisma.verificationToken.count({
    where: { identifier: { not: KEEP_EMAIL } },
  });

  console.log(`Keeping: ${demo.name ?? "(unnamed)"} <${demo.email}>\n`);
  console.log(`Users to delete (${targets.length}):`);
  for (const u of targets) {
    const c = u._count;
    console.log(
      `  - <${u.email}>  items:${c.items}  collections:${c.collections}  tags:${c.tags}  customTypes:${c.itemTypes}  accounts:${c.accounts}  sessions:${c.sessions}`,
    );
  }
  console.log(`Orphan verification tokens to delete: ${orphanTokens}\n`);

  if (dryRun) {
    console.log("Dry run. Re-run with --confirm to actually delete.");
    return;
  }

  if (targets.length === 0 && orphanTokens === 0) {
    console.log("Nothing to delete.");
    return;
  }

  const tokens = await prisma.verificationToken.deleteMany({
    where: { identifier: { not: KEEP_EMAIL } },
  });
  const users = await prisma.user.deleteMany({
    where: { email: { not: KEEP_EMAIL } },
  });

  console.log(`Deleted: ${users.count} users, ${tokens.count} verification tokens.`);
  console.log("Cascaded: items, collections, tags, item-tags, custom item types, accounts, sessions.");
}

main()
  .catch((e) => {
    console.error("reset-users failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
