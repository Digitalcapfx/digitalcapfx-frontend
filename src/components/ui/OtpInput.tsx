'use client'

import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    length = 6,
    value,
    onChange,
    disabled = false,
    className,
    error = false,
}) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Focus the first input box on mount if not disabled
    useEffect(() => {
        if (!disabled) {
            inputsRef.current[0]?.focus();
        }
    }, [disabled]);

    // Ensure array is exact length
    const digits = (value || '').split('').concat(Array(length).fill('')).slice(0, length);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return; // Allow digits only

        const newDigits = [...digits];
        newDigits[idx] = val.slice(-1);
        const combined = newDigits.join('');
        onChange(combined);

        // Autofocus next box if typed
        if (val && idx < length - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;

        // Retrieve clipboard content and keep only digits
        const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(pastedText);

        // Set focus to the last pasted box or keep on index
        const focusIdx = Math.min(pastedText.length, length - 1);
        inputsRef.current[focusIdx]?.focus();
    };

    return (
        <div className="flex space-x-2.5 select-none w-fit">
            {digits.map((digit, idx) => (
                <input 
                    key={idx}
                    ref={(el) => { inputsRef.current[idx] = el }}
                    type="text"
                    maxLength={1}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={digit}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={handlePaste}
                    className={cn(
                        "w-12 h-13 sm:w-14 sm:h-14 rounded-xl bg-[#0C1224]/50 border border-white/10 text-center text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/80 transition-all font-mono disabled:opacity-50",
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                />
            ))}
        </div>
    )
}
