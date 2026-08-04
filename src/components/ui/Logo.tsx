'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
    href?: string;
    showTagline?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    taglineClassName?: string;
    onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
    href = '/',
    showTagline = true,
    size = 'md',
    className,
    taglineClassName,
    onClick,
}) => {
    const sizeMap = {
        sm: { width: 140, height: 28, imgClass: 'h-7 w-auto' },
        md: { width: 160, height: 32, imgClass: 'h-8 sm:h-8 md:h-7.5 w-auto' },
        lg: { width: 180, height: 36, imgClass: 'h-9 sm:h-10 w-auto' },
    };

    const currentSize = sizeMap[size];

    const logoContent = (
        <div className={cn("flex flex-col justify-center items-start group select-none cursor-pointer", className)} onClick={onClick}>
            <Image
                src="/DFXLogo.svg"
                alt="DigitalCap FX Logo"
                width={currentSize.width}
                height={currentSize.height}
                priority
                className={cn(currentSize.imgClass, "object-contain transition-opacity hover:opacity-95")}
            />
            {showTagline && (
                <span
                    className={cn(
                        "text-[11px] sm:text-xs font-medium text-slate-300 group-hover:text-white transition-colors tracking-tight mt-1 font-sans",
                        taglineClassName
                    )}
                >
                    Your bridge to the world of payments
                </span>
            )}
        </div>
    );

    if (href) {
        return <Link href={href}>{logoContent}</Link>;
    }

    return logoContent;
};

export default Logo;
