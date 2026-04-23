export function CategoryForm() {
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Nome da Categoria" 
          className="w-full p-4 text-xl font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-center"
        />
        
        <div className="flex justify-center gap-3">
          {colors.map(color => (
            <button 
              key={color}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-transform active:scale-90"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <button className="w-full p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">
        Salvar Categoria
      </button>
    </div>
  );
}