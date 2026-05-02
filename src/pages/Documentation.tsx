import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Bell,
  Layers,
  Menu,
} from "lucide-react";

// ─── Code examples ────────────────────────────────────────────────────────────

const htmlFormExample = `<form id="contact-form">
  <!-- Honeypot field (hidden from users) -->
  <input type="text" name="website" style="display:none" autocomplete="off" />

  <input name="name" required />
  <input name="email" type="email" required />
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>`;

const scriptTagExample = `<script
  src="https://cdn.inboxit.com/widget/v1/widget.min.js"
  data-api-key="pk_live_xxx"
  data-form="contact-form"
  data-subject="New Lead Submission"
  data-success-message="Thanks! We'll reply soon."
  data-error-message="Failed to send message"
></script>`;

const reactSetupExample = `// Load the Inboxit widget
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.inboxit.com/widget/v1/widget.min.js";
  script.async = true;
  document.body.appendChild(script);
}, []);

// Initialize (once)
useEffect(() => {
  if (window.inboxit) {
    window.inboxit("init", {
      apiKey: "pk_live_xxx",
      subject: "New Lead"
    });
  }
}, []);`;

const reactSubmitExample = `const handleSubmit = async (formData) => {
  try {
    // Check honeypot field
    if (formData.website) return; // discard spam

    await inboxit("sendEmail", formData);
    reset(); // clear form manually
  } catch (err) {
    console.error(err);
  }
};`;

const initCommand = `inboxit("init", {
  apiKey: "pk_live_xxx",
  subject: "New Message"
});`;

const sendCommand = `// Supports JSON object or FormData
await inboxit("sendEmail", {
  name: "John Doe",
  email: "john@example.com",
  message: "Hello from Inboxit!"
});`;

const architectureDiagram = `User submits form
        ↓
Command queued
        ↓
Queue processes request
        ↓
API call executed
        ↓
Promise resolved/rejected
        ↓
Toast displayed`;

// ─── Section / nav data ───────────────────────────────────────────────────────

const DOC_SECTIONS = [
  { id: "introduction",        label: "What is Inboxit?",    category: "Getting Started"  },
  { id: "quick-start",         label: "Quick Start",         category: "Getting Started"  },
  { id: "usage-modes",         label: "Usage Modes",         category: "Integration"      },
  { id: "script-attributes",   label: "Script Attributes",   category: "Integration"      },
  { id: "commands",            label: "Commands",            category: "Integration"      },
  { id: "spam-protection",     label: "Spam Protection",     category: "Features"         },
  { id: "toast-notifications", label: "Toast Notifications", category: "Features"         },
  { id: "architecture",        label: "Architecture",        category: "Internals"        },
  { id: "common-mistakes",     label: "Common Mistakes",     category: "Troubleshooting"  },
  { id: "why-inboxit",         label: "Why Inboxit?",        category: "Reference"        },
  { id: "security",            label: "Security",            category: "Reference"        },
] as const;

const CATEGORIES = [
  "Getting Started",
  "Integration",
  "Features",
  "Internals",
  "Troubleshooting",
  "Reference",
] as const;

// ─── Sidebar nav (shared between desktop and mobile Sheet) ───────────────────

