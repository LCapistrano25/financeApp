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
      // Lógica dinâmica para redirecionamento:
      // 1. Tenta usar a variável de ambiente se ela existir.
      // 2. Se estivermos no navegador, SEMPRE usamos o origin atual como base,
      //    a menos que a variável de ambiente explicitamente aponte para um domínio de produção.
      const envRedirect = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
      let redirectTo = "/auth/callback";

      if (typeof window !== "undefined") {
        const isCurrentlyLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (envRedirect && envRedirect.startsWith('http')) {
          // Se a env existe e estamos local, ou se a env não é localhost, usamos ela
          if (isCurrentlyLocal || !envRedirect.includes('localhost')) {
            redirectTo = envRedirect;
          } else {
            // Se estamos em prod mas a env diz localhost, forçamos o origin correto
            redirectTo = `${window.location.origin}/auth/callback`;
          }
        } else {
          // Se não tem env ou é caminho relativo, usa o origin atual
          redirectTo = `${window.location.origin}/auth/callback`;
        }
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