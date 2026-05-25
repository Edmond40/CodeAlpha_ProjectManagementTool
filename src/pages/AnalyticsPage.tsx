import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Download, TrendingUp, Users, Target, CheckCircle2 } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { mockWeeklyActivity, mockSprintData, mockTeamPerformance } from '../data/mockData';

const taskDistribution = [
  { name: 'To Do', value: 25 },
  { name: 'In Progress', value: 45 },
  { name: 'Review', value: 15 },
  { name: 'Completed', value: 15 },
];
const PIE_COLORS = ['#94a3b8', '#6366f1', '#f59e0b', '#22c55e'];

const completionTrend = [
  { name: 'Mon', completed: 12, target: 10 },
  { name: 'Tue', completed: 19, target: 12 },
  { name: 'Wed', completed: 15, target: 15 },
  { name: 'Thu', completed: 22, target: 18 },
  { name: 'Fri', completed: 28, target: 20 },
  { name: 'Sat', completed: 5, target: 5 },
  { name: 'Sun', completed: 8, target: 5 },
];

export function AnalyticsPage() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep dive into your team's performance.</p>
        </div>
        <Button variant="outline" className="gap-2 text-xs h-9"><Download className="w-4 h-4" /> Export Data</Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: '156', change: '+12 this week', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Completion Rate', value: '84%', change: '+5% vs last month', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active Members', value: '24', change: '3 teams', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Sprint Velocity', value: '32', change: 'Avg per sprint', icon: Target, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card border border-border/50 rounded-2xl p-5 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <Card className="card-hover">
          <CardHeader><CardTitle>Task Distribution</CardTitle><CardDescription>Current status of all active tasks</CardDescription></CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {taskDistribution.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Completion Trend */}
        <Card className="card-hover">
          <CardHeader><CardTitle>Completion Trend</CardTitle><CardDescription>Actual vs Target completion rate</CardDescription></CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4, fill: 'var(--chart-1)' }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="var(--muted-foreground)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Velocity */}
        <Card className="card-hover">
          <CardHeader><CardTitle>Sprint Velocity</CardTitle><CardDescription>Planned vs completed tasks per sprint</CardDescription></CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSprintData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="var(--chart-1)" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="planned" name="Planned" fill="var(--muted-foreground)" radius={[6, 6, 0, 0]} barSize={24} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="card-hover">
          <CardHeader><CardTitle>Weekly Activity</CardTitle><CardDescription>Task completion trend over weeks</CardDescription></CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockWeeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                  <Area type="monotone" dataKey="tasks" stroke="var(--chart-1)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Performance */}
      <motion.div variants={fadeInUp}>
        <Card className="card-hover">
          <CardHeader><CardTitle>Team Performance</CardTitle><CardDescription>Tasks completed by team member</CardDescription></CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTeamPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 12 }} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }} />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={16} />
                  <Bar dataKey="tasks" name="Assigned" fill="var(--muted-foreground)" radius={[0, 6, 6, 0]} barSize={16} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
