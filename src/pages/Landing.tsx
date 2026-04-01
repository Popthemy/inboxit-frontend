import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Zap,
  Shield,
  Globe,
  Code,
  Check,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Animation variants
const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
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
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const features = [
  {
    icon: Mail,
    title: "Form to Email",
    description: "Your existing form sends emails instantly. No backend, no SMTP, no rewrites.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp (Coming Soon)",
    description: "Get instant WhatsApp notifications when someone submits your form.",
  },
  {
    icon: Zap,
    title: "Plug & Play Widget",
    description: "Add one script tag. Inboxit intercepts your form and handles everything.",
  },
  {
    icon: Shield,
    title: "Honeypot Spam Protection",
    description: "Built-in honeypot field filtering. Only bots fill hidden fields — they get blocked.",
  },
  {
    icon: Globe,
    title: "Framework Agnostic",
    description: "Works with HTML, React, Vue, Angular, modals, SPAs, and CMS platforms.",
  },
  {
    icon: Code,
    title: "Async-Aware API",
    description: "Supports both script mode and programmatic mode with await. Shadow DOM toasts included.",
  },
];

const steps = [
  {
    step: "01",
    title: "Keep your form",
    description: "Use your existing HTML form — no changes needed. Just give it an ID.",
  },
  {
    step: "02",
    title: "Add one script tag",
    description: "Drop the Inboxit widget script with your API key. That's it.",
  },
  {
    step: "03",
    title: "Emails start flowing",
    description: "Form submissions land in your inbox with toast notifications built in.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, TechStart",
    content: "Inboxit saved us weeks of backend work. One script tag and our landing page had working forms in minutes.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Developer",
    content: "The simplest form-to-email I've ever used. No SDK, no templates — just drop the widget and go.",
    avatar: "MJ",
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Lead, GrowthCo",
    content: "We've increased lead capture by 40% since switching. The honeypot spam filter is a lifesaver.",
    avatar: "ER",
  },
];

const stats = [
  { value: "10M+", label: "Forms processed" },
  { value: "50K+", label: "Happy developers" },
  { value: "99.9%", label: "Uptime" },
  { value: "<100ms", label: "Avg. delivery" },
];

