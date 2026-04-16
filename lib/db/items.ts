import { db } from "@/lib/db";

export type ItemTypeWithCount = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
};

export type ItemWithDetails = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  tags: { id: string; name: string }[];
};

export type ItemStats = {
  totalItems: number;
  favoriteItems: number;
};

export async function getPinnedItems(): Promise<ItemWithDetails[]> {
  const items = await db.item.findMany({
    where: { isPinned: true },
    include: {
      type: true,
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color,
    },
    tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
  }));
}

export async function getRecentItems(limit = 10): Promise<ItemWithDetails[]> {
  const items = await db.item.findMany({
    include: {
      type: true,
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color,
    },
    tags: item.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
  }));
}

export async function getItemTypes(): Promise<ItemTypeWithCount[]> {
  const types = await db.itemType.findMany({
    where: { isSystem: true },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return types.map((type) => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    color: type.color,
    count: type._count.items,
  }));
}

export async function getItemStats(): Promise<ItemStats> {
  const [totalItems, favoriteItems] = await Promise.all([
    db.item.count(),
    db.item.count({ where: { isFavorite: true } }),
  ]);

  return { totalItems, favoriteItems };
}
