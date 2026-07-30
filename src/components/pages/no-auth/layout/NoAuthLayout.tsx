'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import NavBar from './NavBar'
import SubPageNavbar from './SubPageNavbar'

const SUB_PAGE_PREFIXES = [
    '/about',
    '/about-us',
    '/careers',
    '/blog',
    '/press-kit',
    '/press',
    '/contact',
    '/contact-us',
    '/privacy',
    '/terms',
    '/help',
    '/status',
    '/community',
    '/partners',
    '/licenses',
    '/aml',
]

const NoAuthLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const isSubPage = SUB_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))

    return (
        <div className="bg-[#050816] min-h-screen flex flex-col w-full max-w-full overflow-x-clip">
            {isSubPage ? <SubPageNavbar /> : <NavBar />}
            <main className="flex-1 w-full max-w-full">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default NoAuthLayout