// src/components/cards/summary-card.tsx
import { cn } from "@/lib/utils"; // Assumindo que você tem o utilitário do Shadcn/UI

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: "default" | "income" | "expense";
}

export function SummaryCard({ title, amount, type = "default" }: SummaryCardProps) {
  // Formatação de moeda nativa do JS
  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center transition-colors">
      <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-wider mb-1 uppercase">
        {title}
      </span>
      <div className={cn(
        "font-bold text-lg",
        type === "income" ? "text-emerald-600 dark:text-emerald-500" : "",
        type === "expense" ? "text-red-600 dark:text-red-500" : "",
        type === "default" ? "text-slate-900 dark:text-slate-100" : ""
      )}>
        <span className="text-xs font-semibold mr-1 opacity-50">R$</span>
        {formattedAmount}
      </div>
    </div>
  );
}