import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Moon, Sun, Shield, Award, TrendingUp, Lock, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OurJourney } from "@/components/sections/OurJourney";
import { StartSmartInvestBetter } from "@/components/sections/StartSmartInvestBetter";
import { OurCertificates } from "@/components/sections/OurCertificates";
import { TradingBackground } from "@/components/sections/TradingBackground";

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("appDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    localStorage.setItem("appDarkMode", JSON.stringify(isDarkMode));
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      htmlElement.classList.remove("light-mode");
    } else {
      htmlElement.classList.remove("dark");
      htmlElement.classList.add("light-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScrollPos = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScrollPos);
    return () => window.removeEventListener("scroll", handleScrollPos);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "portfolio", "services", "about", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Intro", id: "intro" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Investment Plans", id: "services" },
    { label: "About Us", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  const bgClasses = isDarkMode
    ? "bg-[#050A14] text-white"
    : "bg-gradient-to-b from-white to-slate-50 text-slate-900";

  const cardClasses = isDarkMode
    ? "bg-[#0F2137]/60 border-white/10 text-white"
    : "bg-white border-slate-200/80 text-slate-900 shadow-lg";

  const mutedClasses = isDarkMode ? "text-[#B8C8D8]" : "text-slate-700";

  return (
    <div
      className={`w-full ${bgClasses} transition-colors duration-300 relative`}
    >
      {/* Global Trading Background Layer */}
      <TradingBackground isDarkMode={isDarkMode} />

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav
          className={`fixed top-0 left-0 right-0 ${isDarkMode ? "bg-[#0A1628]/95" : "bg-white/95"} backdrop-blur-xl ${isDarkMode ? "border-white/[0.07]" : "border-slate-200 shadow-sm"} border-b z-50 transition-colors duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                {/* <img 
                  // src="/logo.png" 
                  alt="TimoFX Logo" 
                  className="w-10 h-10 object-contain"
                /> */}
                <div className="text-2xl font-bold bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">
                  TimoFX
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      activeSection === link.id
                        ? isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"
                        : isDarkMode
                          ? "text-[#B8C8D8] hover:text-white"
                          : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${isDarkMode ? "bg-[#0F2137] text-[#C9A84C] hover:bg-[#122540]" : "bg-amber-50 text-[#A8893C] hover:bg-amber-100 shadow-sm"}`}
                  title="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className={`px-6 py-2.5 ${isDarkMode ? "bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90" : "bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 shadow-md shadow-[#C9A84C]/30"} text-[#050A14] font-bold rounded-xl transition-all duration-200`}
                >
                  Login
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-3">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? "bg-[#0F2137] text-[#C9A84C]" : "bg-amber-50 text-[#A8893C] shadow-sm"}`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  className="md:hidden p-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div
                className={`md:hidden pb-4 ${isDarkMode ? "border-white/[0.07]" : "border-slate-200 bg-slate-50/50"} border-t mt-2`}
              >
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                      activeSection === link.id
                        ? isDarkMode ? "text-[#C9A84C] bg-[#C9A84C]/10" : "text-[#A8893C] bg-amber-50"
                        : isDarkMode
                          ? "text-[#B8C8D8] hover:bg-[#0F2137]/50"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => navigate("/login")}
                  className={`block w-full text-left px-4 py-3 mt-2 ${isDarkMode ? "bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90" : "bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 shadow-md"} text-[#050A14] font-bold rounded-xl transition-all duration-200`}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
       

       
     <section
  id="intro"
  className={`pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
    isDarkMode
      ? "bg-gradient-to-br from-[#050A14]/40 via-[#0A1628]/40 to-[#0D1B2E]/40"
      : "bg-gradient-to-br from-white/50 via-amber-50/30 to-orange-50/20"
  }`}
>
  {/* Glassy Grid Overlay - Retained & Re-colored to Blue */}
  <motion.div
    className="absolute inset-0 opacity-[0.2] pointer-events-none"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%"],
    }}
    transition={{
      duration: 40,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear",
    }}
    style={{
      backgroundImage: `linear-gradient(0deg, ${isDarkMode ? "rgba(201, 168, 76, 0.3)" : "rgba(168, 137, 60, 0.12)"} 1px, transparent 1px), 
                       linear-gradient(90deg, ${isDarkMode ? "rgba(201, 168, 76, 0.3)" : "rgba(168, 137, 60, 0.12)"} 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    }}
  />

  {/* Animated Glassy Orbs - Refined for Navy Theme */}
  <div
    className={`absolute inset-0 overflow-hidden pointer-events-none ${isDarkMode ? "opacity-40" : "opacity-20"}`}
  >
    <motion.div
      className="absolute top-20 left-10 w-80 h-80 bg-[#C9A84C] rounded-full mix-blend-screen filter blur-[120px]"
      animate={{
        y: [0, -40, 0],
        x: [0, 30, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-8 right-10 w-96 h-96 bg-[#A8893C] rounded-full mix-blend-screen filter blur-[140px]"
      animate={{
        y: [0, 40, 0],
        x: [0, -30, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>

  {/* Candlestick Pattern - Blue/Indigo Rebrand */}
  <motion.svg
    className="absolute bottom-1/4 left-12 w-40 h-40 opacity-20 pointer-events-none hidden md:block"
    viewBox="0 0 160 160"
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  >
    {[20, 50, 80, 110, 140].map((x, i) => (
      <g key={x}>
        <line x1={x} y1={20 + (i*10)} x2={x} y2={90 + (i*5)} stroke={i % 2 === 0 ? "#E2BC6A" : "#A8893C"} strokeWidth="2" />
        <rect x={x-8} y={35 + (i*5)} width="16" height={30 + (i*2)} fill={i % 2 === 0 ? "#E2BC6A" : "#A8893C"} opacity="0.4" />
      </g>
    ))}
  </motion.svg>

  {/* Uptrend Line - Cyan Rebrand */}
  <motion.svg
    className="absolute top-1/3 right-20 w-48 h-32 opacity-20 pointer-events-none hidden lg:block"
    viewBox="0 0 200 120"
    animate={{ x: [0, 10, 0], opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
  >
    <polyline
      points="10,100 35,85 60,70 85,55 110,45 135,35 160,20 185,15"
      fill="none"
      stroke={isDarkMode ? "#C9A84C" : "#A8893C"}
      strokeWidth="2.5"
      strokeDasharray="4 2"
    />
    <circle cx="185" cy="15" r="4" fill="#C9A84C" className="animate-pulse" />
  </motion.svg>

  {/* Main Content */}
  <div className="max-w-4xl mx-auto text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className={`text-5xl sm:text-6xl lg:text-7xl font-black mb-6`}
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className={isDarkMode ? "text-white" : "text-slate-900"}>Professional </span>
        <span className="bg-gradient-to-r from-[#E2BC6A] to-[#C9A84C] bg-clip-text text-transparent">Investment Platform</span>
      </motion.h1>

      <motion.p
        className={`text-xl sm:text-2xl ${isDarkMode ? "text-[#B8C8D8]" : "text-slate-700 font-medium"} mb-8 max-w-2xl mx-auto leading-relaxed`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        Grow your wealth with our <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C] font-semibold"}>secure</span>, <span className={isDarkMode ? "text-[#E2BC6A]" : "text-[#A8893C] font-semibold"}>transparent</span>, and <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C] font-semibold"}>user-friendly</span> investment platform. Trusted by thousands of traders worldwide.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        {/* Primary Button: Electric Blue */}
        <motion.button
          onClick={() => navigate("/login")}
          className={`px-8 py-4 ${isDarkMode ? "bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90" : "bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 shadow-xl shadow-[#C9A84C]/30"} text-[#050A14] font-bold rounded-xl transition-all duration-300 text-lg`}
          whileHover={{
            y: -4,
            boxShadow: isDarkMode ? "0 20px 40px rgba(201, 168, 76, 0.3)" : "0 25px 50px rgba(201, 168, 76, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>

        {/* Secondary Button: Glassy Outlined */}
        <motion.button
          onClick={() => scrollToSection("services")}
          className={`px-8 py-4 border-2 backdrop-blur-sm ${
            isDarkMode 
              ? "border-[#C9A84C]/40 hover:border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5" 
              : "border-[#A8893C] hover:border-[#A8893C] text-[#A8893C] bg-white/50 shadow-lg"
          } font-bold rounded-xl transition-all duration-300 text-lg`}
          whileHover={{
            y: -4,
            backgroundColor: isDarkMode ? "rgba(201, 168, 76, 0.1)" : "rgba(255, 255, 255, 0.9)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>
      </motion.div>
    </motion.div>
  </div>

  {/* Scroll Indicator - Blue Accent */}
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <ChevronDown
      className={`w-6 h-6 ${isDarkMode ? "text-[#C9A84C]/50" : "text-[#A8893C]/50"}`}
    />
  </motion.div>
</section>


        {/* Portfolio / Stats Section */}
      <section
          id="portfolio"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-[#0A1628]/50 via-[#0D1B2E]/50 to-[#0A1628]/50"
              : "bg-gradient-to-b from-white/50 via-slate-50/40 to-white/50"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2
                className={`text-4xl sm:text-5xl font-black mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                Our Platform{" "}
                <span className={`bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent`}>
                  in Numbers
                </span>
              </h2>
              <p className={`${mutedClasses} text-lg font-medium`}>
                Join thousands of successful traders managing their investments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Active Customers",
                  value: "58,433+",
                  icon: "👥",
                  color: "from-[#C9A84C] to-[#E2BC6A]",
                },
                {
                  title: "Funds Managed",
                  value: "$15M+",
                  icon: "💰",
                  color: "from-[#A8893C] to-[#C9A84C]",
                },
                {
                  title: "Monthly Growth",
                  value: "5-12%",
                  icon: "📈",
                  color: "from-[#E2BC6A] to-[#C9A84C]",
                },
                {
                  title: "Years of Trust",
                  value: "2+",
                  icon: "🏆",
                  color: "from-[#C9A84C] to-[#A8893C]",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group relative p-8 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-[#0F2137]/40 border-white/10 hover:bg-[#0F2137]/60"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xl hover:shadow-2xl"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10 text-center">
                    <div
                      className="text-5xl mb-4 animate-bounce"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {stat.icon}
                    </div>
                    <p className={`${mutedClasses} text-sm mb-2 font-bold uppercase tracking-wider`}>
                      {stat.title}
                    </p>
                    <h3
                      className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>  

        {/* Start Smart, Invest Better Section */}
        <StartSmartInvestBetter isDarkMode={isDarkMode} />

        {/* Services / Pricing Section */}
        <section
          id="services"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-[#050A14]/50 via-[#0A1628]/50 to-[#050A14]/50"
              : "bg-gradient-to-b from-slate-50/50 via-amber-50/20 to-slate-50/50"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2
                className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                Flexible Investment{" "}
                <span className="bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">
                  Plans
                </span>
              </h2>
              <p className={`${mutedClasses} text-lg`}>
                Choose the perfect plan for your investment goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan A */}
              <div
                className={`relative p-8 rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 border-2 ${
                  isDarkMode
                    ? "bg-[#0F2137]/40 border-white/10 hover:bg-[#0F2137]/60"
                    : "bg-white border-amber-200/80 hover:border-amber-300 shadow-xl hover:shadow-2xl"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? "from-[#C9A84C]/10" : "from-amber-50/80"} to-transparent pointer-events-none`} />
                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    Starter Plan
                  </h3>
                  <p className={`${mutedClasses} mb-4 font-medium`}>
                    Perfect for beginners starting their journey
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">
                      5%
                    </span>
                    <span className={`${mutedClasses} ml-2`}>
                      Monthly Interest
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-4 mb-6 border ${isDarkMode ? "bg-[#0A1628]/50 border-[#C9A84C]/20" : "bg-amber-50/80 border-amber-200"}`}
                  >
                    <p
                      className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}
                    >
                      Minimum Investment:{" "}
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>Less than $999</span>
                    </p>
                  </div>
                  <ul
                    className={`space-y-3 mb-8 ${isDarkMode ? "text-[#B8C8D8]" : "text-slate-700"} font-medium`}
                  >
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> Low minimum
                      deposit
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> Easy to get
                      started
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> 24/7 customer
                      support
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate("/login")}
                    className={`w-full px-6 py-3.5 font-bold rounded-xl transition-all duration-200 border-2 ${
                      isDarkMode
                        ? "border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10"
                        : "border-[#A8893C] text-[#A8893C] hover:bg-amber-50 shadow-md"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* Plan B */}
              <div
                className={`relative p-8 rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 border-2 md:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-[#C9A84C]/10 to-[#A8893C]/10 border-[#C9A84C]/50 hover:bg-gradient-to-br hover:from-[#C9A84C]/20 hover:to-[#A8893C]/20"
                    : "bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-[#C9A84C]/70 hover:border-[#C9A84C] shadow-2xl hover:shadow-3xl"
                }`}
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] text-[#050A14] px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ POPULAR
                </div>
                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    Premium Plan
                  </h3>
                  <p className={`${mutedClasses} mb-4 font-medium`}>
                    For serious investors seeking maximum returns
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">
                      7-12%
                    </span>
                    <span className={`${mutedClasses} ml-2`}>
                      Monthly Interest
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-4 mb-6 border ${isDarkMode ? "bg-[#0A1628]/50 border-[#C9A84C]/30" : "bg-amber-50/80 border-amber-200"}`}
                  >
                    <p
                      className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}
                    >
                      Minimum Investment:{" "}
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>≥ $1000</span>
                    </p>
                  </div>
                  <ul
                    className={`space-y-3 mb-8 ${isDarkMode ? "text-[#B8C8D8]" : "text-slate-700"} font-medium`}
                  >
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> Higher returns
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> Advanced
                      analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}>✓</span> Personal advisor
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 text-[#050A14] font-black rounded-xl transition-all duration-200 shadow-xl hover:shadow-[#C9A84C]/50"
                  >
                    Start Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-[#0A1628]/50 via-[#0D1B2E]/50 to-[#0A1628]/50"
              : "bg-gradient-to-b from-slate-50/30 via-amber-50/20 to-slate-50/30"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: About Text */}
              <div className="animate-slide-up">
                <h2
                  className={`text-4xl sm:text-5xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  About{" "}
                  <span className="bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">
                    Timofx
                  </span>
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#C9A84C] to-[#E2BC6A] bg-clip-text text-transparent">
                      Our Story
                    </h3>
                    <p className={`${mutedClasses} leading-relaxed`}>
                      Founded in 2024, Timofx emerged from a vision to
                      democratize wealth management. We built a platform where
                      both beginners and experienced traders could grow their
                      investments safely and transparently. Today, we've helped
                      thousands achieve their financial dreams.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r  from-[#C9A84C] to-[#E2BC6A] bg-clip-text text-transparent">
                      Our Mission
                    </h3>
                    <p className={`${mutedClasses} leading-relaxed`}>
                      To empower individuals to take control of their financial
                      future through accessible, secure, and transparent
                      investment solutions that everyone can trust and
                      understand.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r  from-[#C9A84C] to-[#E2BC6A] bg-clip-text text-transparent">
                      Our Vision
                    </h3>
                    <p className={`${mutedClasses} leading-relaxed`}>
                      To become the world's most trusted investment platform,
                      enabling millions to build lasting wealth and achieve
                      their financial goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Team Overview */}
              <div className="animate-fade-in">
                <h3
                  className={`text-2xl font-bold mb-8 text-center lg:text-left ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  Leadership Team
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Chief Executive Officer",
                      bio: "15+ years in fintech with proven track record",
                      color: "from-[#C9A84C] to-[#E2BC6A]",
                    },
                    {
                      name: "Michael Chen",
                      role: "Chief Technology Officer",
                      bio: "Expert in blockchain and secure trading systems",
                      color: "from-[#A8893C] to-[#C9A84C]",
                    },
                    {
                      name: "Emma Williams",
                      role: "Head of Customer Relations",
                      bio: "Dedicated to exceptional user experiences",
                      color: "from-[#E2BC6A] to-[#C9A84C]",
                    },
                    {
                      name: "David Rodriguez",
                      role: "Chief Financial Officer",
                      bio: "Strategic financial planning and compliance expert",
                      color: "from-[#C9A84C] to-[#A8893C]",
                    },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className={`group relative p-5 rounded-xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 ${
                        isDarkMode
                          ? "bg-[#0F2137]/40 border-white/10 hover:bg-[#0F2137]/60"
                          : "bg-white border-slate-200/80 hover:border-slate-300 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      ></div>
                      <div className="relative z-10">
                        <h4
                          className={`font-black mb-1 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}
                        >
                          {member.name}
                        </h4>
                        <p className={`text-sm ${mutedClasses} mb-2 font-semibold`}>
                          {member.role}
                        </p>
                        <p
                          className={`text-xs font-medium ${isDarkMode ? "text-slate-500" : "text-slate-600"}`}
                        >
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey Section */}
        <OurJourney isDarkMode={isDarkMode} />

        {/* Our Certificates Section */}
        <OurCertificates isDarkMode={isDarkMode} />

        {/* Contact Section */}
        <section
          id="contact"
          className={`py-20 px-4 sm:px-6 lg:px-8 ${
            isDarkMode
              ? "bg-[#0A1628]/50"
              : "bg-slate-50/50"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-8">
              <p className="text-[#C9A84C] text-sm font-bold uppercase tracking-wider mb-2">REACH OUT</p>
              <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Get in <span className="bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className={`${mutedClasses} text-base max-w-2xl`}>
                Let's discuss how we can help transform your investment journey with innovative solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div
                className={`rounded-2xl p-8 ${
                  isDarkMode
                    ? "bg-[#0F2137]/50 border border-white/10"
                    : "bg-white border border-slate-200 shadow-xl"
                }`}
              >
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Send a Message
                </h3>
                <p className={`text-sm ${mutedClasses} mb-6`}>
                  We'll get back to you within 24 hours.
                </p>
                <form className="space-y-5">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                        isDarkMode
                          ? "bg-[#0A1628] border-white/10 text-white placeholder-[#3D5068]"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                        isDarkMode
                          ? "bg-[#0A1628] border-white/10 text-white placeholder-[#3D5068]"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="+49 040 4870 5778"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all ${
                        isDarkMode
                          ? "bg-[#0A1628] border-white/10 text-white placeholder-[#3D5068]"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      YOUR MESSAGE
                    </label>
                    <textarea
                      placeholder="Tell us about your investment goals..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all resize-none ${
                        isDarkMode
                          ? "bg-[#0A1628] border-white/10 text-white placeholder-[#3D5068]"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 text-[#050A14] font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Contact Info & Business Hours */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div
                  className={`rounded-2xl p-8 ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50"
                      : "bg-white border border-slate-200 shadow-xl"
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                        <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${mutedClasses}`}>EMAIL</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-[#C9A84C]" : "text-[#A8893C]"}`}>
                          Support@timofx.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                        <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${mutedClasses}`}>PHONE</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          +49 040 4870 5778
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-[#C9A84C]/10">
                        <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${mutedClasses}`}>ADDRESS</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          Bernhard-Nocht-Straße 113, 20359 Hamburg, Germany
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div
                  className={`rounded-2xl p-8 ${
                    isDarkMode
                      ? "bg-[#050A14] border border-white/[0.07]"
                      : "bg-slate-900 border border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-[#C9A84C]" />
                    <h3 className="text-xl font-bold text-white">
                      Business Hours
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#B8C8D8]">Monday – Friday</span>
                      <span className="text-sm font-semibold text-[#C9A84C]">9:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#B8C8D8]">Saturday</span>
                      <span className="text-sm font-semibold text-[#E2BC6A]">10:00 AM – 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#B8C8D8]">Sunday</span>
                      <span className="text-sm font-semibold text-red-500">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Ready to start */}
                <div
                  className={`rounded-2xl p-6 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-[#C9A84C]/15 to-[#A8893C]/15 border border-[#C9A84C]/25"
                      : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
                  }`}
                >
                  <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Ready to start trading?
                  </h4>
                  <p className={`text-sm ${mutedClasses} mb-4`}>
                    Join thousands of successful traders and start growing your wealth today.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 text-[#050A14] font-bold rounded-lg transition-all duration-200 shadow-lg"
                  >
                    Start Trading →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`${
            isDarkMode
              ? "bg-[#050A14]/60 border-white/[0.06]"
              : "bg-[#050A14]/60 border-white/[0.06]"
          } border-t`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Company Info */}
              <div className="col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-[#C9A84C]" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent">
                    Timofx
                  </h3>
                </div>
                <p className="text-xs text-[#7A8FA0] mb-1">Professional Investment Platform</p>
                <p className="text-sm text-[#B8C8D8] mb-6 leading-relaxed">
                  Grow your wealth with our secure, transparent, and user-friendly investment platform trusted by thousands worldwide.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#B8C8D8]">
                    <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Support@timofx.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B8C8D8]">
                    <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+49 040 4870 5778</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#B8C8D8]">
                    <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Bernhard-Nocht-Straße 113, 20359 Hamburg, Germany</span>
                  </div>
                </div>
                {/* Social Links */}
               <div className="flex gap-3 mt-6">
  {[
    {
      name: "facebook",
      path: "M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z",
    },
    {
      name: "twitter",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
    {
      name: "linkedin",
      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
      name: "instagram",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
    },
  ].map((social) => (
    <a
      key={social.name}
      href="#"
      className="p-2 rounded-lg bg-[#0A1628] hover:bg-[#0F2137] border border-white/[0.07] hover:border-[#C9A84C]/30 transition-all duration-200"
    >
      <svg
        className="w-4 h-4 text-[#7A8FA0] hover:text-[#C9A84C] transition-colors"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={social.path} />
      </svg>
    </a>
  ))}
</div>
              </div>

              {/* Navigate */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-[#C9A84C]"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">NAVIGATE</h4>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="text-sm text-[#7A8FA0] hover:text-[#C9A84C] transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#C9A84C] transition-all duration-200"></span>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-[#E2BC6A]"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E2BC6A]">SERVICES</h4>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Trading Solutions</h3>
                <ul className="space-y-3">
                  {[
                    "Portfolio Management",
                    "Risk Assessment",
                    "Wealth Management",
                  ].map((service) => (
                    <li key={service}>
                      <a
                        href="#services"
                        className="text-sm text-[#7A8FA0] hover:text-[#E2BC6A] transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#E2BC6A] transition-all duration-200"></span>
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-[#C9A84C]"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">STAY UPDATED</h4>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
                <p className="text-sm text-[#7A8FA0] mb-6">
                  Subscribe to get the latest updates, articles, and news delivered to your inbox.
                </p>
                <div className="flex gap-2 mb-6">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2.5 bg-[#0A1628] border border-white/[0.07] rounded-lg text-sm text-white placeholder-[#3D5068] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  <button className="p-2.5 bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] hover:opacity-90 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-[#7A8FA0]">
                  
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">98%</span> Satisfaction
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">2+</span> Years
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/[0.06]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-[#7A8FA0]">
                  © 2026 <span className="bg-gradient-to-r from-[#A8893C] to-[#E2BC6A] bg-clip-text text-transparent font-semibold">Timofx</span>. All rights reserved.
                </p>
                <div className="flex gap-6">
                  {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm text-[#7A8FA0] hover:text-[#C9A84C] transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}