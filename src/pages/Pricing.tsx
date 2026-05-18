import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, X, Zap, Rocket, Crown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SEO } from "@/components/SEO";

const plans = [
  {
    name: "Free",
    description: "Testing & personal projects",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "forever",
    icon: Rocket,
    featured: false,
    messages: "150 messages/month",
    features: [
      { name: "150 messages/month", included: true },
      { name: "Email delivery", included: true },
      { name: "Basic dashboard access", included: true },
      { name: "Inboxit branding on emails", included: true },
      { name: "Remove branding", included: false },
      { name: "Slack delivery", included: false },
      { name: "Auto-reply", included: false },
      { name: "Webhooks", included: false },
      { name: "Analytics & export", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/signup",
  },
  {
    name: "Starter",
    description: "Freelancers & indie hackers",
    monthlyPrice: "$6",
    annualPrice: "$58",
    period: "/month",
    icon: Zap,
    featured: false,
    messages: "2,000 messages/month",
    features: [
      { name: "2,000 messages/month", included: true },
      { name: "Email delivery", included: true },
      { name: "Basic dashboard access", included: true },
      { name: "Remove Inboxit branding", included: true },
      { name: "Slack delivery", included: true },
      { name: "Basic auto-reply", included: true },
      { name: "Webhooks", included: false },
      { name: "Analytics & export", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    ctaLink: "/signup?plan=starter",
  },
  {
    name: "Pro",
    description: "Agencies & small businesses",
    monthlyPrice: "$15",
    annualPrice: "$144",
    period: "/month",
    icon: Crown,
    featured: true,
    messages: "Unlimited messages",
    features: [
      { name: "Unlimited messages", included: true },
      { name: "Email delivery", included: true },
      { name: "Full dashboard access", included: true },
      { name: "Remove Inboxit branding", included: true },
      { name: "Slack delivery", included: true },
      { name: "Advanced auto-reply", included: true },
      { name: "Webhooks", included: true },
      { name: "Analytics & export", included: true },
      { name: "Priority support", included: true },
      { name: "Custom integrations", included: true },
    ],
    cta: "Start Free Trial",
    ctaLink: "/signup?plan=pro",
  },
];

const faqs = [
  {
    question: "What is included in the Free plan?",
    answer:
      "The Free plan includes up to 150 messages per month, email delivery, basic dashboard access, and Inboxit branding on forwarded emails. It's great for testing or personal projects.",
  },
  {
    question: "Can I remove Inboxit branding from my forwarded emails?",
    answer:
      "Yes. Branding removal (clean forwarding with no mention of Inboxit) is available starting from the Starter plan ($6/month) and above.",
  },
  {
    question: "How does the auto-reply feature work?",
    answer:
      "On Starter and Pro plans, you can set up automatic replies to people who submit your forms. You can use default templates or create custom messages with dynamic fields (e.g., {name}, {email}).",
  },
  {
    question: "What happens if I exceed my monthly message limit?",
    answer:
      "You'll get an email notification. Additional messages are queued until your next billing cycle, or you can upgrade instantly to continue without interruption.",
  },
  {
    question: "Is my data and my customers' data secure?",
    answer:
      "Yes. All API keys are hashed immediately, data is encrypted in transit, and we follow industry best practices. We never sell or share your data.",
  },
  {
    question: "How easy is it to integrate Inboxit?",
    answer:
      "Extremely easy. Just add one CDN script to your site and set your form's action attribute. No backend code, no fetch/axios, and no SMTP setup required. Works with any website.",
  },
  {
    question: "Do you support Slack, Webhooks, or other channels?",
    answer:
      "Yes. Slack delivery is available from Starter plan. Webhooks are available on Pro plan for advanced integrations (Zapier, Make.com, etc.).",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can cancel anytime with no long-term contracts. Your account remains active until the end of your current billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept payments securely through Paystack Checkout..",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes. All paid plans come with a 14-day money-back guarantee. If Inboxit doesn't save you significant time, you get a full refund, no questions asked.",
  },
];

const nigeriaPricing = [
  {
    tier: "Free",
    price: "\u20A60",
    messages: "100",
    target: "Students & testing",
  },
  {
    tier: "Starter",
    price: "\u20A64,500 /mo",
    messages: "1,500",
    target: "Freelancers",
  },
  {
    tier: "Pro",
    price: "\u20A69,500 /mo",
    messages: "Unlimited",
    target: "Agencies & small businesses",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="py-20 lg:py-32">
      <SEO
        title="Pricing — Inboxit form handler plans from $0"
        description="Simple pricing for Inboxit: Free 150 messages/month, Starter $6/mo, Pro $15/mo. Email, Slack, and webhook delivery with no backend."
        path="/pricing"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Inboxit",
            description:
              "Form submission handler that delivers messages by email, Slack, or webhook with no backend required.",
            brand: { "@type": "Brand", name: "Inboxit" },
            offers: plans.map((p) => ({
              "@type": "Offer",
              name: p.name,
              price:
                (isAnnual ? p.annualPrice : p.monthlyPrice).replace(
                  /[^0-9.]/g,
                  "",
                ) || "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://inboxit-frontend.vercel.app/pricing",
            })),
          },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span
              className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Annual
            </span>
            {isAnnual && (
              <span className="bg-success/10 text-success text-xs font-semibold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={plan.featured ? "md:-mt-4 md:mb-4" : ""}
            >
              <Card
                className={`h-full relative ${
                  plan.featured
                    ? "border-primary bg-gradient-to-b from-primary/5 to-card shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.name === "Free"
                        ? ""
                        : isAnnual
                          ? "/year"
                          : plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.messages}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full mb-6"
                    variant={plan.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link to={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/50"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <Button variant="outline" size="lg">
            Contact Support
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
