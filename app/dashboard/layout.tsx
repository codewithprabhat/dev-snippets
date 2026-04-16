import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/dashboard/SidebarContext";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { getItemTypes } from "@/lib/db/items";
import { getCollections } from "@/lib/db/collections";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itemTypes, sidebarCollections] = await Promise.all([
    getItemTypes(),
    getCollections(),
  ]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen flex-col bg-background text-foreground">
          <TopBar />
          <MobileSidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
