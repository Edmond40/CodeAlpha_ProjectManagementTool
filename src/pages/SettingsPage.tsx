import { Bell, Lock, User, Palette } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-muted"><User className="mr-2 h-4 w-4" /> Profile</Button>
          <Button variant="ghost" className="w-full justify-start"><Bell className="mr-2 h-4 w-4" /> Notifications</Button>
          <Button variant="ghost" className="w-full justify-start"><Palette className="mr-2 h-4 w-4" /> Appearance</Button>
          <Button variant="ghost" className="w-full justify-start"><Lock className="mr-2 h-4 w-4" /> Security</Button>
        </aside>

        <div className="md:col-span-3 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <div className="space-y-4 bg-card p-6 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-muted border flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  A
                </div>
                <div className="space-x-2">
                  <Button size="sm">Change Avatar</Button>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">First Name</label>
                  <Input defaultValue="Alex" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input defaultValue="Morgan" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="alex@taskflow.com" type="email" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="space-y-4 bg-card p-6 rounded-2xl border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive daily digest emails.</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded border-border text-primary focus:ring-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Desktop Notifications</h4>
                  <p className="text-sm text-muted-foreground">Show push notifications.</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
