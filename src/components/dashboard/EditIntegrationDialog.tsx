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
  onSave: (id: string, label: string, config: Record<string, string[]>) => void;
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateEmails = (input: string) => {
  const list = input
    .split("\n")
    .map((e) => e.trim())
    .filter(Boolean);

  const invalid = list.filter((email) => !isValidEmail(email));

  return {
    valid: invalid.length === 0,
    invalidEmails: invalid,
    emails: list,
  };
};

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
 
  const [errors, setErrors] = useState<{
    emails?: string;
    phone?: string;
    webhookUrl?: string;
  }>({});

  useEffect(() => {
    if (integration) {
      setLabel(integration.label);
      setEmails(integration.config?.recipientEmails.join("\n") || "");
      setPhone(integration.config?.phone || "");
      setWebhookUrl(integration.config?.webhookUrl || "");
    }
  }, [integration]);

  if (!integration) return null;

  const buildConfig = (): Record<string, string[]> => {
    switch (integration.channel) {
      case "email":
        return {
          recipientEmails: emails
            .split("\n")
            .map((e) => e.trim())
            .filter(Boolean),
        };
      case "whatsapp":
        return { phone: [phone.trim()] };
      case "slack":
        return { webhookUrl: [webhookUrl.trim()] };
      default:
        return {};
    }
  };
   const {
     valid,
     invalidEmails,
     emails: parsedEmails,
   } = validateEmails(buildConfig().recipientEmails.join("\n"));




  const handleSave = () => {
    const newErrors: any = {};

    if (integration.channel === "email") {
      if (!emails.trim()) {
        newErrors.emails = "Email channel requires email addresses";
      }
      if (!valid) {
        newErrors.emails = `Invalid emails: ${invalidEmails.join(", ")}`;
      }
    }
    if (integration.channel === "whatsapp" && !phone.trim()) {
      newErrors.phone = "WhatsApp channel requires a phone number";
    }
    if (integration.channel === "slack" && !webhookUrl.trim()) {
      newErrors.webhookUrl = "Slack channel requires a webhook URL";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

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
              {errors.emails && (
                <p className="text-red-500 text-sm">{errors.emails}</p>
              )}
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
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          )}
          {integration.channel === "slack" && (
            <div className="space-y-2">
              <Label>Slack Webhook URL</Label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              {errors.webhookUrl && (
                <p className="text-red-500 text-sm">{errors.webhookUrl}</p>
              )}
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
