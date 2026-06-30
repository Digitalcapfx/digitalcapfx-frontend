'use client';

import React, { useState, useEffect } from 'react';
import { useWebStore, BalanceMatrix } from '@/store/useWebStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
import { Checkbox } from '@/components/ui/Checkbox';
import { 
  ShieldCheck, 
  Globe, 
  UserCheck, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Coins,
  Sun,
  Moon,
  Search
} from 'lucide-react';

const WAEMU_CEMAC_COUNTRIES = [
  { code: 'SN', name: 'Senegal (WAEMU)', zone: 'WAEMU' },
  { code: 'CI', name: 'Ivory Coast (WAEMU)', zone: 'WAEMU' },
  { code: 'CM', name: 'Cameroon (CEMAC)', zone: 'CEMAC' },
  { code: 'GA', name: 'Gabon (CEMAC)', zone: 'CEMAC' },
  { code: 'TG', name: 'Togo (WAEMU)', zone: 'WAEMU' },
  { code: 'BJ', name: 'Benin (WAEMU)', zone: 'WAEMU' },
  { code: 'BF', name: 'Burkina Faso (WAEMU)', zone: 'WAEMU' },
  { code: 'CG', name: 'Congo-Brazzaville (CEMAC)', zone: 'CEMAC' },
];

