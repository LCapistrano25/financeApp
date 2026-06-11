export interface AuthenticatedUser {
  id: string;
}

export interface IAuthService {
  getAuthenticatedUser(): Promise<AuthenticatedUser>;
  getCurrentUser(): Promise<AuthenticatedUser | null>;
  signInWithGoogle(redirectTo: string): Promise<void>;
  signOut(): Promise<void>;
}
