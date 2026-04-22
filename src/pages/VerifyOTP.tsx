import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const flow = searchParams.get("flow") || "signup"; // "signup" | "reset"
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);

    // Simulate API call: POST /api/verify-otp { email, otp, flow }
    await new Promise((r) => setTimeout(r, 1200));

    if (flow === "signup") {
      toast({ title: "Account verified!", description: "Welcome to Inboxit." });
      navigate("/onboarding");
    } else {
      toast({ title: "OTP verified!", description: "Set your new password." });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    }
    setIsLoading(false);
  };

  const handleResendOTP = () => {
    navigate(`/resend-otp?email=${encodeURIComponent(email)}&flow=${flow}`);
  };

  if (!email) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <Card className="border-border bg-card w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              No email provided. Please start the process again.
            </p>
            <Button asChild>
              <Link to="/signup">Go to Sign Up</Link>
            </Button>
          </CardContent>
        </Card>
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
              <ShieldCheck className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to{" "}
              <strong className="text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isExpired}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Timer */}
            <div className="text-center">
              {isExpired ? (
                <p className="text-sm text-destructive font-medium">
                  Code expired. Please request a new one.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Code expires in{" "}
                  <span
                    className={`font-mono font-semibold ${timeLeft <= 60 ? "text-destructive" : "text-foreground"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading || isExpired}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            {/* Resend */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleResendOTP}
              >
                <ReafreshCw className="h-4 w-4" />
                Resend OTP
              </Button>
            </div>

            {/* Back */}
            <Button variant="ghost" asChild className="w-full gap-2">
              <Link to={flow === "signup" ? "/signup" : "/forgot-password"}>
                <ArrowLeft className="h-4 w-4" />
                {flow === "signup"
                  ? "Back to Sign Up"
                  : "Back to Forgot Password"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
