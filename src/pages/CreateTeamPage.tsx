import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/ui/Select';
import { FormRow } from '../components/ui/FormRow';
import { useUIStore } from '../store/useUIStore';

const TIMEZONES = [
  { value: 'UTC', label: "GMT+0:00 - Greenwich Mean Time - Reykjavik" },
  { value: 'America/New_York', label: 'GMT-5:00 - Eastern Time' },
  { value: 'Europe/London', label: 'GMT+0:00 - London' },
  { value: 'Africa/Accra', label: 'GMT+0:00 - Accra' },
];

const COPY_TEAMS = [
  { value: 'none', label: "Don't copy" },
  { value: 'devplug', label: 'Devplug' },
  { value: 'engineering', label: 'Engineering' },
];

export function CreateTeamPage() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [copyFrom, setCopyFrom] = useState('none');
  const [timezone, setTimezone] = useState('UTC');

  const handleCreate = () => {
    if (!name.trim()) {
      addToast({ title: 'Team name required', type: 'error' });
      return;
    }
    addToast({ title: 'Team created', description: `"${name}" is ready.`, type: 'success' });
    navigate('/dashboard/team');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Create a new team</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Create a new team to manage separate cycles, workflows, and notifications.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        <FormRow label="Team icon">
          <button
            type="button"
            className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80"
          >
            <User className="w-5 h-5" />
          </button>
        </FormRow>
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-foreground shrink-0">Team name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Engineering"
            className="max-w-xs h-9"
          />
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Identifier</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Used to identify tasks from this team (e.g. ENG-123).
              </p>
            </div>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
              placeholder="e.g. ENG"
              className="max-w-[120px] h-9 font-mono uppercase"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Team hierarchy</h2>
        <p className="text-sm text-muted-foreground">
          Teams can be nested to reflect your team structure and to share workflows and settings.
        </p>
        <FormRow label="Parent team" description="">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
            Available on Business
          </span>
        </FormRow>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Copy settings from existing team</h2>
        <p className="text-sm text-muted-foreground">
          Copy settings from an existing team. This will not copy Slack settings or members.
        </p>
        <Select variant="row" label="Copy from team" value={copyFrom} onChange={setCopyFrom} options={COPY_TEAMS} />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Timezone</h2>
        <p className="text-sm text-muted-foreground">
          The timezone which team cycles and due dates are relative to.
        </p>
        <Select variant="row" label="Timezone" value={timezone} onChange={setTimezone} options={TIMEZONES} />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleCreate}>Create team</Button>
      </div>
    </div>
  );
}
