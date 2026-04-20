import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Mail, Loader2 } from "lucide-react";
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
import type { ApiKey } from "@/services/integrations/type";
import { useToast } from "@/hooks/use-toast";

interface SendTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey?: ApiKey | null;
}

const channelMeta = {
  icon: Mail,
  label: "Email",
  destLabel: "Recipient email",
};

declare global {
  interface Window {
    inboxit: any;
  }
}

export function SendTestDialog({
  open,
  onOpenChange,
  apiKey = null,
}: SendTestDialogProps) {
  const [manualKey, setManualKey] = useState("");
  const [subject, setSubject] = useState("Test message from Inboxit");
  const [message, setMessage] = useState(
    "This is a test message. If you received this, your integration is working! 🎉",
  );
  const [step, setStep] = useState<"compose" | "sending" | "sent">("compose");
  const { toast } = useToast();
  const clientEmail = "cleintbolaji24@gmail.com"

  const activeKeyFull = apiKey?.full || manualKey;

  // Load the Inboxit widget
  useEffect(() => {
    if (!window.inboxit) {
      const script = document.createElement("script");
      script.src =
        import.meta.env.VITE_WIDGET_URL ||
        "https://cdn.inboxit.com/widget/v1/widget.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Initialize (whenever key changes)
  useEffect(() => {
    if (open && window.inboxit && activeKeyFull) {
      window.inboxit("init", {
        apiKey: activeKeyFull,
        subject: subject || "Test message",
        successMessage:
            "Test messaged delivered successfully. Check your mail",
        errorMessage: "Not successfully. Resend or contact support",
      });
    }
  }, [open, activeKeyFull, subject]);

  useEffect(() => {
    if (open) {
      setStep("compose");
    }
  }, [open]);

  const Icon = channelMeta.icon || Send;

  const handleSend = async () => {
    if (!window.inboxit) {
      toast({
        title: "Error",
        description: "Inboxit widget not loaded yet.",
        variant: "destructive",
      });
      return;
    }

    if (!activeKeyFull) {
      toast({
        title: "Error",
        description: "Please provide an API key.",
        variant: "destructive",
      });
      return;
    }

    setStep("sending");
    try {
      await window.inboxit("sendEmail", {
        subject: subject,
        message: message,
        email: clientEmail
      });

      setStep("sent");
      toast({
        title: "Test message sent",
        description: "Delivered to channel.",
      });
    } catch (error: any) {
      setStep("compose");
      toast({
        title: "Error sending test",
        description: error.message || "Failed to send test message.",
        variant: "destructive",
      });
    }
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
                  Verify your integration works end-to-end. This sends a real
                  test through the Inboxit widget.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* API Key Input (only if not provided via props) */}
                {!apiKey && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="apiKey"
                      className="text-xs text-muted-foreground"
                    >
                      API Key
                    </Label>
                    <Input
                      id="apiKey"
                      type="text"
                      placeholder="ii_..."
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Enter the API key you want to test.
                    </p>
                  </div>
                )}

                {apiKey && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Using API Key
                    </Label>
                    <div className="p-2 rounded bg-muted font-mono text-xs truncate">
                      {apiKey.prefix}••••••••
                    </div>
                  </div>
                )}

                {/* Destination Info */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="dest"
                    className="text-xs text-muted-foreground flex items-center gap-1.5"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {channelMeta.destLabel}
                  </Label>
                  <Input
                    id="email"
                    value={clientEmail}
                    placeholder={"you@example.com"}
                    disabled={true}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    the reply button on the mail will forward to this client mail.
                  </p>
                </div>

                {/* Subject */}
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
                  disabled={!activeKeyFull || !message || step === "sending"}
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
                  Your API key worked correctly and the message was sent.
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
