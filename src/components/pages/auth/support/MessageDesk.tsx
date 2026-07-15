'use client'

import React from 'react';
import { MessageSquare, Loader2, Shield, User, Send } from 'lucide-react';
import { SupportTicket } from '@/services/support.service';
import { cn } from '@/lib/utils';

interface MessageDeskProps {
    activeTicketId: string | null;
    activeTicket: SupportTicket | null;
    isLoading: boolean;
    replyMsg: string;
    onReplyMsgChange: (msg: string) => void;
    onSendReply: (e: React.FormEvent) => void;
    isSending: boolean;
    getStatusColor: (status: string) => string;
}

export const MessageDesk: React.FC<MessageDeskProps> = ({
    activeTicketId,
    activeTicket,
    isLoading,
    replyMsg,
    onReplyMsgChange,
    onSendReply,
    isSending,
    getStatusColor
}) => {
    return (
        <div className="lg:col-span-2 bg-[#0C1224] border border-[#131B30] rounded-3xl p-5 shadow-xl flex flex-col h-full min-h-[500px] justify-between relative">
            {activeTicketId ? (
                <>
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

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2 max-h-[350px] scrollbar-none">
                        {isLoading ? (
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
                                                {msg.body}
                                            </div>
                                            <span className="text-[8.5px] text-slate-555 font-bold font-mono block mt-0.5">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-xs text-slate-555 text-center py-16">No messages in this ticket yet.</p>
                        )}
                    </div>

                    <form onSubmit={onSendReply} className="mt-4 pt-3.5 border-t border-white/[0.03] flex items-center space-x-3">
                        <input
                            type="text"
                            value={replyMsg}
                            onChange={(e) => onReplyMsgChange(e.target.value)}
                            placeholder="Type reply message..."
                            disabled={isSending || activeTicket?.status === 'closed'}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 flex-1"
                        />
                        <button
                            type="submit"
                            disabled={!replyMsg.trim() || isSending || activeTicket?.status === 'closed'}
                            className="w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-450 text-white flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
                        </button>
                    </form>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center select-none space-y-3">
                    <MessageSquare className="h-9 w-9 text-slate-700" />
                    <h4 className="text-sm font-bold text-white leading-none">Support Conversation Desk</h4>
                    <p className="text-[11px] text-slate-555 max-w-xs leading-normal">
                        Select an active support ticket from the sidebar to chat with an agent, or open a new support desk ticket.
                    </p>
                </div>
            )}
        </div>
    );
};
