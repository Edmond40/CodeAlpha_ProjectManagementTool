import { Layers, Plus, ChevronDown, Star, MoreHorizontal, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';
import { ProjectViewOptionsPopover } from '../components/ui/ProjectViewOptionsPopover';
import { ViewOptionsPopover } from '../components/ui/ViewOptionsPopover';
import { TabFilters } from '../components/ui/TabFilters';
import { Dropdown } from '../components/ui/Dropdown';
import { useFilterStore } from '../store/useFilterStore';
import { useViewsStore } from '../store/useViewsStore';
import { useUIStore } from '../store/useUIStore';
import { useNavigate } from 'react-router-dom';

export function ViewsPage() {
  const {
    viewsContentTab,
    setViewsContentTab,
    viewsSortKey,
    viewsSortDesc,
    setViewsSort,
  } = useFilterStore();
  const { views, removeView } = useViewsStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const filtered = views.filter((v) => v.type === viewsContentTab);

  const sorted = [...filtered].sort((a, b) => {
    const cmp = a[viewsSortKey].localeCompare(b[viewsSortKey]);
    return viewsSortDesc ? -cmp : cmp;
  });

  const handleSortName = () => {
    if (viewsSortKey === 'name') setViewsSort('name', !viewsSortDesc);
    else setViewsSort('name', true);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-bold">D</span>
          <span>Devplug</span>
          <span>/</span>
          <span className="text-foreground font-medium">Views</span>
          <button type="button" className="text-muted-foreground hover:text-amber-400 ml-1">
            <Star className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {viewsContentTab === 'tasks' ? <ViewOptionsPopover /> : <ProjectViewOptionsPopover />}
          <button
            type="button"
            onClick={() => navigate('/dashboard/views/new')}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
            title="New view"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <TabFilters
        value={viewsContentTab}
        onChange={setViewsContentTab}
        tabs={[
          { value: 'tasks', label: 'Tasks' },
          { value: 'projects', label: 'Projects' },
        ]}
      />

      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">
                <button type="button" className="flex items-center gap-1 hover:text-foreground" onClick={handleSortName}>
                  Name <ChevronDown className={cn('w-3.5 h-3.5', viewsSortKey === 'name' && viewsSortDesc && 'rotate-180')} />
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Updated</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Owner</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  No {viewsContentTab} views yet. Create one with +.
                </td>
              </tr>
            ) : (
              sorted.map((view) => (
                <tr
                  key={view.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(view.href)}
                      className="flex items-center gap-2 font-medium text-foreground hover:text-primary"
                    >
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      {view.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{view.created}</td>
                  <td className="px-4 py-3 text-muted-foreground">{view.updated}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {view.owner.charAt(0)}
                      </span>
                      {view.owner}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown
                      align="end"
                      trigger={
                        <button
                          type="button"
                          className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={[
                        {
                          id: 'open',
                          label: 'Open view',
                          icon: <ExternalLink className="w-4 h-4" />,
                          onClick: () => navigate(view.href),
                        },
                        {
                          id: 'edit',
                          label: 'Edit view',
                          onClick: () => navigate('/dashboard/views/new'),
                        },
                        {
                          id: 'sep',
                          label: '',
                          separator: true,
                        },
                        {
                          id: 'delete',
                          label: 'Delete view',
                          icon: <Trash2 className="w-4 h-4" />,
                          destructive: true,
                          onClick: () => {
                            removeView(view.id);
                            addToast({ title: 'View deleted', type: 'success' });
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
