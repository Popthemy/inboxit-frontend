import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

const AnimatedCounter = ({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-4xl font-bold"
    >
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </motion.span>
  );
};

export default function Analytics() {
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
        <p className="font-medium">Error loading analytics</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!metrics) return null;

  const dailyData = metrics.messagesPerDay.map((d) => ({
    name: new Date(d.day).toLocaleDateString("en-US", { weekday: "short" }),
    messages: d.count,
  }));

  const colors = [
    "hsl(239, 84%, 67%)",
    "hsl(142, 71%, 45%)",
    "hsl(38, 92%, 50%)",
    "hsl(280, 80%, 60%)",
    "hsl(0, 84%, 60%)",
  ];

  const routeData = metrics.messagesPerRoute.map((r, i) => ({
    name: r.routeLabel || `Route ${r.routeId}`,
    messages: r.count,
    fill: colors[i % colors.length],
  }));

  const totalRate = metrics.rates.success + metrics.rates.failed;
  const successRate =
    totalRate > 0 ? (metrics.rates.success / totalRate) * 100 : 0;
  const failedRate =
    totalRate > 0 ? (metrics.rates.failed / totalRate) * 100 : 0;

  const successData = [
    {
      name: "Success",
      value: parseFloat(successRate.toFixed(1)),
      color: "hsl(142, 71%, 45%)",
    },
    {
      name: "Failed",
      value: parseFloat(failedRate.toFixed(1)),
      color: "hsl(0, 84%, 60%)",
    },
  ];

  const avgDaily =
    metrics.messagesPerDay.length > 0
      ? metrics.messagesPerDay.reduce((acc, curr) => acc + curr.count, 0) /
        metrics.messagesPerDay.length
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Track your message performance and trends.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <AnimatedCounter value={metrics.totals.messages} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <AnimatedCounter value={successRate} suffix="%" decimals={1} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Daily</p>
                <AnimatedCounter value={avgDaily} decimals={1} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Messages per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
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
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(239, 84%, 67%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(239, 84%, 67%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Messages per Route</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={routeData}>
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
                  <Bar dataKey="messages" radius={[4, 4, 0, 0]}>
                    {routeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success/Failure Donut */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Success vs Failure Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={successData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {successData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 9%)",
                    border: "1px solid hsl(222, 47%, 18%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
