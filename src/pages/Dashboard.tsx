import { motion } from "framer-motion";
import {
  Send,
  Calendar,
  Key,
  Route,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useDashboard } from "@/contexts/DashboardContext";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { metrics, loading, error } = useDashboard();

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!metrics) return null;

  const areaChartData = metrics.messagesPerDay.map((d) => ({
    name: new Date(d.day).toLocaleDateString("en-US", { weekday: "short" }),
    messages: d.count,
  }));

  const pieChartData = [
    {
      name: "Success",
      value: metrics.rates.success || 0,
      color: "hsl(142, 71%, 45%)",
    },
    {
      name: "Failed",
      value: metrics.rates.failed || 0,
      color: "hsl(0, 84%, 60%)",
    },
  ];

  const totalRate = metrics.rates.success + metrics.rates.failed;
  const successPercentage =
    totalRate > 0
      ? ((metrics.rates.success / totalRate) * 100).toFixed(1)
      : "0.0";
  const failedPercentage =
    totalRate > 0
      ? ((metrics.rates.failed / totalRate) * 100).toFixed(1)
      : "0.0";

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
          value={metrics.totals.messages}
          change="All time total"
          changeType="neutral"
          icon={Send}
          delay={0}
        />
        <StatCard
          title="Messages Today"
          value={metrics.totals.messagesToday}
          change="Last 24 hours"
          changeType="positive"
          icon={Calendar}
          delay={0.1}
        />
        <StatCard
          title="Active API Keys"
          value={metrics.totals.activeApiKeys}
          change="Currently active"
          changeType="neutral"
          icon={Key}
          delay={0.2}
        />
        <StatCard
          title="Active Routes"
          value={metrics.totals.activeRoutes}
          change="Available integrations"
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
                    <linearGradient
                      id="colorMessages"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(239, 84%, 67%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(239, 84%, 67%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(222, 47%, 18%)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(220, 9%, 64%)"
                    fontSize={12}
                  />
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
                  <span className="text-sm">Success: {successPercentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Failed: {failedPercentage}%</span>
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
              {metrics.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {activity.subject || "(No Subject)"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: {activity.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={activity.status === "sent" ? "success" : "error"}
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.sentAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {metrics.recentActivity.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
