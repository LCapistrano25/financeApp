"use client";

import { useState } from "react";
import { Calendar, Moon } from "lucide-react";
import ExpenseModal from "@/components/ExpenseModal";
import IncomeModal from "@/components/IncomeModal";

export default function DashboardPage() {
  const [referenceDate] = useState("janeiro de 2026");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

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
            <Calendar className="absolute right-4 text-gray-400" size={18} />
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
                +
              </button>
              <button 
                onClick={() => { setActiveForm('EXPENSE'); setSelectedTransaction(null); }}
                className="flex h-12 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm font-bold text-xl"
              >
                -
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
                      category={(item as any).category?.name || "Sem categoria"}
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
                      category={(item as any).category?.name || "Sem categoria"}
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex h-12 items-center justify-center rounded-xl bg-[#10b981] text-white hover:bg-[#059669] transition-colors shadow-sm font-bold text-xl"
          >
            +
          </button>
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex h-12 items-center justify-center rounded-xl bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors shadow-sm font-bold text-xl"
          >
            -
          </button>
        </div>

        <ExpenseModal 
          isOpen={isExpenseModalOpen} 
          onClose={() => setIsExpenseModalOpen(false)} 
        />

        <IncomeModal 
          isOpen={isIncomeModalOpen} 
          onClose={() => setIsIncomeModalOpen(false)} 
        />

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-[#111827] text-lg mb-4">Rendas</h3>
          </section>

          <section>
            <h3 className="font-bold text-[#111827] text-lg mb-4">Contas</h3>
          </section>
        </div>
      </main>

      {/* --- GAVETA 1: FORMULÁRIO (CRIAÇÃO E EDIÇÃO) --- */}
      <BottomSheet 
        isOpen={!!activeForm} 
        onClose={() => { setActiveForm(null); setSelectedTransaction(null); }}
        title={selectedTransaction ? "Editar Transação" : (activeForm === 'INCOME' ? "Nova Receita" : "Nova Despesa")}
      >
        {activeForm && (
          <TransactionForm 
            type={activeForm} 
            initialData={selectedTransaction} // Passa os dados se estiver editando!
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
              ✏️ Editar Transação
          </button>
          
          <button 
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
              🗑️ Excluir
          </button>
        </div>
      </BottomSheet>
      
    </div>
  );
}