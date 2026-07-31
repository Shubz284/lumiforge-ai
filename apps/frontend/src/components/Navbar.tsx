// src/components/landing/Navbar.tsx
import { Link } from "react-router-dom";
import lumiforgeIcon from "../assets/lumiforge.png"



 const Navbar = () => {
   return (
     <div className="sticky top-4  z-50 max-w-5xl mx-auto px-6">
       <nav className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-xl px-6 py-3 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-2">
           <span className="flex items-center gap-2 font-semibold text-xl">
             <img
               src={lumiforgeIcon}
               alt="Lumiforge_Icon"
               className="w-6 h-6"
             />
             LumiForge AI
           </span>
         </div>

         <div className="hidden md:flex items-center gap-7 text-sm text-gray-600">
           <a href="#features">Features</a>
           <a href="#pricing">Pricing</a>
           <a href="#faq">Faq</a>
         </div>

         <div className="flex items-center gap-2">
           <Link
             to="/login"
             className=" bg-black text-white text-sm px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap"
           >
             Log in
           </Link>

           <Link
             to="/signup"
             className="bg-black text-white text-sm px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap"
           >
             Sign up
           </Link>
         </div>
       </nav>
     </div>
   );
 };

 export default Navbar;