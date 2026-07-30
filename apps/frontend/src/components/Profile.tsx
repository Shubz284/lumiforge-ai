import { useSession, signOut } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronUp, LogOut, Settings } from "lucide-react";

const ProfileMenu = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  if (!session?.user) return null;

  const { user } = session;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Popover>
      <PopoverTrigger
        render=
        {
          <button className="w-full flex items-center cursor-pointer gap-2.5 bg-neutral-50 border rounded-lg px-3 py-2.5 hover:bg-neutral-100">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">Free trial</p>
            </div>
            <ChevronUp size={14} className="text-gray-400" />
          </button>
        }
      />
      <PopoverContent side="top" align="start" className="w-64 p-3">
        <div className="flex items-center gap-2.5 p-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="border-t my-1" />

        <div className="flex justify-between items-center px-2 py-1.5 text-xs">
          <span className="text-gray-500">Email status</span>
          {user.emailVerified ? (
            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
              Verified
            </span>
          ) : (
            <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
              Not verified
            </span>
          )}
        </div>
        <div className="flex justify-between items-center px-2 py-1.5 text-xs">
          <span className="text-gray-500">Member since</span>
          <span>
            {new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="border-t my-1" />

        <button
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
          onClick={() => navigate("/dashboard/setting")}
        >
          <Settings size={15} /> Account settings
        </button>
        <button
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut size={15} /> Sign out
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileMenu;
