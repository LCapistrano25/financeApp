"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f8f9fa] px-4">
      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-[320px] space-y-10">

        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-[40px] font-extrabold text-[#0f172a] tracking-tight">
            Finance
          </h1>
          <p className="text-[#64748b] text-[15px] leading-relaxed">
            Organize suas contas sem
            <br />
            complicação e em segundos.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full max-w-[280px] h-14 items-center justify-center gap-3 rounded-[20px] bg-[#1e293b] px-2 py-2 text-[15px] font-semibold text-white transition-all hover:bg-[#334155] focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                <GoogleIcon />
              </div>
            )}
            Entrar com Google
          </button>
        </div>
      </div>

      <div className="pb-8">
        <p className="text-[13px] text-[#94a3b8] text-center">
          Seus dados são armazenados de forma segura no seu Google Drive.
        </p>
      </div>
    </div>
  );
}
