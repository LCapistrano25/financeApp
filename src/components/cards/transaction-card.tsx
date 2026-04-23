import { cn } from "@/lib/utils";

type TransactionCardProps = Readonly<{
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  onClick?: () => void;
}>;

export function TransactionCard({ title, category, amount, type, onClick }: TransactionCardProps) {
  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <div 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-3 flex justify-between items-center border border-gray-100 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
    >
      <div className="flex flex-col gap-1">
        <strong className="text-base text-slate-900 dark:text-slate-100 font-semibold">{title}</strong>
        <span className="text-xs text-slate-500 dark:text-slate-400">{category}</span>
      </div>
      
      <div className={cn(
        "font-bold",
        type === "income" ? "text-emerald-600 dark:text-emerald-500" : "text-red-500 dark:text-red-400"
      )}>
        {type === "income" ? "+" : "-"}{formattedAmount}
      </div>
    </div>
  );
}