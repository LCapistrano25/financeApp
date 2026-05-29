"use client";

import { useState } from "react";
import { BottomSheet } from "@/presentation/components/mobile/bottom-sheet";
import { AccountForm } from "@/presentation/components/forms/account-form";
import { useAccounts } from "@/presentation/hooks/account/get-accounts/use-get-accounts";
import { useDeleteAccount } from "@/presentation/hooks/account/delete-account/use-delete-account";
import type { Account } from "@/domain/entities/account/account";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

export default function AccountsPage() {
  const { accounts, isLoading, error, refresh } = useAccounts();
  const { deleteAccount, isLoading: isDeleting } = useDeleteAccount();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleOpenCreate = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (account: Account) => {
    setSelectedAccount(account);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedAccount) return;
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAccount?.id) return;
    try {
      const success = await deleteAccount(selectedAccount.id);
      if (success) {
        setIsDetailOpen(false);
        refresh();
      }
    } catch {
      alert("Erro ao excluir conta.");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 px-4 py-8 mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Contas</h2>
          <button
            onClick={handleOpenCreate}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-sm"
            aria-label="Criar conta"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Carregando contas...</p>
          </div>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nenhuma conta cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((a) => (
              <button
                key={a.id}
                onClick={() => handleOpenDetail(a)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: a.color || "#e2e8f0" }}
                  >
                    <span aria-hidden>{a.icon || "🏦"}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Conta</div>
                  </div>
                </div>
                <span className="text-sm text-slate-400">Ver</span>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedAccount ? "Editar Conta" : "Nova Conta"}
      >
        <AccountForm
          initialData={
            selectedAccount
              ? {
                  id: selectedAccount.id!,
                  name: selectedAccount.name,
                  icon: selectedAccount.icon,
                  color: selectedAccount.color,
                }
              : undefined
          }
          onSuccess={() => {
            setIsFormOpen(false);
            refresh();
          }}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedAccount?.name || "Detalhes"}
      >
        <div className="flex flex-col gap-3 pb-4">
          <button
            onClick={handleOpenEdit}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            <Pencil className="w-5 h-5" />
            Editar Conta
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

