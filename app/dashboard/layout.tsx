import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/dashboard/SidebarContext";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen flex-col bg-background text-foreground">
          <TopBar />
          <MobileSidebar />
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
