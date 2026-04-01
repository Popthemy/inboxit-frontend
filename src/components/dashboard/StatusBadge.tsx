import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "success" | "error" | "warning" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { className: string; defaultLabel: string }> = {
  active: { className: "bg-success/20 text-success border-success/30", defaultLabel: "Active" },
  inactive: { className: "bg-muted text-muted-foreground border-border", defaultLabel: "Inactive" },
  success: { className: "bg-success/20 text-success border-success/30", defaultLabel: "Success" },
  error: { className: "bg-destructive/20 text-destructive border-destructive/30", defaultLabel: "Failed" },
  warning: { className: "bg-warning/20 text-warning border-warning/30", defaultLabel: "Warning" },
  pending: { className: "bg-primary/20 text-primary border-primary/30", defaultLabel: "Pending" },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <span className="flex items-center gap-1.5">
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-success",
          status === "inactive" && "bg-muted-foreground",
          status === "success" && "bg-success",
          status === "error" && "bg-destructive",
          status === "warning" && "bg-warning",
          status === "pending" && "bg-primary"
        )} />
        {label || config.defaultLabel}
      </span>
    </Badge>
  );
}
