import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Mail, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "initial" | "email" | "password";

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [step, setStep] = useState<AuthStep>("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useFirebaseAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);
    if (error) {
      toast.error("Failed to sign in with Google");
    } else {
      toast.success("Successfully signed in!");
      handleClose();
    }
  };

  const handleEmailNext = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setStep("password");
      setIsTransitioning(false);
    }, 500);
  };

  const handleCreateAccount = async () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    
    // Try sign up first, if user exists try sign in
    let result = await signUpWithEmail(email, password);
    if (result.error?.message?.includes("email-already-in-use")) {
      result = await signInWithEmail(email, password);
    }
    
    setIsLoading(false);
    if (result.error) {
      toast.error(result.error.message || "Authentication failed");
    } else {
      toast.success("Welcome!");
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("initial");
    setEmail("");
    setPassword("");
    setIsTransitioning(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Start Your Project</h2>
            <p className="text-muted-foreground text-sm">
              {step === "initial" && "Choose how you'd like to continue"}
              {step === "email" && "Enter your email to continue"}
              {step === "password" && "Create a secure password"}
            </p>
          </div>

          {/* Initial Step */}
          {step === "initial" && (
            <div className="space-y-4 animate-fade-in">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-background hover:bg-muted border border-border text-foreground gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                onClick={() => setStep("email")}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground gap-3"
              >
                <Mail className="w-5 h-5" />
                Enter Email
              </Button>
            </div>
          )}

          {/* Email Step */}
          {step === "email" && (
            <div 
              className={`space-y-4 ${isTransitioning ? "animate-pixel-dissolve" : "animate-fade-in"}`}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background border-border"
                  onKeyDown={(e) => e.key === "Enter" && handleEmailNext()}
                />
              </div>
              
              {!isTransitioning && (
                <Button
                  onClick={handleEmailNext}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* Password Step */}
          {step === "password" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-background border-border pl-10 pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateAccount()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
              </div>
              
              <Button
                onClick={handleCreateAccount}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          )}

          {/* Back button for non-initial steps */}
          {step !== "initial" && !isTransitioning && (
            <button
              onClick={() => setStep(step === "password" ? "email" : "initial")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
