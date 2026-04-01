import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Shield, Bug, Rocket } from "lucide-react";

const releases = [
  {
    version: "v1.4.0",
    date: "March 28, 2026",
    tag: "latest",
    icon: Rocket,
    changes: [
      { type: "feature", text: "Widget-based integration — add one script tag to send emails" },
      { type: "feature", text: "Shadow DOM toast notifications with zero CSS conflicts" },
      { type: "feature", text: "Honeypot spam protection built into script mode" },
      { type: "improvement", text: "Command queue pattern with async resolution" },
    ],
  },
  {
    version: "v1.3.0",
    date: "March 15, 2026",
    tag: "stable",
    icon: Zap,
    changes: [
      { type: "feature", text: "Programmatic mode for React, Vue, Angular frameworks" },
      { type: "feature", text: "WhatsApp notifications (beta waitlist)" },
      { type: "improvement", text: "Improved delivery speed — sub-100ms average" },
      { type: "fix", text: "Fixed duplicate submission on rapid clicks" },
    ],
  },
  {
    version: "v1.2.0",
    date: "February 20, 2026",
    tag: "stable",
    icon: Shield,
    changes: [
      { type: "feature", text: "Rate limiting per API key" },
      { type: "feature", text: "Custom email subject via data-subject attribute" },
      { type: "improvement", text: "Dashboard analytics overhaul" },
      { type: "fix", text: "Fixed CORS issue with certain CDN configs" },
    ],
  },
  {
    version: "v1.1.0",
    date: "January 30, 2026",
    tag: "stable",
    icon: Bug,
    changes: [
      { type: "feature", text: "API key management dashboard" },
      { type: "feature", text: "Message history with search and filters" },
      { type: "fix", text: "Fixed email delivery for .edu domains" },
      { type: "fix", text: "Resolved timeout on large payloads" },
    ],
  },
];

const typeColors: Record<string, string> = {
  feature: "bg-success/20 text-success",
  improvement: "bg-primary/20 text-primary",
  fix: "bg-warning/20 text-warning",
};

const statusItems = [
  { name: "API", status: "Operational", ok: true },
  { name: "Widget CDN", status: "Operational", ok: true },
  { name: "Email Delivery", status: "Operational", ok: true },
  { name: "Dashboard", status: "Operational", ok: true },
  { name: "WhatsApp (Beta)", status: "Limited", ok: false },
];

export default function Changelog() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Changelog & Status</h1>
        <p className="text-muted-foreground">Product updates, releases, and system status.</p>
      </div>

      {/* System Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {statusItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <Badge variant={item.ok ? "default" : "secondary"} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Releases */}
      <div className="space-y-6">
        {releases.map((release, idx) => (
          <motion.div
            key={release.version}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <release.icon className="h-5 w-5 text-primary" />
                    {release.version}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {release.tag === "latest" && (
                      <Badge className="text-xs">Latest</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{release.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Badge variant="secondary" className={`text-xs shrink-0 ${typeColors[change.type]}`}>
                        {change.type}
                      </Badge>
                      <span className="text-muted-foreground">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
