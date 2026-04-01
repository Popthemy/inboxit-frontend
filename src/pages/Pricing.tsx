import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, X, Zap, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    description: "Perfect for side projects and testing",
    price: "$0",
    period: "forever",
    icon: Rocket,
    featured: false,
    features: [
      { name: "100 submissions/month", included: true },
      { name: "1 form endpoint", included: true },
      { name: "Email notifications", included: true },
      { name: "Basic spam protection", included: true },
      { name: "Community support", included: true },
      { name: "Custom thank you page", included: false },
      { name: "File uploads", included: false },
      { name: "Webhooks", included: false },
      { name: "WhatsApp notifications", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/signup",
  },
  {
    name: "Pro",
    description: "For growing businesses and agencies",
    price: "$19",
    period: "/month",
    icon: Zap,
    featured: true,
    features: [
      { name: "10,000 submissions/month", included: true },
      { name: "Unlimited form endpoints", included: true },
      { name: "Email notifications", included: true },
      { name: "Advanced spam protection", included: true },
      { name: "Priority email support", included: true },
      { name: "Custom thank you page", included: true },
      { name: "File uploads (10MB)", included: true },
      { name: "Webhooks", included: true },
      { name: "WhatsApp notifications", included: true },
      { name: "API access", included: true },
    ],
    cta: "Start Free Trial",
    ctaLink: "/signup?plan=pro",
  },
  {
    name: "Enterprise",
    description: "For large teams with custom needs",
    price: "Custom",
    period: "",
    icon: Building2,
    featured: false,
    features: [
      { name: "Unlimited submissions", included: true },
      { name: "Unlimited form endpoints", included: true },
      { name: "All Pro features", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "SLA guarantee", included: true },
      { name: "SSO/SAML", included: true },
      { name: "Custom data retention", included: true },
      { name: "On-premise option", included: true },
      { name: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    ctaLink: "#",
  },
];

const faqs = [
  {
    question: "What counts as a submission?",
    answer: "Each form submission sent to your endpoint counts as one submission, regardless of the number of fields or file size.",
  },
  {
    question: "Can I upgrade or downgrade anytime?",
    answer: "Yes! You can change your plan at any time. When upgrading, you'll be charged the prorated amount. When downgrading, the change takes effect at the next billing cycle.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can pay via invoice.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "Yes! Pro comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "When will WhatsApp notifications be available?",
    answer: "WhatsApp notifications are currently in beta. Pro and Enterprise customers will get early access in Q1 2024.",
  },
];

export default function Pricing() {
  return (
    <div className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
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
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
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
                            feature.included ? "text-foreground" : "text-muted-foreground/50"
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
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
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
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
