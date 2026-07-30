import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { useCredits } from "@/context/CreditsContext";
import CreditsPageSkeleton from "@/components/skeleton/CreditsPageSkeleton";
import { toast } from "sonner";

interface CreditTransaction {
  id: string;
  type: "SPEND" | "REFUND" | "BONUS" | "PURCHASE" | "ADJUSTMENT";
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  SPEND: { bg: "bg-red-50", text: "text-red-700", label: "Spend" },
  REFUND: { bg: "bg-purple-50", text: "text-purple-700", label: "Refund" },
  BONUS: { bg: "bg-green-50", text: "text-green-700", label: "Bonus" },
  PURCHASE: { bg: "bg-teal-50", text: "text-teal-700", label: "Purchase" },
  ADJUSTMENT: { bg: "bg-gray-100", text: "text-gray-700", label: "Adjustment" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CreditsPage = () => {
  const navigate = useNavigate();
  const { credits} = useCredits();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [filter, setFilter] = useState<"ALL" | "SPEND" | "REFUND" | "BONUS">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    apiFetch("/credits")
      .then((data) => {
        // setBalance(data.balance);
        setTransactions(data.transactions);
      })
      .catch((err) => {
        console.error("Failed to load credits:", err);
        toast.error("Could not load your credits.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions =
    filter === "ALL" ? transactions : transactions.filter((t) => t.type === filter);

  const totalSpent = transactions
    .filter((t) => t.type === "SPEND")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const imagesGenerated = transactions.filter((t) => t.type === "SPEND").length;

  if (loading) {
    return <CreditsPageSkeleton/>;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 mt-2 ml-4 mr-4 h-full w-auto sm:ml-9 sm:mr-9">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Credits</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your balance and view usage history
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6 sm:flex-row">
        <div className="flex-1 bg-white border rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Balance</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-3xl font-semibold">{credits}</span>
              <span className="text-sm text-gray-400">credits</span>
            </div>
          </div>
          <button
            className="bg-black text-white rounded-lg px-5 py-2.5 font-medium w-full sm:w-auto"
            onClick={() => navigate("/dashboard/billing")}
          >
            Buy Credits
          </button>
        </div>

        <div className="flex gap-3 sm:contents">
          <div className="flex-1 sm:w-48 sm:flex-none bg-white border rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <span className="text-xl font-semibold">{totalSpent}</span>
            <span className="text-sm text-gray-400"> credits</span>
          </div>

          <div className="flex-1 sm:w-48 sm:flex-none bg-white border rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Images Generated</p>
            <span className="text-xl font-semibold">{imagesGenerated}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-medium">Credit Usage History</span>
        <select
          className="text-xs h-8 border rounded-lg px-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="ALL">All</option>
          <option value="SPEND">Spends</option>
          <option value="REFUND">Refunds</option>
          <option value="BONUS">Bonus</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full min-w-160 text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Description</th>
              <th className="px-4 py-2.5 font-medium text-right">Amount</th>
              <th className="px-4 py-2.5 font-medium text-right">Balance</th>
              <th className="px-4 py-2.5 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No transactions yet
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => {
                const style = TYPE_STYLES[t.type] ?? TYPE_STYLES.ADJUSTMENT;
                const isPositive = t.amount > 0;
                return (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="px-4 py-2.5">
                      <span
                        className={`${style.bg} ${style.text} px-2.5 py-1 rounded-full text-xs font-medium`}
                      >
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{t.description ?? "—"}</td>
                    <td
                      className={`px-4 py-2.5 text-right font-medium ${
                        isPositive ? "text-teal-700" : "text-red-700"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {t.amount}
                    </td>
                    <td className="px-4 py-2.5 text-right">{t.balanceAfter}</td>
                    <td className="px-4 py-2.5 text-right text-gray-400">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditsPage;