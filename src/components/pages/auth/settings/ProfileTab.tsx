'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import { DatePicker } from '@/components/ui/DatePicker'
import { Select, SelectOption } from '@/components/ui/Select'
import { getCountries, isValidPhoneNumber } from 'react-phone-number-input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import en from 'react-phone-number-input/locale/en.json'

const enLabels = en as Record<string, string>;
const COUNTRY_OPTIONS: SelectOption[] = getCountries()
  .map((countryCode) => ({
    value: countryCode,
    label: enLabels[countryCode] || countryCode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const getCountryCodeByName = (name: string): string => {
  if (!name) return '';
  if (name.length === 2) return name.toUpperCase();
  const code = Object.keys(enLabels).find(key => enLabels[key].toLowerCase() === name.toLowerCase());
  return code || name;
};

const getCountryNameByCode = (code: string): string => {
  if (!code) return '';
  return enLabels[code] || code;
};

export const ProfileTab: React.FC = () => {
    const queryClient = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Keep fields in sync with query response
    useEffect(() => {
        if (profileQuery.data?.success && profileQuery.data.data) {
            const p = profileQuery.data.data;
            setFirstName(p.firstName || '');
            setLastName(p.lastName || '');
            setDob(p.dateOfBirth || '');
            setNationality(p.nationality || '');
            setPhoneNumber(p.phoneNumber || '');
        }
    }, [profileQuery.data]);

    const updateProfileMutation = useMutation({
        mutationFn: (payload: {
            firstName: string;
            lastName: string;
            dateOfBirth: string;
            nationality: string;
            phoneNumber: string;
        }) => profileService.updateProfile(payload),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Profile details updated successfully!');
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            } else {
                toast.error(data?.error?.message || 'Failed to save changes.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to save profile changes.');
            toast.error(msg);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError('');

        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
            setPhoneError('Please enter a valid phone number');
            return;
        }

        updateProfileMutation.mutate({
            firstName,
            lastName,
            dateOfBirth: dob,
            nationality,
            phoneNumber,
        });
    };

    if (profileQuery.isLoading) {
        return (
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <RefreshCw className="h-8 w-8 text-primary-400 animate-spin" />
                <span className="text-xs font-bold text-slate-500 mt-3 select-none">Loading your profile details...</span>
            </div>
        );
    }

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="font-satoshi font-black text-lg text-white mb-6 select-none border-b border-white/[0.03] pb-3 text-left">
                My Profile
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">First name</label>
                        <input 
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Last Name</label>
                        <input 
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <DatePicker 
                        required
                        label="Date of Birth"
                        value={dob}
                        onChange={setDob}
                    />
                    <Select
                        required
                        label="Nationality*"
                        placeholder="Select country..."
                        value={getCountryCodeByName(nationality)}
                        onChange={(val) => setNationality(getCountryNameByCode(val))}
                        options={COUNTRY_OPTIONS}
                    />
                </div>

                <PhoneInput
                    required
                    label="Phone number*"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    error={phoneError}
                />

                <div className="flex items-center space-x-3.5 pt-4 text-left">
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs px-5 py-3.5 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProfileTab;
