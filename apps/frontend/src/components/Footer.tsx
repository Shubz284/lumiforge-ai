import Twitter from "../assets/twitter.png";
import Github from "../assets/github.png";
import Lumiforge from "../assets/lumiforge.png";
import icon from "../assets/akaza.jpg";

export default function Footer() {
  return (
    <footer className="overflow-hidden max-w-3xl mx-auto px-6">
      <div className="flex flex-col gap-6 mt-5 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-2 text-lg font-semibold">
          <img src={Lumiforge} className="h-5 w-5" alt="" />
          LumiForge AI
        </span>

        <nav className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground md:gap-8">
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#examples" className="hover:text-primary transition-colors">
            Examples
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="https://x.com/shubhx76" target="_blank">
            <img src={Twitter} className="h-3 w-3" alt="Twitter" />
          </a>
          <a href="https://github.com/Shubz284" target="_blank">
            <img src={Github} className="h-4 w-4" alt="GitHub" />
          </a>
        </div>
      </div>

      <div className="mt-6 mb-3 border-t pt-6 flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} LumiForge AI. All rights reserved.</p>

        <div className="flex items-center gap-1">
          Built with ❤️ by
          <a href="https://github.com/Shubz284" target="_blank">
            <img src={icon} className="h-4 w-4 rounded-full" alt="akaza" />
          </a>
        </div>
      </div>
    </footer>
  );
}
