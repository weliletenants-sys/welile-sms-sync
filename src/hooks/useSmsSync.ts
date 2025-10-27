import { useState, useEffect } from 'react';
import { SmsParser } from '@/lib/smsParser';
import { SmsAPI, DeviceAPI, StorageHelper } from '@/lib/api';
import { SmsSyncRequest } from '@/types/transaction';
import { toast } from 'sonner';

export function useSmsSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Listen for SMS from native Android
   */
  useEffect(() => {
    const handleNativeSms = (event: CustomEvent) => {
      const { sender, message } = event.detail;
      console.log('📱 Received SMS from Android:', sender, message);
      
      // Show notification
      toast.success(`SMS received from ${sender}`);
      
      // Automatically sync the SMS
      syncSms(sender, message);
    };

    window.addEventListener('smsReceived', handleNativeSms as EventListener);

    return () => {
      window.removeEventListener('smsReceived', handleNativeSms as EventListener);
    };
  }, []);

  /**
   * Register the current device
   */
  const registerDevice = async (deviceName: string) => {
    try {
      const response = await DeviceAPI.registerDevice(deviceName);
      
      // Store device credentials
      StorageHelper.saveDeviceId(response.device_id);
      StorageHelper.saveApiToken(response.api_token);
      
      toast.success('Device registered successfully');
      return response;
    } catch (error: any) {
      console.error('Device registration failed:', error);
      toast.error('Failed to register device: ' + error.message);
      throw error;
    }
  };

  /**
   * Parse and sync an SMS message
   */
  const syncSms = async (sender: string, message: string) => {
    setIsSyncing(true);
    
    try {
      // Check if it's a Mobile Money message
      if (!SmsParser.isMobileMoneyMessage(sender, message)) {
        console.log('Not a Mobile Money message, skipping');
        return null;
      }

      // Parse the message
      const parsed = SmsParser.parseMessage(sender, message);
      if (!parsed) {
        console.error('Failed to parse SMS message');
        toast.error('Failed to parse transaction details');
        return null;
      }

      // Get device ID
      const deviceId = StorageHelper.getDeviceId();
      if (!deviceId) {
        throw new Error('Device not registered. Please register your device first.');
      }

      // Prepare sync request
      const syncRequest: SmsSyncRequest = {
        device_id: deviceId,
        sender: parsed.sender,
        message: message,
        amount: parsed.amount,
        type: parsed.type,
        timestamp: new Date().toISOString(),
        reference: parsed.reference,
        network: parsed.network
      };

      // Sync to backend
      const response = await SmsAPI.syncSms(syncRequest);
      
      toast.success(`${parsed.type} of UGX ${parsed.amount.toLocaleString()} synced`);
      
      return {
        parsed,
        response
      };
    } catch (error: any) {
      console.error('SMS sync failed:', error);
      toast.error('Failed to sync SMS: ' + error.message);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Test the SMS parser with a sample message
   */
  const testParser = (message: string) => {
    const parsed = SmsParser.parseMessage('MTN Mobile Money', message);
    console.log('Parsed result:', parsed);
    return parsed;
  };

  return {
    isSyncing,
    registerDevice,
    syncSms,
    testParser
  };
}