function SidebarNav({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Documentation navigation">
      {CATEGORIES.map((category) => (
        <div key={category} className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
            {category}
          </p>
          <ul className="space-y-0.5">
            {DOC_SECTIONS.filter((s) => s.category === category).map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={onNavigate}
                  className={cn(
                    "block text-sm rounded-md px-2 py-1.5 transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    DOC_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* ── Mobile sticky bar ──────────────────────────────────────────────── */}
      <div className="md:hidden sticky top-16 z-30 flex items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-4 py-2">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="h-4 w-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 pt-6 overflow-y-auto">
            <SidebarNav
              activeSection={activeSection}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <span className="text-sm text-muted-foreground truncate">
          {DOC_SECTIONS.find((s) => s.id === activeSection)?.label}
        </span>
      </div>

      <div className="flex w-full min-h-full">
        {/* ── Left sidebar ───────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-4 scrollbar-thin">
            <SidebarNav activeSection={activeSection} />
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 py-10 px-6 lg:px-12 max-w-3xl">

          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              What is Inboxit?
            </h2>
            <p className="text-muted-foreground mb-4">
              Inboxit lets you send messages from <strong>any website form</strong> — without
              building a backend, configuring SMTP, or writing API logic.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Static HTML", "React / Vue / Angular", "Modals & SPAs", "CMS Platforms"].map(
                (tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                )
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Add one script. Keep your form. Inboxit handles the rest.
            </p>
          </section>
          <hr className="border-border mb-12" />

          {/* Quick Start */}
          <section id="quick-start" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4">
              Quick Start
            </h2>
            <p className="text-muted-foreground mb-6">Get up and running in 2 steps:</p>

            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                Create your form with honeypot protection
              </h3>
              <CodeBlock code={htmlFormExample} language="html" title="Your Form (index.html)" />
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                Add the Inboxit script
              </h3>
              <CodeBlock
                code={scriptTagExample}
                language="html"
                title="Add before </body>"
              />
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <div className="text-sm">
                <strong>Done!</strong> Inboxit now handles form submission, toast notifications,
                form reset, and spam filtering automatically.
              </div>
            </div>
          </section>
          <hr className="border-border mb-12" />

          {/* Usage Modes */}
          <section id="usage-modes" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Usage Modes
            </h2>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-6">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <div className="text-sm">
                <strong>Important:</strong> Inboxit supports two modes. Do <strong>NOT</strong>{" "}
                mix them.
              </div>
            </div>

            <Tabs defaultValue="script">
              <TabsList className="mb-4">
                <TabsTrigger value="script">🧩 Script Mode</TabsTrigger>
                <TabsTrigger value="programmatic">⚛️ Programmatic Mode</TabsTrigger>
              </TabsList>

              <TabsContent value="script" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use when form exists in the DOM and you don't need manual JS submission.
                </p>
                <div className="grid gap-2">
                  {[
                    { icon: CheckCircle, text: "Form must exist in DOM", ok: true },
                    {
                      icon: CheckCircle,
                      text: "Include hidden 'website' field for spam protection",
                      ok: true,
                    },
                    { icon: XCircle, text: "Do not remove form before submit", ok: false },
                    { icon: XCircle, text: "Do not manually call sendEmail", ok: false },
                    {
                      icon: XCircle,
                      text: "Do not use in React/Vue controlled forms",
                      ok: false,
                    },
                  ].map((rule) => (
                    <div key={rule.text} className="flex items-center gap-2 text-sm">
                      <rule.icon
                        className={`h-4 w-4 ${rule.ok ? "text-success" : "text-destructive"}`}
                      />
                      <span className="text-muted-foreground">{rule.text}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="programmatic" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use with React, Vue, Angular, or dynamic/modal forms where you need full
                  control.
                </p>
                <CodeBlock
                  code={reactSetupExample}
                  language="javascript"
                  title="Setup (React Example)"
                />
                <CodeBlock
                  code={reactSubmitExample}
                  language="javascript"
                  title="Submit Handler"
                />
                <div className="grid gap-2 mt-4">
                  {[
                    { icon: CheckCircle, text: "Use await inboxit(...)", ok: true },
                    { icon: CheckCircle, text: "Handle form reset yourself", ok: true },
                    {
                      icon: CheckCircle,
                      text: "Implement honeypot check (website field)",
                      ok: true,
                    },
                    { icon: XCircle, text: "Do NOT use data-form attribute", ok: false },
                  ].map((rule) => (
                    <div key={rule.text} className="flex items-center gap-2 text-sm">
                      <rule.icon
                        className={`h-4 w-4 ${rule.ok ? "text-success" : "text-destructive"}`}
                      />
                      <span className="text-muted-foreground">{rule.text}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
          <hr className="border-border mb-12" />

          {/* Script Attributes */}
          <section id="script-attributes" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4">
              Script Attributes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Attribute</th>
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Required</th>
                    <th className="text-left py-2 font-medium text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { attr: "data-api-key", req: true, desc: "Your Inboxit public API key" },
                    {
                      attr: "data-form",
                      req: false,
                      desc: "Form ID to auto-bind (Script Mode only)",
                    },
                    { attr: "data-subject", req: false, desc: "Email subject line" },
                    {
                      attr: "data-success-message",
                      req: false,
                      desc: "Custom success toast message",
                    },
                    {
                      attr: "data-error-message",
                      req: false,
                      desc: "Custom error toast message",
                    },
                  ].map((row) => (
                    <tr key={row.attr} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-mono text-xs text-foreground">{row.attr}</td>
                      <td className="py-2 pr-4">
                        <Badge
                          variant={row.req ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {row.req ? "Required" : "Optional"}
                        </Badge>
                      </td>
                      <td className="py-2">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <hr className="border-border mb-12" />

          {/* Commands */}
          <section id="commands" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4">
              Commands
            </h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2 font-mono text-sm">init</h3>
              <CodeBlock code={initCommand} language="javascript" />
            </div>
            <div>
              <h3 className="font-medium mb-2 font-mono text-sm">sendEmail</h3>
              <CodeBlock code={sendCommand} language="javascript" />
            </div>
          </section>
          <hr className="border-border mb-12" />

          {/* Spam Protection */}
          <section id="spam-protection" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Spam Protection (Honeypot)
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add a hidden field named{" "}
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">website</code>{" "}
              to your form. Inboxit automatically discards submissions where this field is filled
              — only bots fill hidden fields.
            </p>
            <CodeBlock
              code={`<!-- Add inside your form -->
<input type="text" name="website" style="display:none" autocomplete="off" />`}
              language="html"
            />
          </section>
          <hr className="border-border mb-12" />

          {/* Toast Notifications */}
          <section id="toast-notifications" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Toast Notifications
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Inboxit automatically shows toast notifications using{" "}
              <strong>Shadow DOM</strong> — zero CSS conflicts with your site.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-sm">
                <strong className="text-success">✓ Success:</strong>
                <span className="text-muted-foreground ml-1">Message sent successfully</span>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                <strong className="text-destructive">✕ Error:</strong>
                <span className="text-muted-foreground ml-1">Failed to send message</span>
              </div>
            </div>
          </section>
          <hr className="border-border mb-12" />

          {/* Architecture */}
          <section id="architecture" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4">
              Architecture
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Inboxit uses a <strong>Command Queue Pattern</strong> with async resolution.
            </p>
            <CodeBlock code={architectureDiagram} language="text" title="Flow" />
          </section>
          <hr className="border-border mb-12" />

          {/* Common Mistakes */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-medium text-sm mb-1">❌ Mixing both modes</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Using{" "}
                  <code className="font-mono bg-muted px-1 rounded">data-form</code> AND calling{" "}
                  <code className="font-mono bg-muted px-1 rounded">
                    inboxit("sendEmail")
                  </code>{" "}
                  causes duplicate requests, 405 errors, and double toasts.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">❌ Form not in DOM</h3>
                <p className="text-xs text-muted-foreground">
                  Inboxit cannot detect forms inside closed modals or unmounted components. Use
                  Programmatic Mode for dynamic forms.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">❌ Not using await</h3>
                <CodeBlock
                  code={`inboxit("sendEmail", data);       // ❌ Wrong
await inboxit("sendEmail", data);  // ✅ Correct`}
                  language="javascript"
                />
              </div>
            </div>
          </section>
          <hr className="border-border mb-12" />

          {/* Why Inboxit */}
          <section id="why-inboxit" className="mb-12">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4">
              Why Inboxit?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Service</th>
                    <th className="text-left py-2 font-medium text-foreground">Problem</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { service: "Formspree", problem: "Requires external form setup" },
                    { service: "EmailJS", problem: "Requires SDK + templates" },
                    { service: "SMTP", problem: "Requires backend server" },
                    { service: "Serverless", problem: "Requires deployment pipeline" },
                    {
                      service: "Inboxit ✨",
                      problem: "Works directly with your existing form",
                    },
                  ].map((row) => (
                    <tr
                      key={row.service}
                      className={cn(
                        "border-b border-border/50",
                        row.service.includes("Inboxit") && "text-primary font-medium"
                      )}
                    >
                      <td className="py-2 pr-4 font-medium">{row.service}</td>
                      <td className="py-2">{row.problem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <hr className="border-border mb-12" />

          {/* Security */}
          <section id="security" className="mb-16">
            <h2 className="scroll-mt-20 text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "API key authentication",
                "Rate limiting",
                "Input validation",
                "Honeypot spam protection",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* ── Right TOC (xl only) ────────────────────────────────────────── */}
        <aside className="hidden xl:flex flex-col w-52 shrink-0 border-l border-border">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-4 scrollbar-thin">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              On this page
            </p>
            <ul className="space-y-1.5">
              {DOC_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      "block text-xs leading-snug transition-colors",
                      activeSection === s.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
