import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  CheckCircle2, Clock, Target, TrendingUp, Users, MoreHorizontal 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { useUIStore } from '../store/useUIStore';

// Mock Data
const productivityData = [
  { name: 'Mon', completed: 4, added: 6 },
  { name: 'Tue', completed: 7, added: 3 },
  { name: 'Wed', completed: 5, added: 5 },
  { name: 'Thu', completed: 9, added: 4 },
  { name: 'Fri', completed: 6, added: 8 },
  { name: 'Sat', completed: 2, added: 1 },
  { name: 'Sun', completed: 3, added: 2 },
];

const weeklyActivity = [
  { name: 'Week 1', tasks: 40 },
  { name: 'Week 2', tasks: 55 },
  { name: 'Week 3', tasks: 35 },
  { name: 'Week 4', tasks: 70 },
];

const recentProjects = [
  { id: 1, name: 'TaskFlow Redesign', status: 'In Progress', progress: 65, members: 4 },
  { id: 2, name: 'Q3 Marketing Campaign', status: 'Review', progress: 90, members: 3 },
  { id: 3, name: 'Mobile App Launch', status: 'Planning', progress: 15, members: 6 },
];

export function DashboardHomePage() {
  const { openProjectModal } = useUIStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good morning, Alex! 👋</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Download Report</Button>
          <Button onClick={() => openProjectModal()}>New Project</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground">Total Projects</p>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+2 this week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground">Tasks Completed</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">148</div>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground">Team Members</p>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24</div>
              <span className="text-xs font-medium text-muted-foreground">Across 3 teams</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground">Productivity Score</p>
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">92%</div>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Productivity Overview</CardTitle>
            <CardDescription>Tasks completed vs added this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} 
                  />
                  <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="added" name="Added" fill="var(--secondary-300)" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Trend</CardTitle>
            <CardDescription>Overall task completion trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} 
                  />
                  <Area type="monotone" dataKey="tasks" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your active project workspaces</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">{project.members} members</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                      project.status === 'Review' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {project.status}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 relative before:absolute before:left-1.5 before:top-6 before:bottom-[-16px] before:w-px before:bg-border last:before:hidden">
                  <div className="relative z-10 h-3 w-3 mt-1.5 rounded-full ring-4 ring-background bg-destructive" />
                  <div>
                    <p className="text-sm font-medium">Finalize Q3 Marketing Plan</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>Today, 5:00 PM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
