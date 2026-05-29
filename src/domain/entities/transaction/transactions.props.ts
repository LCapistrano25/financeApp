import { RepeatFrequency } from "@/domain/enum/repeat-frequency";
import { TransactionType } from "@/domain/enum/transaction-type";

export interface TransactionProps {
  user_id: string;
  amount: number;
  currency: string;
  type: TransactionType;
  date: string;
  is_paid?: boolean;
  description?: string;
  observation?: string;
  category_id?: string;
  account_id?: string;
  attachment_url?: string;
  ignore_transaction?: boolean;
  is_fixed?: boolean;
  repeat?: boolean;
  repeat_times?: number;
  repeat_frequency?: RepeatFrequency;
  id?: string;
  created_at?: string;
}