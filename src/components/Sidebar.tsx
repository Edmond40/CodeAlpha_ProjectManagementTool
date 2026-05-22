import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './Button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: Target },
  { name: 'Boards', href: '/dashboard/boards', icon: FolderKanban },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 200 }}
      className="relative flex h-screen flex-col border-r border-r-gray-300 bg-card shadow-sm z-20"
    >
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <div className="flex items-center gap-3">
          <div className="">
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-500"
            >
              <div className="flex items-center text-primary">
                <img src="src/assets/planoralogo4.png" alt="" width="10%" />
                <span className="font-bold text-xl tracking-tight text-foreground">lanora</span>
              </div>
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary-700 dark:text-primary-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-muted-foreground group-hover:text-foreground',
                  collapsed ? 'mr-0' : 'mr-3'
                )}
                aria-hidden="true"
              />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings */}
      <div className="p-3 border-t">
        <Link
          to="/dashboard/settings"
          className={cn(
            'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            location.pathname.startsWith('/dashboard/settings')
              ? 'bg-primary/10 text-primary-700'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Settings className={cn('h-5 w-5 shrink-0', collapsed ? 'mr-0' : 'mr-3')} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border shadow-md bg-background z-50 hidden md:flex"
        onClick={onToggle}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </motion.div>
  );
}
