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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 ml-3 items-center">
          <span className="font-medium text-xl">Lumiforge AI</span>
          <img
            src={lumiforgeIcon}
            className="w-5 bg-blue-50 rounded-md border-red-200 red-200 h-5"
            alt="app-icon"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-3 ml-2 flex  items-center">
        <SidebarGroup>
          <Link
            to="generate-image"
            className="flex cursor-pointer text-neutral-800 rounded-lg hover:bg-neutral-200 p-2 gap-2 items-center"
          >
            <Image size={16} />
            <span>Generate Image</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link
            to={"images"}
            className="flex text-md font-serif  cursor-pointer rounded-lg  hover:bg-neutral-200 p-2  gap-2 items-center"
          >
            <LayoutGrid size={16} />
            <span>My Images</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link 
           to={"transactions"}
           className="flex text-md cursor-pointer rounded-lg  hover:bg-neutral-200 p-2  gap-2 items-center">
            <ReceiptText size={16} />
            <span>Transactions</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link
          to={"credits"}
           className="flex text-md cursor-pointer rounded-lg  hover:bg-neutral-200 p-2  gap-2 items-center">
            <BadgeDollarSign size={16} />
            <span>Credits</span>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link 
           to={"setting"}
          className="flex text-md cursor-pointer rounded-lg  hover:bg-neutral-200 p-2  gap-2 items-center">
            <Settings size={16} />
            <span>Setting</span>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="bg-slate-300 cursor-pointer p-2 rounded-lg">
          <span>Profile</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
