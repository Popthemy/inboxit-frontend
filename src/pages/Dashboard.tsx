import { motion } from "framer-motion";
import { Send, Calendar, Key, Route, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const areaChartData = [
  { name: "Mon", messages: 245 },
  { name: "Tue", messages: 388 },
  { name: "Wed", messages: 312 },
  { name: "Thu", messages: 456 },
  { name: "Fri", messages: 523 },
  { name: "Sat", messages: 234 },
  { name: "Sun", messages: 189 },
];

const pieChartData = [
  { name: "Success", value: 2847, color: "hsl(142, 71%, 45%)" },
  { name: "Failed", value: 153, color: "hsl(0, 84%, 60%)" },
];

const recentActivity = [
  { id: 1, from: "contact@acme.com", subject: "Partnership inquiry", status: "success" as const, time: "2 min ago" },
  { id: 2, from: "support@tech.io", subject: "Bug report", status: "success" as const, time: "5 min ago" },
  { id: 3, from: "hello@startup.co", subject: "Demo request", status: "error" as const, time: "12 min ago" },
  { id: 4, from: "sales@corp.net", subject: "Pricing question", status: "success" as const, time: "18 min ago" },
  { id: 5, from: "dev@agency.com", subject: "API integration", status: "success" as const, time: "25 min ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Messages"
          value={12847}
          change="+12% from last month"
          changeType="positive"
          icon={Send}
          delay={0}
        />
        <StatCard
          title="Messages Today"
          value={523}
          change="+8% from yesterday"
          changeType="positive"
          icon={Calendar}
          delay={0.1}
        />
        <StatCard
          title="Active API Keys"
          value={8}
          change="2 expiring soon"
          changeType="neutral"
          icon={Key}
          delay={0.2}
        />
        <StatCard
          title="Active Routes"
          value={5}
          change="All operational"
          changeType="positive"
          icon={Route}
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Messages per Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(220, 9%, 64%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 9%, 64%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 9%)",
                      border: "1px solid hsl(222, 47%, 18%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(239, 84%, 67%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMessages)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle>Success vs Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 9%)",
                      border: "1px solid hsl(222, 47%, 18%)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Success: 94.9%</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Failed: 5.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{activity.subject}</p>
                    <p className="text-xs text-muted-foreground font-mono">{activity.from}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={activity.status} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
