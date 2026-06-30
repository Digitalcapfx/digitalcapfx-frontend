import React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, X, Play, PowerOff } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "verified" | "active" | "processing" | "pending" | "rejected" | "inactive" | "chip";
  active?: boolean;
  leftIcon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "active",
  active = false,
  leftIcon,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border transition-all duration-200";

  const variants = {
    verified: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    active: "bg-primary-500/10 border-primary-500/20 text-primary-400",
    processing: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    pending: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    rejected: "bg-red-500/10 border-red-500/20 text-red-400",
    inactive: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    chip: cn(
      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold cursor-pointer text-[11px] uppercase tracking-wider border transition-all duration-200",
      active
        ? "bg-primary-500/10 border-primary-500/50 text-primary-400"
        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
    ),
  };

  // Default icons for statuses if no custom icon is provided to prevent communicating status solely via color
  const defaultIcons = {
    verified: <Check className="h-3.5 w-3.5" />,
    active: <Play className="h-2.5 w-2.5 fill-current" />,
    processing: <Clock className="h-3.5 w-3.5 animate-spin" />,
    pending: <Clock className="h-3.5 w-3.5" />,
    rejected: <X className="h-3.5 w-3.5" />,
    inactive: <PowerOff className="h-3 w-3" />,
    chip: null,
  };

  const icon = leftIcon || defaultIcons[variant];

  return (
    <span
      className={cn(variant === "chip" ? variants.chip : cn(baseStyles, variants[variant]), className)}
      {...props}
    >
      {icon && <span className="flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
