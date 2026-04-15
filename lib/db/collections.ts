import { db } from "@/lib/db";

export type CollectionWithStats = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantColor: string;
  typeIcons: { typeId: string; icon: string; color: string }[];
};

export async function getCollections(limit = 6): Promise<CollectionWithStats[]> {
  const collections = await db.collection.findMany({
    include: {
      items: {
        include: {
          type: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return collections.map((col) => {
    const itemCount = col.items.length;

    // Count items per type
    const typeCounts = new Map<
      string,
      { count: number; icon: string; color: string }
    >();
    for (const item of col.items) {
      const existing = typeCounts.get(item.typeId);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(item.typeId, {
          count: 1,
          icon: item.type.icon ?? "Code",
          color: item.type.color ?? "#555",
        });
      }
    }

    // Dominant color from most-used type
    let dominantColor = "#555";
    let maxCount = 0;
    for (const [, typeData] of typeCounts) {
      if (typeData.count > maxCount) {
        maxCount = typeData.count;
        dominantColor = typeData.color;
      }
    }

    // Unique type icons
    const typeIcons = Array.from(typeCounts.entries()).map(
      ([typeId, data]) => ({
        typeId,
        icon: data.icon,
        color: data.color,
      })
    );

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount,
      dominantColor,
      typeIcons,
    };
  });
}
