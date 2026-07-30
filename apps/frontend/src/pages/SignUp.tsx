import AuthForm from "@/components/AuthForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import icon from "../assets/lumiforge.png";

const SignUp = () => {
  const navigate = useNavigate();
  
    const [searchParams] = useSearchParams();
  
    const handleSuccess = () => {
      const next = searchParams.get("next");
      const pack = searchParams.get("pack");
  
      if (next) {
        const target = pack ? `${next}?pack=${pack}` : next;
        navigate(target, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  return (
    <div className="min-h-screen w-full relative bg-white flex flex-col justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top center,
              rgba(70, 130, 180, 0.5),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* <span className="absolute top-10 left-4 gap-1 flex text-xl">
        Lumiforge AI
        <img src={icon} className="w-6 h-6" alt="Lumiforge_Logo" />
      </span> */}
      <div className="relative z-10">
        <div className="flex justify-center gap-2 text-2xl mb-5 items-center">
          Welcome to Lumiforge AI
          <img src={icon} className="w-6 h-6" alt="Lumiforge_Logo" />
        </div>
        <div>
          <AuthForm
            mode="signup" onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
