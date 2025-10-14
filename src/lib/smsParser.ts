import { ParsedTransaction } from '@/types/transaction';

/**
 * Parses Mobile Money SMS messages from MTN and Airtel
 * 
 * Example MTN messages:
 * - "You have received UGX 150,000 from John Okello. Your new balance is UGX 350,000. Ref: MTN123456"
 * - "You have sent UGX 50,000 to Jane Auma. Your new balance is UGX 300,000. Ref: MTN789012"
 * 
 * Example Airtel messages:
 * - "Dear customer, you have received UGX 200,000 from +256700123456. Txn ID: AT987654"
 * - "You have successfully sent UGX 75,000 to +256700987654. Balance: UGX 225,000. Txn: AT111222"
 */
export class SmsParser {
  /**
   * Determines if an SMS is a Mobile Money transaction
   */
  static isMobileMoneyMessage(sender: string, body: string): boolean {
    const senderLower = sender.toLowerCase();
    const bodyLower = body.toLowerCase();
    
    // Check if from known Mobile Money senders
    const knownSenders = ['mtn', 'airtel', 'mobile money'];
    const hasSender = knownSenders.some(s => senderLower.includes(s));
    
    // Check for Mobile Money keywords
    const keywords = ['ugx', 'received', 'sent', 'paid', 'withdrawn', 'mobile money', 'transaction'];
    const hasKeywords = keywords.some(k => bodyLower.includes(k));
    
    return hasSender || hasKeywords;
  }

  /**
   * Parses a Mobile Money SMS message and extracts transaction details
   */
  static parseMessage(sender: string, message: string): ParsedTransaction | null {
    try {
      const messageLower = message.toLowerCase();
      
      // Determine network
      const network = this.extractNetwork(message);
      if (!network) return null;

      // Extract amount
      const amount = this.extractAmount(message);
      if (!amount) return null;

      // Determine transaction type
      const type = this.extractTransactionType(message);
      
      // Extract reference
      const reference = this.extractReference(message);

      // Extract sender/recipient name or phone
      const extractedSender = this.extractSenderOrRecipient(message) || sender;

      return {
        amount,
        type,
        reference,
        network,
        sender: extractedSender
      };
    } catch (error) {
      console.error('Error parsing SMS:', error);
      return null;
    }
  }

  /**
   * Extracts the network (MTN or AIRTEL) from the message
   */
  private static extractNetwork(message: string): 'MTN' | 'AIRTEL' | null {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('mtn')) {
      return 'MTN';
    } else if (messageLower.includes('airtel')) {
      return 'AIRTEL';
    }
    
    return null;
  }

  /**
   * Extracts the amount from the message
   * Handles formats like: "UGX 150,000", "UGX150000", "UGX 150000"
   */
  private static extractAmount(message: string): number | null {
    // Match UGX followed by amount (with or without commas/spaces)
    const patterns = [
      /UGX\s*([\d,]+)/i,
      /UGX([\d,]+)/i,
      /([\d,]+)\s*UGX/i,
      /([\d,]+)UGX/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const amountStr = match[1].replace(/,/g, '');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }

    return null;
  }

  /**
   * Determines the transaction type (Cash In or Cash Out)
   */
  private static extractTransactionType(message: string): 'Cash In' | 'Cash Out' {
    const messageLower = message.toLowerCase();
    
    // Keywords indicating Cash In
    const cashInKeywords = ['received', 'receive', 'deposited', 'deposit', 'credited'];
    
    // Keywords indicating Cash Out
    const cashOutKeywords = ['sent', 'send', 'paid', 'pay', 'withdrawn', 'withdraw', 'debited', 'transferred', 'transfer'];
    
    // Check Cash In first
    if (cashInKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'Cash In';
    }
    
    // Check Cash Out
    if (cashOutKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'Cash Out';
    }
    
    // Default to Cash In if unclear
    return 'Cash In';
  }

  /**
   * Extracts the reference number from the message
   * Handles formats like: "Ref: MTN123456", "TXN: AT987654", "Reference MTN123"
   */
  private static extractReference(message: string): string | undefined {
    const patterns = [
      /(?:Ref|Reference|REF|REFERENCE)[\s:]*([A-Z0-9]+)/i,
      /(?:TXN|Txn|Transaction|TRANSACTION)[\s:]*([A-Z0-9]+)/i,
      /(?:ID|id)[\s:]*([A-Z0-9]+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return undefined;
  }

  /**
   * Extracts sender or recipient name/phone from the message
   */
  private static extractSenderOrRecipient(message: string): string | undefined {
    // Pattern for "from NAME" or "to NAME"
    const namePatterns = [
      /(?:from|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /(?:from|to)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/
    ];

    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Pattern for phone numbers
    const phonePattern = /(?:from|to)\s*(\+?\d{10,13})/i;
    const phoneMatch = message.match(phonePattern);
    if (phoneMatch && phoneMatch[1]) {
      return phoneMatch[1];
    }

    return undefined;
  }

  /**
   * Formats a phone number to Ugandan standard (+256)
   */
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 256
    if (digits.startsWith('0')) {
      return '+256' + digits.substring(1);
    }
    
    // If starts with 256, add +
    if (digits.startsWith('256')) {
      return '+' + digits;
    }
    
    // If it's just 9 digits, assume it's missing country code
    if (digits.length === 9) {
      return '+256' + digits;
    }
    
    return '+' + digits;
  }
}
