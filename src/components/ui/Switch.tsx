import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label
      className={cn(
        "inline-flex items-center space-x-3 select-none cursor-pointer",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-all duration-200 border",
            checked
              ? "bg-primary-500 border-primary-500"
              : "bg-[#252F48] border-transparent"
          )}
        />
        <div
          className={cn(
            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
      {label && <span className="text-sm font-semibold text-slate-300">{label}</span>}
    </label>
  );
};
