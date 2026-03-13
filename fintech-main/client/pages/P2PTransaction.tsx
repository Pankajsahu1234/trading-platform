import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { transferService, ReceiverInfo } from "@/services/transfer.service";
import {
  AlertCircle,
  CheckCircle,
  Search,
  Send as SendIcon,
} from "lucide-react";

export default function P2PTransaction() {
  const { user } = useAuth();
  const { fetchWalletBalance, balance } = useWallet();

  // Form state
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // UI state
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<ReceiverInfo | null>(null);
  const [transferId, setTransferId] = useState<string | null>(null);

  // Store last transfer info for success display
  const [lastTransfer, setLastTransfer] = useState<{
    receiverName: string;
    amount: string;
    transferId: string;
  } | null>(null);

  // Handle receiver search
  const handleSearchReceiver = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setReceiver(null);

    if (!identifier.trim()) {
      setError("Please enter a receiver email, phone, or user ID");
      return;
    }

    try {
      setSearching(true);
      const foundReceiver = await transferService.searchReceiver(identifier);

      // Defensive check: ensure foundReceiver is valid
      if (!foundReceiver || !foundReceiver.id) {
        setError("Invalid receiver data. Please try again.");
        setReceiver(null);
        return;
      }

      // Check if user is trying to send to themselves (using optional chaining)
      if (foundReceiver?.id === user?.id) {
        setError("You cannot send money to yourself");
        setReceiver(null);
        return;
      }

      setReceiver(foundReceiver);
      setError(null);
    } catch (err: any) {
      setError(
        err?.message ||
          "Receiver not found. Please check the identifier and try again.",
      );
      setReceiver(null);
    } finally {
      setSearching(false);
    }
  };

  // Handle transfer submission
  const handleSendTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!receiver) {
      setError("Please search for a receiver first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const transferAmount = parseFloat(amount);

    if (transferAmount < 1) {
      setError("Minimum transfer amount is $1");
      return;
    }

    const availableBalance = balance?.mainWallet ?? 0;
    if (availableBalance < transferAmount) {
      setError(
        `Insufficient balance. You have $${availableBalance.toFixed(2)}`,
      );
      return;
    }

    try {
      setLoading(true);

      const response = await transferService.initiateTransfer({
        receiver: receiver.id,
        amount: transferAmount,
        description: description.trim() || undefined,
      });

      setTransferId(response.transferId);

      // Store transfer info before resetting form
      setLastTransfer({
        receiverName: receiver.name,
        amount: transferAmount.toFixed(2),
        transferId: response.transferId,
      });

      setSuccess("Transfer completed successfully!");

      // Refresh wallet balance
      await fetchWalletBalance();

      // Reset form and clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
        setTransferId(null);
        setLastTransfer(null);
        setIdentifier("");
        setAmount("");
        setDescription("");
        setReceiver(null);
      }, 5000);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to process transfer";
      const availableBalance = balance?.mainWallet ?? 0;

      // Handle specific error cases
      if (
        errorMessage.includes("insufficient") ||
        errorMessage.includes("balance")
      ) {
        setError(
          `Insufficient balance. You have $${availableBalance.toFixed(2)}`,
        );
      } else if (errorMessage.includes("inactive")) {
        setError(
          "The receiver account is inactive. Please verify the recipient.",
        );
      } else if (errorMessage.includes("yourself")) {
        setError("You cannot send money to yourself");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">P2P Transfer</h1>
          <p className="text-muted-foreground">
            Send money to another user on the platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <GlassCard
            heavy
            className="p-4 border-loss/50 flex items-start gap-4"
          >
            <AlertCircle className="text-loss flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* Success Alert */}
        {success && lastTransfer && (
          <GlassCard
            heavy
            className="p-4 border-profit/50 flex items-start gap-4"
          >
            <CheckCircle className="text-profit flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold">{success}</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>
                  Transfer ID:{" "}
                  <code className="bg-card/50 px-2 py-1 rounded">
                    {lastTransfer.transferId}
                  </code>
                </p>
                <p>
                  To: <strong>{lastTransfer.receiverName}</strong>
                </p>
                <p>
                  Amount: <strong>${lastTransfer.amount}</strong>
                </p>
                <p>
                  New Balance:{" "}
                  <strong>${(balance?.mainWallet ?? 0).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Main Form Card */}
        <GlassCard heavy className="p-8 space-y-6">
          {/* Step 1: Search Receiver */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Find Receiver</h2>
            <form onSubmit={handleSearchReceiver} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Receiver Email / Phone / User ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter receiver email, phone, or user ID"
                    className="flex-1 bg-input border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    disabled={searching || receiver !== null}
                  />
                  <button
                    type="submit"
                    disabled={searching || receiver !== null}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                  >
                    {searching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Divider */}
          {receiver && <div className="h-px bg-border my-8"></div>}

          {/* Step 2: Receiver Info */}
          {receiver && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Receiver Details</h2>
              <GlassCard className="p-4 border border-primary/30 bg-primary/5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Name</span>
                    <span className="font-semibold">
                      {receiver?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Email</span>
                    <span className="font-mono text-sm">
                      {receiver?.email || "N/A"}
                    </span>
                  </div>
                  {receiver?.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">
                        Phone
                      </span>
                      <span className="font-mono text-sm">
                        {receiver.phone}
                      </span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Divider */}
          {receiver && <div className="h-px bg-border my-8"></div>}

          {/* Step 3: Transfer Form */}
          {receiver && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Transfer Details</h2>
              <form onSubmit={handleSendTransfer} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Amount (USD)
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
                      min="1"
                      step="0.01"
                      className="w-full bg-input border border-white/10 rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ${(balance?.mainWallet ?? 0).toFixed(2)}
                  </p>
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a note for your transfer (e.g., 'Payment for services')"
                    className="w-full bg-input border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none disabled:opacity-50"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                {/* Summary */}
                {amount && (
                  <GlassCard className="p-4 border border-white/10 bg-card/30">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-semibold">
                          {receiver?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-semibold">
                          ${parseFloat(amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-px bg-border my-2"></div>
                      <div className="flex justify-between text-base">
                        <span className="font-semibold">New Balance:</span>
                        <span
                          className={`font-bold ${(balance?.mainWallet ?? 0) - parseFloat(amount) >= 0 ? "text-profit" : "text-loss"}`}
                        >
                          $
                          {(
                            (balance?.mainWallet ?? 0) - parseFloat(amount)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setReceiver(null);
                      setIdentifier("");
                      setAmount("");
                      setDescription("");
                    }}
                    disabled={loading}
                    className="flex-1 border border-white/10 hover:border-white/20 text-foreground font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    Change Receiver
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <SendIcon size={18} />
                        Send Transfer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Info Box */}
          {!receiver && (
            <div className="p-6 bg-card/30 rounded-lg border border-white/10 text-center">
              <p className="text-muted-foreground text-sm">
                Search for a receiver to begin the transfer process
              </p>
            </div>
          )}
        </GlassCard>

        {/* Help Section */}
        <GlassCard heavy className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">How it works</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1</span>
              <span>Enter the receiver's email, phone number, or user ID</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2</span>
              <span>Click "Search" to find and verify the receiver</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3</span>
              <span>Enter the transfer amount and optional description</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4</span>
              <span>Review and click "Send Transfer" to complete</span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </main>
  );
}
