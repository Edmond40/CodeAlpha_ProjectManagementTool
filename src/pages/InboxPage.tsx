import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Star } from 'lucide-react';
import { TabFilters } from '../components/ui/TabFilters';
import { FilterPanel } from '../components/ui/FilterPanel';
import { cn } from '../utils/cn';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { useAuthStore } from '../store/useAuthStore';

export function InboxPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'unread' | 'starred'>('all');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const { activeTeamId } = useAuthStore();
  const teamId = activeTeamId || 'default';

  useEffect(() => {
    notificationService.getTeamNotifications(teamId)
      .then(setItems)
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [teamId]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (tab === 'unread' && item.read) return false;
      if (typeFilter.length && !typeFilter.includes(item.type)) return false;
      return true;
    });
  }, [items, tab, typeFilter]);

  const toggleRead = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: !i.read } : i)));
    const item = items.find((i) => i.id === id);
    if (item) {
      notificationService.updateNotification(id, item.read ? 'UNREAD' : 'READ').catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 h-full flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-foreground">Inbox</h1>
        <FilterPanel
          activeCount={typeFilter.length}
          onReset={() => setTypeFilter([])}
          fields={[
            {
              id: 'type',
              label: 'Type',
              type: 'multi-select',
              options: [
                { value: 'mention', label: 'Mentions' },
                { value: 'assign', label: 'Assignments' },
                { value: 'deadline', label: 'Deadlines' },
                { value: 'invite', label: 'Invites' },
                { value: 'comment', label: 'Comments' },
                { value: 'update', label: 'Updates' },
              ],
              value: typeFilter,
              onChange: (v) => setTypeFilter(v as string[]),
            },
          ]}
        />
      </div>

      <TabFilters
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'unread', label: 'Unread' },
        ]}
      />

      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              className={cn(
                'flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors',
                !item.read && 'bg-muted/20'
              )}
            >
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => toggleRead(item.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-primary" />}
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{item.type}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">{item.time}</span>
                </div>
                <p className="text-sm text-foreground truncate">{item.message}</p>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No notifications match.</p>
          )}
        </div>
      </div>
    </div>
  );
}
