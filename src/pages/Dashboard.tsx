import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, TrendingDown, Smartphone, Settings, LogOut, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSmsSync } from "@/hooks/useSmsSync";
import { StorageHelper } from "@/lib/api";
import { useTransactions } from "@/hooks/useTransactions";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { syncSms, registerDevice, isSyncing } = useSmsSync();
  const { transactions, loading: transactionsLoading, refresh: refreshTransactions } = useTransactions();
  
  const [testSmsMessage, setTestSmsMessage] = useState("");
  const [showTestSms, setShowTestSms] = useState(false);
  const [deviceRegistered, setDeviceRegistered] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Check if device is registered
    const deviceId = StorageHelper.getDeviceId();
    setDeviceRegistered(!!deviceId);
  }, []);

  const handleRegisterDevice = async () => {
    try {
      const deviceName = `${navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown Device'}`;
      await registerDevice(deviceName);
      setDeviceRegistered(true);
    } catch (error) {
      console.error('Device registration failed:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const totalCashIn = transactions
    .filter(t => t.type === "Cash In")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashOut = transactions
    .filter(t => t.type === "Cash Out")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCashIn - totalCashOut;

  const handleRefresh = async () => {
    await refreshTransactions();
  };

  const handleTestSms = async () => {
    if (!testSmsMessage.trim()) {
      toast.error("Please enter an SMS message to test");
      return;
    }

    try {
      await syncSms("MTN Mobile Money", testSmsMessage);
      setTestSmsMessage("");
      setShowTestSms(false);
    } catch (error) {
      console.error("Test SMS failed:", error);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Welile SMS</h1>
                <p className="text-sm text-primary-foreground/80">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/20"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-primary-foreground hover:bg-white/20"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="max-w-2xl mx-auto px-4 -mt-24 mb-6">
        <Card className="border-0 shadow-lg bg-gradient-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="h-8"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-6">
              <p className="text-4xl font-bold">{formatAmount(balance)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {transactions.length} transactions synced
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-xs text-muted-foreground">Cash In</p>
                </div>
                <p className="text-lg font-bold text-success">{formatAmount(totalCashIn)}</p>
              </div>

              <div className="bg-destructive/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-xs text-muted-foreground">Cash Out</p>
                </div>
                <p className="text-lg font-bold text-destructive">{formatAmount(totalCashOut)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <div className="flex gap-2">
            {!deviceRegistered && (
              <Button
                onClick={handleRegisterDevice}
                size="sm"
                variant="outline"
                className="rounded-full"
              >
                <Smartphone className="w-3 h-3 mr-1" />
                Register Device
              </Button>
            )}
            {deviceRegistered && (
              <Badge variant="secondary" className="rounded-full">
                <Smartphone className="w-3 h-3 mr-1" />
                Device Registered
              </Badge>
            )}
          </div>
        </div>

        {/* Test SMS Input */}
        {deviceRegistered && (
          <Card className="border-0 shadow-sm bg-gradient-card mb-4">
            <CardContent className="p-4">
              <Button
                onClick={() => setShowTestSms(!showTestSms)}
                variant="outline"
                size="sm"
                className="w-full mb-2"
              >
                {showTestSms ? "Hide" : "Test"} SMS Parser
              </Button>
              
              {showTestSms && (
                <div className="space-y-2 mt-2">
                  <Input
                    placeholder="Paste MTN/Airtel SMS here..."
                    value={testSmsMessage}
                    onChange={(e) => setTestSmsMessage(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleTestSms}
                    disabled={isSyncing}
                    size="sm"
                    className="w-full bg-gradient-primary"
                  >
                    {isSyncing ? "Syncing..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Sync Test SMS
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Example: "You have received UGX 150,000 from John. Ref: MTN123"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {transactions.length === 0 ? (
          <Card className="border-0 shadow-sm bg-gradient-card">
            <CardContent className="p-8 text-center">
              <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No transactions yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test the SMS parser above to add your first transaction
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-card"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === "Cash In" 
                        ? "bg-success/10" 
                        : "bg-destructive/10"
                    }`}>
                      {transaction.type === "Cash In" ? (
                        <TrendingUp className={`w-5 h-5 text-success`} />
                      ) : (
                        <TrendingDown className={`w-5 h-5 text-destructive`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{transaction.sender}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            transaction.network === "MTN" 
                              ? "border-accent bg-accent/10 text-accent-foreground" 
                              : "border-destructive bg-destructive/10 text-destructive"
                          }`}
                        >
                          {transaction.network}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ref: {transaction.reference}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === "Cash In" ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.type === "Cash In" ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
