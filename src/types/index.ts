export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Account {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  is_paid: boolean;
  date: string;
  description: string;
  category_id: string;
  account_id: string;
  attachment_url?: string;
  ignore_transaction: boolean;
  observation?: string;
  is_fixed: boolean;
  repeat: boolean;
  repeat_times?: number;
  repeat_frequency?: 'MONTHS' | 'WEEKS' | 'DAYS';
  type: TransactionType;
  created_at: string;
  user_id: string;
}
