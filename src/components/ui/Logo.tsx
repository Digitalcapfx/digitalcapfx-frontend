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
    onClick,
}) => {
    // 175:34 for full logo with tagline, 143:24 for compact
    const sizeMap = {
        withTagline: {
            sm: { width: 140, height: 27, imgClass: 'h-6.5 sm:h-7 w-auto' },
            md: { width: 165, height: 32, imgClass: 'h-7.5 sm:h-8 w-auto' },
            lg: { width: 190, height: 37, imgClass: 'h-9 sm:h-10 w-auto' },
        },
        compact: {
            sm: { width: 120, height: 20, imgClass: 'h-5 w-auto' },
            md: { width: 143, height: 24, imgClass: 'h-6 w-auto' },
            lg: { width: 165, height: 28, imgClass: 'h-7 sm:h-8 w-auto' },
        },
    };

    const currentSize = showTagline
        ? sizeMap.withTagline[size]
        : sizeMap.compact[size];

    const logoSrc = showTagline ? '/DFXLogo.svg' : '/DFXLogoCompact.svg';

    const logoContent = (
        <div
            className={cn("flex items-center group select-none cursor-pointer shrink-0", className)}
            onClick={onClick}
        >
            <Image
                src={logoSrc}
                alt="DigitalCap FX Logo"
                width={currentSize.width}
                height={currentSize.height}
                priority
                className={cn(currentSize.imgClass, "object-contain transition-opacity hover:opacity-95")}
            />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-flex items-center shrink-0">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default Logo;

