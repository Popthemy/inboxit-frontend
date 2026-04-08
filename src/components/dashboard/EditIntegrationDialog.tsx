import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { RouteIntegration } from "./IntegrationCard";

interface EditIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: RouteIntegration | null;
  onSave: (id: string, label: string, config: Record<string, string>) => void;
}

export function EditIntegrationDialog({
  open,
  onOpenChange,
  integration,
  onSave,
}: EditIntegrationDialogProps) {
  const [label, setLabel] = useState("");
  const [emails, setEmails] = useState("");
  const [phone, setPhone] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (integration) {
      setLabel(integration.label);
      setEmails(integration.config.emails || "");
      setPhone(integration.config.phone || "");
      setWebhookUrl(integration.config.webhookUrl || "");
    }
  }, [integration]);

  if (!integration) return null;

  const buildConfig = (): Record<string, string> => {
    switch (integration.channel) {
      case "email":
        return { emails: emails.trim() };
      case "whatsapp":
        return { phone: phone.trim() };
      case "slack":
        return { webhookUrl: webhookUrl.trim() };
      default:
        return {};
    }
  };

  const handleSave = () => {
    onSave(integration.id, label.trim(), buildConfig());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Route</DialogTitle>
          <DialogDescription>
            Update the configuration for this route.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>

          {integration.channel === "email" && (
            <div className="space-y-2">
              <Label>Email addresses</Label>
              <Textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                rows={3}
                placeholder="One email per line"
              />
            </div>
          )}
          {integration.channel === "whatsapp" && (
            <div className="space-y-2">
              <Label>Phone number</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
          {integration.channel === "slack" && (
            <div className="space-y-2">
              <Label>Slack Webhook URL</Label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!label.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
