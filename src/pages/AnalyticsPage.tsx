import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Download } from 'lucide-react';

const taskDistribution = [
  { name: 'To Do', value: 25 },
  { name: 'In Progress', value: 45 },
  { name: 'Review', value: 15 },
  { name: 'Completed', value: 15 },
];
const COLORS = ['#94a3b8', '#3b82f6', '#eab308', '#22c55e'];

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your team's performance.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Data</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Current status of all active tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Trend</CardTitle>
            <CardDescription>Actual vs Target completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="var(--muted-foreground)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
