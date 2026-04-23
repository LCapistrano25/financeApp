"use client";

import { useState } from "react";
import { LogOut, Moon, Sun, User as UserIcon, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth"; 
import Image from "next/image";
import { useTheme } from "next-themes";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { setTheme, resolvedTheme } = useTheme();

    const avatarUrl = user?.user_metadata?.avatar_url;
    const fullName = user?.user_metadata?.full_name || "Usuário";
    const email = user?.email || "";
    const isDark = resolvedTheme === "dark";

    return (
        <>
            {/* ... Gatilho e Overlay continuam exatamentes iguais ... */}
            <div className="fixed top-0 left-0 w-full h-16 flex items-center px-4 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-30">
                <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <Menu size={24} />
                </button>
                <span className="ml-4 font-bold text-xl tracking-tight">Finance</span>
            </div>

            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)} />

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0f172a] shadow-2xl border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                
                {/* ... Header e User Info iguais ... */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-4 shadow-lg rounded-full overflow-hidden border-2 border-emerald-500/20">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt="Avatar" fill sizes="80px" className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-800">
                                <UserIcon size={32} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{fullName}</h3>
                    <p className="text-sm text-slate-500 truncate max-w-full">{email}</p>
                </div>

                {/* --- NAV LINKS CORRIGIDO --- */}
                <nav className="flex-1 px-4 py-2 space-y-1">
                    {/* Botão Único de Alternar Tema */}
                    <button
                        onClick={() => {
                            setTheme(isDark ? "light" : "dark");
                            // Se quiser fechar a sidebar ao trocar de tema, descomente a linha abaixo:
                            // setIsOpen(false); 
                        }}
                        className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                    >
                        <Sun size={22} className="hidden dark:block group-hover:scale-110 transition-transform text-amber-500" />
                        <Moon size={22} className="block dark:hidden group-hover:scale-110 transition-transform text-blue-500" />
                        <span className="font-medium">Alternar tema</span>
                    </button>
                </nav>

                {/* LOGOUT */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                    <button onClick={logout} className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-semibold">
                        <LogOut size={22} />
                        Sair da conta
                    </button>
                </div>
            </aside>
        </>
    );
}
