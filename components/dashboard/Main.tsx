import Link from "next/link";
import {
  Code,
  MessageSquare,
  Terminal,
  FileText,
  File,
  Image,
  LinkIcon,
  Star,
  Pin,
  Folder,
  Archive,
  Heart,
  FolderHeart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems, getItemStats } from "@/lib/db/items";

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Code,
  MessageSquare,
  Terminal,
  FileText,
  File,
  Image,
  Link: LinkIcon,
  Folder,
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function Main() {
  const [collections, pinnedItems, recentItems, itemStats] = await Promise.all([
    getCollections(),
    getPinnedItems(),
    getRecentItems(),
    getItemStats(),
  ]);

  const stats = [
    {
      label: "Items",
      value: itemStats.totalItems,
      icon: Archive,
      color: "text-blue-500",
    },
    {
      label: "Collections",
      value: collections.length,
      icon: Folder,
      color: "text-emerald-500",
    },
    {
      label: "Favorite Items",
      value: itemStats.favoriteItems,
      icon: Heart,
      color: "text-rose-500",
    },
    {
      label: "Favorite Collections",
      value: collections.filter((c) => c.isFavorite).length,
      icon: FolderHeart,
      color: "text-amber-500",
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your developer knowledge hub
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Collections */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Collections</h2>
          <Link
            href="/collections"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="group rounded-xl border border-border border-l-[3px] bg-card p-4 transition-colors hover:bg-accent/50"
              style={{
                borderLeftColor: col.dominantColor,
                boxShadow: `-4px 0 12px -4px ${col.dominantColor}50`,
              }}
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{col.name}</h3>
                  {col.isFavorite && (
                    <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                  )}
                </div>
              </div>
              <p className="mb-2 text-xs text-muted-foreground">
                {col.itemCount} Items
              </p>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-1">
                {col.description}
              </p>
              <div className="flex items-center gap-2">
                {col.typeIcons.map(({ typeId, icon, color }) => {
                  const Icon = iconMap[icon] ?? Code;
                  return (
                    <Icon
                      key={typeId}
                      className="size-3.5"
                      style={{ color }}
                    />
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Pin className="size-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Pinned</h2>
          </div>
          <div className="flex flex-col gap-3">
            {pinnedItems.map((item) => {
              const TypeIcon = iconMap[item.type.icon ?? ""] ?? Code;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <TypeIcon
                          className="size-4 shrink-0"
                          style={{ color: item.type.color ?? undefined }}
                        />
                        <h3 className="truncate font-medium">{item.title}</h3>
                        <Pin className="size-3 shrink-0 text-muted-foreground" />
                        {item.isFavorite && (
                          <Star className="size-3 shrink-0 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-[11px]"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Items */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent</h2>
        <div className="flex flex-col gap-3">
          {recentItems.map((item) => {
            const TypeIcon = iconMap[item.type.icon ?? ""] ?? Code;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <TypeIcon
                        className="size-4 shrink-0"
                        style={{ color: item.type.color ?? undefined }}
                      />
                      <h3 className="truncate font-medium">{item.title}</h3>
                      {item.isPinned && (
                        <Pin className="size-3 shrink-0 text-muted-foreground" />
                      )}
                      {item.isFavorite && (
                        <Star className="size-3 shrink-0 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="outline" className="text-[11px]">
                      {item.type.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
