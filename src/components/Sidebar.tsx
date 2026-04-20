"use client";

import { useEffect, useState } from "react";
import {
    LogOut,
    Home,
    PieChart,
    Wallet,
    User as UserIcon,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/auth-js";
import Image from "next/image";

export function Sidebar() {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) setUser(session.user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    const avatarUrl = user?.user_metadata?.avatar_url;
    const fullName = user?.user_metadata?.full_name || "Usuário";
    const email = user?.email || "";

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "/dashboard" },
        { icon: Wallet, label: "Transações", href: "#" },
        { icon: PieChart, label: "Relatórios", href: "#" },
    ];

    return (
        <aside
            className={`
                ${isOpen ? "w-64" : "w-20"}
                bg-white dark:bg-[#111827]
                h-screen
                border-r border-gray-200 dark:border-gray-800
                transition-all duration-300
                flex flex-col
            `}
        >
            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                {isOpen && (
                    <span className="font-bold text-lg">Finance</span>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ChevronRight
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* USER */}
            <div className="p-4 flex flex-col items-center border-b border-gray-200 dark:border-gray-800">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                        <UserIcon />
                    </div>
                )}

                {isOpen && (
                    <>
                        <span className="mt-2 text-sm font-semibold text-center">
                            {fullName}
                        </span>
                        <span className="text-xs text-gray-500 text-center">
                            {email}
                        </span>
                    </>
                )}
            </div>

            {/* MENU */}
            <nav className="flex-1 p-2 space-y-1">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <a
                            key={index}
                            href={item.href}
                            className="relative group flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <Icon className="min-w-[20px]" />

                            {/* LABEL */}
                            {isOpen && (
                                <span className="ml-3 text-sm font-medium">
                                    {item.label}
                                </span>
                            )}

                            {/* TOOLTIP */}
                            {!isOpen && (
                                <span className="absolute left-full ml-3 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                    {item.label}
                                </span>
                            )}
                        </a>
                    );
                })}
            </nav>

            {/* LOGOUT */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className="relative group flex items-center w-full p-3 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 text-red-600"
                >
                    <LogOut />

                    {isOpen && (
                        <span className="ml-3 text-sm font-semibold">
                            Sair
                        </span>
                    )}

                    {!isOpen && (
                        <span className="absolute left-full ml-3 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            Sair
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}