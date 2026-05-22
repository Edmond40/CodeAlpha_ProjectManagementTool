import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBoardStore } from '../store/useBoardStore';

export function CalendarPage() {
  const { tasks } = useBoardStore();
  
  // Generating a simple mock calendar grid for the current month
  const days = Array.from({ length: 35 }, (_, i) => i + 1);

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
          <Button variant="outline" className="ml-2"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col rounded-2xl shadow-sm border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-muted/20 shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
          {days.map((day, i) => (
            <div key={i} className="min-h-[100px] border-b border-r border-border p-2 hover:bg-muted/30 transition-colors">
              <span className="text-xs font-medium text-muted-foreground">{day <= 31 ? day : ''}</span>
              {/* Mock placing tasks on specific days */}
              {day === 12 && (
                <div className="mt-1 p-1 px-2 text-xs font-medium rounded bg-primary/10 text-primary truncate">
                  {tasks[0]?.title || 'Design UI'}
                </div>
              )}
              {day === 15 && (
                <div className="mt-1 p-1 px-2 text-xs font-medium rounded bg-green-500/10 text-green-600 truncate">
                  App Launch
                </div>
              )}
              {day === 24 && (
                <div className="mt-1 p-1 px-2 text-xs font-medium rounded bg-destructive/10 text-destructive truncate">
                  {tasks[1]?.title || 'CI/CD Setup'}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
