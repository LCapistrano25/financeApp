import { supabase } from '../repositories/supabase/supabase.client';
import { IAuthService } from './iauth.service';
import type { User } from '@supabase/supabase-js';

export class SupabaseAuthService implements IAuthService {
  private currentUser: User | null = null;

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      this.currentUser = null;
      return null;
    }

    this.currentUser = session.user;
    return this.currentUser;
  }

  async getAuthenticatedUser(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error("Você precisa estar logado para realizar esta operação.");
    }
    return user;
  }

  async signInWithGoogle(redirectTo: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) throw new Error(error.message);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    this.clearCache();
  }

  /**
   * Limpa o cache local do usuário.
   */
  clearCache(): void {
    this.currentUser = null;
  }
}

export const authService = new SupabaseAuthService();
