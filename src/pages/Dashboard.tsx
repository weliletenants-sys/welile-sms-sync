import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, TrendingDown, Smartphone, Settings, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "Cash In" | "Cash Out";
  amount: number;
  network: "MTN" | "AIRTEL";
  sender: string;
  reference: string;
  timestamp: string;
}

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "Cash In",
      amount: 150000,
      network: "MTN",
      sender: "John Okello",
      reference: "MTN123456",
      timestamp: "2025-10-13T14:05:00Z"
    },
    {
      id: "2",
      type: "Cash Out",
      amount: 50000,
      network: "AIRTEL",
      sender: "Jane Auma",
      reference: "AT789012",
      timestamp: "2025-10-13T12:30:00Z"
    },
    {
      id: "3",
      type: "Cash In",
      amount: 200000,
      network: "MTN",
      sender: "Peter Mwesigwa",
      reference: "MTN654321",
      timestamp: "2025-10-13T10:15:00Z"
    }
  ]);

  const totalCashIn = transactions
    .filter(t => t.type === "Cash In")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashOut = transactions
    .filter(t => t.type === "Cash Out")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCashIn - totalCashOut;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Transactions synced");
    }, 1500);
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
                <p className="text-sm text-primary-foreground/80">+256 700 123 456</p>
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
                disabled={isRefreshing}
                className="h-8"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
          <Badge variant="secondary" className="rounded-full">
            <Smartphone className="w-3 h-3 mr-1" />
            SMS Synced
          </Badge>
        </div>

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
      </div>
    </div>
  );
};

export default Dashboard;
