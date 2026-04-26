import { type ElementType } from "react";
import {
  MessageSquare,
  AlertTriangle,
  Key,
  KeyRound,
  Route,
  AlertCircle,
  CreditCard,
  Plug,
  Shield,
} from "lucide-react";

export type NotificationType =
  | "new_message"
  | "message_failed"
  | "api_key_created"
  | "api_key_revoked"
  | "route_activated"
  | "route_deactivated"
  | "usage_limit_warning"
  | "payment_success"
  | "integration_connected"
  | "spam_blocked"
  | "message_sent"
  | "api_key_regenerated";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  objectId: string | null;
}

export const typeConfig: Record<
  NotificationType,
  { label: string; icon: ElementType; color: string }
> = {
  new_message: {
    label: "New Message",
    icon: MessageSquare,
    color: "text-blue-400",
  },
  message_sent: {
    label: "Delivered",
    icon: MessageSquare,
    color: "text-blue-400",
  },
  message_failed: {
    label: "Failed",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  api_key_created: { label: "API Key", icon: Key, color: "text-green-400" },
  api_key_revoked: {
    label: "Revoked",
    icon: KeyRound,
    color: "text-orange-400",
  },
  api_key_regenerated: { label: "API Key", icon: Key, color: "text-green-400" },
  route_activated: { label: "Route", icon: Route, color: "text-green-400" },
  route_deactivated: {
    label: "Route",
    icon: Route,
    color: "text-muted-foreground",
  },
  usage_limit_warning: {
    label: "Warning",
    icon: AlertCircle,
    color: "text-yellow-400",
  },
  payment_success: {
    label: "Payment",
    icon: CreditCard,
    color: "text-green-400",
  },
  integration_connected: {
    label: "Integration",
    icon: Plug,
    color: "text-purple-400",
  },
  spam_blocked: { label: "Spam", icon: Shield, color: "text-red-400" },
};

export const routeMap: Record<string, (id: string | null) => string> = {
  new_message: (id) => (id ? `/messages/${id}` : "/messages"),
  message_sent: (id) => (id ? `/messages/${id}` : "/messages"),
  message_failed: (id) => (id ? `/messages/${id}` : "/messages"),
  api_key_created: () => "/api-keys",
  api_key_revoked: () => "/api-keys",
  api_key_regenerated: () => "/api-keys",
  route_activated: () => "/routes",
  route_deactivated: () => "/routes",
  usage_limit_warning: () => "/routes",
  payment_success: () => "/settings",
  integration_connected: () => "/integrations",
  spam_blocked: () => "/messages",
};

export const filterOptions = [
  { value: "all_types", label: "All Types" },
  { value: "new_message", label: "Messages" },
  { value: "message_failed", label: "Failed" },
  { value: "api_key_created", label: "API Keys" },
  { value: "api_key_regenerated", label: "API Keys" },
  { value: "route_activated", label: "Routes" },
  { value: "usage_limit_warning", label: "Warnings" },
  { value: "payment_success", label: "Payments" },
  { value: "integration_connected", label: "Integrations" },
  { value: "spam_blocked", label: "Spam" },
];
