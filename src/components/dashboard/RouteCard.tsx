import { motion } from "framer-motion";
import {
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";

interface RouteCardProps {
  id: string;
  name: string;
  channel: string;
  recipientEmail: string;
  status: "active" | "inactive";
  messageCount: number;
  delay?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
}

export function RouteCard({
  id,
  name,
  channel,
  recipientEmail,
  status,
  messageCount,
  delay = 0,
  onEdit,
  onDelete,
  onToggle,
}: RouteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="border-border bg-card hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{name}</h3>
                  <p className="text-sm text-muted-foreground">{channel}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={status} />
                <span className="text-sm text-muted-foreground">
                  {messageCount.toLocaleString()} messages
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Recipient:</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {recipientEmail}
                </code>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Route
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggle?.(id)}>
                  {status === "active" ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" />
                      Disable
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" />
                      Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
