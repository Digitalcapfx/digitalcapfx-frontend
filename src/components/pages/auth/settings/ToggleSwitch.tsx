'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
        <button
            type="button"
            onClick={onChange}
            className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-primary-500" : "bg-slate-800"
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    checked ? "translate-x-4" : "translate-x-0"
                )}
            />
        </button>
    );
};

export default ToggleSwitch;
