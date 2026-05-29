"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { BottomSheet } from "@/presentation/components/mobile/bottom-sheet";
import { CategoryForm } from "@/presentation/components/forms/category-form";
import { useCategories } from "@/presentation/hooks/category/get-categories/use-get-categories";
import { useDeleteCategory } from "@/presentation/hooks/category/delete-category/use-delete-category";
import type { Category } from "@/domain/entities/category/category";

export default function CategoriesPage() {
  const { categories, isLoading, error, refresh } = useCategories();
  const { deleteCategory, isLoading: isDeleting } = useDeleteCategory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedCategory) return;
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory?.id) return;
    try {
      const success = await deleteCategory(selectedCategory.id);
      if (success) {
        setIsDetailOpen(false);
        refresh();
      }
    } catch {
      alert("Erro ao excluir categoria.");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 px-4 py-8 mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Categorias</h2>
          <button
            onClick={handleOpenCreate}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-sm"
            aria-label="Criar categoria"
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
            <p>Carregando categorias...</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleOpenDetail(c)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: c.color || "#e2e8f0" }}
                  >
                    <span aria-hidden>{c.icon || "🏷️"}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{c.type === "INCOME" ? "Receita" : "Despesa"}</div>
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
        title={selectedCategory ? "Editar Categoria" : "Nova Categoria"}
      >
        <CategoryForm
          initialData={
            selectedCategory
              ? {
                  id: selectedCategory.id!,
                  name: selectedCategory.name,
                  icon: selectedCategory.icon,
                  color: selectedCategory.color,
                  type: selectedCategory.type,
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
        title={selectedCategory?.name || "Detalhes"}
      >
        <div className="flex flex-col gap-3 pb-4">
          <button
            onClick={handleOpenEdit}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            <Pencil className="w-5 h-5" />
            Editar Categoria
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

