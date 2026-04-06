import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Mail, Lock, User, Phone, LogIn, ChevronDown } from "lucide-react";
import { TradingBackground } from "@/components/sections/TradingBackground";
import { apiClient } from "@/services/api";
import { set } from "zod/v4";

const COUNTRIES = [
  { name: "Germany", code: "+49", flag: "🇩🇪", maxDigits: 10 },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰", maxDigits: 8 },
  { name: "India", code: "+91", flag: "🇮🇳", maxDigits: 10 },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", maxDigits: 10 },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", maxDigits: 10 },
  { name: "Philippines", code: "+63", flag: "🇵🇭", maxDigits: 10 },
  { name: "Poland", code: "+48", flag: "🇵🇱", maxDigits: 9 },
  { name: "Singapore", code: "+65", flag: "🇸🇬", maxDigits: 8 },
  { name: "Spain", code: "+34", flag: "🇪🇸", maxDigits: 9 },
  { name: "Thailand", code: "+66", flag: "🇹🇭", maxDigits: 9 },
  { name: "UAE", code: "+971", flag: "🇦🇪", maxDigits: 9 },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [res, setRes] = useState(undefined);
  const [referralCode, setReferralCode] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref') || '';
  });
  const [reffer, setReffer] = useState(null);
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem("appDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });
  

 useEffect(() => {
  const fetchReferralUser = async () => {
    if (referralCode.length !== 8) return;

    try {
      const response = await apiClient.get(`/users/referral/${referralCode}`);
      if(response.data === 404)  
        {
          setRes({data: {name: response?.message}});
          return;
        }
      setRes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching referral user:", error);
    }
  };

  fetchReferralUser();
}, [referralCode]);

useEffect(() => {
  if (referralCode.length !== 8) {
    setRes(null);
  }
}, [referralCode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= selectedCountry.maxDigits) {
      setPhone(val);
    }
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setPhone("");
    setDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    
    console.log('🚀 Signup form submitted');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Phone:', phone);

    if (phone.length !== selectedCountry.maxDigits) {
      setLocalError(`Phone number must be ${selectedCountry.maxDigits} digits for ${selectedCountry.name}`);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    try {
      await signup(email, password, name, `${selectedCountry.code}${phone}`,referralCode);
      navigate("/verify-email");
    } catch (err) {
      console.error('❌ Signup failed:', err);
      // Error is handled by context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <TradingBackground isDarkMode={isDarkMode} />
      <div className="w-full max-w-md space-y-8 animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              <span className="text-white">Timo</span>
              <span className="text-primary">FX</span>
            </h1>
          <p className="text-muted-foreground">Professional I Platform</p>
        </div>

        {/* Signup Form */}
        <GlassCard heavy className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

          {(error || localError) && (
            <div className="bg-loss/20 border border-loss/30 text-loss px-4 py-3 rounded-lg text-sm">
              <div>{error || localError}</div>
              {(error || "").toLowerCase().includes("already registered") && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Already signed up?{" "}
                  <a
                    href="/verify-email"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => {
                      sessionStorage.setItem("pending_verify_email", email);
                    }}
                  >
                    Click here to verify your email →
                  </a>
                </div>
              )}
              <button
                onClick={() => {
                  clearError();
                  setLocalError("");
                }}
                className="mt-1 text-xs font-semibold hover:underline block"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Input with Country Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 bg-input border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all whitespace-nowrap disabled:opacity-50"
                  >
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-white/80 font-medium">{selectedCountry.code}</span>
                    <ChevronDown
                      size={14}
                      className={`text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-[#0A1628] border border-white/10 rounded-lg shadow-xl overflow-hidden w-52">
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full flex items-center gap-3 px-3 py-1 text-sm hover:bg-white/5 transition-colors text-left ${
                            selectedCountry.code === country.code ? "bg-primary/10 text-primary" : "text-white/80"
                          }`}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="flex-1">{country.name}</span>
                          <span className="text-muted-foreground text-xs">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={"0".repeat(selectedCountry.maxDigits)}
                    className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                    disabled={isLoading}
                    maxLength={selectedCountry.maxDigits}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {selectedCountry.name}: {phone.length}/{selectedCountry.maxDigits} digits
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
             {/* Referral Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Referral Code</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Optional referral code"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">At least 8 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center pt-4 border-t border-white/10">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </GlassCard>

        {res && (
          <GlassCard heavy className="p-6 text-center">
            <h3 className="text-lg font-bold">Referred By</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Name: {res?.data?.name || res.message || 'No referrer found'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Referral Code: {res.data?.referral_code || 'N/A'}
            </p>
        </GlassCard> )}

        {/* Login Link */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Or go to{" "}
          <Link to="/login" className="text-primary hover:underline">
            login page
          </Link>
        </div>
      </div>
    </div>
  );
}