import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export function TopNavbar({ onMobileMenuToggle, toggleTheme, isDark }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-b-gray-300 bg-background/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground lg:hidden"
        onClick={onMobileMenuToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1 items-center" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground ml-3"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-10 w-full lg:w-96 rounded-full border bg-muted/50 pl-10 pr-3 focus-visible:ring-1 focus-visible:bg-background"
            placeholder="Search projects, tasks, or people..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* User Profile Dropdown (Simplified for layout) */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="h-9 w-9 rounded-full bg-muted border object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User Avatar"
              />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                  Alex Morgan
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
