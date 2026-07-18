'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
}

const getLocaleSeparators = (): { group: string; decimal: string } => {
    const locale = typeof navigator !== 'undefined' ? navigator.language : undefined;
    try {
        const formatter = new Intl.NumberFormat(locale);
        const parts = formatter.formatToParts(1000.1);
        const group = parts.find(p => p.type === 'group')?.value || ',';
        const decimal = parts.find(p => p.type === 'decimal')?.value || '.';
        return { group, decimal };
    } catch (e) {
        return { group: ',', decimal: '.' };
    }
};

export const formatNumberByLocale = (valStr: string, group: string, decimal: string): string => {
    if (!valStr) return '';
    if (valStr === '.') return `0${decimal}`;

    const parts = valStr.split('.');
    const integerPartClean = parts[0].replace(/[^0-9]/g, '');
    
    let integerFormatted = '';
    for (let i = integerPartClean.length - 1, count = 0; i >= 0; i--) {
        if (count > 0 && count % 3 === 0) {
            integerFormatted = group + integerFormatted;
        }
        integerFormatted = integerPartClean[i] + integerFormatted;
        count++;
    }

    if (parts.length > 1) {
        const decimalPartClean = parts.slice(1).join('').replace(/[^0-9]/g, '').slice(0, 8);
        return `${integerFormatted}${decimal}${decimalPartClean}`;
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
    const separators = getLocaleSeparators();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const rawCursor = input.selectionStart || 0;
        const originalLength = input.value.length;

        const { group, decimal } = separators;
        
        let rawVal = input.value;
        if (group.trim() === '') {
            rawVal = rawVal.replace(/\s/g, '').replace(/\u00A0/g, '');
        } else {
            const escapedGroup = group.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            rawVal = rawVal.replace(new RegExp(escapedGroup, 'g'), '');
        }
        
        if (decimal !== '.') {
            const escapedDecimal = decimal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            rawVal = rawVal.replace(new RegExp(escapedDecimal, 'g'), '.');
        }

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

    const displayValue = formatNumberByLocale(value, separators.group, separators.decimal);
    const pattern = `[0-9${separators.group.trim() ? separators.group.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : '\\s\\u00A0'}${separators.decimal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]*`;

    return (
        <input
            {...props}
            ref={inputRef}
            type="text"
            inputMode="decimal"
            pattern={pattern}
            value={displayValue}
            onChange={handleChange}
            className={cn(className)}
        />
    );
};

export default NumberInput;
