import { useMemo, useState } from 'react';
import { UserPlus, Plus, ChevronDown, MoreHorizontal, Mail, Pencil, Trash2, UserMinus } from 'lucide-react';
import { Button } from '../components/Button';
import { Dropdown } from '../components/ui/Dropdown';
import { useTeamStore } from '../store/useTeamStore';
import { useUIStore } from '../store/useUIStore';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';

type SortKey = 'name' | 'joined' | 'lastSeen';

export function TeamPage() {
  const { members, removeMember } = useTeamStore();
  const { openInviteMemberModal, addToast } = useUIStore();
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDesc, setSortDesc] = useState(false);

  const sorted = useMemo(() => {
    return [...members].sort((a, b) => {
      const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDesc ? -cmp : cmp;
    });
  }, [members, sortKey, sortDesc]);

  const handleRemove = (id: number, name: string) => {
    if (id === 0) {
      addToast({ title: 'Cannot remove application', type: 'error' });
      return;
    }
    removeMember(id);
    addToast({ title: 'Member removed', description: `${name} was removed from the workspace.`, type: 'success' });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">
          Members <span className="text-muted-foreground font-normal">{members.length}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/settings/new-team">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              New team
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => openInviteMemberModal()}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Invite member"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-foreground"
                  onClick={() => {
                    if (sortKey === 'name') setSortDesc(!sortDesc);
                    else {
                      setSortKey('name');
                      setSortDesc(false);
                    }
                  }}
                >
                  Name{' '}
                  <ChevronDown className={cn('w-3.5 h-3.5', sortKey === 'name' && sortDesc && 'rotate-180')} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Teams</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last seen</th>
              <th className="w-12 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((member) => (
              <tr
                key={member.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        member.role === 'Application'
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-foreground'
                      )}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-foreground">{member.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-md',
                      member.role === 'Admin'
                        ? 'bg-indigo-500/15 text-indigo-400'
                        : member.role === 'Application'
                          ? 'text-muted-foreground'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {member.role}
                    {member.invited ? ' (Invited)' : ''}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{member.joined}</td>
                <td className="px-4 py-3">
                  {member.teams.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <UserPlus className="w-3 h-3" />
                      {member.teams[0]}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {member.lastSeen === 'Online' ? (
                    <span className="flex items-center gap-1.5 text-xs text-foreground">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Online
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">{member.lastSeen}</span>
                  )}
                </td>
                <td className="px-2 py-3 text-right">
                  {member.role !== 'Application' && (
                    <Dropdown
                      align="end"
                      trigger={
                        <button
                          type="button"
                          className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={[
                        {
                          id: 'edit',
                          label: 'Edit member',
                          icon: <Pencil className="w-4 h-4" />,
                          onClick: () => openInviteMemberModal(member.id),
                        },
                        ...(member.invited
                          ? [
                              {
                                id: 'resend',
                                label: 'Resend invite',
                                icon: <Mail className="w-4 h-4" />,
                                onClick: () =>
                                  addToast({
                                    title: 'Invite resent',
                                    description: `Sent again to ${member.email}.`,
                                    type: 'success',
                                  }),
                              },
                            ]
                          : []),
                        {
                          id: 'suspend',
                          label: 'Suspend access',
                          icon: <UserMinus className="w-4 h-4" />,
                          onClick: () =>
                            addToast({ title: 'Member suspended', type: 'default' }),
                        },
                        { id: 'sep', label: '', separator: true },
                        {
                          id: 'remove',
                          label: 'Remove from workspace',
                          icon: <Trash2 className="w-4 h-4" />,
                          destructive: true,
                          onClick: () => handleRemove(member.id, member.name),
                        },
                      ]}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
