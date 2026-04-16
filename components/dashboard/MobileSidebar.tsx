"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/components/dashboard/SidebarContext";
import { SidebarContent } from "@/components/dashboard/Sidebar";
import type { CollectionWithStats } from "@/lib/db/collections";
import type { ItemTypeWithCount } from "@/lib/db/items";

type MobileSidebarProps = {
  itemTypes: ItemTypeWithCount[];
  sidebarCollections: CollectionWithStats[];
};

export function MobileSidebar({ itemTypes, sidebarCollections }: MobileSidebarProps) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarContent itemTypes={itemTypes} sidebarCollections={sidebarCollections} />
      </SheetContent>
    </Sheet>
  );
}
