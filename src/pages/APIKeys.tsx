import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { APIKeyCard } from "@/components/dashboard/APIKeyCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialKeys = [
  {
    id: "1",
    prefix: "if_live_",
    fullKey: "if_live_a3b8c9d4e5f6g7h8i9j0k1l2m3n4o5p6",
    route: "Contact Form",
    usage: 1247,
    limit: 5000,
    status: "active" as const,
    createdAt: "Jan 15, 2026",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    prefix: "if_live_",
    fullKey: "if_live_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    route: "Newsletter",
    usage: 3892,
    limit: 5000,
    status: "active" as const,
    createdAt: "Feb 3, 2026",
    lastUsed: "5 min ago",
  },
  {
    id: "3",
    prefix: "if_test_",
    fullKey: "if_test_g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8",
    route: "Test Route",
    usage: 124,
    limit: 1000,
    status: "inactive" as const,
    createdAt: "Feb 28, 2026",
    lastUsed: "3 days ago",
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const routeOptions = [
  { value: "all", label: "All Routes" },
  { value: "Contact Form", label: "Contact Form" },
  { value: "Newsletter", label: "Newsletter" },
  { value: "Test Route", label: "Test Route" },
];

export default function APIKeys() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [apiKeys, setApiKeys] = useState(initialKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("live");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const { toast } = useToast();

  // Filtering
  const filtered = apiKeys.filter((key) => {
    const matchesSearch =
      key.fullKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || key.status === statusFilter;
    const matchesRoute = routeFilter === "all" || key.route === routeFilter;
    return matchesSearch && matchesStatus && matchesRoute;
  });

  const handleCreate = () => {
    const id = String(apiKeys.length + 1);
    const prefix = newKeyType === "live" ? "pk_live_" : "pk_test_";
    const randomPart = Math.random().toString(36).substring(2, 20);
    const fullKey = `${prefix}${randomPart}`;
    const newKey = {
      id,
      prefix,
      fullKey,
      route: newKeyName || "Unnamed Route",
      usage: 0,
      limit: 5000,
      status: "active" as const,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
    };
    setApiKeys([newKey, ...apiKeys]);
    setCreatedKey(fullKey);
  };

  const handleRevoke = (id: string) => {
    setApiKeys(apiKeys.map((k) => (k.id === id ? { ...k, status: "inactive" as const } : k)));
    toast({ title: "API key revoked", description: "The key has been deactivated." });
  };

  const handleRegenerate = (id: string) => {
    const randomPart = Math.random().toString(36).substring(2, 20);
    setApiKeys(
      apiKeys.map((k) =>
        k.id === id ? { ...k, fullKey: `${k.prefix}${randomPart}`, status: "active" as const } : k
      )
    );
    toast({ title: "API key regenerated", description: "A new key has been issued." });
  };

  const closeDialog = () => {
    setShowCreate(false);
    setNewKeyName("");
    setNewKeyType("live");
    setCreatedKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
          <p className="text-muted-foreground">Manage your API keys and access tokens.</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Create API Key
          </Button>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search by key or route..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <div className="flex gap-2">
          <FilterDropdown
            placeholder="Status"
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={statusOptions}
          />
          <FilterDropdown
            placeholder="Route"
            value={routeFilter}
            onValueChange={setRouteFilter}
            options={routeOptions}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No API keys found</p>
          <p className="text-sm">Try adjusting your filters or create a new key.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((key, index) => (
            <APIKeyCard
              key={key.id}
              {...key}
              delay={index * 0.1}
              onRevoke={handleRevoke}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>
      )}

      {/* Create Key Dialog */}
      <Dialog open={showCreate} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createdKey ? "API Key Created" : "Create New API Key"}</DialogTitle>
            <DialogDescription>
              {createdKey
                ? "Copy your key now — you won't be able to see it again."
                : "Generate a new API key for your form integration."}
            </DialogDescription>
          </DialogHeader>

          {!createdKey ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Route / Label</Label>
                <Input
                  placeholder="e.g. Contact Form, Newsletter"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Key Type</Label>
                <Select value={newKeyType} onValueChange={setNewKeyType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live (pk_live_)</SelectItem>
                    <SelectItem value="test">Test (pk_test_)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={handleCreate}>Generate Key</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-sm break-all select-all">
                {createdKey}
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(createdKey);
                  toast({ title: "Copied!", description: "API key copied to clipboard." });
                }}
              >
                <Copy className="h-4 w-4" /> Copy to Clipboard
              </Button>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Done</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
