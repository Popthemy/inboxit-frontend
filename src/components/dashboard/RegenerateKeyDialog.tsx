import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface RegenerateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  env: "test" | "live";
  routeLabel: string;
  onConfirm: () => string; // returns the new raw key
}

export function RegenerateKeyDialog({
  open,
  onOpenChange,
  env,
  routeLabel,
  onConfirm,
}: RegenerateKeyDialogProps) {
  const [step, setStep] = useState<"confirm" | "done">("confirm");
  const [newKey, setNewKey] = useState("");
  const [copied, setCopied] = useState(false);

  const isLive = env === "live";
  const envLabel = isLive ? "Live" : "Test";

  const handleClose = (val: boolean) => {
    if (!val) {
      setStep("confirm");
      setNewKey("");
      setCopied(false);
    }
    onOpenChange(val);
  };

  const handleRegenerate = () => {
    const key = onConfirm();
    setNewKey(key);
    setStep("done");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Regenerate {envLabel} API Key?
                </DialogTitle>
                <DialogDescription>
                  This will immediately deactivate the current{" "}
                  {envLabel.toLowerCase()} key for <strong>{routeLabel}</strong>
                  . Any integrations using it will stop working.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => handleClose(false)}>
                  Cancel
                </Button>
                <Button
                  variant={isLive ? "destructive" : "default"}
                  onClick={handleRegenerate}
                >
                  Regenerate
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>🔐 Your new {envLabel} API Key</DialogTitle>
                <DialogDescription>
                  Copy this key now. You won't see it again.
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <code className="font-mono text-sm text-foreground break-all select-all block">
                  {newKey}
                </code>
              </div>

              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs text-warning font-medium">
                  ⚠️ This is the only time you'll see the full key. Store it
                  securely.
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                <Button variant="outline" onClick={() => handleClose(false)}>
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