export default function Home() {
  const { balances, activeCurrency, kyc, setActiveCurrency, updateKYC, setBalances } = useWebStore();
  const [kycProgress, setKycProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allocatedAddress, setAllocatedAddress] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('100');

  // Theme Toggle Logic
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sandbox states
  const [sandboxTab, setSandboxTab] = useState('Overview');
  const [sandboxActiveChip, setSandboxActiveChip] = useState('USD');
  const [sandbox2FA, setSandbox2FA] = useState(true);
  const [sandboxEmailNotif, setSandboxEmailNotif] = useState(false);
  const [sandboxAutoConvert, setSandboxAutoConvert] = useState(true);
  const [sandboxTerms, setSandboxTerms] = useState(true);
  const [sandboxKYB, setSandboxKYB] = useState(false);
  const [sandboxRecurring, setSandboxRecurring] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  // Rates relative to XOF
  const rates = {
    XOF: 1,
    XAF: 1,
    EUR: 0.0015,
    USD: 0.0016,
    GBP: 0.0013,
    USDT: 0.0016,
    USDC: 0.0016,
  };

  const handleNextStep = () => {
    if (kyc.step === 'country_selection' && kyc.selectedCountry) {
      updateKYC({ step: 'document_upload' });
      setKycProgress(33);
    } else if (kyc.step === 'document_upload' && kyc.documentType) {
      updateKYC({ step: 'selfie_scan' });
      setKycProgress(66);
    } else if (kyc.step === 'selfie_scan') {
      updateKYC({ step: 'verifying', verificationStatus: 'pending' });
      setKycProgress(90);
      setLoading(true);
      setTimeout(() => {
        updateKYC({ step: 'completed', verificationStatus: 'success' });
        setKycProgress(100);
        setLoading(false);
      }, 3000);
    }
  };

  const handleResetKyc = () => {
    updateKYC({
      step: 'country_selection',
      selectedCountry: '',
      documentType: null,
      verificationStatus: 'idle',
    });
    setKycProgress(0);
  };

  const triggerRachFinanceAddress = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate generating deposit address mapped to transaction ID
      const randomAddress = '0x' + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setAllocatedAddress(randomAddress);
      setLoading(false);
    }, 1500);
  };

  const handleSimulateDeposit = () => {
    if (!allocatedAddress) return;
    const amountNum = parseFloat(depositAmount) || 0;
    if (amountNum <= 0) return;

    setLoading(true);
    setTimeout(() => {
      // Crediting account
      setBalances({
        USDT: balances.USDT + amountNum,
        XOF: balances.XOF + Math.round(amountNum * 615), // Lock rate conversion
      });
      setAllocatedAddress(null);
      setLoading(false);
      alert(`Success! Credited ${amountNum} USDT and settled equivalent XOF.`);
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Top Navigation */}
      <header className="border-b border-border/80 glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
            <Coins className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">NOE<span className="text-emerald-400">-BANK</span></h1>
            <span className="text-xs text-slate-400">Web Portal v3.3</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">WAEMU & CEMAC Compliant</span>
          </div>
          <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">Dev Sandbox</span>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg glass-button flex items-center justify-center text-slate-300 hover:text-white transition duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Balance Matrix & Rach Finance (lg:col-span-5) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Multi-Currency Balances Matrix */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-200">Unified Balance Ledger</h3>
                <p className="text-xs text-slate-400">Multi-currency balance matrix context</p>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(balances).map(([curr, val]) => (
                <button
                  key={curr}
                  onClick={() => setActiveCurrency(curr as keyof BalanceMatrix)}
                  className={`p-4 rounded-xl text-left transition-all relative overflow-hidden group ${
                    activeCurrency === curr 
                      ? 'bg-emerald-500/10 border-emerald-500/30 border' 
                      : 'bg-white/5 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs text-slate-400 tracking-wider">{curr}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      ['USDT', 'USDC'].includes(curr) 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {['USDT', 'USDC'].includes(curr) ? 'Crypto' : 'Fiat'}
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {val.toLocaleString(undefined, { minimumFractionDigits: curr === 'XOF' || curr === 'XAF' ? 0 : 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    ≈ {Math.round(val / rates[curr as keyof BalanceMatrix]).toLocaleString()} XOF
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rach Finance Web3 Portal Integration */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-200">Rach Finance Pipeline</h3>
                <p className="text-xs text-slate-400">Stablecoin address allocation & settlement</p>
              </div>
              <Globe className="h-5 w-5 text-emerald-400" />
            </div>

            {!allocatedAddress ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Generate a unique, single-use ERC-20 deposition address to credit your fiat balance instantly upon payment detection.
                </p>
                <Button
                  onClick={triggerRachFinanceAddress}
                  isLoading={loading}
                  variant="primary"
                  className="w-full text-sm font-bold"
                  rightIcon={!loading && <ArrowRight className="h-4 w-4" />}
                >
                  {loading ? 'Requesting Rach API...' : 'Allocate Deposit Address'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded border border-white/10 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold block">DEPOSIT ERC-20 ADDRESS (USDT/USDC)</span>
                  <code className="text-xs text-emerald-400 break-all block font-mono bg-black/40 p-2 rounded">
                    {allocatedAddress}
                  </code>
                </div>

                <div className="flex items-end space-x-2 w-full">
                  <Input
                    label="Simulate Deposit Value (USDT)"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    onClick={handleSimulateDeposit}
                    isLoading={loading}
                    variant="primary"
                    className="h-[52px] px-6"
                  >
                    Credit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column - KYC Compliance Gateway (lg:col-span-7) */}
        <section className="lg:col-span-7">
          <div className="glass-panel p-8 space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-border pb-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Compliance Gateway</span>
                <h2 className="text-2xl font-bold text-white">Identity & Credentials Verification</h2>
                <p className="text-sm text-slate-400">Smile Identity / Onfido regional check hub</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>

            {/* Warning block - Zero Nigeria Compliance */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 block">Zero-Nigeria Isolation Rule Enforced</span>
                <p>
                  As mandated by WAEMU/CEMAC regional regulators, this compliance stack isolates and excludes query flows to Nigerian verification services (BVN, NIN). Verification documents are restricted to official regional IDs.
                </p>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Progress</span>
                <span className="text-emerald-400 font-mono">{kycProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${kycProgress}%` }}
                ></div>
              </div>
            </div>

            {/* KYC Step UI Switcher */}
            <div className="min-h-[220px] flex flex-col justify-between">
              
              {/* Step 1: Country selection */}
              {kyc.step === 'country_selection' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 block">
                      Select Country of Residence
                    </label>
                    <select
                      value={kyc.selectedCountry}
                      onChange={(e) => updateKYC({ selectedCountry: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="" disabled className="bg-slate-900">Choose country...</option>
                      {WAEMU_CEMAC_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-slate-900">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-slate-400">
                    If your sovereign country is not listed, onboarding must occur via high-value institutional offline processing.
                  </p>
                </div>
              )}

              {/* Step 2: Document selection */}
              {kyc.step === 'document_upload' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300">Select Document Type</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {(['passport', 'id_card', 'electoral_card'] as const).map((doc) => (
                      <button
                        key={doc}
                        onClick={() => updateKYC({ documentType: doc })}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          kyc.documentType === doc 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <Upload className="h-5 w-5 mx-auto mb-2" />
                        <span className="text-xs font-semibold block capitalize">
                          {doc.replace('_', ' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Selfie scan */}
              {kyc.step === 'selfie_scan' && (
                <div className="space-y-4 text-center py-6">
                  <div className="h-28 w-28 mx-auto border-2 border-dashed border-emerald-500/50 rounded-full flex items-center justify-center bg-emerald-500/5">
                    <UserCheck className="h-10 w-10 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200">Biometric Verification Core</h3>
                    <p className="text-xs text-slate-400">
                      We will trigger the web interface checker to capture a facial scan matching your document.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Verification process */}
              {kyc.step === 'verifying' && (
                <div className="text-center py-8 space-y-4">
                  <RefreshCw className="h-12 w-12 text-emerald-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-200">Analyzing Credentials</h3>
                    <p className="text-xs text-slate-400">
                      Validating passport security marks against CEMAC state databases...
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Completed state */}
              {kyc.step === 'completed' && (
                <div className="text-center py-8 space-y-4">
                  <div className="bg-emerald-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">KYC Verification Succeeded</h3>
                    <p className="text-xs text-slate-400">
                      Your identity credentials were approved by BCEAO regulatory guidelines.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3 pt-6 border-t border-white/5">
                {kyc.step !== 'completed' && kyc.step !== 'verifying' && (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (kyc.step === 'country_selection' && !kyc.selectedCountry) ||
                      (kyc.step === 'document_upload' && !kyc.documentType)
                    }
                    variant="primary"
                    className="flex-1"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Proceed Next
                  </Button>
                )}

                {kyc.step === 'completed' && (
                  <Button
                    onClick={handleResetKyc}
                    variant="secondary"
                    className="flex-1"
                  >
                    Reset & Restart Verification
                  </Button>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* Component Sandbox Showcase */}
        <section className="col-span-full border-t border-white/10 pt-10 mt-10 space-y-8">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Design System Showcase</h2>
            <p className="text-xs text-slate-400">Interactive preview of reusable UI components in both Dark and Light mode contexts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs Panel */}
            <div className="glass-panel p-6 space-y-6">
              <h3 className="font-semibold text-base text-slate-200 border-b border-white/5 pb-2 font-satoshi">Inputs</h3>
              <div className="space-y-4">
                <Input label="Email address" placeholder="Enter your email" />
                <Input label="Email address" defaultValue="hello@digitalcapfx.com" success />
                <Input label="Amount" placeholder="0.00" leftIcon={<span className="text-xs font-bold text-slate-500 font-mono">USD</span>} error="This field is required" />
                <Input label="Password" type="password" placeholder="Enter password" />
                <Input label="Search Input" placeholder="Search transactions, accounts..." leftIcon={<Search className="h-4 w-4" />} />
              </div>
            </div>

            {/* Badges, Tabs, Switches, Checkboxes Panel */}
            <div className="space-y-6">
              {/* Badges & Chips */}
              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-semibold text-base text-slate-200 border-b border-white/5 pb-2 font-satoshi">Badges & Chips</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Status Badges</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="verified">Verified</Badge>
                      <Badge variant="active">Active</Badge>
                      <Badge variant="processing">Processing</Badge>
                      <Badge variant="pending">Pending</Badge>
                      <Badge variant="rejected">Rejected</Badge>
                      <Badge variant="inactive">Inactive</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Selectable Chips</span>
                    <div className="flex flex-wrap gap-2">
                      {['USD', 'EUR', 'GBP', 'USDT', 'BTC', 'ETH'].map((c) => (
                        <Badge
                          key={c}
                          variant="chip"
                          active={sandboxActiveChip === c}
                          onClick={() => setSandboxActiveChip(c)}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-semibold text-base text-slate-200 border-b border-white/5 pb-2 font-satoshi">Tabs</h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Pill Tabs (Section switcher)</span>
                    <Tabs
                      variant="pill"
                      activeTab={sandboxTab}
                      onChange={setSandboxTab}
                      tabs={[
                        { id: 'Overview', label: 'Overview' },
                        { id: 'Transactions', label: 'Transactions' },
                        { id: 'Analytics', label: 'Analytics' },
                        { id: 'Settings', label: 'Settings' }
                      ]}
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-2">Underline Tabs (Top navigation)</span>
                    <Tabs
                      variant="underline"
                      activeTab={sandboxTab}
                      onChange={setSandboxTab}
                      tabs={[
                        { id: 'Overview', label: 'Overview' },
                        { id: 'Transactions', label: 'Transactions' },
                        { id: 'Analytics', label: 'Analytics' },
                        { id: 'Settings', label: 'Settings' }
                      ]}
                    />
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-xs border border-white/5">
                    Active Sandbox Tab: <span className="font-bold text-primary-400">{sandboxTab}</span>
                  </div>
                </div>
              </div>

              {/* Switches & Checkboxes */}
              <div className="glass-panel p-6 space-y-6">
                <h3 className="font-semibold text-base text-slate-200 border-b border-white/5 pb-2 font-satoshi">Switches & Checkboxes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <span className="text-xs text-slate-400 font-semibold block">Toggle Switches</span>
                    <div className="flex flex-col space-y-3">
                      <Switch checked={sandbox2FA} onChange={setSandbox2FA} label="Enable 2FA authentication" />
                      <Switch checked={sandboxEmailNotif} onChange={setSandboxEmailNotif} label="Email notifications" />
                      <Switch checked={sandboxAutoConvert} onChange={setSandboxAutoConvert} label="Auto-convert FX on receipt" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs text-slate-400 font-semibold block">Checkboxes</span>
                    <div className="flex flex-col space-y-3">
                      <Checkbox checked={sandboxTerms} onChange={setSandboxTerms} label="Accept terms of service" />
                      <Checkbox checked={sandboxKYB} onChange={setSandboxKYB} label="KYB documentation complete" />
                      <Checkbox checked={sandboxRecurring} onChange={setSandboxRecurring} label="Recurring FX enabled" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
