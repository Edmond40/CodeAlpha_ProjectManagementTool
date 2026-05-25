import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Bell, Shield, Tag, FileText, Clock, FolderKanban,
  Sparkles, Target, Palette
} from 'lucide-react';
import { cn } from '../utils/cn';

const navGroups = [
  {
    items: [
      { label: 'Back to app', href: '/dashboard', icon: ChevronLeft, external: true },
    ],
  },
  {
    items: [
      { label: 'Preferences', href: '/dashboard/settings', icon: Palette },
      { label: 'Profile', href: '/dashboard/settings/profile', icon: User },
      { label: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
      { label: 'Security & access', href: '/dashboard/settings/security', icon: Shield },
    ],
  },
  {
    title: 'Tasks',
    items: [
      { label: 'Labels', href: '/dashboard/settings/labels', icon: Tag },
      { label: 'Templates', href: '/dashboard/settings/templates', icon: FileText },
      { label: 'SLAs', href: '/dashboard/settings/slas', icon: Clock },
    ],
  },
  {
    title: 'Projects',
    items: [
      { label: 'Labels', href: '/dashboard/settings/project-labels', icon: Tag },
      { label: 'Templates', href: '/dashboard/settings/project-templates', icon: FileText },
      { label: 'Statuses', href: '/dashboard/settings/statuses', icon: FolderKanban },
    ],
  },
  {
    title: 'Features',
    items: [
      { label: 'AI & Agents', href: '/dashboard/settings/ai', icon: Sparkles },
      { label: 'Initiatives', href: '/dashboard/settings/initiatives', icon: Target },
    ],
  },
];

export function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 overflow-hidden bg-background">
      <aside className="w-56 shrink-0 border-r border-border overflow-y-auto py-4 px-2">
        {navGroups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && 'mt-4')}>
            {group.title && (
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              if ('external' in item && item.external) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
