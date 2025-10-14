export interface Transaction {
  id: string;
  type: 'Cash In' | 'Cash Out';
  amount: number;
  network: 'MTN' | 'AIRTEL';
  sender: string;
  reference: string;
  timestamp: string;
  message?: string;
}

export interface ParsedTransaction {
  amount: number;
  type: 'Cash In' | 'Cash Out';
  reference?: string;
  network: 'MTN' | 'AIRTEL';
  sender: string;
}

export interface DeviceRegisterRequest {
  device_name: string;
}

export interface DeviceRegisterResponse {
  status: string;
  message: string;
  device_id: string;
  api_token: string;
}

export interface SmsSyncRequest {
  device_id: string;
  sender: string;
  message: string;
  amount: number;
  type: 'Cash In' | 'Cash Out';
  timestamp: string;
  reference?: string;
  network: 'MTN' | 'AIRTEL';
}

export interface SmsSyncResponse {
  status: string;
  message: string;
}
