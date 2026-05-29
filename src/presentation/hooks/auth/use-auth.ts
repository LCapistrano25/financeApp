import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORTAMOS O ROUTER DO NEXT
import { LoginUseCase } from '@/application/usecases/auth/login/usecase';
import { LogoutUseCase } from '@/application/usecases/auth/logout/usecase';
import { authService } from '@/infrastructure/services/supabase-auth.service';
import { supabase } from '@/infrastructure/supabase/supabase.client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter(); // <-- 2. INICIAMOS O ROUTER
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loginUseCase = new LoginUseCase(authService);
  const logoutUseCase = new LogoutUseCase(authService);

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
      // Simplificamos a lógica de redirecionamento:
      // Se houver uma variável de ambiente, usamos ela como base.
      // Caso contrário, usamos o origin atual.
      const envRedirect = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
      const origin = typeof window !== "undefined" ? window.location.origin : '';
      
      let baseRedirect = envRedirect || origin;
      
      // Remove barra ao final se existir para evitar duplicação
      baseRedirect = baseRedirect.replace(/\/$/, '');

      // SEMPRE garantimos que o caminho seja /auth/callback
      // Se a variável já tiver o caminho, não duplicamos
      const redirectTo = baseRedirect.includes('/auth/callback') 
        ? baseRedirect 
        : `${baseRedirect}/auth/callback`;

      await loginUseCase.loginWithGoogle(redirectTo);
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err);
      setError("Falha ao conectar com o Google. Tente novamente.");
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUseCase.execute();
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