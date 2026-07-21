'use client'

import React, { useState } from 'react'
import {
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  Clock,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  Loader2,
  X,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamService, TeamMember } from '@/services/team.service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'

export const TeamsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Dialog & Invite States
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'developer' | 'viewer'>('viewer');

  // Copied invite links state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Queries
  const teamQuery = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => teamService.getTeamMembers()
  });

  const members = teamQuery.data?.success && Array.isArray(teamQuery.data.data)
    ? teamQuery.data.data
    : [];

  // Mutations
  const inviteMutation = useMutation({
    mutationFn: (payload: { email: string; role: string }) =>
      teamService.inviteTeamMember(payload.email, payload.role),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`Invitation successfully dispatched to ${inviteEmail}!`);
        setIsInviteOpen(false);
        setInviteEmail('');
        setInviteRole('viewer');
        queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      } else {
        toast.error(res?.error?.message || 'Failed to dispatch invitation.');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to invite team member.');
    }
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => teamService.removeTeamMember(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Team member revoked successfully.');
        queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      } else {
        toast.error(res?.error?.message || 'Failed to remove member.');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to remove team member.');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: (payload: { id: string; role: string }) =>
      teamService.updateMemberRole(payload.id, payload.role),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Colleague role authorization level adjusted.');
        queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      } else {
        toast.error(res?.error?.message || 'Failed to adjust role.');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update colleague role.');
    }
  });

  const handleCopyLink = (token: string, id: string) => {
    const inviteLink = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedId(id);
    toast.success('Invitation activation link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  const activeMembers = members.filter((m) => m.status === 'active');
  const pendingMembers = members.filter((m) => m.status === 'pending');

  return (
    <div className="space-y-6 mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
            Team Members
          </h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Invite and manage colleagues to collaborate on your corporate business account.
          </p>
        </div>
        <Button
          onClick={() => setIsInviteOpen(true)}
          className="rounded-xl h-[44px] text-xs font-bold px-6 shrink-0 bg-primary-500 hover:bg-primary-600 text-white border-none"
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add Team Member
        </Button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl flex items-center space-x-5 select-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/15 flex items-center justify-center text-primary-400 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Members</span>
            <span className="text-2xl font-black text-white block mt-1 font-mono">
              {members.length}
            </span>
          </div>
        </div>

        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl flex items-center space-x-5 select-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Users</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1 font-mono">
              {activeMembers.length}
            </span>
          </div>
        </div>

        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl flex items-center space-x-5 select-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pending Invites</span>
            <span className="text-2xl font-black text-amber-400 block mt-1 font-mono">
              {pendingMembers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Team Directory list */}
      <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
        <span className="text-xs font-bold text-white block uppercase tracking-wider">Corporate Roster Directory</span>

        {teamQuery.isLoading ? (
          <div className="py-24 text-center text-xs text-slate-500 animate-pulse space-y-2">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
            <span>Fetching organization staff credentials profiles...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <Users className="h-10 w-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <p className="text-slate-400 font-bold text-sm">No members added yet</p>
              <p className="text-[11px] text-slate-550 max-w-sm mx-auto leading-normal">
                Corporate profiles support multiple operators. Invite a developer, accountant, or operations manager to help configure transactions.
              </p>
            </div>
            <Button
              onClick={() => setIsInviteOpen(true)}
              size="small"
              className="bg-primary-500/15 text-primary-400 border border-primary-500/20 hover:bg-primary-500/25"
            >
              Add first colleague
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {members.map((member: TeamMember) => (
              <div key={member.id} className="bg-black/20 border border-white/5 rounded-2.5xl p-5 relative overflow-hidden group space-y-4">
                {/* Header elements: Email and status */}
                <div className="flex justify-between items-start">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-xs text-white truncate max-w-[210px]">{member.email}</h4>
                    <span className="text-[9px] text-slate-550 block font-mono mt-0.5 font-bold uppercase">
                      Joined {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider block border px-1.5 py-0.5 rounded-md",
                    member.status === 'active'
                      ? 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5'
                      : 'text-amber-400 border-amber-500/10 bg-amber-500/5'
                  )}>
                    {member.status}
                  </span>
                </div>

                {/* Body elements: Casing selection */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/5 pt-3.5 gap-3.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4 text-primary-400" />
                    <div className="w-[120px]">
                      <Select
                        label="Access Tier"
                        options={[
                          { value: 'manager', label: 'Manager' },
                          { value: 'developer', label: 'Developer' },
                          { value: 'viewer', label: 'Viewer' }
                        ]}
                        value={member.role}
                        onChange={(val) => updateRoleMutation.mutate({ id: member.id, role: val })}
                        searchable={false}
                        className="h-[36px] py-1 px-2.5 text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Actions: Copy invite token (for pending members) or delete */}
                  <div className="flex items-center justify-end space-x-3 select-none shrink-0">
                    {member.status === 'pending' && member.inviteToken && (
                      <button
                        onClick={() => handleCopyLink(member.inviteToken!, member.id)}
                        className="flex items-center space-x-1 text-[10px] font-bold text-primary-400 hover:text-primary-350 hover:underline cursor-pointer"
                      >
                        {copiedId === member.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy link</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Revoke corporate portal access for ${member.email}?`)) {
                          removeMutation.mutate(member.id);
                        }
                      }}
                      className="flex items-center space-x-1 text-[10px] font-bold text-rose-455 hover:text-rose-350 hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Invite Team Member Overlay */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[8px] z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative space-y-5 text-left animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-4.5 right-4.5 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h4 className="font-satoshi font-black text-base text-white flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-primary-400" />
                <span>Add Team Member</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Dispatches a verification invite to allow developers or operations managers to manage API access.
              </p>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Email Address*</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full"
                />
              </div>

              <Select
                label="Access Role"
                options={[
                  { value: 'manager', label: 'Manager (Full Operations)' },
                  { value: 'developer', label: 'Developer (API Keys)' },
                  { value: 'viewer', label: 'Viewer (Read-only)' }
                ]}
                value={inviteRole}
                onChange={(val) => setInviteRole(val as any)}
                searchable={false}
              />

              <Button
                type="submit"
                isLoading={inviteMutation.isPending}
                className="w-full h-11 rounded-xl text-xs font-bold bg-primary-500 hover:bg-primary-600 text-white"
              >
                Send Invitation
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
