'use client'

import React, { useState, useEffect } from 'react'
import { Check, Clock, Upload, RefreshCw, FileText, AlertCircle, Shield, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import { getCountries } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import { kycService } from '@/services/kyc.service'

const enLabels = en as Record<string, string>;
const NATIONALITY_OPTIONS: SelectOption[] = getCountries()
    .map((countryCode) => ({
        value: enLabels[countryCode] || countryCode,
        label: enLabels[countryCode] || countryCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const VerificationTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [accountType, setAccountType] = useState<'individual' | 'business'>('individual');

    // Retrieve account type from token or localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const accType = getCookie('account_type');
            if (accType === 'business' || accType === 'individual') {
                setAccountType(accType);
            } else {
                const localType = localStorage.getItem('account_type');
                if (localType === 'business' || localType === 'individual') {
                    setAccountType(localType);
                }
            }
        }
    }, []);

    // React Query Queries
    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
    });

    const kycStatusQuery = useQuery({
        queryKey: ['kycStatus'],
        queryFn: () => kycService.getKycStatus(),
    });

    // Form state (synced with queries on success via useEffect)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [jobTitle, setJobTitle] = useState('Director');

    useEffect(() => {
        if (profileQuery.data?.success && profileQuery.data?.data) {
            const p = profileQuery.data.data;
            setFirstName(p.first_name || '');
            setLastName(p.last_name || '');
            setDob(p.date_of_birth || '');
            setNationality(p.nationality || '');
            setPhoneNumber(p.phone_number || '');
        }
    }, [profileQuery.data]);

    // Document upload state
    const [files, setFiles] = useState<{
        incorporation: File | null;
        address: File | null;
        govId: File | null;
    }>({
        incorporation: null,
        address: null,
        govId: null
    });
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (type: 'incorporation' | 'address' | 'govId', file: File | null) => {
        if (!file) return;
        const newFiles = { ...files, [type]: file };
        setFiles(newFiles);
        const count = Object.values(newFiles).filter(Boolean).length;
        setUploadProgress(count);
    };

    // React Query Verification Submit Mutation
    const submitVerificationMutation = useMutation({
        mutationFn: async () => {
            // 1. Update Profile (Names, DOB, Nationality)
            await profileService.updateProfile({
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dob,
                nationality: nationality
            });

            // 2. Submit Documents
            const docUploads = [];
            if (files.incorporation) {
                docUploads.push(kycService.submitDocument({
                    doc_type: 'proof_of_address',
                    doc_url: `https://storage.googleapis.com/digitalfx-kyc-dev/${files.incorporation.name}`
                }));
            }
            if (files.address) {
                docUploads.push(kycService.submitDocument({
                    doc_type: 'proof_of_address',
                    doc_url: `https://storage.googleapis.com/digitalfx-kyc-dev/${files.address.name}`
                }));
            }
            if (files.govId) {
                docUploads.push(kycService.submitDocument({
                    doc_type: 'passport',
                    doc_url: `https://storage.googleapis.com/digitalfx-kyc-dev/${files.govId.name}`
                }));
            }
            await Promise.all(docUploads);
        },
        onSuccess: () => {
            toast.success('Verification details and documents submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (err: any) => {
            console.error('Submit verification error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || 'Verification submission failed.');
            toast.error(msg);
        }
    });

    const handleVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitVerificationMutation.mutate();
    };

    const isPageLoading = profileQuery.isLoading || kycStatusQuery.isLoading;
    const kycStatus = kycStatusQuery.data?.data?.status || 'idle';

    if (isPageLoading) {
        return (
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <RefreshCw className="h-8 w-8 text-primary-400 animate-spin" />
                <span className="text-xs font-bold text-slate-500 mt-3 select-none">Retrieving profile verification details...</span>
            </div>
        );
    }

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 md:p-8 shadow-xl text-left">
            {/* Business Verification Form (Unsubmitted/Idle/Rejected) */}
            {accountType === 'business' && kycStatus !== 'pending' && kycStatus !== 'approved' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 select-none">
                            Business Verification Onboarding
                        </h3>
                        <span className="text-[9px] font-bold text-slate-555 tracking-[0.15em] uppercase block mt-3 select-none font-mono">
                            Complete owner details and upload compliance documents to activate account limits.
                        </span>
                    </div>

                    {kycStatus === 'rejected' && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-450 font-sans flex items-start space-x-3 select-none font-sans text-slate-450">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
                            <div>
                                <h5 className="font-bold text-white">Application Rejected</h5>
                                <p className="mt-1 leading-relaxed text-slate-400">
                                    Your previously submitted documents could not be verified. Please review director details and upload clear, valid documents below.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                        {/* Section 1: Signatory details */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono block">
                                1. Owner / Director Details
                            </span>
                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    required
                                    label="First name*"
                                    placeholder="Peter"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Input 
                                    required
                                    label="Last name*"
                                    placeholder="Adeyemi"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    required
                                    type="text"
                                    label="Job title*"
                                    placeholder="Chief Financial Officer"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                                <Input 
                                    required
                                    type="date"
                                    label="Date of birth*"
                                    placeholder="YYYY-MM-DD"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </div>

                            <Select 
                                required
                                label="Nationality*"
                                placeholder="Select nationality..."
                                value={nationality}
                                onChange={setNationality}
                                options={NATIONALITY_OPTIONS}
                            />

                            <PhoneInput 
                                required
                                label="Phone number*"
                                placeholder="Enter phone number"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                            />
                        </div>

                        {/* Section 2: Documents upload */}
                        <div className="space-y-4 pt-4 border-t border-white/[0.03]">
                            <div className="flex justify-between items-center select-none">
                                <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono">
                                    2. Upload Documents
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                                    Progress: {uploadProgress}/3
                                </span>
                            </div>

                            {/* Certificate of Incorporation */}
                            <div className="p-5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition duration-200 bg-black/15 flex justify-between items-center">
                                <div className="space-y-1 text-left">
                                    <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-primary-400" />
                                        <span>Certificate of Incorporation*</span>
                                    </h4>
                                    <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                                        {files.incorporation ? files.incorporation.name : 'Official document proving your company\'s legal existence.'}
                                    </p>
                                </div>
                                <label className="cursor-pointer shrink-0">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) => handleFileChange('incorporation', e.target.files?.[0] || null)}
                                    />
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition flex items-center space-x-1.5 active:scale-[0.98]">
                                        <Upload className="h-3.5 w-3.5" />
                                        <span>{files.incorporation ? 'Change' : 'Upload'}</span>
                                    </div>
                                </label>
                            </div>

                            {/* Proof of Business Address */}
                            <div className="p-5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition duration-200 bg-black/15 flex justify-between items-center">
                                <div className="space-y-1 text-left">
                                    <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-primary-400" />
                                        <span>Proof of Business Address*</span>
                                    </h4>
                                    <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                                        {files.address ? files.address.name : 'Utility bill or bank statement (issued within the last 3 months).'}
                                    </p>
                                </div>
                                <label className="cursor-pointer shrink-0">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) => handleFileChange('address', e.target.files?.[0] || null)}
                                    />
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition flex items-center space-x-1.5 active:scale-[0.98]">
                                        <Upload className="h-3.5 w-3.5" />
                                        <span>{files.address ? 'Change' : 'Upload'}</span>
                                    </div>
                                </label>
                            </div>

                            {/* Director ID */}
                            <div className="p-5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition duration-200 bg-black/15 flex justify-between items-center">
                                <div className="space-y-1 text-left">
                                    <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-primary-400" />
                                        <span>Director / Owner Government ID*</span>
                                    </h4>
                                    <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                                        {files.govId ? files.govId.name : 'Valid passport, national ID, driving licence, or NIN.'}
                                    </p>
                                </div>
                                <label className="cursor-pointer shrink-0">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) => handleFileChange('govId', e.target.files?.[0] || null)}
                                    />
                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition flex items-center space-x-1.5 active:scale-[0.98]">
                                        <Upload className="h-3.5 w-3.5" />
                                        <span>{files.govId ? 'Change' : 'Upload'}</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={uploadProgress < 3 || submitVerificationMutation.isPending}
                                className="w-full rounded-xl h-[52px] font-bold text-sm"
                                rightIcon={<ArrowRight className="h-4 w-4" />}
                            >
                                {submitVerificationMutation.isPending ? 'Submitting verification details...' : 'Submit application'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Application Submitted Review Status (Pending or Approved) */}
            {accountType === 'business' && (kycStatus === 'pending' || kycStatus === 'approved') && (
                <div className="space-y-8 select-none py-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative w-fit">
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                            <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                                {kycStatus === 'approved' ? (
                                    <Shield className="h-8 w-8 stroke-[2.5]" />
                                ) : (
                                    <Clock className="h-8 w-8 stroke-[2.5]" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className={cn(
                                "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border tracking-wider",
                                kycStatus === 'approved' 
                                    ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-orange-500/15 border-orange-500/20 text-orange-400'
                            )}>
                                {kycStatus === 'approved' ? 'Approved & Live' : 'Under Review'}
                            </span>
                            <h4 className="font-satoshi font-black text-xl text-white pt-2">
                                {kycStatus === 'approved' ? 'Verification Complete!' : 'Application Submitted'}
                            </h4>
                            <p className="text-slate-455 text-xs font-sans leading-relaxed max-w-sm">
                                {kycStatus === 'approved' 
                                    ? 'Your business profile and KYB documents have been fully verified. Core fiat and crypto accounts are active.'
                                    : 'Our compliance team is currently reviewing your company and director onboarding data. You will be notified in 24 hours.'}
                            </p>
                        </div>
                    </div>

                    {/* Step Timeline Progress Card */}
                    <div className="bg-[#0C1224]/50 border border-white/5 rounded-2xl p-6 space-y-4 max-w-md mx-auto">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                            KYB Checkpoints
                        </span>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center space-x-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-white">Document Uploads Received</span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">Complete</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center space-x-2.5">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                                        kycStatus === 'approved' 
                                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                                            : 'border border-white/10 text-slate-500'
                                    )}>
                                        {kycStatus === 'approved' ? <Check className="h-3 w-3" /> : '2'}
                                    </div>
                                    <span className={kycStatus === 'approved' ? 'text-white' : 'text-slate-450'}>Director Verification</span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                                    {kycStatus === 'approved' ? 'Complete' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center space-x-2.5">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                                        kycStatus === 'approved' 
                                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                                            : 'border border-white/10 text-slate-500'
                                    )}>
                                        {kycStatus === 'approved' ? <Check className="h-3 w-3" /> : '3'}
                                    </div>
                                    <span className={kycStatus === 'approved' ? 'text-white' : 'text-slate-450'}>Treasury & Live Limits Activated</span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                                    {kycStatus === 'approved' ? 'Active' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Individual Account Stepper Timeline (Default) */}
            {accountType === 'individual' && (
                <div className="space-y-6">
                    <h3 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 select-none">
                        Verification Timeline
                    </h3>
                    <span className="text-[9px] font-bold text-slate-555 tracking-[0.15em] uppercase block mt-3 mb-6 select-none font-mono">
                        Complete any pending process by clicking.
                    </span>

                    <div className="relative border-l border-white/10 pl-6.5 space-y-6.5 ml-2">
                        {/* Step 1: Email */}
                        <div className="relative">
                            <div className="absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                            <div className="bg-black/10 border border-emerald-500/10 rounded-2xl p-4 flex justify-between items-center shadow-sm select-none">
                                <div className="text-left space-y-0.5">
                                    <span className="font-bold text-white text-xs block">Email Address</span>
                                    <span className="text-[10px] text-slate-500 font-semibold block">Primary contact point verified</span>
                                </div>
                                <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                                    Complete
                                </span>
                            </div>
                        </div>

                        {/* Step 2: Phone */}
                        <div className="relative">
                            <div className="absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                            <div className="bg-black/10 border border-emerald-500/10 rounded-2xl p-4 flex justify-between items-center shadow-sm select-none">
                                <div className="text-left space-y-0.5">
                                    <span className="font-bold text-white text-xs block">Phone Number</span>
                                    <span className="text-[10px] text-slate-500 font-semibold block">Two-factor mobile access active</span>
                                </div>
                                <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                                    Complete
                                </span>
                            </div>
                        </div>

                        {/* Step 3: Identity check / KYC Status */}
                        <div className="relative">
                            <div className={cn(
                                "absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full flex items-center justify-center transition duration-300",
                                kycStatus === 'approved'
                                    ? "bg-emerald-500/10 border border-emerald-500/35 text-emerald-400"
                                    : kycStatus === 'pending'
                                    ? "bg-orange-500/10 border-orange-500/35 text-orange-400"
                                    : "bg-orange-500/10 border border-orange-500/35 text-orange-400"
                            )}>
                                {kycStatus === 'approved' ? (
                                    <Check className="h-3.5 w-3.5" />
                                ) : (
                                    <Clock className="h-3.5 w-3.5" />
                                )}
                            </div>
                            <div className={cn(
                                "rounded-2xl p-4 flex justify-between items-center shadow-md transition duration-300 border",
                                kycStatus === 'approved'
                                    ? "bg-black/10 border-emerald-500/10"
                                    : "bg-orange-500/5 border-orange-500/25"
                            )}>
                                <div className="text-left space-y-0.5">
                                    <span className="font-bold text-white text-xs block">Identity Verification (KYC)</span>
                                    <span className="text-[10px] text-slate-500 font-semibold block">
                                        {kycStatus === 'approved' ? 'Government ID and biometric selfies validated' : 'Verification is currently pending review'}
                                    </span>
                                </div>
                                <span className={cn(
                                    "text-[8px] font-extrabold uppercase px-2 py-0.5 rounded select-none border",
                                    kycStatus === 'approved'
                                        ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                                        : "bg-orange-500/15 border-orange-500/20 text-orange-400"
                                )}>
                                    {kycStatus === 'approved' ? 'Complete' : kycStatus || 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationTab;
