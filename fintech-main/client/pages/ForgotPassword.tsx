import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import { KeyRound, RefreshCw, Mail } from "lucide-react";
import { TradingBackground } from "@/components/sections/TradingBackground";

type Step = "email" | "otp";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem("appDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  /* ── Step 1: Send OTP ── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/password/forgot-password", { email: email.trim() });
      setSuccess("OTP sent! Check your inbox.");
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Could not send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── OTP helpers ── */
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  /* ── Step 2: Verify OTP → get access token → redirect ── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiClient.post("/password/verify-reset-otp", {
        email: email.trim(),
        otp: code,
      });
      // Store the access token so ResetPassword page can use it
      const token = res?.data?.access_token || res?.access_token;
      if (token) sessionStorage.setItem("reset_access_token", token);
      sessionStorage.setItem("reset_email", email.trim());
      setSuccess("OTP verified! Redirecting…");
      setTimeout(() => navigate("/reset-password"), 1200);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setIsResending(true);
    try {
      await apiClient.post("/password/forgot-password", { email: email.trim() });
      setSuccess("A new OTP has been sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err?.message || "Could not resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <TradingBackground isDarkMode={isDarkMode} />
      <div className="w-full max-w-md space-y-8 animate-slide-up relative z-10">

        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Timofx</h1>
          <p className="text-muted-foreground">Professional Investment Platform</p>
        </div>

        <GlassCard heavy className="p-8 space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <KeyRound className="text-primary" size={48} />
            </div>
            <h2 className="text-2xl font-bold">
              {step === "email" ? "Forgot Password" : "Verify OTP"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === "email"
                ? "Enter your registered email to receive a reset code."
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && step === "email" && (
            <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* ── STEP 1: Email form ── */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending OTP…" : "Send Reset Code"}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP form ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">

              {/* Success inline */}
              {success && (
                <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-4 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      disabled={isLoading}
                      className="w-12 h-14 text-center text-xl font-bold bg-input border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying…" : "Verify OTP"}
              </button>

              {/* Resend */}
              <div className="text-center text-sm text-muted-foreground pt-2 border-t border-white/10">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary hover:underline font-semibold disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <RefreshCw size={13} className={isResending ? "animate-spin" : ""} />
                  {isResending ? "Sending…" : "Resend OTP"}
                </button>
              </div>

              {/* Back link */}
              <div className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(null); setSuccess(null); setOtp(["","","","","",""]); }}
                  className="text-primary hover:underline font-semibold"
                >
                  ← Change email
                </button>
              </div>
            </form>
          )}

        </GlassCard>

        <div className="text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
