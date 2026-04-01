import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Zap, Shield, Bell, Layers } from "lucide-react";

// Script Mode Examples
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

export default function Documentation() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inboxit Documentation</h1>
        <p className="text-muted-foreground">Turn any form into an email sender with one script.</p>
      </div>

      <div className="grid gap-6">
        {/* What is Inboxit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                What is Inboxit?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Inboxit lets you send messages from <strong>any website form</strong> — without building a backend, 
                configuring SMTP, or writing API logic.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Static HTML", "React / Vue / Angular", "Modals & SPAs", "CMS Platforms"].map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Add one script. Keep your form. Inboxit handles the rest.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Get up and running in 2 steps:</p>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                  Create your form with honeypot protection
                </h4>
                <CodeBlock code={htmlFormExample} language="html" title="Your Form (index.html)" />
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                  Add the Inboxit script
                </h4>
                <CodeBlock code={scriptTagExample} language="html" title="Add before &lt;/body&gt;" />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong>Done!</strong> Inboxit now handles form submission, toast notifications, form reset, and spam filtering automatically.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Usage Modes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-6">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong>Important:</strong> Inboxit supports two modes. Do <strong>NOT</strong> mix them.
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
                      { icon: CheckCircle, text: "Include hidden 'website' field for spam protection", ok: true },
                      { icon: XCircle, text: "Do not remove form before submit", ok: false },
                      { icon: XCircle, text: "Do not manually call sendEmail", ok: false },
                      { icon: XCircle, text: "Do not use in React/Vue controlled forms", ok: false },
                    ].map((rule) => (
                      <div key={rule.text} className="flex items-center gap-2 text-sm">
                        <rule.icon className={`h-4 w-4 ${rule.ok ? 'text-success' : 'text-destructive'}`} />
                        <span className="text-muted-foreground">{rule.text}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="programmatic" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Use with React, Vue, Angular, or dynamic/modal forms where you need full control.
                  </p>
                  <CodeBlock code={reactSetupExample} language="javascript" title="Setup (React Example)" />
                  <CodeBlock code={reactSubmitExample} language="javascript" title="Submit Handler" />
                  <div className="grid gap-2 mt-4">
                    {[
                      { icon: CheckCircle, text: "Use await inboxit(...)", ok: true },
                      { icon: CheckCircle, text: "Handle form reset yourself", ok: true },
                      { icon: CheckCircle, text: "Implement honeypot check (website field)", ok: true },
                      { icon: XCircle, text: "Do NOT use data-form attribute", ok: false },
                    ].map((rule) => (
                      <div key={rule.text} className="flex items-center gap-2 text-sm">
                        <rule.icon className={`h-4 w-4 ${rule.ok ? 'text-success' : 'text-destructive'}`} />
                        <span className="text-muted-foreground">{rule.text}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Script Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Script Attributes</CardTitle>
            </CardHeader>
            <CardContent>
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
                      { attr: "data-form", req: false, desc: "Form ID to auto-bind (Script Mode only)" },
                      { attr: "data-subject", req: false, desc: "Email subject line" },
                      { attr: "data-success-message", req: false, desc: "Custom success toast message" },
                      { attr: "data-error-message", req: false, desc: "Custom error toast message" },
                    ].map((row) => (
                      <tr key={row.attr} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-mono text-xs text-foreground">{row.attr}</td>
                        <td className="py-2 pr-4">
                          <Badge variant={row.req ? "default" : "secondary"} className="text-xs">
                            {row.req ? "Required" : "Optional"}
                          </Badge>
                        </td>
                        <td className="py-2">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 font-mono text-sm">init</h4>
                <CodeBlock code={initCommand} language="javascript" />
              </div>
              <div>
                <h4 className="font-medium mb-2 font-mono text-sm">sendEmail</h4>
                <CodeBlock code={sendCommand} language="javascript" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spam Protection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Spam Protection (Honeypot)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add a hidden field named <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">website</code> to your form. Inboxit automatically discards submissions where this field is filled — only bots fill hidden fields.
              </p>
              <CodeBlock
                code={`<!-- Add inside your form -->
<input type="text" name="website" style="display:none" autocomplete="off" />`}
                language="html"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Toast Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Toast Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Inboxit automatically shows toast notifications using <strong>Shadow DOM</strong> — zero CSS conflicts with your site.
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Inboxit uses a <strong>Command Queue Pattern</strong> with async resolution.
              </p>
              <CodeBlock code={architectureDiagram} language="text" title="Flow" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Common Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">❌ Mixing both modes</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Using <code className="font-mono bg-muted px-1 rounded">data-form</code> AND calling <code className="font-mono bg-muted px-1 rounded">inboxit("sendEmail")</code> causes duplicate requests, 405 errors, and double toasts.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">❌ Form not in DOM</h4>
                  <p className="text-xs text-muted-foreground">
                    Inboxit cannot detect forms inside closed modals or unmounted components. Use Programmatic Mode for dynamic forms.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">❌ Not using await</h4>
                  <CodeBlock
                    code={`inboxit("sendEmail", data);       // ❌ Wrong
await inboxit("sendEmail", data);  // ✅ Correct`}
                    language="javascript"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why Inboxit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Why Inboxit?</CardTitle>
            </CardHeader>
            <CardContent>
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
                      { service: "Inboxit ✨", problem: "Works directly with your existing form" },
                    ].map((row) => (
                      <tr key={row.service} className={`border-b border-border/50 ${row.service.includes('Inboxit') ? 'text-primary font-medium' : ''}`}>
                        <td className="py-2 pr-4 font-medium">{row.service}</td>
                        <td className="py-2">{row.problem}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {["API key authentication", "Rate limiting", "Input validation", "Honeypot spam protection"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
