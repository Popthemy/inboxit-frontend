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
import { validateEmails } from "@/services/integrations/utils";

interface EditIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: RouteIntegration | null;
  onSave: (id: string, label: string,channel:string, config: Record<string, string>) => void;
}


export function EditIntegrationDialog({
  open,
  onOpenChange,
  integration,
  onSave,
}: EditIntegrationDialogProps) {
  const [label, setLabel] = useState("");
  const [emails, setEmails] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [webhookUrls, setwebhookUrls] = useState("");
  const channel = integration?.channel;

  const [errors, setErrors] = useState<{
    emails?: string;
    phoneNumbers?: string;
    webhookUrls?: string;
  }>({});

  useEffect(() => {
    if (integration) {
      setLabel(integration.label);
      // setEmails(integration.config?.recipientEmails.join("\n") || "");
      setEmails(
        Array.isArray(integration.config?.recipientEmails)
          ? integration.config.recipientEmails.join("\n")
          : integration.config?.recipientEmails || "",
      );
      setPhoneNumbers(integration.config?.phoneNumbers || "");
      setwebhookUrls(integration.config?.webhookUrls || "");
    }
  }, [integration]);
  console.log("channel:",channel)

  if (!integration) return null;

  const {
    valid,
    invalidEmails,
    emails: parsedEmails,
  } = validateEmails(emails);

  const handleSave = () => {
    const newErrors: any = {};
    if (channel === "email") {
      if (!emails.trim()) {
        newErrors.emails = "Email channel requires email addresses";
      }
      if (!valid) {
        newErrors.emails = `Invalid emails: ${invalidEmails.join(", ")}`;
      }
    }
    if (channel === "whatsapp" && !phoneNumbers.trim()) {
      newErrors.phoneNumbers = "WhatsApp channel requires a phoneNumbers number";
    }
    if (channel === "slack" && !webhookUrls.trim()) {
      newErrors.webhookUrls = "Slack channel requires a webhook URL";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSave(integration.id, label.trim(), channel, { recipientEmails: parsedEmails.join("\n"), phoneNumbers, webhookUrls });
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

          {channel === "email" && (
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
          {channel === "whatsapp" && (
            <div className="space-y-2">
              <Label>phoneNumbers number</Label>
              <Input
                type="tel"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
              />
              {errors.phoneNumbers && (
                <p className="text-red-500 text-sm">{errors.phoneNumbers}</p>
              )}
     
            </div>
          )}
          {channel === "slack" && (
            <div className="space-y-2">
              <Label>Slack Webhook URL</Label>
              <Input
                value={webhookUrls}
                onChange={(e) => setwebhookUrls(e.target.value)}
              />
              {errors.webhookUrls && (
                <p className="text-red-500 text-sm">{errors.webhookUrls}</p>
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
