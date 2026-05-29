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
}
