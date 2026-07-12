'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    className
}) => {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 200); // Wait for scale transition
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200 ease-out",
                    isOpen ? "opacity-100 animate-in fade-in" : "opacity-0 animate-out fade-out"
                )}
                onClick={onClose}
            />

            {/* Modal Panel Content */}
            <div 
                className={cn(
                    "relative w-full max-w-3xl h-[80vh] bg-[#080D1C] border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col transition-all duration-200 ease-out z-10 overflow-hidden",
                    isOpen 
                        ? "opacity-100 scale-100 animate-in zoom-in-95 duration-200" 
                        : "opacity-0 scale-95 animate-out zoom-out-95 duration-200",
                    className
                )}
            >
                {/* Close Button */}
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer active:scale-95 z-20"
                >
                    <X className="h-4 w-4" />
                </button>

                {title && (
                    <div className="mb-4 space-y-1 pr-8 text-left select-none border-b border-white/5 pb-3 shrink-0">
                        <h2 className="font-satoshi font-black text-lg text-white tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex-grow overflow-hidden relative min-h-[300px]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Dialog;
