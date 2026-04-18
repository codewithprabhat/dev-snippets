"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Code,
  MessageSquare,
  Terminal,
  FileText,
  File,
  Image,
  LinkIcon,
  Folder,
  Star,
  Settings,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/dashboard/SidebarContext";
import { cn } from "@/lib/utils";
import type { CollectionWithStats } from "@/lib/db/collections";
import type { ItemTypeWithCount } from "@/lib/db/items";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  MessageSquare,
  Sparkles,
  Terminal,
  FileText,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
  Folder,
};

const PRO_TYPES = new Set(["file", "image"]);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Placeholder user until auth is implemented
const currentUser = { name: "Demo User", email: "demo@devstash.io" };

type SidebarProps = {
  itemTypes: ItemTypeWithCount[];
  sidebarCollections: CollectionWithStats[];
};

export function SidebarContent({ itemTypes, sidebarCollections }: SidebarProps) {
  const { collapsed } = useSidebar();
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const favoriteCollections = sidebarCollections.filter((c) => c.isFavorite);
  const allCollections = sidebarCollections.filter((c) => !c.isFavorite);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 border-b border-border px-4",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          D
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight">
            DevStash
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className={cn("py-4", collapsed ? "px-2" : "px-3")}>
          {/* Types */}
          <div className="mb-6">
            {!collapsed && (
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Types
              </h3>
            )}
            <nav className="flex flex-col gap-0.5">
              {itemTypes.map((type) => {
                const Icon = iconMap[type.icon ?? ""] ?? Code;
                const slug = type.name.toLowerCase();

                return collapsed ? (
                  <Tooltip key={type.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/items/${slug}`}
                        className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Icon className="size-4" style={{ color: type.color ?? undefined }} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-2">
                      {type.name}
                      {PRO_TYPES.has(slug) && (
                        <Badge variant="outline" className="h-4 border-amber-500/40 bg-amber-500/10 px-1.5 py-0 text-[10px] text-amber-500">
                          PRO
                        </Badge>
                      )}
                      <span className="text-muted-foreground">{type.count}</span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={type.id}
                    href={`/items/${slug}`}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="size-4 shrink-0" style={{ color: type.color ?? undefined }} />
                    <span className="flex-1 truncate capitalize">{type.name}</span>
                    {PRO_TYPES.has(slug) && (
                      <Badge variant="outline" className="h-4 border-amber-500/40 bg-amber-500/10 px-1.5 py-0 text-[10px] text-amber-500">
                        PRO
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{type.count}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Collections */}
          <div>
            {!collapsed && (
              <div className="mb-2 px-2">
                <button
                  onClick={() => setCollectionsOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  Collections
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform duration-200",
                      !collectionsOpen && "-rotate-90"
                    )}
                  />
                </button>
              </div>
            )}

            {/* Expanded sidebar: collapsible collection lists */}
            {!collapsed && collectionsOpen && (
              <>
                {/* Favorite collections */}
                {favoriteCollections.length > 0 && (
                  <div className="mb-3">
                    <h4 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      Favorites
                    </h4>
                    <nav className="flex flex-col gap-0.5">
                      {favoriteCollections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                          <span className="flex-1 truncate">{col.name}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}

                {/* All collections */}
                {allCollections.length > 0 && (
                  <div>
                    <h4 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      All Collections
                    </h4>
                    <nav className="flex flex-col gap-0.5">
                      {allCollections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div
                            className="size-3.5 shrink-0 rounded-full"
                            style={{ backgroundColor: col.dominantColor }}
                          />
                          <span className="flex-1 truncate">{col.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {col.itemCount}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}

                {/* View all collections link */}
                <Link
                  href="/collections"
                  className="mt-3 flex items-center px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all collections
                </Link>
              </>
            )}

            {/* Collapsed sidebar: icon-only collection links */}
            {collapsed && (
              <nav className="flex flex-col gap-0.5">
                {sidebarCollections.slice(0, 5).map((col) => (
                  <Tooltip key={col.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/collections/${col.id}`}
                        className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {col.isFavorite ? (
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <div
                            className="size-4 rounded-full"
                            style={{ backgroundColor: col.dominantColor }}
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {col.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </nav>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* User area */}
      <div
        className={cn(
          "shrink-0 border-t border-border p-3",
          collapsed && "flex justify-center p-2"
        )}
      >
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback className="text-xs">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-xs">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="size-7 shrink-0">
              <Settings className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ itemTypes, sidebarCollections }: SidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex shrink-0 flex-col border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <SidebarContent itemTypes={itemTypes} sidebarCollections={sidebarCollections} />
    </aside>
  );
}
