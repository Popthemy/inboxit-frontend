import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${email}`,
      });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&flow=reset`);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not send reset code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">IF</span>
              </div>
            </Link>
            <CardTitle className="text-2xl">Forgot your password?</CardTitle>
            <CardDescription>
              No worries, we'll send you reset instructions.
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

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <Button variant="ghost" asChild className="w-full mt-4 gap-2">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
