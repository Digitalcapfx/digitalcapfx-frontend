'use client'

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Select } from "./Select";
import { Button } from "./Button";

export interface DatePickerProps {
  value: string; // Expected format: YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate years from 1920 to current year
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select Date",
  required,
  disabled,
  error,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial state date
  const parsedDate = value ? new Date(value) : null;
  const initialYear = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : currentYear;
  const initialMonth = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getMonth() : new Date().getMonth();

  const [currentViewYear, setCurrentViewYear] = useState(initialYear);
  const [currentViewMonth, setCurrentViewMonth] = useState(initialMonth);

  // Update view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentViewYear(d.getFullYear());
        setCurrentViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date for trigger button e.g., "December 3, 1990"
  const getFormattedValue = () => {
    if (!value) return "";
    const dateObj = new Date(value);
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  // Days in month logic
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentViewYear, currentViewMonth);
  const firstDayIndex = getFirstDayOfMonth(currentViewYear, currentViewMonth);

  // Pad previous month days
  const prevMonthDaysCount = firstDayIndex;
  const prevMonth = currentViewMonth === 0 ? 11 : currentViewMonth - 1;
  const prevMonthYear = currentViewMonth === 0 ? currentViewYear - 1 : currentViewYear;
  const prevMonthDaysTotal = getDaysInMonth(prevMonthYear, prevMonth);

  const prevMonthDays = Array.from({ length: prevMonthDaysCount }, (_, i) => {
    return prevMonthDaysTotal - prevMonthDaysCount + i + 1;
  });

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month days padding to make full grid lines
  const totalGridCells = 42; // 6 rows of 7 days
  const nextMonthDaysCount = totalGridCells - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  const isFutureDate = (day: number, monthOffset = 0) => {
    let targetMonth = currentViewMonth + monthOffset;
    let targetYear = currentViewYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }

    const d = new Date(targetYear, targetMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d > today;
  };