// Abstract Background Component
function AbstractBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Code Brackets */}
      <motion.div
        className="absolute top-20 left-[10%] text-primary/10 font-mono text-8xl font-bold"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {"{ }"}
      </motion.div>

      <motion.div
        className="absolute top-40 right-[15%] text-primary/10 font-mono text-6xl font-bold"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        {"< />"}
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-[20%] text-primary/10 font-mono text-7xl font-bold"
        animate={{ y: [0, -15, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        {"[ ]"}
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-[25%] text-primary/10 font-mono text-5xl font-bold"
        animate={{ y: [0, 15, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        {"( )"}
      </motion.div>

      {/* Floating Dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Gradient Orbs */}
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

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <motion.path
          d="M0,200 Q400,100 800,300 T1600,200"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,400 Q300,500 600,350 T1200,450"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </svg>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <AbstractBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              variants={bounceIn}
              initial="hidden"
              animate="visible"
            >
              <Star className="h-4 w-4 fill-primary" />
              <span>Trusted by 50,000+ developers</span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
              variants={bounceIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              Add a Contact Form to Your Website{" "}
              <br />
              <motion.span 
                className="text-gradient inline-block"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                No Backend Required
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              Turn any form into an email sender with one script tag.
              No server, no SMTP, no API logic. Just plug & play.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Button size="lg" className="text-lg px-8 gap-2 group" asChild>
                <Link to="/signup">
                  Start for Free 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="#how-it-works">See how it works</a>
              </Button>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-muted-foreground"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              Free forever for up to 100 submissions/month. No credit card required.
            </motion.p>
          </div>

          {/* Code Preview */}
          <motion.div
            className="mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          >
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-destructive/60"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-warning/60"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-success/60"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
              <span className="ml-2 text-xs text-muted-foreground font-mono">index.html</span>
              </div>
              <motion.pre 
                className="p-6 text-sm overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <code className="text-muted-foreground">
                  <span className="text-muted-foreground/50">{"<!-- Your existing form -->"}</span>{"\n"}
                  <span className="text-primary">&lt;form</span> <span className="text-success">id</span>=<span className="text-warning">"contact-form"</span><span className="text-primary">&gt;</span>{"\n"}
                  {"  "}<span className="text-primary">&lt;input</span> <span className="text-success">name</span>=<span className="text-warning">"name"</span> <span className="text-success">required</span> <span className="text-primary">/&gt;</span>{"\n"}
                  {"  "}<span className="text-primary">&lt;input</span> <span className="text-success">name</span>=<span className="text-warning">"email"</span> <span className="text-success">type</span>=<span className="text-warning">"email"</span> <span className="text-success">required</span> <span className="text-primary">/&gt;</span>{"\n"}
                  {"  "}<span className="text-primary">&lt;textarea</span> <span className="text-success">name</span>=<span className="text-warning">"message"</span><span className="text-primary">&gt;&lt;/textarea&gt;</span>{"\n"}
                  {"  "}<span className="text-primary">&lt;button</span> <span className="text-success">type</span>=<span className="text-warning">"submit"</span><span className="text-primary">&gt;</span>Send<span className="text-primary">&lt;/button&gt;</span>{"\n"}
                  <span className="text-primary">&lt;/form&gt;</span>{"\n"}{"\n"}
                  <span className="text-muted-foreground/50">{"<!-- Add Inboxit widget -->"}</span>{"\n"}
                  <span className="text-primary">&lt;script</span>{"\n"}
                  {"  "}<span className="text-success">src</span>=<span className="text-warning">"https://cdn.inboxit.com/widget/v1/widget.min.js"</span>{"\n"}
                  {"  "}<span className="text-success">data-api-key</span>=<span className="text-warning">"pk_live_xxx"</span>{"\n"}
                  {"  "}<span className="text-success">data-form</span>=<span className="text-warning">"contact-form"</span>{"\n"}
                  <span className="text-primary">&gt;&lt;/script&gt;</span>
                </code>
              </motion.pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={bounceIn}
              >
                <motion.div 
                  className="text-3xl sm:text-4xl font-bold text-foreground mb-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              variants={bounceIn}
            >
              Everything you need for forms
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={slideInLeft}
            >
              Powerful features that make form handling effortless
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                      whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-card/50 relative overflow-hidden">
        {/* Background decoration */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              variants={bounceIn}
            >
              Get started in 3 steps
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={slideInRight}
            >
              From zero to receiving form submissions in under 2 minutes
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className="text-6xl font-bold text-primary/20 mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  {step.step}
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-8 -right-4"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="h-8 w-8 text-primary/30" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              variants={bounceIn}
            >
              Loved by developers
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={slideInLeft}
            >
              Join thousands who've simplified their form handling
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={index === 1 ? bounceIn : index === 0 ? slideInLeft : slideInRight}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Star className="h-4 w-4 fill-warning text-warning" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-foreground mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-primary font-medium text-sm">{testimonial.avatar}</span>
                      </motion.div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: "0% 0%" }}
          animate={{ backgroundPosition: "100% 100%" }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: "radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
            backgroundSize: "100% 100%",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              variants={bounceIn}
            >
              Ready to simplify your forms?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={slideInLeft}
            >
              Start receiving form submissions in your inbox today. 
              Free forever for small projects.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={slideInRight}
            >
              <Button size="lg" className="text-lg px-8 gap-2 group" asChild>
                <Link to="/signup">
                  Get Started Free 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </motion.div>
            <motion.div 
              className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              variants={staggerContainer}
            >
              {[
                "No credit card required",
                "100 free submissions/month",
                "Cancel anytime",
              ].map((text, index) => (
                <motion.div 
                  key={text}
                  className="flex items-center gap-2"
                  variants={fadeUp}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <Check className="h-4 w-4 text-success" />
                  </motion.div>
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
