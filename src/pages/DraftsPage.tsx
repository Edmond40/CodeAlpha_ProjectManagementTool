import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Clock, MoreHorizontal } from 'lucide-react';

const mockDrafts = [
  { id: '1', title: 'Q3 Marketing Plan Draft', project: 'Q3 Campaign', updated: '2h ago', words: 340 },
  { id: '2', title: 'API Migration Proposal', project: 'API Gateway Migration', updated: '1d ago', words: 1200 },
  { id: '3', title: 'Design System Migration Notes', project: 'Design System v2', updated: '3d ago', words: 560 },
  { id: '4', title: 'Sprint Retrospective Notes', project: 'Sprint 47', updated: '5d ago', words: 890 },
];

export function DraftsPage() {
  const [drafts] = useState(mockDrafts);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Drafts</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">{drafts.length} unsaved drafts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drafts.map((draft) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-violet-500" />
              </div>
              <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-sm text-[var(--foreground)] group-hover:text-primary transition-colors">{draft.title}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {draft.project} · {draft.words} words
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[var(--muted-foreground)]">
              <Clock className="w-3 h-3" />
              <span>Updated {draft.updated}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
