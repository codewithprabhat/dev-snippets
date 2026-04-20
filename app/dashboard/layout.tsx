import { redirect } from "next/navigation";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/dashboard/SidebarContext";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { getItemTypes } from "@/lib/db/items";
import { getCollections } from "@/lib/db/collections";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  const [itemTypes, sidebarCollections] = await Promise.all([
    getItemTypes(),
    getCollections(),
  ]);

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen flex-col bg-background text-foreground">
          <TopBar />
          <MobileSidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} user={user} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar itemTypes={itemTypes} sidebarCollections={sidebarCollections} user={user} />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
