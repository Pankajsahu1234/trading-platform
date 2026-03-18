import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";
import { TradingBackground } from "@/components/sections/TradingBackground";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem("appDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Retrieve token & email stored by ForgotPassword page
  const accessToken = sessionStorage.getItem("reset_access_token") || "";
  const email = sessionStorage.getItem("reset_email") || "";

  useEffect(() => {
    // Guard: if user lands here without going through OTP flow, redirect them
    if (!accessToken && !email) {
      navigate("/forgot-password");
    }
  }, []);

  /* ── Strength helpers ── */
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { label: "", color: "" },
      { label: "Weak", color: "bg-loss" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-profit" },
    ];
    return { score, ...map[score] };
  };

  const strength = getStrength(newPassword);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post(
        "/password/set-password",
        { email, new_password: newPassword },
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
      );
      sessionStorage.removeItem("reset_access_token");
      sessionStorage.removeItem("reset_email");
      setSuccess("Password reset successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
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
              <ShieldCheck className="text-primary" size={48} />
            </div>
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <p className="text-sm text-muted-foreground">
              Create a new strong password for your account.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-profit/20 border border-profit/30 text-profit px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  disabled={isLoading || !!success}
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          n <= strength.score ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs text-muted-foreground">
                      Strength:{" "}
                      <span
                        className={
                          strength.score === 4
                            ? "text-profit"
                            : strength.score === 3
                            ? "text-blue-400"
                            : strength.score === 2
                            ? "text-yellow-400"
                            : "text-loss"
                        }
                      >
                        {strength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  disabled={isLoading || !!success}
                  className={`w-full bg-input border rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-profit/50"
                        : "border-loss/50"
                      : "border-white/10"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${passwordsMatch ? "text-profit" : "text-loss"}`}>
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success || !passwordsMatch || newPassword.length < 8}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving…" : "Reset Password"}
            </button>
          </form>

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
