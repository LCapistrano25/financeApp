import { authRepository } from '../../../infrastructure/supabase/auth.repository';

export async function loginWithGoogleHandler(redirectTo: string): Promise<void> {
  // Aqui no futuro você pode colocar lógicas extras, como disparar um evento de analytics, etc.
  await authRepository.signInWithGoogle(redirectTo);
}