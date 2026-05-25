import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SavedViewType = 'tasks' | 'projects';

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  type: SavedViewType;
  owner: string;
  created: string;
  updated: string;
  href: string;
}

const initialViews: SavedView[] = [
  { id: '1', name: 'webpages', type: 'tasks', owner: 'osei edmond', created: 'May 24', updated: 'May 24', href: '/dashboard/boards' },
  { id: '2', name: 'Active Sprint', type: 'tasks', owner: 'Alex Morgan', created: 'May 20', updated: 'May 22', href: '/dashboard/boards' },
  { id: '3', name: 'All projects', type: 'projects', owner: 'osei edmond', created: 'May 18', updated: 'May 24', href: '/dashboard/projects' },
];

interface ViewsState {
  views: SavedView[];
  addView: (view: Omit<SavedView, 'id' | 'created' | 'updated'>) => void;
  removeView: (id: string) => void;
  updateView: (id: string, fields: Partial<SavedView>) => void;
}

export const useViewsStore = create<ViewsState>()(
  persist(
    (set) => ({
      views: initialViews,
      addView: (view) =>
        set((s) => ({
          views: [
            ...s.views,
            {
              ...view,
              id: `v${Date.now()}`,
              created: 'May 24',
              updated: 'May 24',
            },
          ],
        })),
      removeView: (id) => set((s) => ({ views: s.views.filter((v) => v.id !== id) })),
      updateView: (id, fields) =>
        set((s) => ({
          views: s.views.map((v) =>
            v.id === id ? { ...v, ...fields, updated: 'May 24' } : v
          ),
        })),
    }),
    {
      name: 'planora-views',
      merge: (persisted, current) => {
        const p = persisted as { views?: Array<SavedView & { type?: string }> } | undefined;
        if (!p?.views) return { ...current, ...(persisted as object) };
        return {
          ...current,
          views: p.views.map((v) => ({
            ...v,
            type: (v.type as string) === 'issues' ? 'tasks' : v.type,
          })) as SavedView[],
        };
      },
    }
  )
);
