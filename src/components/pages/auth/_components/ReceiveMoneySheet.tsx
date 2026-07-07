'use client'

import React, { useState, useEffect } from 'react'
import { 
    ChevronDown, 
    Check, 
    Copy, 
    Share2, 
    QrCode
} from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { WALLETS_DATA } from '../wallet/WalletsPage'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'

// Mock bank details or crypto addresses mapped to codes
const RECEIVE_ADDRESSES: Record<string, string> = {
    USDC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    USDT: '0x455885899jjnfndnndjuud877d99',
    BTC: 'bc1qxy2kg3zv40q7cx0749gndr3s965gndr3s96',
    ETH: '0x3c44cdd3068e0e5a11702bd3068e0e5a11702bd3',
    POL: '0x8247E5C7ab88b098defB751B7401B5f6d8976F',
    SOL: 'HN7cAB1Zgp3LHcnA2RY2ydgE6G6X6bE8Ym',
    TRX: 'TY2ydgE6G6X6bE8YmHN7cAB1Zgp3LHcnA2',
    LTC: 'LgdE6G6X6bE8YmHN7cAB1Zgp3LHcnA2RY2',
    USD: 'IBAN: GB29 NMBK 8832 9012 3442 12 | SWIFT: NWBKGB2L',
    EUR: 'IBAN: DE89 3704 0044 0532 0130 00 | SWIFT: DEUTDEDD',
    GBP: 'IBAN: GB45 BARC 2020 1553 0192 88 | SWIFT: BARCGB22',
    NGN: 'Acct No: 1022883742 | Bank: Access Bank Nigeria',
    XOF: 'Acct No: 492010293049 | Bank: Bank of Africa',
    XAF: 'Acct No: 883204928104 | Bank: BGFI Bank',
};

export const ReceiveMoneySheet: React.FC = () => {
    const { isReceiveOpen, closeReceive, receiveDefaultWalletId } = useTransactionStore();

    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Sync state on opening
    useEffect(() => {
        if (isReceiveOpen) {
            setSelectedWalletId(receiveDefaultWalletId || WALLETS_DATA[0].id);
            setCopied(false);
        }
    }, [isReceiveOpen, receiveDefaultWalletId]);

    const activeWallet = WALLETS_DATA.find(w => w.id === selectedWalletId) || WALLETS_DATA[0];
    const address = RECEIVE_ADDRESSES[activeWallet.code] || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    const isCrypto = activeWallet.type === 'crypto' || activeWallet.type === 'stablecoin';

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `My ${activeWallet.code} Address`,
                text: address
            }).catch(console.error);
        } else {
            handleCopy();
            alert('Address copied to clipboard! Share it with anyone to receive payments.');
        }
    };

    return (
        <Sheet
            isOpen={isReceiveOpen}
            onClose={closeReceive}
            title="Receive"
            description="Get paid in any currency"
        >
            <div className="space-y-6 flex flex-col justify-between h-full text-left">
                
                <div className="space-y-6">
                    {/* Wallet Select Dropdown */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Select Currency</span>
                        <div className="relative">
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                            >
                                <div className="flex items-center space-x-3">
                                    <CurrencyIcon code={activeWallet.code} size="md" />
                                    <div className="text-left">
                                        <span className="font-bold text-white block text-sm leading-tight">{activeWallet.name}</span>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">{activeWallet.code} • {activeWallet.type}</span>
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                            </div>

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5">
                                    {WALLETS_DATA.map((w) => (
                                        <div
                                            key={w.id}
                                            onClick={() => {
                                                setSelectedWalletId(w.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition",
                                                selectedWalletId === w.id ? "bg-white/[0.01]" : ""
                                            )}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <CurrencyIcon code={w.code} size="md" />
                                                <div className="text-left">
                                                    <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase">{w.code} • {w.balance}</span>
                                                </div>
                                            </div>
                                            {selectedWalletId === w.id && <Check className="h-4 w-4 text-primary-400" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-center space-y-4 select-none">
                        
                        {/* Custom Vector QR Code */}
                        <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-lg relative flex items-center justify-center">
                            {/* Inner Logo overlay */}
                            <div className="absolute w-10 h-10 rounded-full bg-[#080D1C] flex items-center justify-center border-4 border-white shadow-md">
                                <CurrencyIcon code={activeWallet.code} size="sm" className="border-none shadow-none" />
                            </div>
                            
                            {/* QR SVG Grid */}
                            <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                                {/* Corners */}
                                <path d="M 0,0 L 25,0 L 25,7 L 7,7 L 7,25 L 0,25 Z M 75,0 L 100,0 L 100,25 L 93,25 L 93,7 L 75,7 Z M 0,75 L 25,75 L 25,93 L 7,93 L 7,75 L 0,75 Z M 75,93 L 100,93 L 100,75 L 93,75 L 93,93 L 75,93 Z" />
                                <path d="M 12,12 L 25,12 L 25,25 L 12,25 Z M 75,12 L 88,12 L 88,25 L 75,25 Z M 12,75 L 25,75 L 25,88 L 12,88 Z" />
                                {/* Grid Dots */}
                                <circle cx="35" cy="18" r="3" />
                                <circle cx="50" cy="18" r="3" />
                                <circle cx="62" cy="18" r="3" />
                                <circle cx="35" cy="35" r="3" />
                                <circle cx="50" cy="35" r="3" />
                                <circle cx="62" cy="35" r="3" />
                                <circle cx="35" cy="50" r="3" />
                                <circle cx="50" cy="50" r="3" />
                                <circle cx="62" cy="50" r="3" />
                                <circle cx="35" cy="62" r="3" />
                                <circle cx="50" cy="62" r="3" />
                                <circle cx="62" cy="62" r="3" />
                                <circle cx="18" cy="35" r="3" />
                                <circle cx="18" cy="50" r="3" />
                                <circle cx="18" cy="62" r="3" />
                                <circle cx="82" cy="35" r="3" />
                                <circle cx="82" cy="50" r="3" />
                                <circle cx="82" cy="62" r="3" />
                                <circle cx="35" cy="82" r="3" />
                                <circle cx="50" cy="82" r="3" />
                                <circle cx="62" cy="82" r="3" />
                            </svg>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">
                                Your {activeWallet.code} {isCrypto ? 'address' : 'bank details'}
                            </span>
                        </div>
                    </div>

                    {/* Address Text Field Input */}
                    <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-xl px-4 py-3 font-mono text-xs text-slate-350 select-text">
                        <span className="truncate mr-3 leading-relaxed">
                            {address}
                        </span>
                        <button 
                            onClick={handleCopy}
                            className="text-slate-500 hover:text-white transition duration-200 cursor-pointer shrink-0"
                        >
                            {copied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
                        </button>
                    </div>
                </div>

                {/* Share Button CTA */}
                <button
                    onClick={handleShare}
                    className="w-full bg-primary-500 hover:bg-primary-450 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98] mt-auto select-none"
                >
                    <Share2 className="h-4.5 w-4.5" />
                    <span>Share Address</span>
                </button>
            </div>
        </Sheet>
    );
};

export default ReceiveMoneySheet;
