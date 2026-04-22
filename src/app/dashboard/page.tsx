// src/app/(dashboard)/page.tsx
"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { SummaryCard } from "@/components/cards/summary-card";
import { TransactionCard } from "@/components/cards/transaction-card"; // <-- IMPORT NOVO
import { BottomSheet } from "@/components/mobile/bottom-sheet"; // <-- IMPORT NOVO

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState("2026-01"); 

  // --- NOVOS ESTADOS PARA A GAVETA ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");

  // MOCKS: Resumo
  const totals = { income: 5000.00, expense: 2350.50, balance: 2649.50 };

  // --- NOVA FUNÇÃO PARA ABRIR A GAVETA ---
  const handleTransactionClick = (name: string) => {
    setSelectedTransaction(name);
    setIsSheetOpen(true);
  };

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

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <SummaryCard title="Rendas" amount={totals.income} type="income" />
          <SummaryCard title="Contas" amount={totals.expense} type="expense" />
          <SummaryCard title="Saldo Atual" amount={totals.balance} type="default" />
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="flex h-12 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm font-bold text-xl">
            +
          </button>
          <button className="flex h-12 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm font-bold text-xl">
            -
          </button>
        </div>

        {/* LISTAS DE TRANSAÇÕES */}
        <div className="space-y-6 pb-6">
          {/* SESSÃO DE RENDAS */}
          <section>
            <h3 className="font-bold text-lg mb-4">Rendas</h3>
            <TransactionCard 
              title="Salário" 
              category="Fixo" 
              amount={5000} 
              type="income" 
              onClick={() => handleTransactionClick("Salário")}
            />
          </section>

          {/* SESSÃO DE CONTAS */}
          <section>
            <h3 className="font-bold text-lg mb-4">Contas</h3>
            <TransactionCard 
              title="Aluguel" 
              category="Moradia" 
              amount={1500} 
              type="expense" 
              onClick={() => handleTransactionClick("Aluguel")}
            />
            <TransactionCard 
              title="Internet Fibra" 
              category="Assinaturas" 
              amount={120.50} 
              type="expense" 
              onClick={() => handleTransactionClick("Internet Fibra")}
            />
          </section>
        </div>
      </main>

      {/* --- O BOTTOM SHEET (Gaveta) FICA AQUI NO FINAL --- */}
      <BottomSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title={selectedTransaction} 
      />
      
    </div>
  );
}