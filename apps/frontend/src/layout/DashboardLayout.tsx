import Appbar from "@/components/App-bar";
import { AppSidebar } from "@/components/App-Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
      <SidebarProvider>
        <AppSidebar />

        <main className="flex h-screen flex-1 flex-col overflow-hidden">
          {/* Top Navigation */}
          <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 mt-2">
            <SidebarTrigger className="cursor-pointer" />
            <Appbar />
          </div>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
  );
}
