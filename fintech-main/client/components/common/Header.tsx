import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "./StatusBadge";
import { RobotActivationDetailsModal } from "./RobotActivationDetailsModal";
import { Bell, User, Sun, Moon, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { robotService, RobotStatus } from "@/services/robotService"; // ADD

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
    const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null); // ADD
  const navigate = useNavigate();
  // ✅ Remove menuOpen state — no longer needed


  //   // ADD - fetch real robot status when user is active
  useEffect(() => {
    if (user?.robotStatus === "active" || user?.robotStatus === "ACTIVE") {
      robotService.getStatus()
        .then(status => setRobotStatus(status))
        .catch(err => console.error("Failed to fetch robot status:", err));
    }
  }, [user?.robotStatus]);

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
                navigate("/settings");  }}
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

      {/* <RobotActivationDetailsModal
        isOpen={showRobotDetails}
        onClose={() => setShowRobotDetails(false)} 
        activationTimestamp={""} 
        expiryDate={""} isExpired={false}      /> */}
             <RobotActivationDetailsModal
        isOpen={showRobotDetails}
        onClose={() => setShowRobotDetails(false)}
        activationTimestamp={robotStatus?.activation_timestamp ?? null}
        expiryDate={robotStatus?.expiry_date ?? null}
        isExpired={robotStatus?.isExpired ?? false} />
    </>
  );
}



















// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { StatusBadge } from "./StatusBadge";
// import { RobotActivationDetailsModal } from "./RobotActivationDetailsModal";
// import { Bell, User, Sun, Moon, Menu } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface HeaderProps {
//   isDarkMode: boolean;
//   onToggleDarkMode: (isDark: boolean) => void;
//   onSidebarToggle: () => void;
// }

// export function Header({
//   isDarkMode,
//   onToggleDarkMode,
//   onSidebarToggle,
// }: HeaderProps) {
//   const { user } = useAuth();
//   const [showRobotDetails, setShowRobotDetails] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <>
//       <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border transition-all duration-300">
//         <div className="flex items-center justify-between p-4 lg:pl-72">
          
//           {/* Welcome text */}
//           <div>
//             <h2 className="text-sm text-muted-foreground transition-colors duration-300">
//               Welcome back
//             </h2>

//             {/* ✅ CLICKABLE USER NAME */}
//             <p
//               onClick={() => navigate("/")} 
//               className="text-lg font-semibold transition-colors duration-300 cursor-pointer hover:text-primary"
//               title="Go to Home"
//             >
//               {user?.name || "Trader"}
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             {user && (
//               <StatusBadge
//                 status={user?.robotStatus === "ACTIVE" ? "active" : "inactive"}
//                 clickable={user?.robotStatus === "ACTIVE"}
//                 onClick={() =>
//                   user?.robotStatus === "ACTIVE" && setShowRobotDetails(true)
//                 }
//               />
//             )}

//             {/* Desktop buttons */}
//             <div className="hidden lg:flex items-center gap-4">
//               <button
//                 className="p-2 hover:bg-card rounded-lg transition-all duration-300"
//                 title="Notifications"
//               >
//                 <Bell size={20} className="text-muted-foreground" />
//               </button>

//               <button
//                 onClick={() => onToggleDarkMode(!isDarkMode)}
//                 className="p-2 hover:bg-card rounded-lg transition-all duration-300"
//               >
//                 {isDarkMode ? (
//                   <Sun size={20} className="text-amber-400" />
//                 ) : (
//                   <Moon size={20} className="text-indigo-500" />
//                 )}
//               </button>

//               <button
//                 className="p-2 hover:bg-card rounded-lg transition-all duration-300"
//                 title="Profile"
//                 onClick={() => {
//                   navigate("/settings");
//                 }}
//               >
//                 <User size={20} className="text-muted-foreground" />
//               </button>
//             </div>

//             {/* Mobile menu button */}
//             <button
//               onClick={onSidebarToggle}
//               className="p-2 hover:bg-card rounded-lg transition-all duration-300 lg:hidden"
//               title="Menu"
//             >
//               <Menu size={20} className="text-muted-foreground" />
//             </button>
//           </div>
//         </div>
//       </header>

//       <RobotActivationDetailsModal
//         isOpen={showRobotDetails}
//         onClose={() => setShowRobotDetails(false)}
//       />
//     </>
//   );
// }



















// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { StatusBadge } from "./StatusBadge";
// import { RobotActivationDetailsModal } from "./RobotActivationDetailsModal";
// import { Bell, User, Sun, Moon } from "lucide-react";
// import { robotService, RobotStatus } from "@/services/robotService"; // ADD

// interface HeaderProps {
//   isDarkMode: boolean;
//   onToggleDarkMode: (isDark: boolean) => void;
// }

// export function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
//   const { user } = useAuth();
//   const [showRobotDetails, setShowRobotDetails] = useState(false);
//   const [robotStatus, setRobotStatus] = useState<RobotStatus | null>(null); // ADD

//   // ADD - fetch real robot status when user is active
//   useEffect(() => {
//     if (user?.robotStatus === "active" || user?.robotStatus === "ACTIVE") {
//       robotService.getStatus()
//         .then(status => setRobotStatus(status))
//         .catch(err => console.error("Failed to fetch robot status:", err));
//     }
//   }, [user?.robotStatus]);

//   return (
//     <>
//       <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border transition-all duration-300">
//         <div className="flex items-center justify-between p-4 lg:pl-72">
//           <div>
//             <h2 className="text-sm text-muted-foreground transition-colors duration-300">Welcome back</h2>
//             <p className="text-lg font-semibold transition-colors duration-300">{user?.name || "Trader"}</p>
//           </div>

//           <div className="flex items-center gap-4">
//             {user && (
//               <StatusBadge
//                 status={user?.robotStatus === "ACTIVE" ? "active" : "inactive"}
//                 clickable={user?.robotStatus === "ACTIVE"}
//                 onClick={() => user?.robotStatus === "ACTIVE" && setShowRobotDetails(true)}
//               />
//             )}

//             <button className="p-2 hover:bg-card rounded-lg transition-all duration-300" title="Notifications">
//               <Bell size={20} className="text-muted-foreground transition-colors duration-300" />
//             </button>

//             <button
//               onClick={() => onToggleDarkMode(!isDarkMode)}
//               className="p-2 hover:bg-card rounded-lg transition-all duration-300"
//               title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
//             >
//               {isDarkMode ? (
//                 <Sun size={20} className="text-amber-400 transition-colors duration-300" />
//               ) : (
//                 <Moon size={20} className="text-indigo-500 transition-colors duration-300" />
//               )}
//             </button>

//             <button className="p-2 hover:bg-card rounded-lg transition-all duration-300" title="Profile">
//               <User size={20} className="text-muted-foreground transition-colors duration-300" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* UPDATED - pass real data as props */}
//       <RobotActivationDetailsModal
//         isOpen={showRobotDetails}
//         onClose={() => setShowRobotDetails(false)}
//         activationTimestamp={robotStatus?.activation_timestamp ?? null}
//         expiryDate={robotStatus?.expiry_date ?? null}
//         isExpired={robotStatus?.isExpired ?? false}
//       />
//     </>
//   );
// }