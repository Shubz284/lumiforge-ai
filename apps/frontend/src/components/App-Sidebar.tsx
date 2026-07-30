import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

import lumiforgeIcon from "../assets/lumiforge.png";
import {
  BadgeDollarSign,
  Image,
  LayoutGrid,
  ReceiptText,
  Settings,
} from "lucide-react";
import Profile from "./Profile";

const linkClass =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors cursor-pointer";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 ml-3 items-center">
          <span className="font-medium text-xl">Lumiforge AI</span>
          <img
            src={lumiforgeIcon}
            className="w-5 h-5 rounded-md bg-blue-50"
            alt="app-icon"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4 ml-2 flex flex-col gap-1 items-stretch">
        <SidebarGroup>
          <Link to="generate-image" className={linkClass}>
            <Image size={19} />
            <span>Generate Image</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link to="images" className={linkClass}>
            <LayoutGrid size={19} />
            <span>My Images</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link to="transactions" className={linkClass}>
            <ReceiptText size={19} />
            <span>Transactions</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link to="credits" className={linkClass}>
            <BadgeDollarSign size={19} />
            <span>Credits</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link to="setting" className={linkClass}>
            <Settings size={19} />
            <span>Setting</span>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>
          <Profile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}