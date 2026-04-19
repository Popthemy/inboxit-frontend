import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Mail,
  MessageCircle,
  Hash,
  Loader2,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RouteIntegration, ChannelType } from "./IntegrationCard";
import { useToast } from "@/hooks/use-toast";

interface SendTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: RouteIntegration | null;
  defaultEnv?: "test" | "live";
}

const channelMeta: Record<
  ChannelType,
  { icon: typeof Mail; label: string; destLabel: string }
> = {
  email: { icon: Mail, label: "Email", destLabel: "Recipient email" },
  whatsapp: {
    icon: MessageCircle,
    label: "WhatsApp",
    destLabel: "Recipient phone",
  },
  slack: { icon: Hash, label: "Slack", destLabel: "Webhook URL" },
};

export function SendTestDialog({
  open,
  onOpenChange,
  route,
  defaultEnv = "test",
}: SendTestDialogProps) {
  const [env, setEnv] = useState<"test" | "live">(defaultEnv);
  const [destination, setDestination] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"compose" | "sending" | "sent">("compose");
  const { toast } = useToast();

  useEffect(() => {
    if (open && route) {
      setEnv(defaultEnv);
      setStep("compose");
      setSubject(`Test message from ${route.label}`);
      setMessage(
        `This is a test from your "${route.label}" route. If you received this, your integration is working! 🎉`,
      );
      // Pre-fill destination from route config
      switch (route.channel) {
        case "email":
          setDestination((route.config.emails || "").split("\n")[0] || "");
          break;
        case "whatsapp":
          setDestination(route.config.phone || "");
          break;
        case "slack":
          setDestination(route.config.webhookUrl || "");
          break;
      }
    }
  }, [open, route, defaultEnv]);

  if (!route) return null;

  const meta = channelMeta[route.channel];
  const Icon = meta.icon;
  const usingKey = env === "live" ? route.liveKey : route.testKey;

  const handleSend = () => {
    setStep("sending");
    // Simulated send
    setTimeout(() => {
      setStep("sent");
      toast({
        title: "Test message sent",
        description: `Delivered to ${destination} via ${meta.label}.`,
      });
    }, 1200);
  };

  const handleClose = (val: boolean) => {
    if (!val) setStep("compose");
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <AnimatePresence mode="wait">
          {step !== "sent" ? (
            <motion.div
              key="compose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send Test Message
                </DialogTitle>
                <DialogDescription>
                  Verify <strong>{route.label}</strong> works end-to-end. This
                  sends a real test through the {meta.label.toLowerCase()}{" "}
                  channel.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Env switcher */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Environment
                  </Label>
                  <Tabs
                    value={env}
                    onValueChange={(v) => setEnv(v as "test" | "live")}
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="test">🧪 Test Key</TabsTrigger>
                      <TabsTrigger value="live">🚀 Live Key</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <p className="text-[10px] font-mono text-muted-foreground truncate">
                    Using: {usingKey.prefix}••••••••
                  </p>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="dest"
                    className="text-xs text-muted-foreground flex items-center gap-1.5"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {meta.destLabel}
                  </Label>
                  <Input
                    id="dest"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={
                      route.channel === "email"
                        ? "you@example.com"
                        : route.channel === "whatsapp"
                          ? "+1 234 567 8900"
                          : "https://hooks.slack.com/..."
                    }
                  />
                </div>

                {/* Subject (email only) */}
                {route.channel === "email" && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="subj"
                      className="text-xs text-muted-foreground"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subj"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}

                {/* Message */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="msg"
                    className="text-xs text-muted-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="mt-5">
                <Button
                  variant="outline"
                  onClick={() => handleClose(false)}
                  disabled={step === "sending"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!destination || !message || step === "sending"}
                  className="gap-2"
                >
                  {step === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Test
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"
              >
                <CheckCircle2 className="h-8 w-8 text-success" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Test message delivered!
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sent to{" "}
                  <strong className="text-foreground">{destination}</strong>{" "}
                  using your {env === "live" ? "live" : "test"} key.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-left">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                  Preview
                </p>
                {route.channel === "email" && (
                  <p className="text-xs font-medium text-foreground mb-1">
                    {subject}
                  </p>
                )}
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {message}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("compose")}
                >
                  Send another
                </Button>
                <Button className="flex-1" onClick={() => handleClose(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
