import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/common/GlassCard";
import { apiClient } from "@/services/api";
import {
  User,
  Lock,
  Bell,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function passwordStrength(pwd: string) {
  if (!pwd) return { score: 0, label: "", color: "" };

  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const map = [
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-orange-500" },
    { label: "Good", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-green-500" },
    { label: "Very Strong", color: "bg-emerald-500" },
  ];

  return { score, ...map[score] };
}

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  console.log("USER DATA:", user);

  const strength = passwordStrength(form.newPassword);

  const handleChangePassword = async () => {
    setError("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setShowChangePassword(false);
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen relative">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Settings */}
        <GlassCard heavy className="p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User size={20} />
            Account Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="email"
                defaultValue={user?.phone}
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                defaultValue={user?.phone || "Not provided"}
                className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled
              />
            </div>
          </div>
        </GlassCard>

        {/* Security Settings */}
        <GlassCard heavy className="p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock size={20} />
            Security
          </h3>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure.
            </p>
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg transition-all duration-200"
            >
              <Shield size={16} />
              Change Password
            </button>
          </div>
        </GlassCard>

        {/* Notification Settings */}
        <GlassCard heavy className="p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive updates about your account
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <div>
                <p className="font-medium text-sm">Profit Updates</p>
                <p className="text-xs text-muted-foreground">
                  Get notified when you earn profits
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <div>
                <p className="font-medium text-sm">Weekly Digest</p>
                <p className="text-xs text-muted-foreground">
                  Summary of your weekly activity
                </p>
              </div>
            </label>
          </div>
        </GlassCard>

        {/* Logout */}
        <GlassCard heavy className="p-8 space-y-6 border-loss/30">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to logout? You will need to sign in again."
                )
              ) {
                logout();
              }
            }}
            className="w-full text-left p-4 bg-loss/20 hover:bg-loss/30 border border-loss/30 rounded-lg transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-loss" />
              <div>
                <p className="font-semibold text-sm text-loss">Logout</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign out from your account
                </p>
              </div>
            </div>
            <span className="text-loss">→</span>
          </button>
        </GlassCard>
      </div>
{/* // change password modal */}
{showChangePassword && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
    
    {/* Mobile bottom sheet + desktop modal */}
    <div className="w-full sm:max-w-md bg-card border border-white/10 rounded-t-2xl sm:rounded-xl shadow-xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" size={18} />
          <h2 className="font-semibold text-sm sm:text-base">
            Change Password
          </h2>
        </div>
        <button
          onClick={() => setShowChangePassword(false)}
          className="text-muted-foreground hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">

        {success ? (
          <div className="flex flex-col items-center text-center gap-2 py-6">
            <CheckCircle className="text-green-500" size={30} />
            <p className="text-sm">Password updated successfully</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Fields */}
            {[
              { key: "currentPassword", label: "Current Password" },
              { key: "newPassword", label: "New Password" },
              { key: "confirmPassword", label: "Confirm Password" },
            ].map(({ key, label }) => {
              const fieldKey = key as keyof typeof form;
              const showKey =
                key === "currentPassword"
                  ? "current"
                  : key === "newPassword"
                  ? "new"
                  : "confirm";

              return (
                <div key={key}>
                  <div className="relative">
                    <input
                      type={show[showKey] ? "text" : "password"}
                      placeholder={label}
                      value={form[fieldKey]}
                      onChange={(e) =>
                        setForm({ ...form, [fieldKey]: e.target.value })
                      }
                      className="w-full bg-input border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShow({ ...show, [showKey]: !show[showKey] })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {show[showKey] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {/* Strength */}
                  {key === "newPassword" && form.newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded ${
                              i <= strength.score
                                ? strength.color
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {strength.label}
                      </p>
                    </div>
                  )}

                  {/* Match */}
                  {key === "confirmPassword" && form.confirmPassword && (
                    <p
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        form.newPassword === form.confirmPassword
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {form.newPassword === form.confirmPassword ? (
                        <>
                          <CheckCircle size={12} /> Match
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} /> Not match
                        </>
                      )}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Button */}
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg flex justify-center items-center gap-2 text-sm sticky bottom-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Updating...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Update Password
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}
    </main>
  );
}