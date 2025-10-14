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
   * Register a device in the database
   */
  static async registerDevice(deviceName: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Generate unique device ID
    const deviceId = `WELILE-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    const apiToken = `TOKEN-${Math.random().toString(36).substr(2, 16)}`;

    const { error } = await supabase
      .from('devices')
      .insert({
        user_id: user.id,
        device_id: deviceId,
        device_name: deviceName,
        api_token: apiToken
      });

    if (error) throw error;

    return {
      status: 'registered',
      message: 'Device linked successfully',
      device_id: deviceId,
      api_token: apiToken
    };
  }

  /**
   * Get user's devices
   */
  static async getDevices() {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

/**
 * SMS Sync API
 */
export class SmsAPI {
  /**
   * Sync an SMS transaction to the database
   */
  static async syncSms(request: SmsSyncRequest) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        device_id: request.device_id,
        sender: request.sender,
        message: request.message,
        amount: request.amount,
        type: request.type,
        network: request.network,
        reference: request.reference,
        timestamp: request.timestamp
      });

    if (error) throw error;

    return {
      status: 'success',
      message: 'SMS synced and saved'
    };
  }

  /**
   * Get all transactions for the current user
   */
  static async getTransactions() {
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
