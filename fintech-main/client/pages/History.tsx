import { useEffect, useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { formatCurrency, formatDate } from "@/utils/formatting";
import {
  Filter,
  Loader2,
  ChevronDown,
  X,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { apiClient } from "@/services/api";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  fee: number;
  penalty: number;
  netAmount: number;
  status: string;
  referenceId: string | null;
  sourceWallet: string | null;
  destinationWallet: string | null;
  description: string | null;
  timestamp: string;
}

const FILTER_TYPES = [
  "deposit",
  "withdrawal",
  "profit",
  // "investment",
  "transfer",
];

// ── Detail Popup ──────────────────────────────────────────────────────────────
function TransactionDetailModal({
  txn,
  onClose,
}: {
  txn: Transaction;
  onClose: () => void;
}) {
  const isPositive =
    txn.type?.toLowerCase().includes("deposit") ||
    txn.type?.toLowerCase().includes("interest") ||
    txn.type?.toLowerCase().includes("profit");

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-md bg-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isPositive ? "bg-profit/15 text-profit" : "bg-loss/15 text-loss"
              }`}
            >
              {isPositive ? (
                <ArrowDownLeft size={18} />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </div>
            <div>
              <p className="font-semibold capitalize text-sm">
                {txn.type?.replace(/_/g, " ") || "Transaction"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(txn.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount */}
        <div className="px-5 py-5 border-b border-white/10 text-center">
          <p className="text-xs text-muted-foreground mb-1">Amount</p>
          <p
            className={`text-3xl font-bold ${
              isPositive ? "text-profit" : "text-loss"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatCurrency(txn.amount)}
          </p>
        </div>

        {/* Details rows */}
        {/* Details rows */}
        <div className="px-5 py-4 space-y-3">
          {[
            { label: "Status", value: txn.status || "Unknown", isStatus: true },
            { label: "Date", value: formatDate(txn.timestamp) }, // 👈 add this
            {
              label: "Time",
              value: new Date(txn.timestamp).toLocaleTimeString(),
            },
            { label: "Net Amount", value: formatCurrency(txn.netAmount) },
            { label: "Fee", value: formatCurrency(txn.fee) },
            { label: "Penalty", value: formatCurrency(txn.penalty) },
            { label: "Reference ID", value: txn.referenceId || "—" },
          ].map(({ label, value, isStatus }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              {isStatus ? (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                    value?.toLowerCase() === "completed" ||
                    value?.toLowerCase() === "success"
                      ? "bg-profit/20 text-profit"
                      : value?.toLowerCase() === "pending"
                      ? "bg-warning/20 text-warning"
                      : "bg-loss/20 text-loss"
                  }`}
                >
                  {value?.toLowerCase() === "success" ? "COMPLETED" : value}
                </span>
              ) : (
                <p className="text-sm font-medium text-right max-w-[55%] truncate">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Close button */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-card border border-white/10 text-sm font-medium hover:bg-card/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get<{ data: Transaction[] }>(
          "/users/transaction/history?limit=100",
        );
        setTransactions(res.data.data);
        setFilteredTransactions(res.data.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
        setError(error.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((txn) => {
          const type = txn.type?.toLowerCase() || "";
          if (filter === "deposit") return type.includes("deposit");
          if (filter === "withdrawal") return type.includes("withdrawal");
          if (filter === "profit")
            return type.includes("interest") || type.includes("profit");
          // if (filter === "investment") return type.includes("investment");
          if (filter === "transfer") return type.includes("transfer");
          return false;
        }),
      );
    }
  }, [filter, transactions]);

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View all your deposits, withdrawals, and profits
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex gap-2">
          {/* "All" always visible */}
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 border border-white/10 hover:border-white/20 text-muted-foreground"
            }`}
          >
            All
          </button>

          {/* Desktop: show all filter buttons */}
          <div className="hidden sm:flex gap-2 overflow-x-auto">
            {FILTER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  filter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 border border-white/10 hover:border-white/20 text-muted-foreground"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Mobile: "Type" dropdown */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setTypeMenuOpen((v) => !v)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all border ${
                filter !== "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/50 border-white/10 hover:border-white/20 text-muted-foreground"
              }`}
            >
              {filter !== "all"
                ? filter.charAt(0).toUpperCase() + filter.slice(1)
                : "Type"}
              <ChevronDown size={14} />
            </button>

            {typeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-background border border-white/10 rounded-xl shadow-xl z-30 overflow-hidden">
                {FILTER_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilter(type);
                      setTypeMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      filter === type
                        ? "bg-primary/20 text-primary font-medium"
                        : "hover:bg-card text-foreground"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <GlassCard heavy className="p-8 flex items-center justify-center">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading transactions...</span>
          </GlassCard>
        )}

        {error && (
          <GlassCard
            heavy
            className="p-4 border-loss/50 flex items-start gap-4"
          >
            <div className="text-loss">⚠️</div>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* ── Table ── */}
        {!loading && !error && (
          <GlassCard heavy className="p-6 overflow-x-auto">
            {/* ── Desktop Table (sm and above) ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-1/4" />
                  <col className="w-1/4" />
                  <col className="w-1/4" />
                  <col className="w-1/4" />
                </colgroup>
                <thead className="border-b border-white/10">
                  <tr className="text-muted-foreground text-xs uppercase font-semibold">
                    <th className="text-center py-3 px-4">Date & Time</th>
                    <th className="text-center py-3 px-4">Type</th>
                    <th className="text-center py-3 px-4">Amount</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-card/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTxn(txn)}
                    >
                      <td className="py-4 px-4 text-center">
                        <p className="font-medium">
                          {formatDate(txn.timestamp)}
                        </p>
                      </td>
                      <td className="py-4 px-4 capitalize text-center">
                        {txn.type?.replace(/_/g, " ") || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                            txn.status?.toLowerCase() === "completed" ||
                            txn.status?.toLowerCase() === "success" ||
                            txn.status?.toLowerCase() === "confirmed"
                              ? "bg-profit/20 text-profit"
                              : txn.status?.toLowerCase() === "pending"
                              ? "bg-warning/20 text-warning"
                              : "bg-loss/20 text-loss"
                          }`}
                        >
                          {txn.status?.toLowerCase() === "success" ? "COMPLETED" : (txn.status || "Unknown")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Card List (below sm) ── */}
            <div className="sm:hidden divide-y divide-white/10">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-4 px-2 cursor-pointer hover:bg-card/50 active:bg-card/70 transition-colors"
                  onClick={() => setSelectedTxn(txn)}
                >
                  {/* Left: type + date */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium capitalize">
                      {txn.type?.replace(/_/g, " ") || "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(txn.timestamp)}
                    </span>
                  </div>

                  {/* Right: amount + status */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold">
                      {formatCurrency(txn.amount)}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded lowercase first-letter:capitalize ${
                        txn.status?.toLowerCase() === "completed" ||
                        txn.status?.toLowerCase() === "success"  ||
                        txn.status?.toLowerCase() === "confirmed"

                          ? "bg-profit/20 text-profit"
                          : txn.status?.toLowerCase() === "pending"
                          ? "bg-warning/20 text-warning"
                          : "bg-loss/20 text-loss"
                      }`}
                    >
                      {txn.status?.toLowerCase() === "success" ? "COMPLETED" : (txn.status || "Unknown")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredTransactions.length === 0 && !loading && (
              <div className="text-center py-12">
                <Filter
                  className="mx-auto text-muted-foreground opacity-50 mb-3"
                  size={32}
                />
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "No transactions found"
                    : `No ${filter} transactions found`}
                </p>
              </div>
            )}

            {filteredTransactions.length === 0 && !loading && (
              <div className="text-center py-12">
                <Filter
                  className="mx-auto text-muted-foreground opacity-50 mb-3"
                  size={32}
                />
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "No transactions found"
                    : `No ${filter} transactions found`}
                </p>
              </div>
            )}
          </GlassCard>
        )}

        {/* ── Summary Stats ── */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Deposits</p>
              <p className="text-2xl font-bold mt-2 text-profit">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type?.toLowerCase().includes("deposit"))
                    .reduce((sum, t) => sum + t.netAmount, 0),
                )}
              </p>
            </GlassCard>
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Withdrawn</p>
              <p className="text-2xl font-bold mt-2 text-loss">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type?.toLowerCase().includes("withdrawal"))
                    .reduce((sum, t) => sum + t.netAmount, 0),
                )}
              </p>
            </GlassCard>
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Profit</p>
              <p className="text-2xl font-bold mt-2 text-profit">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type?.toLowerCase().includes("interest"))
                    .reduce((sum, t) => sum + t.netAmount, 0),
                )}
              </p>
            </GlassCard>
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">
                Total Transactions
              </p>
              <p className="text-2xl font-bold mt-2">{transactions.length}</p>
            </GlassCard>
          </div>
        )}
      </div>

      {/* ── Detail Popup ── */}
      {selectedTxn && (
        <TransactionDetailModal
          txn={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </main>
  );
}
