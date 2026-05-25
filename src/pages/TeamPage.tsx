import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, MoreHorizontal, Mail, Shield, ShieldCheck, ShieldAlert, Circle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useTeamStore } from '../store/useTeamStore';
import { useUIStore } from '../store/useUIStore';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { cn } from '../utils/cn';

const roleIcons = {
  Admin: ShieldAlert,
  Manager: ShieldCheck,
  Member: Shield,
};

const roleColors: Record<string, string> = {
  Admin: 'bg-violet-500/10 text-violet-500',
  Manager: 'bg-blue-500/10 text-blue-500',
  Member: 'bg-slate-500/10 text-slate-400',
};

const statusColors: Record<string, string> = {
  Online: 'bg-emerald-500',
  Offline: 'bg-slate-400',
  'In a meeting': 'bg-amber-500',
};

export function TeamPage() {
  const [search, setSearch] = useState('');
  const { members, removeMember } = useTeamStore();
  const { openInviteMemberModal, addToast } = useUIStore();

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">{members.length} members across your workspace.</p>
        </div>
        <Button onClick={() => openInviteMemberModal()} className="gap-2 shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: members.length, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Online Now', value: members.filter(m => m.status === 'Online').length, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Admins', value: members.filter(m => m.role === 'Admin').length, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-5 card-hover">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <UserPlus className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeInUp} className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border/50">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-10" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      {/* Members Table */}
      <motion.div variants={fadeInUp}>
        <Card className="overflow-hidden border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Member</th>
                  <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((member) => {
                  const RoleIcon = roleIcons[member.role];
                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center font-bold text-primary text-sm">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <RoleIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', roleColors[member.role])}>
                            {member.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-2 h-2 rounded-full', statusColors[member.status] || 'bg-slate-400')} />
                          <span className="text-xs text-muted-foreground">{member.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openInviteMemberModal(member.id)}>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { removeMember(member.id); addToast({ title: 'Member removed', type: 'error' }); }}>
                            <Circle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filteredMembers.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No members found matching your search.</div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
