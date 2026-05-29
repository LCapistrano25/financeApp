"use client";

import { useEffect } from "react";
import { useAuth } from "@/presentation/hooks/auth/use-auth";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] px-4">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1e293b] border-t-transparent"></div>
        <h1 className="text-xl font-semibold text-[#0f172a]">Saindo da sua conta...</h1>
        <p className="text-[#64748b]">Você será redirecionado em instantes.</p>
      </div>
    </div>
  );
}
