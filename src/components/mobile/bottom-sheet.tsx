"use client";

import { useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react";

type BottomSheetProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}>;

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  // Impede o scroll do fundo quando a gaveta está aberta
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* OVERLAY ESCURO */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* A GAVETA */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 rounded-t-[32px] p-6 z-50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* TRACINHO SUPERIOR */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>

          {/* BOTÃO DE FECHAR */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTEÚDO */}
        {children ?? (
          <div className="flex flex-col gap-3 pb-4">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
              <Edit2 size={18} /> Editar Transação
            </button>

            <button className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <Trash2 size={18} /> Excluir
            </button>
          </div>
        )}
      </div>
    </>
  );
}