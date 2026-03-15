import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { TrendingUp, AlertCircle, CheckCircle, MapPin } from "lucide-react";
import withdrawService, { WithdrawalData } from "@/services/withdraw.service";
import { useNavigate } from "react-router-dom";

// Minimum amounts per type
const MIN_AMOUNT = {
  PROFIT: 25,
  PRINCIPAL: 100,
};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessData(null);

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

        setTimeout(() => {
          navigate("/wallet");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Withdrawal error:", err);
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
            <label className="block text-sm font-semibold mb-4">
              Withdrawal Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setWithdrawType("PROFIT"); setAmount(""); setError(""); }}
                className={`p-4 rounded-lg border transition-all ${
                  withdrawType === "PROFIT"
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-card/50 hover:border-white/20"
                }`}
              >
                <p className="font-semibold mb-1">Profit Withdrawal</p>
                <p className="text-xs text-muted-foreground">Minimum $25</p>
              </button>

              <button
                type="button"
                onClick={() => { setWithdrawType("PRINCIPAL"); setAmount(""); setError(""); }}
                className={`p-4 rounded-lg border transition-all ${
                  withdrawType === "PRINCIPAL"
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-card/50 hover:border-white/20"
                }`}
              >
                <p className="font-semibold mb-1">Principal Withdrawal</p>
                <p className="text-xs text-muted-foreground">Minimum $100</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Withdrawal Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-muted-foreground font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={minAmount}
                  step="0.01"
                  disabled={loading}
                  className="w-full bg-input border border-white/10 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Minimum withdrawal: ${minAmount}
              </p>
            </div>

            {/* Wallet Address Input */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Wallet / Payment Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-3.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet or payment address"
                  disabled={loading}
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
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
              disabled={!isValidAmount || !walletAddress.trim() || loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <TrendingUp size={20} />
              {loading ? "Processing..." : "Request Withdrawal"}
            </button>
          </form>

          {/* Withdrawal Breakdown — no fees shown */}
          {isValidAmount && (
            <div className="pt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4">Withdrawal Breakdown</h3>
              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Amount</span>
                  <span className="font-semibold">${parsedAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="font-semibold">You Will Receive</span>
                  <span className="font-semibold text-profit">
                    ${parsedAmount.toFixed(2)}
                  </span>
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