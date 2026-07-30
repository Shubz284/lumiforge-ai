import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

interface CreditsContextValue {
  credits: number;
  loading: boolean;
  refetchCredits: () => Promise<void>;
  setCredits: (n: number) => void;
}

const CreditsContext = createContext<CreditsContextValue | undefined>(
  undefined,
);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  const refetchCredits = async () => {
    try {
      const data = await apiFetch("/credits");
      setCredits(data.balance);
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return; // session still resolving, don't fire yet

    if (session?.user) {
      refetchCredits();
    } else {
      setCredits(0);
      setLoading(false);
    }
  }, [isPending, session?.user?.id]); // refetch whenever auth state actually changes

  return (
    <CreditsContext.Provider
      value={{ credits, loading, refetchCredits, setCredits }}
    >
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return ctx;
}