  const handleDateSelect = (day: number, monthOffset = 0) => {
    if (isFutureDate(day, monthOffset)) return;

    let targetMonth = currentViewMonth + monthOffset;
    let targetYear = currentViewYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }

    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = (targetMonth + 1).toString().padStart(2, "0");
    const formattedDate = `${targetYear}-${formattedMonth}-${formattedDay}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentViewMonth === 0) {
        setCurrentViewMonth(11);
        setCurrentViewYear(prev => prev - 1);
      } else {
        setCurrentViewMonth(prev => prev - 1);
      }
    } else {
      if (direction === "next") {
        if (!canNavigateNext()) return;
        if (currentViewMonth === 11) {
          setCurrentViewMonth(0);
          setCurrentViewYear(prev => prev + 1);
        } else {
          setCurrentViewMonth(prev => prev + 1);
        }
      }
    }
  };

  const canNavigateNext = () => {
    const today = new Date();
    const nextMonthFirst = new Date(currentViewYear, currentViewMonth + 1, 1);
    return nextMonthFirst <= today;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === currentViewMonth &&
      today.getFullYear() === currentViewYear;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getDate() === day &&
      d.getMonth() === currentViewMonth &&
      d.getFullYear() === currentViewYear;
  };

  const handleYearChange = (yearVal: string) => {
    const year = parseInt(yearVal);
    setCurrentViewYear(year);
    if (year === currentYear) {
      const thisMonth = new Date().getMonth();
      if (currentViewMonth > thisMonth) {
        setCurrentViewMonth(thisMonth);
      }
    }
  };

  const allowedMonths = MONTHS.map((m, idx) => ({
    value: idx.toString(),
    label: m.slice(0, 3)
  })).filter((_, idx) => {
    if (currentViewYear === currentYear) {
      return idx <= new Date().getMonth();
    }
    return true;
  });

  const allowedYears = YEARS.map(y => ({
    value: y.toString(),
    label: y.toString()
  }));

  return (
    <div className={cn("w-full space-y-1.5 text-left relative", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 block tracking-wide select-none">
          {label}
        </label>
      )}

      {/* Styled Input Trigger */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full h-[52px] rounded-[12px] bg-black/30 border border-white/10 px-4 text-sm text-left text-white font-sans focus:outline-none transition-all duration-200 focus:border-primary-500/80 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 flex items-center justify-between cursor-pointer",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            isOpen && "border-primary-500/80 ring-2 ring-primary-500/20",
            !value && "text-slate-500"
          )}
        >
          <span>{getFormattedValue() || placeholder}</span>
          <CalendarIcon className="h-4.5 w-4.5 text-slate-400 shrink-0 ml-2" />
        </button>
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-80 bg-[#0C1224] border border-[#131B30] rounded-2xl shadow-2xl p-4.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4.5">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Quick selectors for Month & Year using custom Select component */}
            <div className="flex items-center space-x-1.5 select-none z-50">
              <div className="w-[75px]">
                <Select
                  options={allowedMonths}
                  value={currentViewMonth.toString()}
                  onChange={(val) => setCurrentViewMonth(parseInt(val))}
                  searchable={false}
                  className="h-[32px] text-xs py-1 px-2 text-white bg-black/40 border-white/10 hover:border-slate-500/50"
                />
              </div>

              <div className="w-[85px]">
                <Select
                  options={allowedYears}
                  value={currentViewYear.toString()}
                  onChange={handleYearChange}
                  searchable={true}
                  searchPlaceholder="Year..."
                  className="h-[32px] text-xs py-1 px-2 text-white bg-black/40 border-white/10 hover:border-slate-500/50"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!canNavigateNext()}
              onClick={() => navigateMonth("next")}
              className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2 select-none">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <span key={day} className="text-[10px] font-extrabold text-slate-550 uppercase tracking-wider block py-1 font-mono">
                {day}
              </span>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous Month Days */}
            {prevMonthDays.map(day => {
              const disabledDay = isFutureDate(day, -1);
              return (
                <button
                  key={`prev-${day}`}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleDateSelect(day, -1)}
                  className="h-8 text-xs font-semibold text-slate-700 hover:text-slate-400 transition rounded-lg hover:bg-white/[0.02] cursor-pointer font-mono disabled:opacity-10 disabled:pointer-events-none"
                >
                  {day}
                </button>
              );
            })}

            {/* Current Month Days */}
            {currentMonthDays.map(day => {
              const disabledDay = isFutureDate(day, 0);
              return (
                <button
                  key={`current-${day}`}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleDateSelect(day, 0)}
                  className={cn(
                    "h-8 text-xs font-bold transition rounded-lg cursor-pointer font-mono relative disabled:opacity-10 disabled:pointer-events-none",
                    isToday(day) && "text-primary-400 after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary-500",
                    isSelected(day)
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                      : "text-slate-350 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {day}
                </button>
              );
            })}

            {/* Next Month Days */}
            {nextMonthDays.map(day => {
              const disabledDay = isFutureDate(day, 1);
              return (
                <button
                  key={`next-${day}`}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleDateSelect(day, 1)}
                  className="h-8 text-xs font-semibold text-slate-700 hover:text-slate-400 transition rounded-lg hover:bg-white/[0.02] cursor-pointer font-mono disabled:opacity-10 disabled:pointer-events-none"
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-white/[0.03] text-[10px] font-bold">
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-rose-455 hover:underline cursor-pointer h-7 text-[10px] px-2"
            >
              Clear
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={() => {
                const today = new Date();
                const formatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
                onChange(formatted);
                setIsOpen(false);
              }}
              className="text-primary-400 hover:underline cursor-pointer h-7 text-[10px] px-2"
            >
              Today
            </Button>
          </div>

        </div>
      )}

      {/* Error Output */}
      {error && typeof error === "string" && (
        <p className="text-xs text-red-500 font-semibold mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
