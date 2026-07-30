import { Zap } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";
import { useNavigate } from "react-router-dom";

function Appbar() {
  const { credits} = useCredits();
  const navigate  = useNavigate()

  return (
    <div className="flex justify-end p-1 w-full mr-9">
      <div className="flex rounded-sm gap-1 border-2 shadow-md justify-center items-center mr-3 bg-neutral-50 px-2">
        <Zap size={16} className="text-yellow-300" />
        <span className="flex justify-end text-md">{credits} Credits </span>
      </div>
      <div>
        <button
          onClick={() => navigate("/dashboard/billing")}
          className="bg-black shadow-md cursor-pointer text-white rounded-lg px-2 py-1.5  text-sm font-medium disabled:opacity-50"
        >
          Buy Credits
        </button>
      </div>
    </div>
  );
}

export default Appbar;
