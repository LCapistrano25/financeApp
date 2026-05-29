import type { User } from '@supabase/supabase-js';

export interface IAuthService {
  /**
   * Returns the currently authenticated user or throws an error if not authenticated.
   */
  getAuthenticatedUser(): Promise<User>;
  
  /**
   * Returns the currently authenticated user or null if not authenticated.
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Signs in the user with Google OAuth.
   */
  signInWithGoogle(redirectTo: string): Promise<void>;

  /**
   * Signs out the currently authenticated user.
   */
  signOut(): Promise<void>;
}
