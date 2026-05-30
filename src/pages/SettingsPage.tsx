import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ThemeModeSelect } from '../components/ui/ThemeToggle';
import { Toggle } from '../components/ui/Toggle';
import { useThemeStore } from '../store/useThemeStore';
import { useUIStore } from '../store/useUIStore';
import { fadeInUp } from '../animations/variants';
import { settingsService } from '../services/settingsService';
import type { TeamSettings } from '../services/settingsService';
import { useAuthStore } from '../store/useAuthStore';

export function SettingsPage() {
  const location = useLocation();
  const path = location.pathname.split('/').pop() || 'settings';
  const { resolved } = useThemeStore();
  const { addToast } = useUIStore();
  const [settings, setSettings] = useState<TeamSettings>({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const { activeTeamId } = useAuthStore();
  const teamId = activeTeamId || 'default';

  useEffect(() => {
    if (path === 'notifications') {
      settingsService.getSettings(teamId)
        .then(setSettings)
        .catch(() => {})
        .finally(() => setSettingsLoading(false));
    }
  }, [path, teamId]);

  if (path === 'profile' || path === 'settings') {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{path === 'profile' ? 'Profile' : 'Preferences'}</h1>
        {path === 'profile' ? (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">First name</label><Input defaultValue="Alex" className="mt-1" /></div>
              <div><label className="text-sm font-medium">Last name</label><Input defaultValue="Morgan" className="mt-1" /></div>
            </div>
            <div><label className="text-sm font-medium">Email</label><Input defaultValue="alex@planora.dev" type="email" className="mt-1" /></div>
            <Button onClick={() => addToast({ title: 'Profile saved', type: 'success' })}>Save changes</Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6">
            <ThemeModeSelect />
            <p className="text-xs text-muted-foreground mt-4">Current theme: {resolved}</p>
          </div>
        )}
      </motion.div>
    );
  }

  if (path === 'notifications') {
    return <NotificationsSettings />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
      <p className="text-sm font-medium text-foreground capitalize">{path.replace(/-/g, ' ')}</p>
      <p className="text-xs text-muted-foreground mt-1">This settings section is coming soon.</p>
    </div>
  );
}

function NotificationsSettings() {
  const { addToast } = useUIStore();
  const { activeTeamId } = useAuthStore();
  const teamId = activeTeamId || 'default';
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [tasks, setTasks] = useState(true);
  const [deadlines, setDeadlines] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(teamId, {
        notificationPreferences: { email, push, tasks, deadlines },
      });
      addToast({ title: 'Settings saved', type: 'success' });
    } catch {
      addToast({ title: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <Toggle label="Email notifications" description="Daily digest emails" checked={email} onChange={setEmail} />
        <Toggle label="Push notifications" description="Browser push for mentions" checked={push} onChange={setPush} />
        <Toggle label="Task assignments" description="When assigned a task" checked={tasks} onChange={setTasks} />
        <Toggle label="Deadline reminders" description="24h before deadlines" checked={deadlines} onChange={setDeadlines} />
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save preferences
        </Button>
      </div>
    </motion.div>
  );
}
