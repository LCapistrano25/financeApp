export interface ILoginUseCase {
  loginWithGoogle: (redirectTo: string) => Promise<void>;
}