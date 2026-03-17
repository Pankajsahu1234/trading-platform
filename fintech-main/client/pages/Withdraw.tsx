import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { TrendingUp, AlertCircle, CheckCircle, MapPin, Clock, Lock } from "lucide-react";
import withdrawService, { WithdrawalData } from "@/services/withdraw.service";
import { useNavigate } from "react-router-dom";

const MIN_AMOUNT = {
  PROFIT: 25,
  PRINCIPAL: 100,
};

// ── Date window helpers ───────────────────────────────────────────────────────
function getWithdrawalWindowStatus(type: "PROFIT" | "PRINCIPAL") {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (type === "PROFIT") {
    // Allowed: 1st to 5th of every month
    const isOpen = day >= 1 && day <= 5;
    const daysUntilOpen = isOpen ? 0 : (() => {
      // Next 1st of next month
      const nextOpen = new Date(year, month + 1, 1);
      const diff = Math.ceil((nextOpen.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    })();
    const daysRemaining = isOpen ? 5 - day + 1 : 0;
    return { isOpen, daysUntilOpen, daysRemaining };
  } else {
    // PRINCIPAL — Allowed: only 28th of every month
    const isOpen = day === 28;
    const daysUntilOpen = isOpen ? 0 : (() => {
      let nextOpen: Date;
      if (day < 28) {
        nextOpen = new Date(year, month, 28);
      } else {
        nextOpen = new Date(year, month + 1, 28);
      }
      const diff = Math.ceil((nextOpen.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    })();
    return { isOpen, daysUntilOpen, daysRemaining: isOpen ? 1 : 0 };
  }
}

export default function Withdraw() {
  const navigate = useNavigate();

  const [withdrawType, setWithdrawType] = useState<"PROFIT" | "PRINCIPAL">("PROFIT");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<WithdrawalData | null>(null);

  const parsedAmount = parseFloat(amount);
  const minAmount = MIN_AMOUNT[withdrawType];
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= minAmount;

  const windowStatus = getWithdrawalWindowStatus(withdrawType);
  const isWindowOpen = windowStatus.isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessData(null);

    // Date window check — double check on submit too
    if (!isWindowOpen) {
      setError(
        withdrawType === "PROFIT"
          ? "Profit withdrawals are only allowed between the 1st and 5th of each month."
          : "Principal withdrawals are only allowed on the 28th of each month."
      );
      return;
    }

    if (!isValidAmount) {
      setError(`Minimum withdrawal amount for ${withdrawType === "PROFIT" ? "Profit" : "Principal"} is $${minAmount}`);
      return;
    }

    if (!walletAddress.trim()) {
      setError("Please enter your wallet/payment address.");
      return;
    }

    setLoading(true);

    try {
      const result = await withdrawService.initiateWithdrawal({
        type: withdrawType,
        amount: parsedAmount,
        walletAddress: walletAddress.trim(),
      });

      if (result.success) {
        setSuccessData(result.data);
        setAmount("");
        setWalletAddress("");
        setTimeout(() => navigate("/wallet"), 3000);
      }
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || err.message || "Failed to process withdrawal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-muted-foreground">
            Request withdrawal of your profits or principal investment
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <GlassCard heavy className="p-4 border-loss/50 flex items-start gap-4">
            <AlertCircle className="text-loss flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* Success Banner */}
        {successData && (
          <GlassCard heavy className="p-4 border-profit/50 flex items-start gap-4">
            <CheckCircle className="text-profit flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">Withdrawal Request Submitted!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hi <span className="font-semibold">{successData.name}</span>, your{" "}
                <span className="font-semibold">{successData.withdrawalType}</span> withdrawal of{" "}
                <span className="text-profit font-semibold">${successData.finalAmount}</span>{" "}
                has been queued to{" "}
                <span className="font-mono text-xs">{successData.walletAddress}</span>.
                Redirecting to wallet...
              </p>
            </div>
          </GlassCard>
        )}

        <GlassCard heavy className="p-8 space-y-6">

          {/* Withdrawal Type Toggle */}
          <div>
            <label className="block text-sm font-semibold mb-4">Withdrawal Type</label>
            <div className="grid grid-cols-2 gap-4">
              {(["PROFIT", "PRINCIPAL"] as const).map((type) => {
                const status = getWithdrawalWindowStatus(type);
                const isSelected = withdrawType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setWithdrawType(type); setAmount(""); setError(""); }}
                    className={`p-4 rounded-lg border transition-all text-left relative ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-card/50 hover:border-white/20"
                    }`}
                  >
                    {/* Open / Closed badge */}
                    <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      status.isOpen
                        ? "bg-profit/20 text-profit"
                        : "bg-loss/20 text-loss"
                    }`}>
                      {status.isOpen ? "Open" : "Closed"}
                    </span>

                    <p className="font-semibold mb-1 pr-14">
                      {type === "PROFIT" ? "Profit Withdrawal" : "Principal Withdrawal"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {type === "PROFIT"
                        ? "Available: 1st – 5th of each month"
                        : "Available: 28th of each month only"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Window Status Banner ── */}
          {!isWindowOpen ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-loss/10 border border-loss/30">
              <Lock size={18} className="text-loss flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-loss">Withdrawal Window Closed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {withdrawType === "PROFIT"
                    ? `Profit withdrawals are only allowed between the 1st and 5th of each month.`
                    : `Principal withdrawals are only allowed on the 28th of each month.`}
                  {" "}
                  <span className="font-semibold text-foreground">
                    Window opens in {windowStatus.daysUntilOpen} day{windowStatus.daysUntilOpen !== 1 ? "s" : ""}.
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-profit/10 border border-profit/30">
              <Clock size={18} className="text-profit flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-profit">Withdrawal Window is Open</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {withdrawType === "PROFIT"
                    ? `You can withdraw profits until the 5th of this month. ${windowStatus.daysRemaining} day${windowStatus.daysRemaining !== 1 ? "s" : ""} remaining.`
                    : `Today is the 28th — principal withdrawal window is open for today only.`}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Withdrawal Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-muted-foreground font-semibold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={minAmount}
                  step="0.01"
                  disabled={loading || !isWindowOpen}
                  className="w-full bg-input border border-white/10 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Wallet Address Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Wallet / Payment Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-muted-foreground" size={16} />
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet or payment address"
                  disabled={loading || !isWindowOpen}
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Double-check your address — transactions cannot be reversed once processed.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValidAmount || !walletAddress.trim() || loading || !isWindowOpen}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {!isWindowOpen ? (
                <><Lock size={18} /> Window Closed</>
              ) : (
                <><TrendingUp size={20} /> {loading ? "Processing..." : "Request Withdrawal"}</>
              )}
            </button>
          </form>

          {/* Withdrawal Breakdown */}
          {isValidAmount && isWindowOpen && (
            <div className="pt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4">Withdrawal Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Amount</span>
                  <span className="font-semibold">${parsedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="font-semibold">You Will Receive</span>
                  <span className="font-semibold text-profit">${parsedAmount.toFixed(2)}</span>
                </div>
                {walletAddress.trim() && (
                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">To Address</span>
                    <span className="font-mono text-xs text-right max-w-[200px] truncate">
                      {walletAddress.trim()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        </GlassCard>
      </div>
    </main>
  );
}