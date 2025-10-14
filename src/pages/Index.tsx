import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Smartphone, Shield, Zap, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-lg">
            <Wallet className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your <span className="bg-gradient-primary bg-clip-text text-transparent">Mobile Money</span>
              <br />
              Companion App
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automatically sync MTN and Airtel Mobile Money SMS transactions to track your cash flow in real-time
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="h-14 px-8 text-lg bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Auto SMS Sync</h3>
              <p className="text-sm text-muted-foreground">
                Automatically captures and syncs Mobile Money SMS from MTN and Airtel to your dashboard
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-success-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                See your cash in and cash out transactions updated instantly as SMS arrive
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your SMS data stays on your device. We only sync transaction details securely
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
            <div>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">2</p>
              <p className="text-sm text-muted-foreground mt-1">Networks Supported</p>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Automatic</p>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Real-time</p>
              <p className="text-sm text-muted-foreground mt-1">Sync Speed</p>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Secure</p>
              <p className="text-sm text-muted-foreground mt-1">End-to-End</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="font-semibold">Welile SMS Companion</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Welile. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
