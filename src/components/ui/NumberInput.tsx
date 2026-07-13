'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
}

export const formatNumberWithCommas = (valStr: string): string => {
    if (!valStr) return '';
    if (valStr === '.') return '0.';

    const parts = valStr.split('.');
    const integerPartClean = parts[0].replace(/,/g, '').replace(/[^0-9]/g, '');
    const integerFormatted = integerPartClean.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (parts.length > 1) {
        const decimalPartClean = parts.slice(1).join('').replace(/[^0-9]/g, '').slice(0, 8);
        return `${integerFormatted}.${decimalPartClean}`;
    }

    return integerFormatted;
};

export const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    className,
    ...props
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const rawCursor = input.selectionStart || 0;
        const originalLength = input.value.length;

        let rawVal = input.value.replace(/,/g, '');
        const dotIndex = rawVal.indexOf('.');
        if (dotIndex !== -1) {
            const beforeDot = rawVal.slice(0, dotIndex).replace(/[^0-9]/g, '');
            const afterDot = rawVal.slice(dotIndex + 1).replace(/[^0-9]/g, '');
            rawVal = beforeDot + '.' + afterDot;
        } else {
            rawVal = rawVal.replace(/[^0-9]/g, '');
        }

        onChange(rawVal);

        requestAnimationFrame(() => {
            if (inputRef.current) {
                const newLength = inputRef.current.value.length;
                const lengthDiff = newLength - originalLength;
                const newCursor = Math.max(0, rawCursor + lengthDiff);
                inputRef.current.setSelectionRange(newCursor, newCursor);
            }
        });
    };

    const displayValue = formatNumberWithCommas(value);

    return (
        <input
            {...props}
            ref={inputRef}
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={displayValue}
            onChange={handleChange}
            className={cn(className)}
        />
    );
};

export default NumberInput;
