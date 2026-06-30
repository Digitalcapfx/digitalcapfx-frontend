import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
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
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-200",
            checked
              ? "bg-primary-500 border-primary-500 text-white"
              : "bg-transparent border-[#3E4658] hover:border-slate-400"
          )}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm font-semibold text-slate-300">{label}</span>}
    </label>
  );
};
