import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, ArrowRight, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Sign in failed");
      } else {
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        toast.error(error.message || "Sign up failed");
      } else {
        toast.success("Account created! Please check your email for verification.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-lg mb-2">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welile SMS
          </h1>
          <p className="text-muted-foreground">
            Your Mobile Money transaction companion
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-lg bg-gradient-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to access your Mobile Money dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <span className="text-lg">📱</span>
            </div>
            <p className="font-medium">Auto-sync SMS</p>
            <p className="text-xs text-muted-foreground">MTN & Airtel</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-sm border border-border">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
              <span className="text-lg">💰</span>
            </div>
            <p className="font-medium">Track Money</p>
            <p className="text-xs text-muted-foreground">Real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
