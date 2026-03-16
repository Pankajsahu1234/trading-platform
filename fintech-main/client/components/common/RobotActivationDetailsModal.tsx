import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GlassCard } from "./GlassCard";
import { CheckCircle, Calendar, Zap } from "lucide-react";

interface RobotActivationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activationTimestamp: string | null;   // real data from API
  expiryDate: string | null;            // real data from API
  isExpired: boolean;                   // real data from API
}

export function RobotActivationDetailsModal({
  isOpen,
  onClose,
  activationTimestamp,
  expiryDate,
  isExpired,
}: RobotActivationDetailsModalProps) {

  // Calculate days remaining from real expiry date
  const daysRemaining = expiryDate
    ? Math.max(
        Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        0
      )
    : 0;

  const progressPercentage = Math.min((daysRemaining / 365) * 100, 100);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border border-profit/30 bg-card">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle
              className={isExpired ? "text-loss" : "text-profit"}
              size={48}
            />
          </div>
          <DialogTitle
            className={`text-2xl font-bold ${isExpired ? "text-loss" : "text-profit"}`}
          >
            {isExpired ? "Robot Expired" : "Robot Activated"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isExpired
              ? "Your robot subscription has expired. Please renew."
              : "Your automated trading robot is running smoothly"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Card */}
          <GlassCard
            className={`p-4 ${isExpired ? "bg-loss/5 border border-loss/20" : "bg-profit/5 border border-profit/20"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-semibold ${isExpired ? "text-loss" : "text-profit"}`}>
                Status
              </p>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  isExpired
                    ? "bg-loss/20 text-loss border-loss/30"
                    : "bg-profit/20 text-profit border-profit/30"
                }`}
              >
                {isExpired ? "EXPIRED" : "ACTIVE"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isExpired
                ? "Your robot has stopped trading. Renew to resume."
                : "Your robot is actively trading and managing your investments 24/7"}
            </p>
          </GlassCard>

          {/* Time Remaining */}
          {!isExpired && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-amber-500" size={18} />
                  <span className="text-sm font-semibold">Time Remaining</span>
                </div>
                <span className="text-lg font-bold text-amber-400">
                  {daysRemaining} days
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Until {formatDate(expiryDate)}
              </p>
              <div className="relative h-2 bg-card border border-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Activation Details */}
          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Activated On</p>
              <p className="text-sm font-bold text-foreground">
                {formatDate(activationTimestamp)}
              </p>
            </GlassCard>
            <GlassCard className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Expires On</p>
              <p className={`text-sm font-bold ${isExpired ? "text-loss" : "text-amber-400"}`}>
                {formatDate(expiryDate)}
              </p>
            </GlassCard>
          </div>

          {/* Benefits — only show when active */}
          {!isExpired && (
            <GlassCard className="p-4 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-primary" size={18} />
                <p className="text-sm font-semibold">Current Benefits</p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  24/7 automated trading
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  Real-time market analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  Risk management enabled
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  Premium support included
                </li>
              </ul>
            </GlassCard>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 text-sm"
            >
              Close
            </button>
            {isExpired && (
              <button className="flex-1 py-2 px-3 bg-card hover:bg-card/80 border border-border text-foreground font-semibold rounded-lg transition-all duration-300 text-sm">
                Renew Plan
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}