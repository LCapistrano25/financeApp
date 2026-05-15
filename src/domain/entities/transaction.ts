import { TransactionType, RepeatFrequency } from '../value-objects/transaction-type';

export interface Transaction {
  id: string;
  user_id: string;
  
  description?: string;
  observation?: string;
  
  amount: number;
  currency: string;
  type: TransactionType;
  date: string; 
  
  is_paid: boolean;
  
  category_id?: string;
  account_id?: string;
  
  attachment_url?: string;
  ignore_transaction?: boolean;
  is_fixed?: boolean;
  repeat?: boolean;
  repeat_times?: number;
  repeat_frequency?: RepeatFrequency;
  
  created_at: string;
}