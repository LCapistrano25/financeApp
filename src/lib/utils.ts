import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: string): string {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '');
  
  // Converte para centavos (número)
  const cents = Number(digits) || 0;
  
  // Formata como moeda BRL sem o símbolo R$
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
