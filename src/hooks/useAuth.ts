import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthAPI, StorageHelper } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          StorageHelper.clearAll();
        }
      }
    );

    // THEN check for existing session
    AuthAPI.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { session, user } = await AuthAPI.signIn(email, password);
      setSession(session);
      setUser(user);
      return { session, user, error: null };
    } catch (error: any) {
      return { session: null, user: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { session, user } = await AuthAPI.signUp(email, password);
      setSession(session);
      setUser(user);
      return { session, user, error: null };
    } catch (error: any) {
      return { session: null, user: null, error };
    }
  };

  const signOut = async () => {
    try {
      await AuthAPI.signOut();
      setSession(null);
      setUser(null);
      StorageHelper.clearAll();
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  };
}
