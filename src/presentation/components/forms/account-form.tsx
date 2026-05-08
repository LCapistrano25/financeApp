export function AccountForm() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl border border-dashed border-slate-300 dark:border-slate-600">
          🏦
        </div>
        <p className="text-xs text-slate-400 mt-2 font-bold uppercase">Ícone da Conta</p>
      </div>

      <input 
        type="text" 
        placeholder="Nome da Conta (ex: Nubank, Carteira)" 
        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
      />

      <button className="w-full p-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">
        Criar Conta
      </button>
    </div>
  );
}