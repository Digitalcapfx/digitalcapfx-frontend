'use client'

import React, { useState, useEffect, useRef } from 'react'
import RPNInput, { getCountryCallingCode, Country } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types for country select options
interface CountrySelectOption {
    value?: string;
    label: string;
}

interface CountrySelectProps {
    value?: string;
    onChange: (value?: string) => void;
    options: CountrySelectOption[];
    disabled?: boolean;
}

// Custom Country Select Dropdown
const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, options, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Filter options by search query (e.g. country name, code, or dial code)
    const filteredOptions = options.filter(opt => {
        if (!opt.value) return false;
        try {
            const dialCode = getCountryCallingCode(opt.value as Country);
            return (
                opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dialCode.includes(searchQuery) ||
                opt.value.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } catch (e) {
            return opt.label.toLowerCase().includes(searchQuery.toLowerCase());
        }
    });

    const ActiveFlag = value ? flags[value as keyof typeof flags] : null;
    const activeDialCode = value ? getCountryCallingCode(value as Country) : '';

    return (
        <div className="relative h-full flex items-center" ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 h-full hover:bg-white/5 active:bg-white/10 transition duration-200 rounded-l-[12px] text-slate-300 hover:text-white border-r border-white/10 focus:outline-none select-none shrink-0"
            >
                {ActiveFlag ? (
                    <div className="w-5 h-3.5 overflow-hidden rounded-[2px] bg-slate-800 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover">
                        <ActiveFlag title={value || ''} />
                    </div>
                ) : (
                    <span className="text-xs font-semibold">Select</span>
                )}
                {activeDialCode && (
                    <span className="text-xs font-medium text-slate-400">
                        +{activeDialCode}
                    </span>
                )}
                <ChevronDown className={cn("h-3.5 w-3.5 text-slate-500 transition-transform duration-200", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-[100%] mt-2 bg-[#0C1224] border border-white/10 rounded-xl shadow-2xl p-2.5 z-[100] w-[280px] space-y-2 select-none">
                    {/* Search Field */}
                    <div className="relative flex items-center">
                        <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search country or code..."
                            className="bg-black/40 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/55 w-full font-sans"
                        />
                    </div>

                    {/* Scrollable Items */}
                    <div className="max-h-[200px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                if (!opt.value) return null;
                                const isSelected = opt.value === value;
                                const Flag = flags[opt.value as keyof typeof flags];
                                let dialCode = '';
                                try {
                                    dialCode = getCountryCallingCode(opt.value as Country);
                                } catch (e) {}

                                return (
                                    <div 
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition font-sans flex items-center justify-between",
                                            isSelected 
                                                ? 'bg-primary-500 text-white font-bold' 
                                                : 'text-slate-350 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <div className="flex items-center space-x-2 min-w-0">
                                            {Flag && (
                                                <div className="w-4.5 h-3 overflow-hidden rounded-[1px] bg-slate-800 shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover">
                                                    <Flag title={opt.label} />
                                                </div>
                                            )}
                                            <span className="truncate max-w-[150px]">{opt.label}</span>
                                        </div>
                                        {dialCode && (
                                            <span className={cn("text-[10px] font-mono", isSelected ? "text-white" : "text-slate-500")}>
                                                +{dialCode}
                                            </span>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-3 text-xs text-slate-500 font-sans">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Custom Input Element styled to fit inside our container
const PhoneInputElement = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => (
        <input
            ref={ref}
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 px-4 text-sm text-white font-sans placeholder-slate-500 h-full"
            {...props}
        />
    )
);
PhoneInputElement.displayName = 'PhoneInputElement';

export interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string | boolean;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const PhoneInput = React.forwardRef<any, PhoneInputProps>(
    ({ value, onChange, placeholder = 'Enter phone number', label, error, required = false, disabled = false, className }, ref) => {
        return (
            <div className={cn("w-full space-y-1.5 text-left", className)}>
                {label && (
                    <label className="text-xs font-semibold text-slate-400 block tracking-wide select-none">
                        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
                    </label>
                )}
                
                <div className={cn(
                    "flex items-center bg-black/30 border border-white/10 rounded-[12px] h-[52px] w-full focus-within:border-primary-500/80 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-200 relative",
                    error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
                    disabled && "opacity-50 pointer-events-none"
                )}>
                    <RPNInput
                        ref={ref}
                        value={value}
                        onChange={(val) => onChange(val || '')}
                        placeholder={placeholder}
                        disabled={disabled}
                        defaultCountry="NG"
                        countrySelectComponent={CountrySelect}
                        inputComponent={PhoneInputElement}
                        className="flex items-center w-full h-full"
                    />
                </div>

                {error && typeof error === "string" && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

PhoneInput.displayName = 'PhoneInput';
