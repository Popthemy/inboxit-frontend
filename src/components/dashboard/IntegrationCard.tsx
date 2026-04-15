import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Hash,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  Eye,
  EyeOff,
  Code2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { CopyButton } from "./CopyButton";

export type ChannelType = "email" | "whatsapp" | "slack";

export interface RouteKey {
  prefix: string;
  full: string;
  lastUsed: string;
}

export interface RouteIntegration {
  id: string;
  label: string;
  channel: ChannelType;
  config: Record<string, string>;
  testKey: RouteKey;
  liveKey: RouteKey;
  status: "active" | "inactive";
  messageCount: number;
  createdAt: string;
  deletedAt?: string | null;
}

interface IntegrationCardProps extends RouteIntegration {
  delay?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  onRegenerateKey?: (id: string, env: "test" | "live") => void;
  onShowSnippet?: (id: string) => void;
}

const channelMeta: Record<
  ChannelType,
  { icon: typeof Mail; label: string; color: string }
> = {
  email: { icon: Mail, label: "Email", color: "text-primary" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-success" },
  slack: { icon: Hash, label: "Slack", color: "text-warning" },
};

function KeyRow({
  env,
  keyData,
  onRegenerate,
}: {
  env: "test" | "live";
  keyData: RouteKey;
  onRegenerate: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const masked = `${keyData?.prefix}${"•".repeat(20)}`;
  const display = revealed ? keyData.full : masked;
  const isLive = env === "live";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${isLive ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
        >
          {isLive ? "🚀 Live Key" : "🧪 Test Key"}
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          Last used: {keyData?.lastUsed}
        </span>
      </div>
      <div className="flex items-center gap-1.5 p-2 sm:p-2.5 rounded-lg bg-muted/50 border border-border">
        <code className="font-mono text-[10px] sm:text-xs text-foreground flex-1 truncate select-all">
          {display}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? (
            <EyeOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          ) : (
            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          )}
        </Button>
        <CopyButton
          text={keyData?.full}
          className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
          onClick={onRegenerate}
          title="Regenerate key"
        >
          <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function IntegrationCard({
  id,
  label,
  channel,
  config,
  testKey,
  liveKey,
  status,
  messageCount,
  createdAt,
  delay = 0,
  onEdit,
  onDelete,
  onToggle,
  onRegenerateKey,
  onShowSnippet,
}: IntegrationCardProps) {
  const meta = channelMeta[channel];
  const Icon = meta.icon;

  const configSummary = () => {
    switch (channel) {
      case "email": {
        const emails = config.recipientEmails;

        if (!emails) return "—";
        // Normalize to array
        const list = Array.isArray(emails)
          ? emails
          : emails.split(",").map((e) => e.trim());

        if (list.length === 0) return "—";

        if (list.length === 1) return list[0];

        // Show first + count
        return `${list[0]} +${list.length - 1} more`;
      }
      case "whatsapp":
        return config.phoneNumbers || "—";
      case "slack":
        return config.webhookUrl ? "Webhook configured" : "—";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="border-border bg-card hover:border-primary/30 transition-colors group">
        <CardContent className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-2.5 rounded-xl bg-muted shrink-0">
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${meta.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
                    {label}
                  </h3>
                  <StatusBadge status={status} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {meta.label} channel
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Route
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowSnippet?.(id)}>
                  <Code2 className="mr-2 h-4 w-4" /> Show Integration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggle?.(id)}>
                  {status === "active" ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" /> Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" /> Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2 text-xs sm:text-sm mt-3">
            <span className="text-muted-foreground shrink-0">Destination:</span>
            <span className="text-foreground font-medium truncate">
              {configSummary()}
            </span>
          </div>

          {/* Keys section */}
          <div className="mt-4 space-y-3">
            {testKey && (
              <KeyRow
                env="test"
                keyData={testKey}
                onRegenerate={() => onRegenerateKey?.(id, "test")}
              />
            )}
            {liveKey && (
              <KeyRow
                env="live"
                keyData={liveKey}
                onRegenerate={() => onRegenerateKey?.(id, "live")}
              />
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            <span>{messageCount.toLocaleString()} messages</span>
            <span>Created: {createdAt}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
