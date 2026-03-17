import { useState } from "react";
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
  User,
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
          <h1 className="text-2xl font-bold text-foreground">Timofx</h1>
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
                    : "text-foreground hover:bg-sidebar-accent",
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
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-sidebar-accent transition-colors">
              <Bell size={18} />
              Notifications
            </button>

            <button
              onClick={() => onToggleDarkMode(!isDarkMode)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-sidebar-accent transition-colors"
            >
              {isDarkMode ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-indigo-500" />
              )}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-sidebar-accent transition-colors"
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
