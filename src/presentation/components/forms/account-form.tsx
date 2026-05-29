"use client";

import * as React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCreateAccount } from "@/presentation/hooks/account/create-account/use-create-account";
import { useEditAccount } from "@/presentation/hooks/account/edit-account/use-edit-account";

type AccountFormInitialData = {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
};

type AccountFormProps = Readonly<{
  initialData?: AccountFormInitialData;
  onSuccess: () => void;
}>;

export function AccountForm({ initialData, onSuccess }: AccountFormProps) {
  const isEditing = !!initialData;

  const { createAccount, isLoading: isCreating } = useCreateAccount();
  const { editAccount, isLoading: isUpdating } = useEditAccount();
  const isSubmitting = isCreating || isUpdating;

  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  const [name, setName] = useState(initialData?.name ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "🏦");
  const [color, setColor] = useState(initialData?.color ?? colors[0]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return alert("Preencha o nome da conta.");

    const payload = { name: name.trim(), icon: icon.trim() || "🏦", color };

    try {
      if (isEditing && initialData) {
        await editAccount(initialData.id, payload);
      } else {
        await createAccount(payload);
      }
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      alert("Erro ao salvar conta: " + message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col items-center py-2">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl border border-dashed border-slate-300 dark:border-slate-600"
            style={{ backgroundColor: color }}
          >
            <span aria-hidden>{icon || "🏦"}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Nome da Conta (ex: Nubank, Carteira)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase block mb-1">Ícone</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Ex: 💳"
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-end justify-end">
            <div className="flex flex-wrap justify-end gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Selecionar cor ${c}`}
                  className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform active:scale-90 ${
                    color === c ? "border-slate-900 dark:border-white" : "border-white dark:border-slate-900"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full flex justify-center items-center gap-2 p-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : isEditing ? "Guardar Alterações" : "Criar Conta"}
      </button>
    </form>
  );
}
