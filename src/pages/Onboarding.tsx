import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Code, Mail, Key, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import { useToast } from "@/hooks/use-toast";

const steps = [
  {
    id: "welcome",
    icon: Rocket,
    title: "Welcome to Inboxit",
    subtitle: "Let's get your first form sending emails in under 2 minutes.",
  },
  {
    id: "api-key",
    icon: Key,
    title: "Your API Key",
    subtitle: "Here's your first API key. You'll use this in the widget script.",
  },
  {
    id: "integrate",
    icon: Code,
    title: "Add the Widget",
    subtitle: "Drop this script tag into your HTML — right before </body>.",
  },
  {
    id: "done",
    icon: Check,
    title: "You're all set!",
    subtitle: "Your form is ready to send emails. Test it now.",
  },
];

const widgetCode = `<script
  src="https://cdn.inboxit.com/widget/v1/widget.min.js"
  data-api-key="pk_live_your_key_here"
  data-form="contact-form"
></script>`;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formUrl, setFormUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const finish = () => {
    toast({ title: "Setup complete!", description: "Redirecting to your dashboard." });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                animate={i === currentStep ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${i < currentStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border bg-card">
              <CardContent className="pt-8 pb-8 text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <StepIcon className="h-8 w-8 text-primary" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
                <p className="text-muted-foreground mb-8">{step.subtitle}</p>

                {/* Step Content */}
                {currentStep === 0 && (
                  <div className="text-left space-y-4 max-w-md mx-auto">
                    <div className="space-y-2">
                      <Label>What's your website URL? (optional)</Label>
                      <Input
                        placeholder="https://mysite.com"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Portfolio", "SaaS", "Landing Page", "Agency", "Blog"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="text-left max-w-md mx-auto space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Your API Key</p>
                      <code className="font-mono text-sm text-foreground select-all">pk_live_m0ck_a1b2c3d4e5f6</code>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                      <span>Emails will be delivered to: <strong className="text-foreground">john@example.com</strong></span>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="text-left max-w-lg mx-auto">
                    <CodeBlock code={widgetCode} language="html" title="Add before </body>" />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "API Key", value: "Active" },
                        { label: "Widget", value: "Ready" },
                        { label: "Delivery", value: "Enabled" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium text-success">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button variant="ghost" onClick={prev} disabled={currentStep === 0} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={next} className="gap-2">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={finish} className="gap-2">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
