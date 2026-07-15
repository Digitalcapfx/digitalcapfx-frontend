'use client'

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { SupportTicket } from '@/services/support.service';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface TicketsSidebarProps {
    ticketsList: SupportTicket[];
    isLoading: boolean;
    activeTicketId: string | null;
    onOpenCreate: () => void;
    getStatusColor: (status: string) => string;
}

export const TicketsSidebar: React.FC<TicketsSidebarProps> = ({
    ticketsList,
    isLoading,
    activeTicketId,
    onOpenCreate,
    getStatusColor
}) => {
    return (
        <div className="space-y-4 flex flex-col h-full min-h-[500px]">
            <Button
                onClick={onOpenCreate}
                className="w-full rounded-xl py-3 text-xs font-bold"
                leftIcon={<Plus className="h-4 w-4" />}
            >
                Open Support Ticket
            </Button>

            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-5 shadow-xl flex-1 overflow-y-auto max-h-[500px] space-y-3">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block font-mono border-b border-white/[0.03] pb-2">Active Tickets</span>
                {isLoading ? (
                    <p className="text-xs text-slate-500 py-6 text-center">Loading tickets...</p>
                ) : ticketsList.length === 0 ? (
                    <p className="text-xs text-slate-600 py-8 text-center">No support tickets found.</p>
                ) : (
                    <div className="space-y-2">
                        {ticketsList.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/support/tickets/${ticket.id}`}
                                className={cn(
                                    "p-3.5 rounded-2xl bg-black/20 border text-left cursor-pointer transition select-none block",
                                    activeTicketId === ticket.id ? "border-primary-500 bg-primary-500/5" : "border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-white text-xs block truncate max-w-[70%]">{ticket.subject}</span>
                                    <span className={cn("text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border", getStatusColor(ticket.status))}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-555 font-semibold mt-2.5">
                                    <span className="uppercase">{ticket.category}</span>
                                    <span className="font-mono">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
