import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '../../store/useThemeStore';
import { cn } from '../../utils/cn';
import { Select } from './Select';

const themeOptions = [
  { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-primary" /> },
  { value: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5 text-muted-foreground" /> },
];

export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolved, toggle } = useThemeStore();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
      title={resolved === 'dark' ? 'Switch to light' : 'Switch to dark'}
    >
      {resolved === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

export function ThemeModeSelect() {
  const { mode, setMode } = useThemeStore();
  return (
    <Select
      label="Theme"
      value={mode}
      onChange={(v) => setMode(v as ThemeMode)}
      options={themeOptions}
      size="sm"
    />
  );
}
