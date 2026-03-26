"use client";

import { useState } from "react";
import { Calendar, Moon } from "lucide-react";

export default function DashboardPage() {
  const [referenceDate] = useState("janeiro de 2026");

  return (
    <div className="flex flex-col flex-1">
      {/* Header/Navbar */}
      <header className="flex h-16 items-center justify-end px-6">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Moon size={20} fill="currentColor" />
        </button>
      </header>

      <main className="flex-1 px-4 py-8 mx-auto w-full max-w-3xl">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Mês de referência:</h2>

        <div className="relative mb-6">
          <div className="flex items-center justify-center w-full rounded-xl bg-white p-3 shadow-sm border border-gray-100 text-[#111827] font-medium text-sm">
            {referenceDate}
            <Calendar className="absolute right-4 text-gray-400" size={18} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">RENDAS</span>
            <div className="text-[#111827] font-bold text-lg">
              <span className="text-xs font-semibold mr-1 text-gray-400">R$</span>0,00
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">CONTAS</span>
            <div className="text-[#111827] font-bold text-lg">
              <span className="text-xs font-semibold mr-1 text-gray-400">R$</span>0,00
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SALDO ATUAL</span>
            <div className="text-[#111827] font-bold text-lg">
              <span className="text-xs font-semibold mr-1 text-gray-400">R$</span>0,00
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="flex h-12 items-center justify-center rounded-xl bg-[#10b981] text-white hover:bg-[#059669] transition-colors shadow-sm font-bold text-xl">
            +
          </button>
          <button className="flex h-12 items-center justify-center rounded-xl bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors shadow-sm font-bold text-xl">
            -
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-[#111827] text-lg mb-4">Rendas</h3>
          </section>

          <section>
            <h3 className="font-bold text-[#111827] text-lg mb-4">Contas</h3>
          </section>
        </div>
      </main>
    </div>
  );
}
