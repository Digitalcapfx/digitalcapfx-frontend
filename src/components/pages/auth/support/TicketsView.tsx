'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService, SupportTicket } from '@/services/support.service';
import { toast } from 'sonner';

import { TicketsSidebar } from './TicketsSidebar';
import { MessageDesk } from './MessageDesk';
import { CreateTicketModal } from './CreateTicketModal';
import { useLanguageStore } from '@/store/languageStore';

interface TicketsViewProps {
    ticketId?: string;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ ticketId }) => {
    const { t } = useLanguageStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [replyMsg, setReplyMsg] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const activeTicketId = ticketId || null;

    // Queries
    const ticketsQuery = useQuery({
        queryKey: ['ticketsList'],
        queryFn: () => supportService.getTickets()
    });

    const ticketDetailQuery = useQuery({
        queryKey: ['ticketDetails', activeTicketId],
        queryFn: () => supportService.getTicketDetails(activeTicketId!),
        enabled: !!activeTicketId
    });

    // Mutations
    const createTicketMutation = useMutation({
        mutationFn: (payload: { subject: string; category: string; message: string }) =>
            supportService.createTicket(payload),
        onSuccess: (res) => {
            toast.success(t('support.toast.createSuccess'));
            setIsCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ['ticketsList'] });
            if (res?.data?.id) {
                router.push(`/support/tickets/${res.data.id}`);
            } else {
                router.push('/support/tickets');
            }
        },
        onError: () => toast.error(t('support.toast.createError'))
    });

    const sendReplyMutation = useMutation({
        mutationFn: (payload: { id: string; msg: string }) =>
            supportService.sendTicketReply(payload.id, payload.msg),
        onSuccess: () => {
            setReplyMsg('');
            queryClient.invalidateQueries({ queryKey: ['ticketDetails', activeTicketId] });
        },
        onError: () => toast.error(t('support.toast.replyError'))
    });

    const handleCreateSubmit = (payload: { subject: string; category: string; message: string }) => {
        createTicketMutation.mutate(payload);
    };

    const handleSendReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMsg.trim() || !activeTicketId) return;
        sendReplyMutation.mutate({ id: activeTicketId, msg: replyMsg });
    };

    const ticketsList: SupportTicket[] = ticketsQuery.data?.success && Array.isArray(ticketsQuery.data.data?.tickets)
        ? ticketsQuery.data.data.tickets
        : [];

    const activeTicket = ticketDetailQuery.data?.success ? ticketDetailQuery.data.data : null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'pending':
                return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'resolved':
                return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'closed':
            default:
                return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in duration-200">
            <TicketsSidebar
                ticketsList={ticketsList}
                isLoading={ticketsQuery.isLoading}
                activeTicketId={activeTicketId}
                onOpenCreate={() => setIsCreateOpen(true)}
                getStatusColor={getStatusColor}
            />

            <MessageDesk
                activeTicketId={activeTicketId}
                activeTicket={activeTicket}
                isLoading={ticketDetailQuery.isLoading}
                replyMsg={replyMsg}
                onReplyMsgChange={setReplyMsg}
                onSendReply={handleSendReplySubmit}
                isSending={sendReplyMutation.isPending}
                getStatusColor={getStatusColor}
            />

            <CreateTicketModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
                isPending={createTicketMutation.isPending}
            />
        </div>
    );
};

export default TicketsView;
