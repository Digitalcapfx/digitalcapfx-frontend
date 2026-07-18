import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "pill",
  className,
}) => {
  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex p-1 bg-[#0A0E1A] border border-white/20 rounded-2xl",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 select-none focus:outline-none",
                isActive
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/10"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div className={cn("flex space-x-6 border-b border-white/5", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-1 pb-4 text-sm font-semibold transition-all duration-200 select-none border-b-2 -mb-[1px] focus:outline-none",
              isActive
                ? "border-primary-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-white/10"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
