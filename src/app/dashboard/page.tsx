"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, Minus, Plus} from "lucide-react";
import { SummaryCard } from "@/components/cards/summary-card";
import { TransactionCard } from "@/components/cards/transaction-card";
import { BottomSheet } from "@/components/mobile/bottom-sheet";
import { TransactionForm } from "@/components/forms/transaction-form";
import { useTransactions } from "@/hooks/use-transactions";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types";

function getCurrentMonthYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear); 
  
  // 1. Hook limpo e puxando o "refresh" para atualizar sem F5
  const { transactions, totals, isLoading, error, refresh } = useTransactions(currentDate);

  type TransactionWithCategory = Transaction & { category?: { name: string } | null };

  // 2. Estados de Controle das Gavetas
  const [activeForm, setActiveForm] = useState<'INCOME' | 'EXPENSE' | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // 3. Guardar a transação INTEIRA selecionada (não só o ID) para podermos editar
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithCategory | null>(null);

  // Separando rendas e contas
  const typedTransactions = transactions as TransactionWithCategory[];
  const incomes = typedTransactions.filter((t) => t.type === "INCOME");
  const expenses = typedTransactions.filter((t) => t.type === "EXPENSE");

  // --- FUNÇÕES DE AÇÃO ---

  // Quando clica num card da lista
  const handleTransactionClick = (transaction: TransactionWithCategory) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  // Quando clica no botão "Editar" dentro da gaveta de detalhes
  const handleOpenEdit = () => {
    if (!selectedTransaction) return;
    setActiveForm(selectedTransaction.type); // Abre o formulário como Renda ou Despesa
    setIsDetailOpen(false); // Fecha a gaveta de opções
  };

  // Quando clica no botão "Excluir"
  const handleDelete = async () => {
    if (!selectedTransaction) return;
    const title = selectedTransaction?.title || selectedTransaction?.description;
    const confirmDelete = globalThis.confirm(`Tem certeza que deseja excluir "${title}"?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', selectedTransaction.id);
      if (error) throw error;
      
      setIsDetailOpen(false); // Fecha a gaveta
      refresh(); // <-- MÁGICA! Atualiza a tela sem dar F5
    } catch {
      alert("Erro ao excluir!");
    }
  };

  let formTitle = "Nova Transação";
  if (selectedTransaction) {
    formTitle = "Editar Transação";
  } else if (activeForm === "INCOME") {
    formTitle = "Nova Receita";
  } else if (activeForm === "EXPENSE") {
    formTitle = "Nova Despesa";
  }

  return (
    <div className="flex flex-col flex-1 bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 px-4 py-8 mx-auto w-full max-w-3xl">
        
        <h2 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
          Mês de referência:
        </h2>

        {/* SELETOR DE MÊS */}
        <div className="relative mb-6">
          <label className="flex items-center justify-center w-full rounded-xl bg-white dark:bg-slate-900 p-3 shadow-sm border border-gray-100 dark:border-slate-800 font-medium text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="month" 
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent outline-none cursor-pointer w-auto text-center color-transparent"
            />
            {/* <Calendar className="absolute right-4 text-gray-400" size={18} /> */}
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Carregando transações...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <SummaryCard title="Rendas" amount={totals.income} type="income" />
              <SummaryCard title="Contas" amount={totals.expense} type="expense" />
              <SummaryCard title="Saldo Atual" amount={totals.balance} type="default" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button 
                onClick={() => { setActiveForm('INCOME'); setSelectedTransaction(null); }}
                className="flex h-12 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm font-bold text-xl"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button 
                onClick={() => { setActiveForm('EXPENSE'); setSelectedTransaction(null); }}
                className="flex h-12 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm font-bold text-xl"
              >
                <Minus className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 pb-6">
              <section>
                <h3 className="font-bold text-lg mb-4">Rendas</h3>
                {incomes.length > 0 ? (
                  incomes.map((item) => (
                    <TransactionCard
                      key={item.id}
                      title={item.title || item.description || "Renda"}
                      category={item.category?.name || "Sem categoria"}
                      amount={item.amount}
                      type="income"
                      onClick={() => handleTransactionClick(item)} // <-- Passamos o OBJETO INTEIRO aqui
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Nenhuma renda encontrada neste mês.</p>
                )}
              </section>

              <section>
                <h3 className="font-bold text-lg mb-4">Contas</h3>
                {expenses.length > 0 ? (
                  expenses.map((item) => (
                    <TransactionCard
                      key={item.id}
                      title={item.title || item.description || "Conta"}
                      category={item.category?.name || "Sem categoria"}
                      amount={item.amount}
                      type="expense"
                      onClick={() => handleTransactionClick(item)} // <-- Passamos o OBJETO INTEIRO aqui
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Nenhuma conta encontrada neste mês.</p>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      {/* --- GAVETA 1: FORMULÁRIO (CRIAÇÃO E EDIÇÃO) --- */}
      <BottomSheet 
        isOpen={!!activeForm} 
        onClose={() => { setActiveForm(null); setSelectedTransaction(null); }}
        title={formTitle}
      >
        {activeForm && (
          <TransactionForm 
            type={activeForm} 
            initialData={selectedTransaction ?? undefined} // Passa os dados se estiver editando!
            onSuccess={() => { 
              setActiveForm(null); 
              setSelectedTransaction(null);
              refresh(); // Atualiza a tela sem F5
            }} 
          />
        )}
      </BottomSheet>

      {/* --- GAVETA 2: OPÇÕES DA TRANSAÇÃO (Editar / Excluir) --- */}
      <BottomSheet 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title={selectedTransaction?.title || selectedTransaction?.description || "Detalhes"}
      >
        <div className="flex flex-col gap-3 pb-4">
          <button 
            onClick={handleOpenEdit} // <-- AQUI CHAMAMOS A FUNÇÃO DE EDITAR
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            <Pencil className="w-5 h-5" />
            Editar Transação
          </button>
          
          <button 
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Excluir
          </button>
        </div>
      </BottomSheet>
      
    </div>
  );
}
