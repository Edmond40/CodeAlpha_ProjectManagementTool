import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FilterPanel } from '../components/ui/FilterPanel';
import { useBoardStore } from '../store/useBoardStore';

export function CalendarPage() {
  const { tasks } = useBoardStore();
  const [showTasks, setShowTasks] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  const activeFilterCount = (!showTasks ? 1 : 0) + (!showMilestones ? 1 : 0);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Track deadlines and milestones.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold px-4">October 2026</span>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          <FilterPanel
            activeCount={activeFilterCount}
            onReset={() => { setShowTasks(true); setShowMilestones(true); }}
            fields={[
              { id: 'tasks', label: 'Show tasks', type: 'toggle', value: showTasks, onChange: (v) => setShowTasks(v as boolean) },
              { id: 'milestones', label: 'Show milestones', type: 'toggle', value: showMilestones, onChange: (v) => setShowMilestones(v as boolean) },
            ]}
          />
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col rounded-2xl shadow-sm border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-muted/20 shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
          {days.map((day, i) => (
            <div key={i} className="min-h-[100px] border-b border-r border-border p-2 hover:bg-muted/30 transition-colors">
              <span className="text-xs font-medium text-muted-foreground">{day <= 31 ? day : ''}</span>
              {showTasks && day === 12 && tasks[0] && (
                <div className="mt-1 px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary truncate">
                  {tasks[0].title}
                </div>
              )}
              {showMilestones && day === 24 && (
                <div className="mt-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 truncate">
                  Sprint deadline
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
