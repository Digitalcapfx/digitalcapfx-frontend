'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vtuService } from '@/services/vtu.service'
import { Tabs } from '@/components/ui/Tabs'
import { toast } from 'sonner'
import { AirtimeForm } from './_components/AirtimeForm'
import { DataBundleForm } from './_components/DataBundleForm'
import { BillPaymentForm } from './_components/BillPaymentForm'
import { VtuTxHistory } from './_components/VtuTxHistory'
import { cn } from '@/lib/utils'

export const VtuPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'airtime' | 'data' | 'bill'>('airtime');
    const [currency, setCurrency] = useState<'XAF' | 'XOF'>('XAF');

    // Queries
    const txQuery = useQuery({
        queryKey: ['vtuTransactions'],
        queryFn: () => vtuService.getVtuTransactions(),
    });

    const txList = txQuery.data?.success && Array.isArray(txQuery.data.data) ? txQuery.data.data : [];

    // Purchase Mutations
    const purchaseAirtimeMutation = useMutation({
        mutationFn: (payload: any) => vtuService.purchaseAirtime(payload),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Airtime purchase request submitted successfully!');
                queryClient.invalidateQueries({ queryKey: ['vtuTransactions'] });
            } else {
                toast.error(data?.error?.message || 'Airtime purchase failed.');
            }
        },
        onError: (err: any) => {
            console.error('Airtime purchase error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to purchase airtime.');
            toast.error(msg);
        }
    });

    const purchaseDataMutation = useMutation({
        mutationFn: (payload: any) => vtuService.purchaseData(payload),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Data bundle purchase request submitted successfully!');
                queryClient.invalidateQueries({ queryKey: ['vtuTransactions'] });
            } else {
                toast.error(data?.error?.message || 'Data purchase failed.');
            }
        },
        onError: (err: any) => {
            console.error('Data purchase error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to purchase data bundle.');
            toast.error(msg);
        }
    });

    const payBillMutation = useMutation({
        mutationFn: (payload: any) => vtuService.payBill(payload),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Utility bill payment request submitted successfully!');
                queryClient.invalidateQueries({ queryKey: ['vtuTransactions'] });
            } else {
                toast.error(data?.error?.message || 'Bill payment failed.');
            }
        },
        onError: (err: any) => {
            console.error('Bill payment error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to process bill payment.');
            toast.error(msg);
        }
    });

    const handleAirtimeSubmit = (data: { phone: string; amount: number; operator: string }) => {
        purchaseAirtimeMutation.mutate({
            ...data,
            currency,
        });
    };

    const handleDataSubmit = (data: { phone: string; bundleId: string; amount: number; operator: string }) => {
        purchaseDataMutation.mutate({
            ...data,
            currency,
        });
    };

    const handleBillSubmit = (data: { accountNumber: string; amount: number; billerId: string }) => {
        payBillMutation.mutate({
            ...data,
            currency,
        });
    };

    const isPending = purchaseAirtimeMutation.isPending || purchaseDataMutation.isPending || payBillMutation.isPending;

    const tabsList = [
        { id: 'airtime', label: 'Airtime Top-up' },
        { id: 'data', label: 'Data Bundles' },
        { id: 'bill', label: 'Utility Bills' }
    ];

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-300">
            {/* Header section */}
            <div>
                <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                    Airtime & Bill Payments (VTU)
                </h1>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-sans max-w-xl">
                    Pay utility bills or top up mobile credit instantly. Direct settlement is made from your local African fiat (XAF / XOF) wallets.
                </p>
            </div>

            {/* Tab selection */}
            <div className="flex select-none">
                <Tabs 
                    tabs={tabsList}
                    activeTab={activeTab}
                    onChange={(id) => {
                        setActiveTab(id as any);
                    }}
                    className="w-full sm:w-auto grid grid-cols-3 text-center sm:inline-flex p-1 bg-[#0A0E1A] border border-white/10 rounded-2xl"
                />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form column */}
                <div className="lg:col-span-7 bg-[#0C1224] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6">
                    
                    {/* Header inside card */}
                    <div className="border-b border-white/[0.04] pb-4 flex justify-between items-center select-none">
                        <div>
                            <h3 className="text-sm font-bold text-white capitalize">
                                {activeTab} Details
                            </h3>
                            <p className="text-[10px] text-slate-555 mt-0.5">Fill in fields to proceed</p>
                        </div>
                        {/* Currency toggle */}
                        <div className="flex bg-[#070C19] rounded-xl p-0.5 border border-white/5 text-[10px] font-bold">
                            {(['XAF', 'XOF'] as const).map(curr => (
                                <button
                                    key={curr}
                                    type="button"
                                    onClick={() => setCurrency(curr)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg transition select-none cursor-pointer",
                                        currency === curr 
                                            ? "bg-primary-500 text-white shadow" 
                                            : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Render sub-components dynamically based on tab */}
                    {activeTab === 'airtime' && (
                        <AirtimeForm 
                            currency={currency}
                            isPending={isPending}
                            onSubmit={handleAirtimeSubmit}
                        />
                    )}

                    {activeTab === 'data' && (
                        <DataBundleForm 
                            currency={currency}
                            isPending={isPending}
                            onSubmit={handleDataSubmit}
                        />
                    )}

                    {activeTab === 'bill' && (
                        <BillPaymentForm 
                            currency={currency}
                            isPending={isPending}
                            onSubmit={handleBillSubmit}
                        />
                    )}

                </div>

                {/* History column */}
                <VtuTxHistory 
                    isLoading={txQuery.isLoading}
                    txList={txList}
                />

            </div>
        </div>
    );
};

export default VtuPage;
