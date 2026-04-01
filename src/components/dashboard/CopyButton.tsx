import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
}

export function CopyButton({ text, className, variant = "ghost", size = "icon" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("relative", className)}
    >
      <motion.div
        initial={false}
        animate={{ scale: copied ? 0 : 1, opacity: copied ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <Copy className="h-4 w-4" />
      </motion.div>
      <motion.div
        className="absolute"
        initial={false}
        animate={{ scale: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <Check className="h-4 w-4 text-success" />
      </motion.div>
    </Button>
  );
}
