import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, ArrowRight, Wallet } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(\+256|0)?[37]\d{8}$/)) {
      toast.error("Please enter a valid Ugandan phone number");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      toast.success("OTP sent to " + phoneNumber);
      navigate("/verify-otp", { state: { phoneNumber } });
    }, 1500);
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
            <CardTitle className="text-2xl">Sign in with phone</CardTitle>
            <CardDescription>
              Enter your phone number to receive a verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+256 700 123 456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-11 h-12 text-base"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send you a 6-digit verification code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

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
