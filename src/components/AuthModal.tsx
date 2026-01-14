import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, Eye, EyeOff, User, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  
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

  const handleSignIn = async () => {
    if (!signInEmail || !signInEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!signInPassword || signInPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const result = await signInWithEmail(signInEmail, signInPassword);
    setIsLoading(false);

    if (result.error) {
      if (result.error.message?.includes("user-not-found")) {
        toast.error("No account found with this email. Please sign up first.");
      } else if (result.error.message?.includes("wrong-password")) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error(result.error.message || "Sign in failed");
      }
    } else {
      toast.success("Welcome back!");
      handleClose();
    }
  };

  const handleSignUp = async () => {
    if (!signUpEmail || !signUpEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!signUpUsername || signUpUsername.trim().length < 2) {
      toast.error("Username must be at least 2 characters");
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await signUpWithEmail(signUpEmail, signUpPassword, signUpUsername);
    
    if (!result.error && result.user) {
      // Create profile in Supabase
      try {
        await supabase
          .from("profiles")
          .upsert({ 
            user_id: result.user.uid,
            email: signUpEmail,
            username: signUpUsername.trim(),
            full_name: signUpUsername.trim()
          }, { onConflict: 'user_id' });
      } catch (error) {
        console.error("Error creating profile:", error);
      }
    }
    
    setIsLoading(false);

    if (result.error) {
      if (result.error.message?.includes("email-already-in-use")) {
        toast.error("This email is already registered. Please sign in instead.");
        setActiveTab("signin");
        setSignInEmail(signUpEmail);
      } else {
        toast.error(result.error.message || "Sign up failed");
      }
    } else {
      toast.success("Welcome to CodeFyre!");
      handleClose();
    }
  };

  const handleClose = () => {
    setSignInEmail("");
    setSignInPassword("");
    setSignUpEmail("");
    setSignUpUsername("");
    setSignUpPassword("");
    setSignUpConfirmPassword("");
    setShowSignInPassword(false);
    setShowSignUpPassword(false);
    setActiveTab("signin");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome to CodeFyre
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your account or create a new one
            </p>
          </div>

          {/* Google Sign In */}
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
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Tabs for Sign In / Sign Up */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="h-12 bg-background border-border pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                    className="h-12 bg-background border-border pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="h-12 bg-background border-border pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    className="h-12 bg-background border-border pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="h-12 bg-background border-border pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                    className="h-12 bg-background border-border pl-10"
                  />
                </div>
              </div>

              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;