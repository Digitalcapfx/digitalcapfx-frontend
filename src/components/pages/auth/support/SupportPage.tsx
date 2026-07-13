'use client'

import React, { useState } from 'react'
import {
    HelpCircle,
    MessageSquare,
    Send,
    Plus,
    ChevronDown,
    ChevronUp,
    Loader2,
    AlertCircle,
    ExternalLink,
    Clock,
    User,
    Shield,
    Search,
    X
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supportService, FAQ, SupportTicket } from '@/services/support.service'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const SupportPage: React.FC = () => {
    const queryClient = useQueryClient();

    // Tab selector: 'faq' | 'tickets'
    const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

    // Selected ticket details
    const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
    const [replyMsg, setReplyMsg] = useState('');

    // Ticket create dialog
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        category: 'general',
        message: ''
    });

    // Queries
    const faqsQuery = useQuery({
        queryKey: ['faqs', selectedCategory],
        queryFn: () => supportService.getFAQs(selectedCategory === 'all' ? undefined : selectedCategory)
    });

    const linksQuery = useQuery({
        queryKey: ['supportLinks'],
        queryFn: () => supportService.getLinks()
    });

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
            toast.success('Support ticket created successfully!');
            setIsCreateOpen(false);
            setNewTicket({ subject: '', category: 'general', message: '' });
            queryClient.invalidateQueries({ queryKey: ['ticketsList'] });
            if (res?.data?.id) {
                setActiveTicketId(res.data.id);
            }
        },
        onError: () => toast.error('Failed to open support ticket.')
    });

    const sendReplyMutation = useMutation({
        mutationFn: (payload: { id: string; msg: string }) =>
            supportService.sendTicketReply(payload.id, payload.msg),
        onSuccess: () => {
            setReplyMsg('');
            queryClient.invalidateQueries({ queryKey: ['ticketDetails', activeTicketId] });
        },
        onError: () => toast.error('Failed to send reply message.')
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicket.subject || !newTicket.message) {
            toast.error('Subject and message fields are required.');
            return;
        }
        createTicketMutation.mutate(newTicket);
    };

    const handleSendReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMsg.trim() || !activeTicketId) return;
        sendReplyMutation.mutate({ id: activeTicketId, msg: replyMsg });
    };

    // Filter FAQs by search keyword
    const faqList: FAQ[] = faqsQuery.data?.success && Array.isArray(faqsQuery.data.data) ? faqsQuery.data.data : [];
    const filteredFAQs = faqList.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ticketsList: SupportTicket[] = ticketsQuery.data?.success && Array.isArray(ticketsQuery.data.data)
        ? ticketsQuery.data.data
        : [];

    const activeTicket = ticketDetailQuery.data?.success ? ticketDetailQuery.data.data : null;

    const categories = ['all', 'general', 'account', 'payment', 'kyc', 'technical', 'card'];

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
        <div className="space-y-6 mx-auto px-4 md:px-8 py-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
                        Support Desk
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                        Find answers to frequently asked questions or open a ticket with our compliance agents.
                    </p>
                </div>

                <div className="flex bg-black/30 border border-white/5 p-1 rounded-xl shrink-0 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={cn(
                            "flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                            activeTab === 'faq' ? "bg-primary-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                        )}
                    >
                        FAQs & Links
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={cn(
                            "flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                            activeTab === 'tickets' ? "bg-primary-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Help Tickets ({ticketsList.length})
                    </button>
                </div>
            </div>

            {/* TAB 1: FAQ ACCORDION AND EXTERNAL LINKS */}
            {activeTab === 'faq' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* FAQ listings */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-550" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search FAQs by keyword..."
                                    className="bg-[#0C1224] border border-[#131B30] rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-[#0C1224] border border-[#131B30] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-3">
                            {faqsQuery.isLoading ? (
                                <div className="py-16 flex items-center justify-center space-x-2 text-xs text-slate-500">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
                                    <span>Loading FAQ database...</span>
                                </div>
                            ) : filteredFAQs.length === 0 ? (
                                <p className="text-xs text-slate-500 py-8 text-center select-none">No FAQs found matching keyword.</p>
                            ) : (
                                filteredFAQs.map((faq) => {
                                    const isExpanded = expandedFaqId === faq.id;
                                    return (
                                        <div key={faq.id} className="border-b border-white/[0.03] last:border-b-0 pb-3 last:pb-0">
                                            <button
                                                onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                                                className="w-full flex items-center justify-between text-left py-2 font-bold text-white text-xs hover:text-primary-400 transition"
                                            >
                                                <span>{faq.question}</span>
                                                {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                                            </button>
                                            {isExpanded && (
                                                <p className="text-[11px] text-slate-400 leading-relaxed py-1.5 animate-in slide-in-from-top-1 duration-200">
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* App Links sidebar */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4">
                        <h4 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 flex items-center space-x-2">
                            <HelpCircle className="h-4.5 w-4.5 text-primary-400" />
                            <span>Quick Links</span>
                        </h4>
                        {linksQuery.isLoading ? (
                            <p className="text-xs text-slate-500 animate-pulse">Loading links...</p>
                        ) : (
                            <div className="space-y-3">
                                {linksQuery.data?.success && Array.isArray(linksQuery.data.data) && linksQuery.data.data.map(link => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 text-xs font-bold text-slate-300 hover:text-white transition group"
                                    >
                                        <span>{link.name}</span>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary-400 transition" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: SUPPORT TICKETS & MESSAGING DESK */}
            {activeTab === 'tickets' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Tickets List */}
                    <div className="space-y-4 flex flex-col h-full min-h-[500px]">
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="w-full rounded-xl py-3 text-xs font-bold"
                            leftIcon={<Plus className="h-4 w-4" />}
                        >
                            Open Support Ticket
                        </Button>

                        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-5 shadow-xl flex-1 overflow-y-auto max-h-[500px] space-y-3">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block font-mono border-b border-white/[0.03] pb-2">Active Tickets</span>
                            {ticketsQuery.isLoading ? (
                                <p className="text-xs text-slate-500 py-6 text-center">Loading tickets...</p>
                            ) : ticketsList.length === 0 ? (
                                <p className="text-xs text-slate-600 py-8 text-center">No support tickets found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {ticketsList.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            onClick={() => setActiveTicketId(ticket.id)}
                                            className={cn(
                                                "p-3.5 rounded-2xl bg-black/20 border text-left cursor-pointer transition select-none",
                                                activeTicketId === ticket.id ? "border-primary-500 bg-primary-500/5" : "border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-white text-xs block truncate max-w-[70%]">{ticket.subject}</span>
                                                <span className={cn("text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border", getStatusColor(ticket.status))}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-[9px] text-slate-500 font-semibold mt-2.5">
                                                <span className="uppercase">{ticket.category}</span>
                                                <span className="font-mono">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messaging Desk panel */}
                    <div className="lg:col-span-2 bg-[#0C1224] border border-[#131B30] rounded-3xl p-5 shadow-xl flex flex-col h-full min-h-[500px] justify-between relative">
                        {activeTicketId ? (
                            <>
                                {/* Ticket header info */}
                                <div className="border-b border-white/[0.03] pb-3 mb-3 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-satoshi font-black text-sm text-white">
                                            {activeTicket?.subject || 'Ticket Details'}
                                        </h4>
                                        <span className="text-[9.5px] text-slate-500 font-semibold block uppercase mt-0.5">
                                            Category: {activeTicket?.category}
                                        </span>
                                    </div>
                                    {activeTicket && (
                                        <span className={cn("text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border", getStatusColor(activeTicket.status))}>
                                            {activeTicket.status}
                                        </span>
                                    )}
                                </div>

                                {/* Messages Timeline feed */}
                                <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2 max-h-[350px] scrollbar-none">
                                    {ticketDetailQuery.isLoading ? (
                                        <div className="flex justify-center items-center py-20 text-xs text-slate-500 space-x-1.5">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
                                            <span>Syncing messages...</span>
                                        </div>
                                    ) : activeTicket?.messages && activeTicket.messages.length > 0 ? (
                                        activeTicket.messages.map((msg) => {
                                            const isAgent = msg.senderType === 'agent';
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex space-x-3.5 max-w-[85%]",
                                                        isAgent ? "text-left" : "text-right ml-auto flex-row-reverse space-x-reverse"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                                        isAgent ? "bg-slate-800 border-white/10 text-slate-400" : "bg-primary-500/10 border-primary-500/20 text-primary-400"
                                                    )}>
                                                        {isAgent ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className={cn(
                                                            "p-3 rounded-2xl text-xs leading-relaxed",
                                                            isAgent ? "bg-slate-850 text-slate-200 rounded-tl-none border border-white/5" : "bg-primary-500 text-white rounded-tr-none text-left"
                                                        )}>
                                                            {msg.message}
                                                        </div>
                                                        <span className="text-[8.5px] text-slate-550 font-bold font-mono block mt-0.5">
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-slate-550 text-center py-16">No messages in this ticket yet.</p>
                                    )}
                                </div>

                                {/* Reply Input bar */}
                                <form onSubmit={handleSendReplySubmit} className="mt-4 pt-3.5 border-t border-white/[0.03] flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={replyMsg}
                                        onChange={(e) => setReplyMsg(e.target.value)}
                                        placeholder="Type reply message..."
                                        disabled={sendReplyMutation.isPending || activeTicket?.status === 'closed'}
                                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 flex-1"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!replyMsg.trim() || sendReplyMutation.isPending || activeTicket?.status === 'closed'}
                                        className="w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-450 text-white flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sendReplyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center select-none space-y-3">
                                <MessageSquare className="h-9 w-9 text-slate-700" />
                                <h4 className="text-sm font-bold text-white leading-none">Support Conversation Desk</h4>
                                <p className="text-[11px] text-slate-500 max-w-xs leading-normal">
                                    Select an active support ticket from the sidebar to chat with an agent, or open a new support desk ticket.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Open Support Ticket Overlay */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-[8px] z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative space-y-5 text-left animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute top-4.5 right-4.5 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-1">
                            <h4 className="font-satoshi font-black text-base text-white flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-primary-400" />
                                <span>Create Ticket</span>
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                Briefly describe the issue. Our support team will respond shortly.
                            </p>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Subject*</label>
                                <input
                                    type="text"
                                    required
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    placeholder="e.g. Card transaction error"
                                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Category</label>
                                <select
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                    className="bg-[#0C1224] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none w-full cursor-pointer"
                                >
                                    <option value="general">General</option>
                                    <option value="account">Account</option>
                                    <option value="payment">Payment</option>
                                    <option value="kyc">KYC compliance</option>
                                    <option value="technical">Technical</option>
                                    <option value="card">Cards</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Message Details*</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newTicket.message}
                                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                    placeholder="Provide detailed logs or message content..."
                                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full resize-none font-sans"
                                />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="w-1/2 rounded-xl h-11 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={createTicketMutation.isPending}
                                    className="w-1/2 rounded-xl h-11 text-xs"
                                >
                                    {createTicketMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportPage;
