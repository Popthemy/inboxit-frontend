import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { IntegrationCard, type RouteIntegration, type ChannelType } from "@/components/dashboard/IntegrationCard";
import { CreateIntegrationDialog } from "@/components/dashboard/CreateIntegrationDialog";
import { EditIntegrationDialog } from "@/components/dashboard/EditIntegrationDialog";
import { RegenerateKeyDialog } from "@/components/dashboard/RegenerateKeyDialog";
import { IntegrationSnippetDialog } from "@/components/dashboard/IntegrationSnippetDialog";
import { useToast } from "@/hooks/use-toast";

function generateKey(prefix: string) {
  return prefix + Array.from({ length: 32 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
  ).join("");
}

const initialRoutes: RouteIntegration[] = [
  {
    id: "1",
    label: "Contact Form",
    channel: "email",
    config: { emails: "support@company.com\nsales@company.com" },
    testKey: { prefix: "ib_test_", full: "ib_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", lastUsed: "5 min ago" },
    liveKey: { prefix: "ib_live_", full: "ib_live_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2", lastUsed: "2 hours ago" },
    status: "active",
    messageCount: 4523,
    createdAt: "Jan 15, 2026",
  },
  {
    id: "2",
    label: "Newsletter Signup",
    channel: "email",
    config: { emails: "newsletter@company.com" },
    testKey: { prefix: "ib_test_", full: "ib_test_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6", lastUsed: "1 day ago" },
    liveKey: { prefix: "ib_live_", full: "ib_live_n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2", lastUsed: "5 min ago" },
    status: "active",
    messageCount: 12847,
    createdAt: "Feb 3, 2026",
  },
  {
    id: "3",
    label: "Sales Alerts",
    channel: "slack",
    config: { webhookUrl: "https://hooks.slack.com/services/T00/B00/xxxx" },
    testKey: { prefix: "ib_test_", full: "ib_test_s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0", lastUsed: "Never" },
    liveKey: { prefix: "ib_live_", full: "ib_live_i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6", lastUsed: "1 day ago" },
    status: "active",
    messageCount: 892,
    createdAt: "Feb 20, 2026",
  },
  {
    id: "4",
    label: "WhatsApp Orders",
    channel: "whatsapp",
    config: { phone: "+1 234 567 8900" },
    testKey: { prefix: "ib_test_", full: "ib_test_g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8", lastUsed: "3 days ago" },
    liveKey: { prefix: "ib_live_", full: "ib_live_w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4", lastUsed: "Never" },
    status: "inactive",
    messageCount: 124,
    createdAt: "Mar 1, 2026",
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

const channelOptions = [
  { value: "all", label: "All Channels" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "slack", label: "Slack" },
];

export default function Integrations() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteIntegration | null>(null);
  const [regenState, setRegenState] = useState<{ routeId: string; env: "test" | "live" } | null>(null);
  const [snippetRoute, setSnippetRoute] = useState<RouteIntegration | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      if (r.deletedAt && statusFilter !== "archived") return false;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || r.label.toLowerCase().includes(q) || r.channel.includes(q);
      const matchesStatus = statusFilter === "all" || statusFilter === "archived" ? true : r.status === statusFilter;
      const matchesChannel = channelFilter === "all" || r.channel === channelFilter;
      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [routes, searchQuery, statusFilter, channelFilter]);

  const handleCreate = (data: { label: string; channel: ChannelType; config: Record<string, string> }) => {
    const id = String(Date.now());
    const testFull = generateKey("ib_test_");
    const liveFull = generateKey("ib_live_");

    const newRoute: RouteIntegration = {
      id,
      label: data.label,
      channel: data.channel,
      config: data.config,
      testKey: { prefix: "ib_test_", full: testFull, lastUsed: "Never" },
      liveKey: { prefix: "ib_live_", full: liveFull, lastUsed: "Never" },
      status: "active",
      messageCount: 0,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setRoutes((prev) => [newRoute, ...prev]);
    toast({ title: "Route created", description: `${data.label} is ready to use.` });
    return { testKey: testFull, liveKey: liveFull };
  };

  const handleToggle = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "active" ? "inactive" as const : "active" as const } : r
      )
    );
    toast({ title: "Status updated" });
  };

  const handleDelete = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "inactive" as const, deletedAt: new Date().toISOString() }
          : r
      )
    );
    toast({ title: "Route archived", description: "The route has been soft-deleted and can be restored." });
  };

  const handleRegenerateKey = (id: string, env: "test" | "live") => {
    setRegenState({ routeId: id, env });
  };

  const confirmRegenerate = (): string => {
    if (!regenState) return "";
    const { routeId, env } = regenState;
    const prefix = env === "live" ? "ib_live_" : "ib_test_";
    const newKey = generateKey(prefix);

    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;
        const keyField = env === "live" ? "liveKey" : "testKey";
        return { ...r, [keyField]: { prefix, full: newKey, lastUsed: "Never" } };
      })
    );

    toast({ title: `${env === "live" ? "Live" : "Test"} key regenerated` });
    return newKey;
  };

  const handleEdit = (id: string) => {
    const route = routes.find((r) => r.id === id);
    if (route) setEditingRoute(route);
  };

  const handleSaveEdit = (id: string, label: string, config: Record<string, string>) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, label, config } : r))
    );
    toast({ title: "Route updated" });
  };

  const handleShowSnippet = (id: string) => {
    const route = routes.find((r) => r.id === id);
    if (route) setSnippetRoute(route);
  };

  const regenRoute = regenState ? routes.find((r) => r.id === regenState.routeId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">
            Manage your routes, API keys, and channels in one place.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            New Route
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          placeholder="Search routes..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <div className="flex gap-2">
          <FilterDropdown placeholder="Status" value={statusFilter} onValueChange={setStatusFilter} options={statusOptions} />
          <FilterDropdown placeholder="Channel" value={channelFilter} onValueChange={setChannelFilter} options={channelOptions} />
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-foreground">No routes found</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first route to get started.</p>
          <Button className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New Route
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((route, index) => (
            <IntegrationCard
              key={route.id}
              {...route}
              delay={index * 0.08}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onRegenerateKey={handleRegenerateKey}
              onShowSnippet={handleShowSnippet}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateIntegrationDialog open={showCreate} onOpenChange={setShowCreate} onCreated={handleCreate} />

      <EditIntegrationDialog
        open={!!editingRoute}
        onOpenChange={(open) => { if (!open) setEditingRoute(null); }}
        integration={editingRoute}
        onSave={handleSaveEdit}
      />

      <RegenerateKeyDialog
        open={!!regenState}
        onOpenChange={(open) => { if (!open) setRegenState(null); }}
        env={regenState?.env || "test"}
        routeLabel={regenRoute?.label || ""}
        onConfirm={confirmRegenerate}
      />

      <IntegrationSnippetDialog
        open={!!snippetRoute}
        onOpenChange={(open) => { if (!open) setSnippetRoute(null); }}
        route={snippetRoute}
      />
    </div>
  );
}
