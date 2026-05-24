import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORTAMOS O ROUTER DO NEXT
import { loginWithGoogleHandler } from '@/application/commands/auth/login-with-google.handler';
import { logoutHandler } from '@/application/commands/auth/logout.handler';
import { supabase } from '@/infrastructure/supabase/supabase.client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter(); // <-- 2. INICIAMOS O ROUTER
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Erro ao buscar sessão", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Usamos variável de ambiente para o redirecionamento, fallback para origin se não definida
      const envRedirect = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
      let redirectTo = envRedirect || "/auth/callback";

      if (!envRedirect && typeof globalThis !== "undefined" && globalThis.location) {
        redirectTo = `${globalThis.location.origin}/auth/callback`;
      }

      await loginWithGoogleHandler(redirectTo);
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err);
      setError("Falha ao conectar com o Google. Tente novamente.");
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutHandler();
      setUser(null);

      // 3. AGORA SIM, FORÇAMOS O REDIRECIONAMENTO!
      router.push('/auth/login');

    } catch (err) {
      console.error("Erro ao deslogar", err);
      setError("Falha ao sair da conta.");
      setIsLoading(false);
    }
  };

  return {
    user,
    loginWithGoogle,
    logout,
    isLoading,
    error
  };
}