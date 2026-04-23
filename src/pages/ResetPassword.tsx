import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { dictionary, translations } from "@zxcvbn-ts/language-en";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const navigate = useNavigate();
  const { verifyPasswordReset } = useAuth();
  const { toast } = useToast();

  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [crackTime, setCrackTime] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (!value) {
      setPasswordScore(0);
      setPasswordFeedback("");
      setCrackTime("");
      return;
    }

    const result = zxcvbn(value, [email]);

    setPasswordScore(result.score);

    setPasswordFeedback(
      result.feedback.warning || result.feedback.suggestions[0] || "",
    );

    setCrackTime(result.crackTimesDisplay.offlineSlowHashing1e4PerSecond);
  };

  zxcvbnOptions.setOptions({
    dictionary,
    translations,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    if (otp.length !== 6) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 2) {
      setError("Password is too weak");
      return;
    }
    try {
      await verifyPasswordReset(email, otp, password, confirmPassword);
      setIsReset(true);
    } catch (err: any) {
      toast({
        title: "Reset failed",
        description: err.message || "Could not reset password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
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
              <CardTitle className="text-2xl mb-2">Password reset!</CardTitle>
              <CardDescription className="mb-6">
                Your password has been successfully updated. You can now sign
                in.
              </CardDescription>
              <Button asChild className="w-full gap-2">
                <Link to="/login">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">IB</span>
              </div>
            </Link>
            <CardTitle className="text-2xl">Set new password</CardTitle>
            <CardDescription>
              Create a new password for <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
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
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              {password && (
                <div className="space-y-2">
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

                  <p className="text-xs text-muted-foreground">
                    Strength:{" "}
                    {
                      ["Very weak", "Weak", "Fair", "Strong", "Very strong"][
                        passwordScore
                      ]
                    }
                  </p>

                  {crackTime && (
                    <p className="text-xs text-muted-foreground">
                      Crack time: {crackTime}
                    </p>
                  )}

                  {passwordFeedback && (
                    <p className="text-xs text-muted-foreground">
                      {passwordFeedback}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading || (!password ||
                    !confirmPassword ||
                    password !== confirmPassword ||
                    passwordScore < 2)
                }
              >
                {isLoading ? "Resetting..." : "Reset password"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
