import { authRepository } from '../../../infrastructure/supabase/auth.repository';

export async function logoutHandler(): Promise<void> {
  await authRepository.signOut();
}