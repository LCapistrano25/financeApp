import { TransactionType } from '../value-objects/transaction-type';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  user_id: string;
  created_at: string;
}