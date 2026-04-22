import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Shield, Globe, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animation variants
const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const benefits = [
  {
    icon: Mail,
    title: "Never miss a message",
    description: "Every submission goes straight to your inbox.",
  },
  {
    icon: Clock,
    title: "Set up in minutes",
    description: "No backend, no config, no headaches.",
  },
  {
    icon: Globe,
    title: "Works everywhere",
    description: "HTML, React, Vue, CMS—anything.",
  },
  {
    icon: Shield,
    title: "Spam protection built-in",
    description: "Block bots automatically with honeypot filtering.",
  },
];

const steps = [
  {
    num: "1",
    title: "Keep your form",
    description: "Use your existing HTML form—no changes needed.",
  },
  {
    num: "2",
    title: "Add one script",
    description: "Drop the Inboxit widget with your API key.",
  },
  {
    num: "3",
    title: "Get submissions instantly",
    description: "Emails start flowing to your inbox.",
  },
];

// Minimal abstract background
function AbstractBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* ==============================
          SECTION 1: HERO
          ============================== */}
      <section className="relative py-20 lg:py-32">
        <AbstractBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              variants={bounceIn}
              initial="hidden"
              animate="visible"
            >
              Capture form submissions instantly-
              <motion.span
                className="text-gradient inline-block"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                no backend required
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Add one script to any form and start receiving emails in minutes.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <Button size="lg" className="text-lg px-8 gap-2 group" asChild>
                <Link to="/signup">
                  Start free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                asChild
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </motion.div>

            {/* Micro-trust */}
            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                "Free for 100 submissions/month",
                "No credit card required",
                "Takes 2 minutes to set up",
              ].map((text) => (
                <motion.span
                  key={text}
                  className="flex items-center gap-1.5"
                  variants={fadeUp}
                >
                  <Check className="h-3.5 w-3.5 text-success" />
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==============================
          SECTION 2: CODE EXAMPLE (aha moment)
          ============================== */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-center text-lg font-medium text-muted-foreground mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Works with your existing form
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  index.html
                </span>
              </div>
              <pre className="p-4 sm:p-6 text-xs sm:text-sm overflow-x-auto">
                <code className="text-muted-foreground">
                  <span className="text-muted-foreground/50">
                    {"<!-- Your existing form —no changes needed -->"}
                  </span>
                  {"\n"}
                  <span className="text-primary">&lt;form</span>{" "}
                  <span className="text-success">id</span>=
                  <span className="text-warning">"contact-form"</span>
                  <span className="text-primary">&gt;</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">&lt;input</span>{" "}
                  <span className="text-success">name</span>=
                  <span className="text-warning">"name"</span>{" "}
                  <span className="text-success">required</span>{" "}
                  <span className="text-primary">/&gt;</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">&lt;input</span>{" "}
                  <span className="text-success">name</span>=
                  <span className="text-warning">"email"</span>{" "}
                  <span className="text-success">type</span>=
                  <span className="text-warning">"email"</span>{" "}
                  <span className="text-success">required</span>{" "}
                  <span className="text-primary">/&gt;</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">&lt;textarea</span>{" "}
                  <span className="text-success">name</span>=
                  <span className="text-warning">"message"</span>
                  <span className="text-primary">&gt;&lt;/textarea&gt;</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">&lt;button</span>{" "}
                  <span className="text-success">type</span>=
                  <span className="text-warning">"submit"</span>
                  <span className="text-primary">&gt;</span>Send
                  <span className="text-primary">&lt;/button&gt;</span>
                  {"\n"}
                  <span className="text-primary">&lt;/form&gt;</span>
                  {"\n\n"}
                  <span className="text-muted-foreground/50">
                    {"<!-- Add Inboxit — one script and you're done -->"}
                  </span>
                  {"\n"}
                  <span className="text-primary">&lt;script</span>
                  {"\n"}
                  {"  "}
                  <span className="text-success">src</span>=
                  <span className="text-warning">
                    "https://cdn.inboxit.com/widget/v1/widget.min.js"
                  </span>
                  {"\n"}
                  {"  "}
                  <span className="text-success">data-api-key</span>=
                  <span className="text-warning">"pk_live_xxx"</span>
                  {"\n"}
                  {"  "}
                  <span className="text-success">data-form</span>=
                  <span className="text-warning">"contact-form"</span>
                  {"\n"}
                  <span className="text-primary">&gt;&lt;/script&gt;</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==============================
          SECTION 3: HOW IT WORKS (3 steps)
          ============================== */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-card/50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12"
            variants={bounceIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Get started in 3 steps
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.15 }}
              >
                <motion.div
                  className="text-5xl font-bold text-primary/20 mb-3"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                >
                  {step.num}
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================
          SECTION 4: CORE BENEFITS (4 cards)
          ============================== */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid sm:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={i % 2 === 0 ? slideInLeft : slideInRight}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==============================
          SECTION 5: EARLY TRUST
          ============================== */}
      <section className="py-16 lg:py-20 bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              className="text-lg sm:text-xl font-medium text-foreground mb-2"
              variants={bounceIn}
            >
              Built for developers who want to move fast.
            </motion.p>
            <motion.p className="text-muted-foreground" variants={fadeUp}>
              No bloat, no lock-in. Just the fastest way to make any form work.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ==============================
          SECTION 6: FINAL CTA
          ============================== */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-2xl sm:text-4xl font-bold text-foreground mb-4"
              variants={bounceIn}
            >
              Start receiving form submissions in minutes.
            </motion.h2>
            <motion.div className="mt-8" variants={slideInRight}>
              <Button size="lg" className="text-lg px-8 gap-2 group" asChild>
                <Link to="/signup">
                  Get started for free
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
              variants={staggerContainer}
            >
              {[
                "No credit card required",
                "100 free submissions/month",
                "Cancel anytime",
              ].map((text) => (
                <motion.span
                  key={text}
                  className="flex items-center gap-1.5"
                  variants={fadeUp}
                >
                  <Check className="h-3.5 w-3.5 text-success" />
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
