import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, MoreVertical, Copy, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { CopyButton } from "./CopyButton";

interface APIKeyCardProps {
  id: string;
  prefix: string;
  fullKey: string;
  route: string;
  usage: number;
  limit: number;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed: string;
  delay?: number;
  onRevoke?: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

export function APIKeyCard({
  id,
  prefix,
  fullKey,
  route,
  usage,
  limit,
  status,
  createdAt,
  lastUsed,
  delay = 0,
  onRevoke,
  onRegenerate,
}: APIKeyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const displayKey = revealed ? fullKey : `${prefix}${"•".repeat(32)}`;
  const usagePercent = (usage / limit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="border-border bg-card hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {displayKey}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setRevealed(!revealed)}
                >
                  {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <CopyButton text={fullKey} />
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Route: <span className="text-foreground">{route}</span></span>
                <StatusBadge status={status} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="text-foreground">{usage.toLocaleString()} / {limit.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercent}%` }}
                    transition={{ duration: 0.8, delay: delay + 0.2 }}
                  />
                </div>
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Created: {createdAt}</span>
                <span>Last used: {lastUsed}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(fullKey)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Key
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRegenerate?.(id)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onRevoke?.(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Revoke
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
