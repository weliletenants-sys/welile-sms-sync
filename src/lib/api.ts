import { supabase } from './supabase';
import {
  DeviceRegisterRequest,
  DeviceRegisterResponse,
  SmsSyncRequest,
  SmsSyncResponse
} from '@/types/transaction';

const SUPABASE_URL = 'https://dtcoxihxkcsvwaovgwvd.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Y294aWh4a2Nzdndhb3Znd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzUxNzQsImV4cCI6MjA3NTg1MTE3NH0.4nBijQDZqsmbBAdksahbelnkNH6zK8k17uusQl4mIqE';

/**
 * Authentication API
 */
export class AuthAPI {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current session
   */
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  /**
   * Get current user
   */
  static async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }
}

/**
 * Device API
 */
export class DeviceAPI {
  /**
   * Register a device
   */
  static async registerDevice(
    deviceName: string
  ): Promise<DeviceRegisterResponse> {
    const session = await AuthAPI.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('device-register', {
      body: { device_name: deviceName } as DeviceRegisterRequest
    });

    if (error) throw error;
    return data as DeviceRegisterResponse;
  }
}

/**
 * SMS Sync API
 */
export class SmsAPI {
  /**
   * Sync an SMS transaction to the backend
   */
  static async syncSms(request: SmsSyncRequest): Promise<SmsSyncResponse> {
    const session = await AuthAPI.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('sms-sync', {
      body: request
    });

    if (error) throw error;
    return data as SmsSyncResponse;
  }

  /**
   * Get all transactions for the current user
   */
  static async getTransactions() {
    const session = await AuthAPI.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    // This would query the transactions table
    // Adjust table name and columns based on your schema
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }
}

/**
 * Storage helper for device data
 */
export class StorageHelper {
  private static readonly DEVICE_ID_KEY = 'welile_device_id';
  private static readonly API_TOKEN_KEY = 'welile_api_token';

  static saveDeviceId(deviceId: string) {
    localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
  }

  static getDeviceId(): string | null {
    return localStorage.getItem(this.DEVICE_ID_KEY);
  }

  static saveApiToken(token: string) {
    localStorage.setItem(this.API_TOKEN_KEY, token);
  }

  static getApiToken(): string | null {
    return localStorage.getItem(this.API_TOKEN_KEY);
  }

  static clearAll() {
    localStorage.removeItem(this.DEVICE_ID_KEY);
    localStorage.removeItem(this.API_TOKEN_KEY);
  }
}
