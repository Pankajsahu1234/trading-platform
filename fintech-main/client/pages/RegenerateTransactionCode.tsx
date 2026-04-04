import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import {
  Shield,
  Lock,
  Key,
  Copy,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { apiClient } from "@/services/api";

export default function RegenerateTransactionCode() {
  const [step, setStep] = useState<"initial" | "otp">("initial");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [generatedCode, setGeneratedCode] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  //  Send OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await apiClient.post("/auth/send-transaction-otp");

      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  //  Verify + Generate
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiClient.post("/auth/regenerate-transaction-code", {
        emailVerificationOTP: otp,
        currentUserPassword: password,
      });
      console.log("API Response:", res);
      if(res?.error){
        setError(res?.error);
        return;
      }
      setGeneratedCode(res.data.transactionCode);
      setMessage(res.data.message);
    } catch (err: any) {
      console.error("Error generating transaction code:", err);
      setError(err?.data?.error || err?.response?.data?.message || err?.message || "Failed to generate transaction code");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Regenerate Transaction Code
          </h1>
          <p className="text-muted-foreground">
            Securely generate a new transaction code
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Main Card */}
        <GlassCard heavy className="p-8 space-y-6">

          {/* STEP 1 */}
          {step === "initial" && (
            <div className="space-y-4 text-center">
              <Shield className="mx-auto text-primary" size={40} />

              <p className="text-sm text-muted-foreground">
                To regenerate your transaction code, we will first verify your identity.
              </p>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Key size={16} />
                    Send OTP
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === "otp" && !generatedCode && (
            <div className="space-y-4">

              <div>
                <label className="text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full mt-1 bg-input border border-white/10 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Enter Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    Verify & Generate
                  </>
                )}
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {generatedCode && (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto text-green-500" size={40} />

              <p className="font-semibold">{message}</p>

              <div className="bg-card border border-white/10 rounded-lg p-4 text-lg tracking-widest font-mono">
                {generatedCode}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 mx-auto text-sm text-primary"
              >
                <Copy size={14} />
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
          )}

        </GlassCard>
      </div>
    </main>
  );
}