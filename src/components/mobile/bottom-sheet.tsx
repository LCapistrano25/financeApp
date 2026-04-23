"use client";

import { useEffect } from "react";
import { Edit2, Trash2, X } from "lucide-react"; // <-- OLHA O 'X' AQUI!

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode; 
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Impede o scroll do fundo quando a gaveta está aberta
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <>
      {/* OVERLAY ESCURO */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* A GAVETA */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 rounded-t-[32px] p-6 z-50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* TRACINHO SUPERIOR (Handle) */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          
          {/* O BOTÃO COM O ÍCONE 'X' */}
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Renderiza o formulário (se houver) ou os botões padrão */}
        {children ? (
          children
        ) : (
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