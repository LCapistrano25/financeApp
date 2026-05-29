"use client";

import * as React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CategoryType } from "@/domain/enum/category-types";
import { useCreateCategory } from "@/presentation/hooks/category/create-category/use-create-category";
import { useEditCategory } from "@/presentation/hooks/category/edit-category/use-edit-category";

type CategoryFormInitialData = {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly type: CategoryType;
};

type CategoryFormProps = Readonly<{
  initialData?: CategoryFormInitialData;
  onSuccess: () => void;
}>;

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const isEditing = !!initialData;

  const { createCategory, isLoading: isCreating } = useCreateCategory();
  const { editCategory, isLoading: isUpdating } = useEditCategory();
  const isSubmitting = isCreating || isUpdating;

  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  const [name, setName] = useState(initialData?.name ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "🏷️");
  const [color, setColor] = useState(initialData?.color ?? colors[0]);
  const [type, setType] = useState<CategoryType>(initialData?.type ?? CategoryType.EXPENSE);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return alert("Preencha o nome da categoria.");

    const payload = { name: name.trim(), icon: icon.trim() || "🏷️", color, type };

    try {
      if (isEditing && initialData) {
        await editCategory(initialData.id, payload);
      } else {
        await createCategory(payload);
      }
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao salvar categoria: " + message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 text-xl font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-center"
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase block mb-1">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CategoryType)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value={CategoryType.EXPENSE}>Despesa</option>
              <option value={CategoryType.INCOME}>Receita</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase block mb-1">Ícone</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ex: 🛒"
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Selecionar cor ${c}`}
              className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform active:scale-90 ${
                color === c ? "border-slate-900 dark:border-white" : "border-white dark:border-slate-900"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full flex justify-center items-center gap-2 p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : isEditing ? "Guardar Alterações" : "Salvar Categoria"}
      </button>
    </form>
  );
}
