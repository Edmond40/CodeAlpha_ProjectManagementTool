import { useState } from 'react';
import { Search, Filter, UserPlus, MoreHorizontal, Mail } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useUIStore } from '../store/useUIStore';
import { useTeamStore } from '../store/useTeamStore';

export function TeamPage() {
  const [search, setSearch] = useState('');
  const { openInviteMemberModal } = useUIStore();
  const { members, removeMember } = useTeamStore();

  const filteredTeam = members.filter(member => 
    member.name.toLowerCase().includes(search.toLowerCase()) || 
    member.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">Manage members and roles.</p>
        </div>
        <Button onClick={() => openInviteMemberModal()}>
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search team members..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

      <Card className="rounded-2xl overflow-hidden border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTeam.map((member) => (
                <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" /> {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      member.role === 'Admin' ? 'bg-purple-500/10 text-purple-600' :
                      member.role === 'Manager' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-slate-500/10 text-slate-600'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        member.status === 'Online' ? 'bg-green-500' :
                        member.status === 'Offline' ? 'bg-slate-400' : 'bg-yellow-500'
                      }`} />
                      <span className="text-muted-foreground">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openInviteMemberModal(member.id)}>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <MoreHorizontal className="h-4 w-4 opacity-0" /> {/* Placeholder for alignment, use Trash or similar if imported, but for now just text */}
                        <span className="text-xs absolute">Del</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTeam.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No team members found matching your search.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
