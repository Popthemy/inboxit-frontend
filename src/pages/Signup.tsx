import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Check } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MutedVideo } from "@/components/common/mutedVideo";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { dictionary, translations } from "@zxcvbn-ts/language-en";
zxcvbnOptions.setOptions({
  translations,
  dictionary,
});
const benefits = [
  "100 free submissions every month",
  "No credit card required",
  "Set up in under 2 minutes",
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // password strength
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [crackTime, setCrackTime] = useState("");

  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await signup(firstName, lastName, email, password, confirmPassword);

      toast({
        title: "Verification code sent!",
        description: `Check your inbox at ${email}`,
      });

      navigate(`/verify-otp?email=${encodeURIComponent(email)}&flow=signup`);
    } catch (error: any) {
      const serverMessage =
        error.response?.data?.message ||
        error.message ||
        "Account creation failed.";

      // 2. IMPORTANT: You must throw a NEW error with just the string
      // This allows your component to use 'err.message'
      // throw new prror(serverMessage);
      console.log("server error during signup",serverMessage, error);
      toast({
        title: "Error",
        description: serverMessage,
        variant: "destructive",
      });
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordScore(0);
      setPasswordFeedback("");
      setCrackTime("");
      return;
    }

    const result = zxcvbn(value, [email, firstName, lastName]);

    setPasswordScore(result.score);

    // Better feedback handling
    if (result.feedback.warning) {
      setPasswordFeedback(result.feedback.warning);
    } else if (result.feedback.suggestions.length > 0) {
      setPasswordFeedback(result.feedback.suggestions[0]);
    } else {
      setPasswordFeedback("");
    }

    // Bonus: crack time (industry-level UX)
    setCrackTime(result.crackTimesDisplay.offlineSlowHashing1e4PerSecond);
  };

  const handleSocialSignup = (provider: string) => {
    toast({
      title: "Social Mode",
      description: `${provider} signup will be available soon.`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left side - Video */}
        <div className="hidden lg:flex h-full justify-end">
          <div className="w-auto h-full rounded-2xl border border-border flex overflow-hidden">
            <MutedVideo />
          </div>
        </div>

        {/* Right side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border bg-card h-full">
            <CardHeader className="text-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 mb-4 lg:hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">IB</span>
                </div>
              </Link>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Get started with Inboxit for free
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Social Signup Buttons */}
              {/* <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleSocialSignup("Google")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleSocialSignup("GitHub")}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </Button>
              </div> */}

              {/* <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or continue with email
                </span>
              </div> */}

              {/* Email Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Last name (Surname)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Praise"
                        className="pl-10"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                      value={password}
                      onChange={handlePassword}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {password && (
                    <div className="space-y-2">
                      {/* Strength bar */}
                      <div className="h-2 w-full bg-muted rounded">
                        <div
                          className={`h-2 rounded transition-all ${
                            passwordScore === 0
                              ? "w-1/5 bg-red-500"
                              : passwordScore === 1
                                ? "w-2/5 bg-orange-500"
                                : passwordScore === 2
                                  ? "w-3/5 bg-yellow-500"
                                  : passwordScore === 3
                                    ? "w-4/5 bg-blue-500"
                                    : "w-full bg-green-500"
                          }`}
                        />
                      </div>

                      {/* Label */}
                      <p className="text-xs text-muted-foreground">
                        Strength:{" "}
                        <span className="font-medium">
                          {
                            [
                              "Very weak",
                              "Weak",
                              "Fair",
                              "Strong",
                              "Very strong",
                            ][passwordScore]
                          }
                        </span>
                      </p>

                      {/* Crack time */}
                      {password && (
                        <p className="text-xs text-muted-foreground">
                          Estimated crack time: {crackTime}
                        </p>
                      )}

                      {/* Feedback */}
                      {passwordFeedback && (
                        <p className="text-xs text-muted-foreground">
                          {passwordFeedback}
                        </p>
                      )}
                    </div>
                  )}

                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  )}
                </div>
                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={
                    isLoading ||
                    !email ||
                    !password ||
                    password !== confirmPassword ||
                    passwordScore < 2
                  }
                >
                  {isLoading ? "Creating account..." : "Create account"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
