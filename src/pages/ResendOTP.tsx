import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ResendOTP() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const flow = searchParams.get("flow") || "signup";
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call: POST /api/resend-otp { email, flow }
    await new Promise((r) => setTimeout(r, 1000));

    setIsLoading(false);
    setIsSent(true);
    toast({ title: "OTP sent!", description: `A new code has been sent to ${email}` });
  };

  const handleGoToVerify = () => {
    navigate(`/verify-otp?email=${encodeURIComponent(email)}&flow=${flow}`);
  };

  if (isSent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="pt-6 text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="h-8 w-8 text-success" />
              </motion.div>
              <CardTitle className="text-2xl mb-2">Code sent!</CardTitle>
              <CardDescription className="mb-6">
                A new verification code has been sent to <strong>{email}</strong>.
                It will expire in 10 minutes.
              </CardDescription>
              <Button className="w-full gap-2" onClick={handleGoToVerify}>
                Enter OTP
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Still didn't receive it?{" "}
                <button
                  onClick={() => setIsSent(false)}
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <RefreshCw className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Resend verification code</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a new OTP code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send new code"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <Button variant="ghost" asChild className="w-full mt-4 gap-2">
              <Link to={flow === "signup" ? "/signup" : "/forgot-password"}>
                <ArrowLeft className="h-4 w-4" />
                {flow === "signup" ? "Back to Sign Up" : "Back to Forgot Password"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
