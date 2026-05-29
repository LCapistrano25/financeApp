import { supabase } from '../supabase/supabase.client';
import { IAuthService } from '../../application/services/iauth.service';
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

  clearCache(): void {
    this.currentUser = null;
  }
}

export const authService = new SupabaseAuthService();
