import "dotenv/config";
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // 1. Connection check
  await prisma.$queryRaw`SELECT 1`;
  console.log("Connection: OK\n");

  // 2. Users
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, isPro: true },
  });
  console.log(`Users (${users.length}):`);
  for (const u of users) {
    console.log(`  - ${u.name} <${u.email}> (pro: ${u.isPro})`);
  }

  // 3. Item Types
  const itemTypes = await prisma.itemType.findMany({
    orderBy: { name: "asc" },
  });
  console.log(`\nItem Types (${itemTypes.length}):`);
  for (const t of itemTypes) {
    console.log(`  - ${t.name} [${t.icon}] ${t.color} (system: ${t.isSystem})`);
  }

  // 4. Collections with item counts
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  console.log(`\nCollections (${collections.length}):`);
  for (const c of collections) {
    console.log(`  - ${c.name} (${c._count.items} items)`);
  }

  // 5. Items summary
  const items = await prisma.item.findMany({
    include: { type: true, collection: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });
  console.log(`\nItems (${items.length}):`);
  for (const item of items) {
    const tagList = item.tags.map((t) => t.tag.name).join(", ");
    console.log(
      `  - [${item.type.name}] ${item.title}${item.collection ? ` (in ${item.collection.name})` : ""}${tagList ? ` — tags: ${tagList}` : ""}`
    );
  }

  // 6. Tags
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  console.log(`\nTags (${tags.length}):`);
  for (const tag of tags) {
    console.log(`  - ${tag.name} (${tag._count.items} items)`);
  }

  console.log("\nAll checks passed!");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
