'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    searchable = true,
    searchPlaceholder = 'Search...',
    className,
    error,
    required = false,
}) => {
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

    // Reset search when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="w-full space-y-1.5 text-left relative" ref={containerRef}>
            {label && (
                <label className="text-xs font-semibold text-slate-400 block tracking-wide select-none">
                    {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
                </label>
            )}

            {/* Select Trigger Box */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "bg-black/30 border border-white/10 rounded-[12px] px-4 py-3 text-sm text-white flex justify-between items-center cursor-pointer h-[52px] font-sans hover:border-slate-500/50 transition-all select-none",
                    isOpen && "border-primary-500/80 ring-2 ring-primary-500/20",
                    error && "border-red-500 focus:border-red-500",
                    className
                )}
            >
                <span className={selectedOption ? 'text-white font-medium' : 'text-slate-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg 
                    className={cn("h-4 w-4 fill-current text-slate-500 transition-transform duration-200", isOpen && "transform rotate-180")} 
                    viewBox="0 0 20 20"
                >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
            </div>

            {/* Dropdown Options List */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-[#0C1224] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 space-y-2 select-none">
                    {/* Search Field */}
                    {searchable && (
                        <div className="relative flex items-center">
                            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="bg-black/40 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/55 w-full font-sans"
                            />
                        </div>
                    )}

                    {/* Scrollable Items */}
                    <div className="max-h-[160px] overflow-y-auto space-y-1 pr-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <div 
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "px-3 py-2 text-xs rounded-lg cursor-pointer transition font-sans flex items-center justify-between",
                                            isSelected 
                                                ? 'bg-primary-500 text-white font-bold' 
                                                : 'text-slate-350 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                            </svg>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-3 text-xs text-slate-500 font-sans">
                                No results matching query
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error messaging */}
            {error && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}
