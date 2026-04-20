'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  CheckCircle, 
  Calendar, 
  FileText, 
  Bookmark, 
  Landmark, 
  Paperclip, 
  Info, 
  Pencil, 
  Heart, 
  ChevronDown, 
  ChevronLeft,
  Pin,
  RefreshCw,
  Car
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Category, Account } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IconComponent = ({ name, ...props }: { name: string, [key: string]: unknown }) => {
  const icons: { [key: string]: React.ElementType } = {
    car: Car,
    landmark: Landmark,
    bookmark: Bookmark,
    wallet: Landmark, // Default for wallet
  };
  const Icon = icons[name.toLowerCase()] || Bookmark;
  return <Icon {...props} />;
};

export default function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  const [amount, setAmount] = useState('0,00');
  const [isPaid, setIsPaid] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [ignoreTransaction, setIgnoreTransaction] = useState(false);
  const [observation, setObservation] = useState('');
  const [showMoreDetails, setShowMoreDetails] = useState(true);
  
  // States from the image/description not in the initial text but visible
  const [isFixed, setIsFixed] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [repeatTimes, setRepeatTimes] = useState(2);
  const [repeatFrequency] = useState('Meses');

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchAccounts();
    }
  }, [isOpen]);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'EXPENSE');
    
    if (data && data.length > 0) {
      setCategories(data);
    } else {
      // Fallback para teste do design se a tabela não existir
      setCategories([
        { id: '1', name: 'Transporte', icon: 'car', color: '#facc15', type: 'EXPENSE' },
        { id: '2', name: 'Alimentação', icon: 'bookmark', color: '#ef4444', type: 'EXPENSE' },
        { id: '3', name: 'Lazer', icon: 'bookmark', color: '#3b82f6', type: 'EXPENSE' },
      ]);
    }
    if (error) console.error('Error fetching categories:', error);
  }

  async function fetchAccounts() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*');
    
    if (data && data.length > 0) {
      setAccounts(data);
    } else {
      // Fallback para teste do design se a tabela não existir
      setAccounts([
        { id: '1', name: 'Carteira', icon: 'wallet', color: '#06b6d4' },
        { id: '2', name: 'Banco', icon: 'landmark', color: '#8b5cf6' },
      ]);
    }
    if (error) console.error('Error fetching accounts:', error);
  }

  const handleSave = async () => {
    try {
      // Parse amount
      const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
      
      if (isNaN(numericAmount) || numericAmount === 0) {
        alert('Por favor, insira um valor válido maior que 0');
        return;
      }

      if (!category) {
        alert('Por favor, selecione uma categoria');
        return;
      }

      if (!account) {
        alert('Por favor, selecione uma conta');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        alert('Usuário não autenticado');
        return;
      }

      const { error } = await supabase.from('transactions').insert({
        amount: numericAmount,
        currency: 'BRL',
        is_paid: isPaid,
        date: new Date(date).toISOString(),
        description,
        category_id: category.id,
        account_id: account.id,
        ignore_transaction: ignoreTransaction,
        observation,
        is_fixed: isFixed,
        repeat: repeat,
        repeat_times: repeat ? repeatTimes : null,
        repeat_frequency: repeat ? 'MONTHS' : null, // Default to months
        type: 'EXPENSE',
        user_id: userData.user.id
      });

      if (error) throw error;

      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Erro ao salvar despesa');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden rounded-[24px] bg-[#1e1e1e] text-white shadow-2xl border border-white/5 mx-4">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between border-b border-white/10 px-8 py-5 shrink-0">
          <h2 className="text-xl font-bold tracking-tight">Nova Despesa</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-all active:scale-95">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row min-h-full">
            {/* Left Column */}
            <div className="flex-1 border-r border-white/10 p-8 space-y-8">
            {/* Amount Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-3 flex-1">
                  <Calculator size={20} className="text-gray-400" />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#ef4444]">R$</span>
                      <input 
                        type="text" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent text-3xl font-bold text-[#ef4444] outline-none placeholder:text-[#ef4444]/50"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                  BRL <ChevronDown size={14} />
                </button>
              </div>
              <p className="text-xs text-[#ef4444]">Deve ter um valor diferente de 0</p>
            </div>

            {/* Paid Toggle */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                  <CheckCircle size={20} className={cn("transition-colors", isPaid ? "text-[#ef4444]" : "text-gray-400")} />
                  <span className="text-gray-200">Foi paga</span>
                </div>
              <button 
                    onClick={() => setIsPaid(!isPaid)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors outline-none",
                      isPaid ? "bg-[#ef4444]" : "bg-gray-600"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                      isPaid ? "left-6" : "left-1"
                    )} />
                  </button>
            </div>

            {/* Date Selector */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div className="relative">
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-gray-200 outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 flex-1">
                <FileText size={20} className="text-gray-400" />
                <input 
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição"
                  className="w-full bg-transparent text-gray-200 outline-none placeholder:text-gray-500"
                />
              </div>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn("transition-colors", isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-gray-300")}
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Category Selector */}
            <div className="relative">
              <div 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between border-b border-white/10 pb-4 cursor-pointer hover:bg-white/5 px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bookmark size={20} className="text-gray-400" />
                  {category ? (
                    <div className="flex items-center gap-2 rounded-full px-3 py-1 border" style={{ backgroundColor: `${category.color}20`, borderColor: `${category.color}30` }}>
                      <IconComponent name={category.icon} size={16} style={{ color: category.color }} />
                      <span className="text-sm font-medium" style={{ color: category.color }}>{category.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Selecionar categoria</span>
                  )}
                </div>
                <ChevronDown size={20} className={cn("text-gray-400 transition-transform", isCategoryOpen && "rotate-180")} />
              </div>

              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-xl bg-[#2a2a2a] p-2 shadow-xl border border-white/10">
                  {categories.length > 0 ? categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <IconComponent name={cat.icon} size={18} style={{ color: cat.color }} />
                      <span className="text-sm text-gray-200">{cat.name}</span>
                    </button>
                  )) : (
                    <div className="p-3 text-sm text-gray-500 text-center">Nenhuma categoria encontrada</div>
                  )}
                </div>
              )}
            </div>

            {/* Account Selector */}
            <div className="relative">
              <div 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center justify-between border-b border-white/10 pb-4 cursor-pointer hover:bg-white/5 px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Landmark size={20} className="text-gray-400" />
                  {account ? (
                    <div className="flex items-center gap-2 rounded-full px-3 py-1 border" style={{ backgroundColor: `${account.color}20`, borderColor: `${account.color}30` }}>
                      <IconComponent name={account.icon} size={16} style={{ color: account.color }} />
                      <span className="text-sm font-medium" style={{ color: account.color }}>{account.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Selecionar conta</span>
                  )}
                </div>
                <ChevronDown size={20} className={cn("text-gray-400 transition-transform", isAccountOpen && "rotate-180")} />
              </div>

              {isAccountOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-xl bg-[#2a2a2a] p-2 shadow-xl border border-white/10">
                  {accounts.length > 0 ? accounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccount(acc);
                        setIsAccountOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <IconComponent name={acc.icon} size={18} style={{ color: acc.color }} />
                      <span className="text-sm text-gray-200">{acc.name}</span>
                    </button>
                  )) : (
                    <div className="p-3 text-sm text-gray-500 text-center">Nenhuma conta encontrada</div>
                  )}
                </div>
              )}
            </div>

            {/* Attach File */}
            <div className="flex items-center gap-3 py-2 cursor-pointer hover:text-white text-gray-400 transition-colors">
              <Paperclip size={20} />
              <span className="text-sm">Anexar Arquivo</span>
            </div>

            {/* Ignore Transaction */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-gray-400" />
                <span className="text-sm text-gray-200">Ignorar transação</span>
              </div>
              <button 
                onClick={() => setIgnoreTransaction(!ignoreTransaction)}
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors outline-none",
                  ignoreTransaction ? "bg-[#ef4444]" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                  ignoreTransaction ? "left-4.5" : "left-0.5"
                )} />
              </button>
            </div>

            {/* Toggle Details */}
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {showMoreDetails ? "Menos detalhes" : "Mais detalhes"}
                <ChevronLeft size={16} className={cn("transition-transform", !showMoreDetails && "rotate-180")} />
              </button>
            </div>
          </div>

          {/* Right Column */}
          {showMoreDetails && (
            <div className="flex-1 p-8 space-y-8 bg-[#1a1a1a]">
              {/* Observation */}
              <div className="flex items-start gap-3 border-b border-white/10 pb-4">
                <Pencil size={20} className="text-gray-400 mt-1" />
                <textarea 
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Observação"
                  rows={1}
                  className="w-full bg-transparent text-gray-200 outline-none placeholder:text-gray-500 resize-none"
                />
              </div>

              {/* Fixed Expense */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Pin size={20} className="text-gray-400" />
                  <span className="text-gray-200">Despesa fixa</span>
                </div>
                <button 
                  onClick={() => setIsFixed(!isFixed)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors outline-none",
                    isFixed ? "bg-[#ef4444]" : "bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                    isFixed ? "left-4.5" : "left-0.5"
                  )} />
                </button>
              </div>

              {/* Repeat */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <RefreshCw size={20} className="text-gray-400" />
                    <span className="text-gray-200">Repetir</span>
                  </div>
                  <button 
                    onClick={() => setRepeat(!repeat)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors outline-none",
                      repeat ? "bg-[#ef4444]" : "bg-gray-600"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-sm",
                      repeat ? "left-4.5" : "left-0.5"
                    )} />
                  </button>
                </div>

                {repeat && (
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex-1 border-b border-white/10 pb-1">
                      <input 
                        type="number" 
                        value={repeatTimes}
                        onChange={(e) => setRepeatTimes(Number(e.target.value))}
                        className="w-full bg-transparent text-gray-200 outline-none"
                      />
                      <span className="text-xs text-gray-500">vezes</span>
                    </div>
                    <div className="flex-1 border-b border-white/10 pb-1 flex items-center justify-between cursor-pointer">
                      <span className="text-gray-200">{repeatFrequency}</span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div></div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end gap-4 bg-[#1e1e1e] p-8 pt-4 border-t border-white/10 shrink-0">
          <button 
            onClick={handleSave}
            className="rounded-xl bg-[#2a2a2a] px-6 py-3 text-sm font-bold text-gray-300 hover:bg-[#333] transition-all active:scale-95"
          >
            SALVAR E CRIAR NOVA
          </button>
          <button 
            onClick={handleSave}
            className="rounded-xl bg-[#ef4444] px-10 py-3 text-sm font-bold text-white hover:bg-[#dc2626] transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            SALVAR
          </button>
        </div>
      </div>
    </div>
  );
}
