import { Bell, Search, Menu, Settings, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ThemeToggleButton } from './ui/ThemeToggle';
import { Dropdown } from './ui/Dropdown';
import { useUIStore } from '../store/useUIStore';

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
}

export function TopNavbar({ onMobileMenuToggle }: TopNavbarProps) {
  const { openSearchModal } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground lg:hidden"
        onClick={onMobileMenuToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <button
          type="button"
          onClick={openSearchModal}
          className="relative flex flex-1 items-center max-w-lg group"
        >
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors"
            aria-hidden="true"
          />
          <span className="flex h-10 w-full items-center rounded-full border border-border bg-muted/50 pl-10 pr-16 text-sm text-muted-foreground group-hover:border-primary/30 group-hover:bg-background transition-colors text-left">
            Search projects, tasks, or people...
          </span>
          <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <ThemeToggleButton />

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          <Dropdown
            align="end"
            trigger={
              <button
                type="button"
                className="-m-1.5 flex items-center p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <img
                  className="h-9 w-9 rounded-full bg-muted border object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User Avatar"
                />
                <span className="hidden lg:flex lg:items-center ml-3 text-sm font-semibold text-foreground">
                  Alex Morgan
                </span>
              </button>
            }
            items={[
              { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, onClick: () => navigate('/dashboard/settings') },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, onClick: () => navigate('/dashboard/settings') },
              { id: 'sep', label: '', separator: true },
              { id: 'logout', label: 'Sign out', icon: <LogOut className="w-4 h-4" />, destructive: true, onClick: () => navigate('/auth/login') },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
