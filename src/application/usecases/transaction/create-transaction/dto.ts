import { RepeatFrequency } from "@/domain/enum/repeat-frequency";

export interface CreateTransactionDto {
  amount: number;
  currency: string;
  type: "EXPENSE" | "INCOME";
  date: string;
  is_paid?: boolean;
  description?: string;
  observation?: string;
  category_id: string;
  account_id: string;
  attachment_url?: string;
  isRepeat?: boolean;
  ignore_transaction?: boolean;
  is_fixed?: boolean;
  repeat?: boolean;
  repeat_times?: number;
  repeat_frequency?: RepeatFrequency;
}
