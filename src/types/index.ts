export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Account {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  user_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  
  // Usaremos description como o "Título" se você não criar a coluna title
  title: string; // <-- Adicione isso no seu banco de dados!
  description?: string; 
  observation?: string;
  
  amount: number;
  currency: string;
  type: TransactionType;
  date: string; // Vem como ISO string do timestamp do banco
  
  // A LÓGICA DE ERP (Pendente vs Pago)
  is_paid: boolean;
  
  // Chaves Estrangeiras
  category_id?: string;
  account_id?: string;
  
  // Campos avançados (podemos ignorar na UI inicial, mas devem estar na tipagem)
  attachment_url?: string;
  ignore_transaction?: boolean;
  is_fixed?: boolean;
  repeat?: boolean;
  repeat_times?: number;
  repeat_frequency?: 'MONTHS' | 'WEEKS' | 'DAYS';
  
  created_at: string;
}
