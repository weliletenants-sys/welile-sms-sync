import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { toast } from 'sonner';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch transactions from the database
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = (data || []).map((row) => ({
        id: row.id,
        type: row.type as 'Cash In' | 'Cash Out',
        amount: parseFloat(row.amount.toString()),
        network: row.network as 'MTN' | 'AIRTEL',
        sender: row.sender,
        reference: row.reference || '',
        timestamp: row.timestamp,
        message: row.message
      }));

      setTransactions(formattedTransactions);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err as Error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for new transactions
  useEffect(() => {
    fetchTransactions();

    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('New transaction received:', payload);
          const newTransaction = payload.new as any;
          
          const formattedTransaction: Transaction = {
            id: newTransaction.id,
            type: newTransaction.type as 'Cash In' | 'Cash Out',
            amount: parseFloat(newTransaction.amount.toString()),
            network: newTransaction.network as 'MTN' | 'AIRTEL',
            sender: newTransaction.sender,
            reference: newTransaction.reference || '',
            timestamp: newTransaction.timestamp,
            message: newTransaction.message
          };

          setTransactions((prev) => [formattedTransaction, ...prev]);
          
          toast.success(
            `${formattedTransaction.type}: UGX ${formattedTransaction.amount.toLocaleString()}`
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          device_id: localStorage.getItem('welile_device_id') || 'unknown',
          sender: transaction.sender,
          message: transaction.message || '',
          amount: transaction.amount,
          type: transaction.type,
          network: transaction.network,
          reference: transaction.reference,
          timestamp: transaction.timestamp
        });

      if (error) throw error;

      toast.success('Transaction added successfully');
      await fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction:', err);
      toast.error('Failed to add transaction');
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    refresh: fetchTransactions,
    addTransaction
  };
}
