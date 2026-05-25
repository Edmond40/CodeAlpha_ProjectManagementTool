import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  CheckCircle2, Clock, Target, TrendingUp, Users, MoreHorizontal,
  ArrowUpRight, Zap, Sparkles, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import { fadeInUp, staggerContainer } from '../animations/variants';
import {
  mockProductivityData, mockSprintData,
  mockActivityFeed, mockStats
} from '../data/mockData';

const taskDistribution = [
  { name: 'Todo', value: 25 },
  { name: 'In Progress', value: 45 },
  { name: 'Review', value: 15 },
  { name: 'Done', value: 15 },
];
const PIE_COLORS = ['#94a3b8', '#6366f1', '#f59e0b', '#22c55e'];

const recentProjects = [
  { id: 1, name: 'Dashboard Redesign', status: 'In Progress', progress: 72, members: 4, deadline: 'Jun 15' },
  { id: 2, name: 'Q3 Marketing Campaign', status: 'Review', progress: 90, members: 3, deadline: 'May 30' },
  { id: 3, name: 'Mobile App Launch', status: 'Planning', progress: 15, members: 6, deadline: 'Jul 10' },
  { id: 4, name: 'API Gateway Migration', status: 'In Progress', progress: 45, members: 5, deadline: 'Jul 20' },
];

export function DashboardHomePage() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome + AI Suggestion */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Good morning, Alex! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-500" /> AI Summary
          </Button>
          <Button className="gap-2 text-xs shadow-lg shadow-primary/20">
            <Zap className="w-4 h-4" /> Quick Create
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: mockStats.totalProjects, change: '+2 this week', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Tasks Completed', value: mockStats.tasksCompleted, change: '+12% vs last week', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Team Members', value: mockStats.teamMembers, change: 'Across 3 teams', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Productivity', value: `${mockStats.productivityScore}%`, change: '+4% increase', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Overview */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Productivity Overview</CardTitle>
              <CardDescription>Tasks completed vs added this week</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockProductivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                  />
                  <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={28} />
                  <Bar dataKey="added" name="Added" fill="var(--muted-foreground)" radius={[6, 6, 0, 0]} barSize={28} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Current status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskDistribution} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                    {taskDistribution.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {taskDistribution.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row: Activity + Upcoming + Sprint Velocity */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {mockActivityFeed.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--secondary)]/40 transition-colors"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                    activity.type === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    activity.type === 'created' ? 'bg-blue-500/10 text-blue-500' :
                    activity.type === 'joined' ? 'bg-violet-500/10 text-violet-500' :
                    'bg-amber-500/10 text-amber-500'
                  )}>
                    {activity.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.project} · {activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Upcoming + Sprint */}
        <div className="space-y-4">
          {/* Upcoming Deadlines */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 relative before:absolute before:left-[5px] before:top-5 before:bottom-[-8px] before:w-px before:bg-border last:before:hidden">
                    <div className={cn(
                      'relative z-10 h-2.5 w-2.5 mt-1.5 rounded-full ring-4 ring-[var(--card)]',
                      i === 1 ? 'bg-destructive' : i === 2 ? 'bg-amber-500' : 'bg-muted-foreground'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {i === 1 ? 'Finalize Q3 Marketing Plan' : i === 2 ? 'API Gateway Review' : 'Design System Handoff'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{i === 1 ? 'Today, 5:00 PM' : i === 2 ? 'Tomorrow' : 'In 3 days'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sprint Velocity */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Sprint Velocity</CardTitle>
              <CardDescription>Last 4 sprints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockSprintData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    />
                    <Bar dataKey="completed" name="Completed" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={18} />
                    <Bar dataKey="planned" name="Planned" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} barSize={18} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recent Projects */}
      <motion.div variants={fadeInUp}>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Your current project workspaces</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{project.name}</h4>
                      <Badge variant={
                        project.status === 'In Progress' ? 'info' :
                        project.status === 'Review' ? 'warning' :
                        project.status === 'Planning' ? 'default' : 'success'
                      }>{project.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{project.progress}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.members}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.deadline}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights Panel */}
      <motion.div variants={fadeInUp}>
        <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-violet-500/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-foreground mb-1">AI Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Your team's productivity is up <strong className="text-emerald-500">12%</strong> this week. The 
                  "Dashboard Redesign" project is at risk of missing its deadline. Consider reallocating resources 
                  from the completed "User Research" project.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-8">View Details</Button>
                  <Button size="sm" variant="ghost" className="text-xs h-8">Dismiss</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
