import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "./StatusBadge";
import { RobotActivationDetailsModal } from "./RobotActivationDetailsModal";
import { Bell, User, Sun, Moon, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: (isDark: boolean) => void;
  onSidebarToggle: () => void;
}

export function Header({
  isDarkMode,
  onToggleDarkMode,
  onSidebarToggle,
}: HeaderProps) {
  const { user } = useAuth();
  const [showRobotDetails, setShowRobotDetails] = useState(false);
  const navigate = useNavigate();
  // ✅ Remove menuOpen state — no longer needed

  return (
    <>
    
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border transition-all duration-300">
        <div className="flex items-center justify-between p-4 lg:pl-72">
          {/* Welcome text — always visible */}
          <div>
            <h2 className="text-sm text-muted-foreground transition-colors duration-300">
              Welcome back
            </h2>
            <p className="text-lg font-semibold transition-colors duration-300">
              {user?.name || "Trader"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <StatusBadge
                status={user?.robotStatus === "ACTIVE" ? "active" : "inactive"}
                clickable={user?.robotStatus === "ACTIVE"}
                onClick={() =>
                  user?.robotStatus === "ACTIVE" && setShowRobotDetails(true)
                }
              />
            )}

            {/* Desktop utility buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                className="p-2 hover:bg-card rounded-lg transition-all duration-300"
                title="Notifications"
              >
                <Bell size={20} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => onToggleDarkMode(!isDarkMode)}
                className="p-2 hover:bg-card rounded-lg transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-amber-400" />
                ) : (
                  <Moon size={20} className="text-indigo-500" />
                )}
              </button>
              <button
                className="p-2 hover:bg-card rounded-lg transition-all duration-300"
                title="Profile"
                onClick={() => {
   alert("clicked!"); 
    console.log("Current location:", window.location.pathname);
    navigate("/settings");
    console.log("navigate() called");
  }}
              >
                <User size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Mobile hamburger — opens sidebar (which now has all the buttons) */}
            <button
              onClick={onSidebarToggle}
              className="p-2 hover:bg-card rounded-lg transition-all duration-300 lg:hidden"
              title="Menu"
            >
              <Menu size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <RobotActivationDetailsModal
        isOpen={showRobotDetails}
        onClose={() => setShowRobotDetails(false)}
      />
    </>
  );
}
