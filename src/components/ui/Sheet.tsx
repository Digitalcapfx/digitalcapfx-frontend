'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, title, description, children }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300); // Wait for slide-out animation
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop Overlay */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Slide-out Sheet Panel */}
            <div 
                className={cn(
                    "relative w-full max-w-[460px] h-full bg-[#080D1C] border-l border-white/5 shadow-2xl p-6 md:p-8 flex flex-col transition-transform duration-300 ease-out z-10 overflow-y-auto scrollbar-none",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer active:scale-95 z-20"
                >
                    <X className="h-4 w-4" />
                </button>

                {title && (
                    <div className="mb-6 space-y-1 pr-8 text-left select-none">
                        <h2 className="font-satoshi font-black text-xl text-white tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex-grow flex flex-col justify-between">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Sheet;
