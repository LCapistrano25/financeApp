export interface IAuthRepository {
  signInWithGoogle(redirectTo: string): Promise<void>;
  signOut(): Promise<void>;
}