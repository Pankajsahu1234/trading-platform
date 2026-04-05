// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  Wallet,
  TrendingUp,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  Bot,
  Send,
  Loader2,
  Sun,
  Bell,
  Moon,
  User,CheckCheck, X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: (isDark: boolean) => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Deposit",
    href: "/wallet/deposit",
    icon: Wallet,
  },
  {
    label: "Withdraw",
    href: "/wallet/withdraw",
    icon: TrendingUp,
  },
  {
    label: "P2P Transaction",
    href: "/p2p-transaction",
    icon: Send,
  },
  {
    label: "Activate Robot",
    href: "/robot/activate",
    icon: Bot,
  },
  {
    label: "Referral",
    href: "/referral",
    icon: Users,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Timo token",
    href: "/timotoken",
    icon: History,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({
  isOpen,
  onToggle,
  isDarkMode,
  onToggleDarkMode,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { setActivationModalOpen } = useApp();
  const { toast } = useToast();
  const [isCheckingRobotStatus, setIsCheckingRobotStatus] = useState(false);
  
  const [notifOpen, setNotifOpen] = useState(false);
const notifRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
      setNotifOpen(false);
    }
  }
  if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [notifOpen]);

  const navigateWithExistingGuards = (href: string, label: string) => {
    if (
      (label === "Deposit" ||
        label === "Withdraw" ||
        label === "Activate Robot") &&
      user?.accountStatus === "inactive"
    ) {
      setActivationModalOpen(true);
    } else {
      navigate(href);
    }

    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const handleRobotActivationClick = async (href: string) => {
    if (isCheckingRobotStatus) return;

    try {
      setIsCheckingRobotStatus(true);

      const response = await apiClient.get<{
        success: boolean;
        data: {
          robot_status: string;
          isExpired: boolean;
          activation_timestamp: string | null;
          expiry_date: string | null;
        };
      }>("/robot/status");

      // ✅ Correct field name: robot_status, not status
      const robotStatus = response.data?.data?.robot_status?.toUpperCase();
      const isExpired = response.data?.data?.isExpired;

      if (robotStatus === "ACTIVE" && !isExpired) {
        // Robot active hai — directly page pe le jao
        navigate(href);
        if (window.innerWidth < 1024) onToggle();
        return;
      }

      // Inactive ya expired — activation page pe le jao
      navigateWithExistingGuards(href, "Activate Robot");
    } catch (_error) {
      // Error aaye tab bhi page pe le jao, block mat karo
      navigateWithExistingGuards(href, "Activate Robot");
    } finally {
      setIsCheckingRobotStatus(false);
    }
  };

  const handleNav = (href: string, label: string) => {
    if (label === "Activate Robot") {
      void handleRobotActivationClick(href);
      return;
    }

    navigateWithExistingGuards(href, label);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-all duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-border transition-all duration-300 z-40 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold">
              <span className="text-white">Timo</span>
              <span className="text-primary">FX</span>
            </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Professional Investment Platform
          </p>
        </div>
    
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isRobotItem = item.label === "Activate Robot";
            const isDisabled = isRobotItem && isCheckingRobotStatus;

            return (
              <div
                key={item.href}
                onClick={() => {
                  if (!isDisabled) {
                    handleNav(item.href, item.label);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium cursor-pointer",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                  isDisabled && "cursor-not-allowed opacity-60",
                )}
                aria-disabled={isDisabled}
              >
                {isDisabled ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Icon size={18} />
                )}
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-1">
          {/* Mobile-only: utility buttons inside sidebar */}
          <div className="lg:hidden flex flex-col gap-1 mb-2">
           
           <div ref={notifRef} className="relative">
  <button
    onClick={() => setNotifOpen((v) => !v)}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
  >
    <Bell size={18} />
    Notifications
    <span className="ml-auto text-xs bg-white/10 text-muted-foreground px-2 py-0.5 rounded-full">0</span>
  </button>

  {notifOpen && (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-muted-foreground" />
          <span className="text-sm font-semibold">Notifications</span>
        </div>
        <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground">
          <X size={14} />
        </button>
      </div>
      <div className="flex flex-col items-center gap-3 py-8 px-6 text-center">
        <div className="p-3 rounded-full bg-card border border-white/10">
          <CheckCheck size={20} className="text-muted-foreground opacity-60" />
        </div>
        <p className="text-sm font-semibold">You're all caught up!</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          No new notifications right now. We'll let you know when something arrives.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-white/10 bg-card/30">
        <p className="text-xs text-muted-foreground text-center">Notifications are enabled for your account</p>
      </div>
    </div>
  )}
</div>

            <button
              onClick={() => onToggleDarkMode(!isDarkMode)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-indigo-500" />
              )}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
             onClick={() => { navigate("/settings"); onToggle(); }}>
              <User size={18} />
              Profile
            </button>
          </div>

          {/* Divider between utility + logout */}
          <div className="lg:hidden border-t border-white/10 mb-1" />

          <button
            onClick={() => {
              logout();
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
