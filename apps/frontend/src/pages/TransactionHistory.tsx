// src/pages/TransactionHistory.tsx
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import TransactionHistorySkeleton from "@/components/skeleton/TransactionHistorySkeleton";

interface Payment {
  id: string;
  status: "CREATED" | "PAID" | "FAILED";
  packId: string;
  amount: number; // paise
  credits: number;
  createdAt: string;
}

const STATUS_STYLES: Record<
  string,
  { dot: string; text: string; label: string }
> = {
  PAID: {
    dot: "bg-green-500",
    text: "text-green-700 bg-green-50",
    label: "Paid",
  },
  FAILED: {
    dot: "bg-red-500",
    text: "text-red-700 bg-red-50",
    label: "Failed",
  },
  CREATED: {
    dot: "bg-gray-400",
    text: "text-gray-600 bg-gray-100",
    label: "Pending",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function packLabel(packId: string) {
  return packId.charAt(0).toUpperCase() + packId.slice(1);
}

const TransactionHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/payments/transactions")
      .then((data) => setPayments(data))
      .catch((err) => {
        console.error("Failed to load payments:", err);
        setError("Could not load your transaction history.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <TransactionHistorySkeleton />;
  }

return (
  <div className="p-2 mt-2 ml-4 mr-4 h-full w-auto sm:ml-9 sm:mr-9">
    <div className="mb-6">
      <h1 className="text-xl font-medium">Transaction History</h1>
      <p className="text-sm text-gray-500 mt-1">
        All your credit pack purchases
      </p>
    </div>

    <div className="bg-white border rounded-xl overflow-x-auto">
      <table className="w-full min-w-140 text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Pack</th>
            <th className="px-4 py-2.5 font-medium">Amount</th>
            <th className="px-4 py-2.5 font-medium">Credits</th>
            <th className="px-4 py-2.5 font-medium text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                No purchases yet
              </td>
            </tr>
          ) : (
            payments.map((p) => {
              const style = STATUS_STYLES[p.status] ?? STATUS_STYLES.CREATED;
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${style.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                      />
                      {style.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">{packLabel(p.packId)}</td>
                  <td className="px-4  py-2.5">{formatAmount(p.amount)}</td>
                  <td className="px-4  py-2.5">
                    {p.status === "PAID"
                      ? p.credits.toLocaleString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-400 whitespace-nowrap">
                    {formatDate(p.createdAt)}
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
}

export default TransactionHistory;
