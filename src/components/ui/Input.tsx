import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string | boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, success, leftIcon, rightIcon, helperText, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="text-xs font-semibold text-slate-400 block tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={currentType}
            disabled={disabled}
            className={cn(
              "w-full h-[52px] rounded-[12px] bg-black/30 border border-white/10 px-4 text-sm text-white font-sans focus:outline-none transition-all duration-200 focus:border-primary-500/80 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 placeholder-slate-500",
              leftIcon && "pl-11",
              (rightIcon || isPassword || success || error) && "pr-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              success && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20",
              className
            )}
            {...props}
          />
          
          {/* Status / Toggle Icons on the Right */}
          <div className="absolute right-4 flex items-center space-x-2">
            {error && <AlertCircle className="h-5 w-5 text-red-500" />}
            {success && !error && <Check className="h-5 w-5 text-emerald-500" />}
            {isPassword && !error && !success && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            )}
            {!isPassword && !error && !success && rightIcon && (
              <div className="text-slate-400 pointer-events-none flex items-center">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {/* Error or helper text */}
        {error && typeof error === "string" && (
          <p className="text-xs text-red-500 font-semibold mt-1 flex items-center">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
