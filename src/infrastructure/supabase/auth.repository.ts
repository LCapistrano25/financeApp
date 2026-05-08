import { supabase } from './supabase.client';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthRepository implements IAuthRepository {
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
  }
}

export const authRepository = new AuthRepository();