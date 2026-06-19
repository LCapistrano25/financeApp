import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogoutUseCase } from '@/application/usecases/auth/logout/usecase';
import { authService } from '@/infrastructure/services/supabase-auth.service';
import { supabase } from '@/infrastructure/repositories/supabase/supabase.client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logoutUseCase = new LogoutUseCase(authService);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Erro ao buscar sessao", err);
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
      router.push('/auth/google');
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
    error,
  };
}
