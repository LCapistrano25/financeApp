"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types";

type TransactionFormInitialData = {
  readonly id: Transaction["id"];
  readonly amount: Transaction["amount"];
  readonly description?: Transaction["description"];
  readonly date: Transaction["date"];
  readonly is_paid: Transaction["is_paid"];
};

interface TransactionFormProps {
  type: 'INCOME' | 'EXPENSE';
  initialData?: TransactionFormInitialData;
  onSuccess: () => void;
}

export function TransactionForm({ type, initialData, onSuccess }: TransactionFormProps) {
  // Se veio initialData, significa que estamos Editando
  const isEditing = !!initialData;

  // Estados do formulário
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  
  // OPÇÃO 2: Puxamos o valor inicial de 'description' em vez de 'title'
  const [title, setTitle] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [isPaid, setIsPaid] = useState(initialData?.is_paid ?? true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return alert("Preencha o valor e o título!");

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não logado");

      // OPÇÃO 2 APLICADA AQUI NA HORA DE SALVAR NO BANCO:
      const payload = {
        user_id: session.user.id,
        description: title, // <--- Salvamos a variável title dentro da coluna description
        amount: Number.parseFloat(amount.replace(',', '.')),
        type: type,
        date: new Date(date).toISOString(),
        is_paid: isPaid,
      };

      if (isEditing) {
        // Lógica de Atualizar
        const { error } = await supabase.from('transactions').update(payload).eq('id', initialData.id);
        if (error) throw error;
      } else {
        // Lógica de Criar
        const { error } = await supabase.from('transactions').insert(payload);
        if (error) throw error;
      }

      onSuccess(); // Sucesso! Avisa a página para fechar a gaveta e recarregar a lista.

    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao salvar transação: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center py-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Valor da {type === 'INCOME' ? 'Receita' : 'Despesa'}
        </span>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-bold text-slate-400">R$</span>
          <input 
            type="number" 
            step="0.01"
            required
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
          <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Título</label>
          <input 
            type="text" 
            required
            placeholder="Ex: Aluguel, Salário..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-slate-100" 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Data</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none color-scheme-dark text-slate-900 dark:text-slate-100" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Status</label>
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
      </div>

      <button 
        disabled={isLoading}
        type="submit" 
        className={`w-full flex justify-center items-center gap-2 p-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 mt-4 ${type === 'INCOME' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'} disabled:opacity-50`}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : (isEditing ? "Guardar Alterações" : `Confirmar ${type === 'INCOME' ? 'Receita' : 'Despesa'}`)}
      </button>
    </form>
  );
}
