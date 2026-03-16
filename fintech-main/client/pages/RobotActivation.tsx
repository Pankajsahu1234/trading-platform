import { useState, useEffect } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { Copy, Check, AlertCircle, CheckCircle, Bot, Clock, Calendar } from "lucide-react";
import { robotService, RobotStatus } from "@/services/robotService";
import { RobotActivationDetailsModal } from "@/components/common/RobotActivationDetailsModal";

export default function RobotActivation() {
  const [txHash, setTxHash] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<"txHash" | "address" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Real robot status from API
  const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch robot status on mount
  useEffect(() => {
    fetchRobotStatus();
  }, []);

  const fetchRobotStatus = async () => {
    try {
      setStatusLoading(true);
      const status = await robotService.getStatus();
      setRobotStatus(status);
    } catch (err: any) {
      console.error("Failed to fetch robot status:", err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCopy = (text: string, type: "txHash" | "address") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!txHash.trim()) {
      setError("Please enter a transaction hash");
      return;
    }

    if (!depositAddress.trim()) {
      setError("Please enter a deposit address");
      return;
    }

    try {
      setSubmitting(true);
      const response = await robotService.activate(txHash.trim(), depositAddress.trim());

      if (response.success) {
        setSuccess(
          response.message || "Activation request submitted. Waiting for blockchain confirmation."
        );
        setTxHash("");
        setDepositAddress("");
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to activate robot. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  // Days remaining helper
  const getDaysRemaining = (expiryDate: string | null) => {
    if (!expiryDate) return 0;
    return Math.max(
      Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      0
    );
  };

  const isActive = robotStatus?.robot_status === "ACTIVE" && !robotStatus?.isExpired;

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trading Robot</h1>
          <p className="text-muted-foreground">
            Manage your automated trading robot
          </p>
        </div>

        {/* ── ROBOT STATUS CARD (always visible) ── */}
        {statusLoading ? (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-muted-foreground text-sm">Loading robot status...</span>
            </div>
          </GlassCard>
        ) : robotStatus && (
          <GlassCard
            heavy
            className={`p-6 border ${
              isActive ? "border-profit/30 bg-profit/5" : "border-loss/20 bg-loss/5"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? "bg-profit/20" : "bg-loss/10"
                }`}>
                  <Bot size={20} className={isActive ? "text-profit" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="font-semibold">Robot Status</p>
                  <p className="text-xs text-muted-foreground">
                    {isActive ? "Running 24/7" : "Not active"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  isActive
                    ? "bg-profit/20 text-profit border-profit/30"
                    : robotStatus.isExpired
                    ? "bg-loss/20 text-loss border-loss/30"
                    : "bg-muted/20 text-muted-foreground border-border"
                }`}>
                  {robotStatus.isExpired ? "EXPIRED" : robotStatus.robot_status}
                </span>
              </div>
            </div>

            {/* Show expiry info only if ever activated */}
            {robotStatus.activation_timestamp && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-3 bg-card/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Activated</p>
                  <p className="text-sm font-bold">{formatDate(robotStatus.activation_timestamp)}</p>
                </div>
                <div className="text-center p-3 bg-card/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Expires</p>
                  <p className={`text-sm font-bold ${robotStatus.isExpired ? "text-loss" : "text-amber-400"}`}>
                    {formatDate(robotStatus.expiry_date)}
                  </p>
                </div>
                <div className="text-center p-3 bg-card/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                  <p className={`text-sm font-bold ${
                    getDaysRemaining(robotStatus.expiry_date) < 30 ? "text-loss" : "text-profit"
                  }`}>
                    {getDaysRemaining(robotStatus.expiry_date)}
                  </p>
                </div>
              </div>
            )}

            {/* Progress bar if active */}
            {isActive && robotStatus.expiry_date && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Subscription progress</span>
                  <span>{getDaysRemaining(robotStatus.expiry_date)} days remaining</span>
                </div>
                <div className="h-2 bg-card border border-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${(getDaysRemaining(robotStatus.expiry_date) / 365) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* View details button */}
            {robotStatus.activation_timestamp && (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 w-full py-2 text-sm font-semibold border border-border rounded-lg hover:bg-card/80 transition-all"
              >
                View Full Details
              </button>
            )}
          </GlassCard>
        )}

        {/* ── ACTIVATION FORM (only if not active) ── */}
        {!isActive && !statusLoading && (
          <>
            {error && (
              <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
            )}

            <GlassCard heavy className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Activate Your Robot</h2>
                <p className="text-sm text-muted-foreground">
                  Enter transaction details to activate your trading robot
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Transaction Hash (TxID) <span className="text-loss">*</span>
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x1234567890abcdef... or transaction ID"
                    className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    required
                    disabled={submitting}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Your transaction hash from blockchain
                    </p>
                    {txHash && (
                      <button
                        type="button"
                        onClick={() => handleCopy(txHash, "txHash")}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {copied === "txHash" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Sender Address <span className="text-loss">*</span>
                  </label>
                  <input
                    type="text"
                    value={depositAddress}
                    onChange={(e) => setDepositAddress(e.target.value)}
                    placeholder="0x... or wallet address"
                    className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    required
                    disabled={submitting}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Sender wallet address, from which you made the deposit.
                    </p>
                    {depositAddress && (
                      <button
                        type="button"
                        onClick={() => handleCopy(depositAddress, "address")}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {copied === "address" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !txHash.trim() || !depositAddress.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Activating...
                    </>
                  ) : (
                    <><Bot size={20} /> Activate Robot</>
                  )}
                </button>
              </form>

              <div className="space-y-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="text-warning flex-shrink-0" />
                  <h3 className="font-semibold">Important Information</h3>
                </div>
                <ul className="space-y-2 text-sm ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold mt-0.5">•</span>
                    <span>Ensure the transaction hash is correct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold mt-0.5">•</span>
                    <span>Double-check the deposit address before submitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold mt-0.5">•</span>
                    <span>Your robot will be activated after verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold mt-0.5">•</span>
                   <span>Verification typically takes <strong>15-30 minutes</strong></span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* Modal with real data */}
      {robotStatus && (
        <RobotActivationDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          activationTimestamp={robotStatus.activation_timestamp}
          expiryDate={robotStatus.expiry_date}
          isExpired={robotStatus.isExpired}
        />
      )}
    </main>
  );
}