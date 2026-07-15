'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { supportService } from '@/services/support.service';
import { cn } from '@/lib/utils';

export const SupportHeader: React.FC = () => {
    const pathname = usePathname();
    const isTicketsActive = pathname.startsWith('/support/tickets');

    const ticketsQuery = useQuery({
        queryKey: ['ticketsList'],
        queryFn: () => supportService.getTickets()
    });

    const ticketsCount = ticketsQuery.data?.success && Array.isArray(ticketsQuery.data.data?.tickets)
        ? ticketsQuery.data.data.tickets.length
        : 0;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
                    Support Desk
                </h1>
                <p className="text-slate-400 text-xs font-semibold mt-1">
                    Find answers to frequently asked questions or open a ticket with our compliance agents.
                </p>
            </div>

            <div className="flex bg-black/30 border border-white/20 p-1 rounded-xl shrink-0 w-full md:w-auto">
                <Link
                    href="/support"
                    className={cn(
                        "flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer select-none text-center",
                        !isTicketsActive ? "bg-primary-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                    )}
                >
                    FAQs & Links
                </Link>
                <Link
                    href="/support/tickets"
                    className={cn(
                        "flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer select-none text-center",
                        isTicketsActive ? "bg-primary-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                    )}
                >
                    Help Tickets ({ticketsCount})
                </Link>
            </div>
        </div>
    );
};

export default SupportHeader;
