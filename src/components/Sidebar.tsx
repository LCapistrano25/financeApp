"use client";

import { useEffect, useState } from "react";
import { LogOut, Home, Wallet, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import {User} from "@supabase/auth-js";
import Image from "next/image";

export function Sidebar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
            }
        };
        getUser();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    const avatarUrl = user?.user_metadata?.avatar_url;
    const fullName = user?.user_metadata?.full_name || "Usuário Logado";
    const email = user?.email || "";

    return (
        <aside className="w-[16rem] bg-white dark:bg-[#111827] text-[#0f172a] dark:text-white flex flex-col h-full border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all z-10 shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                <div className="text-xl font-bold tracking-tight">Finance</div>
            </div>

            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col items-center">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt="Avatar"
                        width={64}
                        height={64}
                        priority
                        className="w-16 h-16 rounded-full mb-3 border border-gray-200 dark:border-gray-700 shadow-sm object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full mb-3 bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                        <UserIcon size={32} className="text-gray-400" />
                    </div>
                )}
                <div className="text-sm font-bold truncate w-full text-center">
                    {fullName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center mt-1">
                    {email}
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                <a href="/dashboard" className="flex items-center px-3 py-2.5 bg-gray-100 dark:bg-gray-800 text-[#0f172a] dark:text-white rounded-lg group transition-colors">
                    <Home size={20} className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-[#0f172a] dark:group-hover:text-white transition-colors" />
                    <span className="font-semibold text-[13px]">Dashboard</span>
                </a>
                <button type="button" className="w-full text-left flex items-center px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0f172a] dark:hover:text-white rounded-lg group transition-colors">
                    <Wallet size={20} className="mr-3 group-hover:text-[#0f172a] dark:group-hover:text-white transition-colors" />
                    <span className="font-semibold text-[13px]">Categorias</span>
                </button>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-2.5 text-[13px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors shadow-sm border border-red-100 dark:border-transparent"
                >
                    <LogOut size={16} className="mr-2" />
                    Sair da aplicação
                </button>
            </div>
        </aside>
    );
}
