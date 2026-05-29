"use client";

import * as React from "react";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { TransactionType } from "@/domain/enum/transaction-type";
import { useCategories } from "@/presentation/hooks/category/get-categories/use-get-categories";
import { useAccounts } from "@/presentation/hooks/account/get-accounts/use-get-accounts";

import { useCreateTransaction } from "@/presentation/hooks/transaction/create-transaction/use-create-transaction";
import { useEditTransaction } from "@/presentation/hooks/transaction/edit-transaction/use-edit-transaction";

type TransactionFormInitialData = {
  readonly id: string;
  readonly amount: number;
  readonly description?: string;
  readonly date: string;
  readonly isPaid: boolean;
  readonly categoryId?: string;
  readonly accountId?: string;
};

type TransactionFormProps = Readonly<{
  type: TransactionType;
  initialData?: TransactionFormInitialData;
  onSuccess: () => void;
}>;

export function TransactionForm({ type, initialData, onSuccess }: TransactionFormProps) {
  const isEditing = !!initialData;

  const { createTransaction, isLoading: isCreating } = useCreateTransaction();
  const { editTransaction, isLoading: isUpdating } = useEditTransaction();
  const isSubmitting = isCreating || isUpdating;

  const { categories, isLoading: isLoadingCategories } = useCategories();
  const categoriesForType = categories.filter((c) => c.type === type);

  const { accounts, isLoading: isLoadingAccounts } = useAccounts();

  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  
  const [title, setTitle] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [isPaid, setIsPaid] = useState(initialData?.isPaid ?? true);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [accountId, setAccountId] = useState(initialData?.accountId ?? "");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || !title) return alert("Preencha o valor e o título!");

    try {
      const payload = {
        description: title,
        amount: Number.parseFloat(amount.replace(',', '.')),
        type: type,
        date: new Date(date).toISOString(),
        is_paid: isPaid,
        currency: 'BRL',
        ...(categoryId ? { category_id: categoryId } : {}),
        ...(accountId ? { account_id: accountId } : {}),
      };

      if (isEditing && initialData) {
        await editTransaction(initialData.id, payload);
      } else {
        await createTransaction(payload);
      }

      onSuccess();

    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao salvar transação: " + message);
    }
  };

  const transactionTypeName = type === TransactionType.INCOME ? "Receita" : "Despesa";

  let submitButtonContent;
  if (isSubmitting) {
    submitButtonContent = <Loader2 className="animate-spin" />;
  } else if (isEditing) {
    submitButtonContent = "Guardar Alterações";
  } else {
    submitButtonContent = `Confirmar ${transactionTypeName}`;
  }

  const typeClasses = type === TransactionType.INCOME 
    ? "bg-emerald-500 shadow-emerald-500/20" 
    : "bg-red-500 shadow-red-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center py-4">
        <label htmlFor="amount" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Valor da {transactionTypeName}
        </label>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-bold text-slate-400">R$</span>
          <input 
            id="amount"
            type="number" 
            step="0.01"
            placeholder="0.00"
            className="text-4xl font-bold bg-transparent outline-none w-40 text-center placeholder:opacity-20 text-slate-900 dark:text-slate-100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="title" className="text-xs font-bold text-slate-400 ml-1 uppercase">Título</label>
          <input 
            id="title"
            type="text" 
            placeholder="Ex: Aluguel, Salário..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100" 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="text-xs font-bold text-slate-400 ml-1 uppercase">Data</label>
            <input 
              id="date"
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none color-scheme-dark text-slate-900 dark:text-slate-100" 
            />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 ml-1 uppercase block mb-1">Status</span>
            <button 
              type="button" 
              onClick={() => setIsPaid(!isPaid)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-900 dark:text-slate-100"
            >
              <span className="text-sm font-medium">{isPaid ? 'Pago' : 'Pendente'}</span>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isPaid ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {isPaid && <Check size={14} className="text-white" />}
              </div>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="text-xs font-bold text-slate-400 ml-1 uppercase">Categoria</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isLoadingCategories}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
          >
            <option value="">{isLoadingCategories ? "Carregando..." : "Sem categoria"}</option>
            {categoriesForType.map((c) => (
              <option key={c.id} value={c.id}>
                {`${c.icon ?? "🏷️"} ${c.name}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="account" className="text-xs font-bold text-slate-400 ml-1 uppercase">Conta</label>
          <select
            id="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={isLoadingAccounts}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
          >
            <option value="">{isLoadingAccounts ? "Carregando..." : "Sem conta"}</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {`${a.icon ?? "🏦"} ${a.name}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button 
        disabled={isSubmitting}
        type="submit" 
        className={`w-full flex justify-center items-center gap-2 p-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 mt-4 ${typeClasses} disabled:opacity-50`}
      >
        {submitButtonContent}
      </button>
    </form>
  );
}
