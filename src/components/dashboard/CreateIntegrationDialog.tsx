import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Hash,
  Copy,
  Check,
  ArrowLeft,
  Plus,
} from "lucide-react";
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
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type ChannelType } from "@/services/integrations/type";

interface CreateResult {
  testKey: string;
  liveKey: string;
}

interface CreateIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (data: {
    label: string;
    channel: ChannelType;
    config: Record<string, string>;

    // recipientEmails?: string;
    // phoneNumbers?: string;
    // webhookUrls?: string;
  }) => CreateResult;
}

const channels: {
  value: ChannelType;
  label: string;
  icon: typeof Mail;
  description: string;
  color: string;
}[] = [
  {
    value: "email",
    label: "Email",
    icon: Mail,
    description: "Forward submissions to email addresses",
    color: "text-primary",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    description: "Send notifications via WhatsApp",
    color: "text-success",
  },
  {
    value: "slack",
    label: "Slack",
    icon: Hash,
    description: "Post submissions to a Slack channel",
    color: "text-warning",
  },
];

type Step = "channel" | "config" | "done";

export function CreateIntegrationDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateIntegrationDialogProps) {
  const [step, setStep] = useState<Step>("channel");
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(
    null,
  );
  const [label, setLabel] = useState("");
  const [emails, setEmails] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [webhookUrls, setwebhookUrls] = useState("");
  const [keys, setKeys] = useState<CreateResult | null>(null);
  const [copiedTest, setCopiedTest] = useState(false);
  const [copiedLive, setCopiedLive] = useState(false);

  const reset = () => {
    setStep("channel");
    setSelectedChannel(null);
    setLabel("");
    setEmails("");
    setPhoneNumbers("");
    setwebhookUrls("");
    setKeys(null);
    setCopiedTest(false);
    setCopiedLive(false);
  };

  const handleClose = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  const handleSelectChannel = (ch: ChannelType) => {
    setSelectedChannel(ch);
    setStep("config");
  };

  const isConfigValid = () => {
    if (!label.trim()) return false;
    switch (selectedChannel) {
      case "email":
        return emails.trim().length > 0;
      case "whatsapp":
        return phoneNumbers.trim().length > 0;
      case "slack":
        return webhookUrls.trim().length > 0;
      default:
        return false;
    }
  };

  const handleCreate = async () => {
    try {
      const result = await onCreated({
        label: label.trim(),
        channel: selectedChannel!,
        config: {
          recipientEmails: emails,
          phoneNumbers: phoneNumbers,
          webhookUrls: webhookUrls,
        },
      });
      console.log("result:", result);
      setKeys(result);
      setStep("done");
    } catch (error) {
      console.error("Error creating integration:", error);
      const responseData = error.response?.data || error.response || {};
      console.log("Error response data:", responseData);
    }
  };

  const handleCopy = async (key: string, env: "test" | "live") => {
    await navigator.clipboard.writeText(key);
    if (env === "test") {
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2500);
    } else {
      setCopiedLive(true);
      setTimeout(() => setCopiedLive(false), 2500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "channel" && "Create Route"}
            {step === "config" && "Configure Route"}
            {step === "done" && "Route Created!"}
          </DialogTitle>
          <DialogDescription>
            {step === "channel" &&
              "Choose a channel for your form submissions."}
            {step === "config" &&
              "Set up where your messages will be delivered."}
            {step === "done" &&
              "Copy your API keys now — you won't see the full keys again."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "channel" && (
            <motion.div
              key="channel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3 py-2"
            >
              {channels.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => handleSelectChannel(ch.value)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted/50 transition-all text-left group"
                >
                  <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                    <ch.icon className={cn("h-6 w-6", ch.color)} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{ch.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {ch.description}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === "config" && selectedChannel && (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 py-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground -ml-2"
                onClick={() => setStep("channel")}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>

              <div className="space-y-2">
                <Label htmlFor="label">Route Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., Contact Form, Waitlist"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A friendly name for this route
                </p>
              </div>

              {selectedChannel === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="emails">Email addresses</Label>
                  <Textarea
                    id="emails"
                    placeholder={"support@company.com\nsales@company.com"}
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    One email per line. All will receive submissions.
                  </p>
                </div>
              )}
              {selectedChannel === "whatsapp" && (
                <div className="space-y-2">
                  <Label htmlFor="PhoneNumbers">PhoneNumbers number</Label>
                  <Input
                    id="PhoneNumbers"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include country code. WhatsApp Business required.
                  </p>
                </div>
              )}
              {selectedChannel === "slack" && (
                <div className="space-y-2">
                  <Label htmlFor="webhook">Slack Webhook URL</Label>
                  <Input
                    id="webhook"
                    placeholder="https://hooks.slack.com/services/..."
                    value={webhookUrls}
                    onChange={(e) => setwebhookUrls(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create an incoming webhook in your Slack workspace settings.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Both a{" "}
                  <strong>Test</strong> and <strong>Live</strong> API key will
                  be generated automatically for this route.
                </p>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleCreate}
                disabled={!isConfigValid()}
              >
                <Plus className="h-4 w-4" /> Create Route & Generate Keys
              </Button>
            </motion.div>
          )}

          {step === "done" && keys && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 py-2"
            >
              {/* Test Key */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-warning/10 text-warning">
                    🧪 Test Key
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <code className="font-mono text-sm text-foreground break-all select-all block">
                    {keys.testKey}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleCopy(keys.testKey, "test")}
                >
                  {copiedTest ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedTest ? "Copied!" : "Copy Test Key"}
                </Button>
              </div>

              {/* Live Key */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-success/10 text-success">
                    🚀 Live Key
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <code className="font-mono text-sm text-foreground break-all select-all block">
                    {keys.liveKey}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleCopy(keys.liveKey, "live")}
                >
                  {copiedLive ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedLive ? "Copied!" : "Copy Live Key"}
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs text-warning font-medium">
                  ⚠️ This is the only time you'll see the full keys. Copy them
                  now and store securely.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleClose(false)}
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
