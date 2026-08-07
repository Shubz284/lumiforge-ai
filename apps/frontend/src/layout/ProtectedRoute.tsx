import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

export default function ProtectedRoute() {
  const { data: session, isPending } = useSession();

  console.log("ProtectedRoute render:", { isPending, session });

  if (isPending) return null;

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
