import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import type { RouteIntegration } from "./IntegrationCard";

interface IntegrationSnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: RouteIntegration | null;
}

export function IntegrationSnippetDialog({
  open,
  onOpenChange,
  route,
}: IntegrationSnippetDialogProps) {
  const [env, setEnv] = useState<"test" | "live">("test");
  const [tab, setTab] = useState<"html" | "js" | "react">("html");

  if (!route) return null;

  const apiKeyPlaceholder =
    env === "live" ? "YOUR_LIVE_API_KEY" : "YOUR_TEST_API_KEY";

  const subjectFromLabel = route.label.replace(/([A-Z])/g, " $1").trim();

  const htmlSnippet = `<!-- Add before </body> -->
<script src="https://cdn.inboxit.dev/v1/inboxit.js"></script>
<script>
  inboxit("init", {
    apiKey: "${apiKeyPlaceholder}",
    subject: "New ${subjectFromLabel} Submission"
  });
</script>

<form id="inboxit-form">
  <input name="name" placeholder="Your name" required />
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>`;

  const jsSnippet = `import inboxit from "@inboxit/js";

inboxit("init", {
  apiKey: "${apiKeyPlaceholder}",
  subject: "New ${subjectFromLabel} Submission"
});

// Using with a form
const form = document.getElementById("my-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  
  const result = await inboxit("sendEmail", data);
  if (result.ok) {
    alert("Message sent!");
  }
});`;

  const reactSnippet = `import { useState } from "react";

export function ${route.label.replace(/\s+/g, "")}Form() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    
    const data = new FormData(e.target);
    const result = await inboxit("sendEmail", data);
    
    setStatus(result.ok ? "sent" : "error");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" />
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}`;

  const snippets = { html: htmlSnippet, js: jsSnippet, react: reactSnippet };
  const titles = { html: "HTML", js: "JavaScript", react: "React" };
  const langs = { html: "html", js: "javascript", react: "jsx" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Integration for "{route.label}"</DialogTitle>
          <DialogDescription>
            Copy the snippet below and add it to your project. Replace the API
            key placeholder with your actual key.
          </DialogDescription>
        </DialogHeader>

        {/* Environment toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Environment:</span>
          <div className="flex gap-1 p-1 rounded-lg bg-muted border border-border">
            <button
              onClick={() => setEnv("test")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                env === "test"
                  ? "bg-warning/15 text-warning shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              🧪 Test
            </button>
            <button
              onClick={() => setEnv("live")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                env === "live"
                  ? "bg-success/15 text-success shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              🚀 Live
            </button>
          </div>
        </div>

        {/* Code tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted border border-border w-fit">
          {(["html", "js", "react"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                tab === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {titles[t]}
            </button>
          ))}
        </div>

        <CodeBlock
          code={snippets[tab]}
          language={langs[tab]}
          title={`${titles[tab]} — ${env === "live" ? "Production" : "Development"}`}
          showLineNumbers
        />

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Use the{" "}
            <strong>Test</strong> key during development. Switch to{" "}
            <strong>Live</strong> when you're ready to deploy. The code snippet
            updates automatically.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
