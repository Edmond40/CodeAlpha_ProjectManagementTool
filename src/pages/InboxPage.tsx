import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Star } from 'lucide-react';

const mockInbox = [
  { id: '1', from: 'Alice Chen', subject: 'Design review for Dashboard v2', preview: 'The new mockups are ready for feedback...', time: '5m ago', read: false, starred: true },
  { id: '2', from: 'System', subject: 'Task assigned: Rate limiting middleware', preview: 'You have been assigned to a new task...', time: '1h ago', read: false, starred: false },
  { id: '3', from: 'Grace Huang', subject: 'Sprint 47 planning notes', preview: 'Here are the key items for tomorrow...', time: '3h ago', read: true, starred: false },
  { id: '4', from: 'Liam O\'Brien', subject: 'Q3 campaign assets', preview: 'Please review the attached creative...', time: '1d ago', read: true, starred: true },
  { id: '5', from: 'Olivia Taylor', subject: 'Product roadmap alignment', preview: 'We need to sync on the priorities...', time: '2d ago', read: true, starred: false },
];

export function InboxPage() {
  const [items, setItems] = useState(mockInbox);
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleRead = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: !i.read } : i)));
  };

  const toggleStar = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, starred: !i.starred } : i)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Inbox</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Notifications and updates</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-[var(--secondary)]/40 ${
                !item.read ? 'bg-[var(--secondary)]/20' : ''
              } ${activeId === item.id ? 'ring-1 ring-primary/20' : ''}`}
            >
              <div className="flex items-center gap-2 pt-0.5">
                <button onClick={(e) => { e.stopPropagation(); toggleRead(item.id); }} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {item.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-primary" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleStar(item.id); }} className="text-[var(--muted-foreground)] hover:text-yellow-500 transition-colors">
                  <Star className={`w-4 h-4 ${item.starred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--foreground)]">{item.from}</span>
                  <span className="text-[11px] text-[var(--muted-foreground)] shrink-0">{item.time}</span>
                </div>
                <p className="text-sm text-[var(--foreground)] truncate mt-0.5">{item.subject}</p>
                <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{item.preview}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
