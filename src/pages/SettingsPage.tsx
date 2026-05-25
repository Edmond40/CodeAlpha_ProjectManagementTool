import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Palette, Globe, Shield, CreditCard, BellRing, Eye } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { cn } from '../utils/cn';
import { fadeInUp } from '../animations/variants';
import { ThemeModeSelect } from '../components/ui/ThemeToggle';
import { Toggle } from '../components/ui/Toggle';
import { FormRow } from '../components/ui/FormRow';
import { Select } from '../components/ui/Select';
import { useThemeStore } from '../store/useThemeStore';
import { useUIStore } from '../store/useUIStore';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'security' | 'billing' | 'team';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Globe },
];

const accentColors = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b'];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [accent, setAccent] = useState('#6366f1');
  const { resolved } = useThemeStore();
  const { addToast } = useUIStore();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  const applyAccent = (color: string) => {
    setAccent(color);
    document.documentElement.style.setProperty('--primary', color);
    addToast({ title: 'Accent color updated', type: 'success' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all',
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Profile</h3>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    A
                  </div>
                  <div className="space-x-2">
                    <Button size="sm">Change Avatar</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input defaultValue="Alex" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <Input defaultValue="Morgan" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input defaultValue="alex@planora.dev" type="email" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => addToast({ title: 'Profile saved', type: 'success' })}>Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                {[
                  { title: 'Email Notifications', desc: 'Receive daily digest emails with task updates.', icon: BellRing, checked: notifEmail, set: setNotifEmail },
                  { title: 'Push Notifications', desc: 'Show browser push notifications for mentions.', icon: Bell, checked: notifPush, set: setNotifPush },
                  { title: 'Task Assignments', desc: 'Get notified when you are assigned a task.', icon: User, checked: true, set: () => {} },
                  { title: 'Deadline Reminders', desc: 'Receive reminders 24h before deadlines.', icon: Eye, checked: false, set: () => {} },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <Toggle label={item.title} description={item.desc} checked={item.checked} onChange={item.set} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <ThemeModeSelect />
                <FormRow label="Interface theme" description={`Currently ${resolved} mode`}>
                  <span className="text-xs text-muted-foreground capitalize">{resolved}</span>
                </FormRow>
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Accent color</p>
                  <div className="flex gap-3 flex-wrap">
                    {accentColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => applyAccent(color)}
                        className={cn(
                          'w-8 h-8 rounded-full hover:scale-110 transition-transform ring-2 ring-offset-2 ring-offset-card',
                          accent === color ? 'ring-primary' : 'ring-transparent'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <Select
                  label="Density"
                  value="comfortable"
                  onChange={() => {}}
                  options={[
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'compact', label: 'Compact' },
                  ]}
                  size="sm"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Security</h3>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <FormRow label="Two-Factor Authentication" description="Add an extra layer of security.">
                  <Button variant="outline" size="sm">Enable</Button>
                </FormRow>
                <Button onClick={() => addToast({ title: 'Password updated', type: 'success' })}>
                  Update Password
                </Button>
              </div>
            </motion.div>
          )}

          {(activeTab === 'billing' || activeTab === 'team') && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Coming Soon</p>
                <p className="text-xs text-muted-foreground mt-1">This section is under development.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
