import Appbar from "@/components/App-bar";
import { AppSidebar } from "@/components/App-Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-svh flex-1 flex-col">
        <div className="sticky flex shrink-0 gap-2 justify-center mt-2">
          <SidebarTrigger className={"cursor-pointer"} />
          <Appbar />
        </div>
        <div className="flex-1 min-h-0  ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
