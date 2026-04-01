import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Send, CheckCircle, XCircle } from "lucide-react";

const dailyData = [
  { name: "Mon", messages: 245 },
  { name: "Tue", messages: 388 },
  { name: "Wed", messages: 312 },
  { name: "Thu", messages: 456 },
  { name: "Fri", messages: 523 },
  { name: "Sat", messages: 234 },
  { name: "Sun", messages: 189 },
];

const routeData = [
  { name: "Contact", messages: 4523, fill: "hsl(239, 84%, 67%)" },
  { name: "Newsletter", messages: 12847, fill: "hsl(142, 71%, 45%)" },
  { name: "Quote", messages: 892, fill: "hsl(38, 92%, 50%)" },
  { name: "Support", messages: 2341, fill: "hsl(280, 80%, 60%)" },
];

const successData = [
  { name: "Success", value: 94.9, color: "hsl(142, 71%, 45%)" },
  { name: "Failed", value: 5.1, color: "hsl(0, 84%, 60%)" },
];

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-4xl font-bold"
    >
      {value.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your message performance and trends.</p>
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
                <AnimatedCounter value={20603} />
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
                <AnimatedCounter value={94.9} suffix="%" />
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
                <AnimatedCounter value={335} />
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
