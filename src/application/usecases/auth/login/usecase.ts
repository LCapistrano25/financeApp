import { IAuthService } from "@/application/ports/iauth.service";
import { ILoginUseCase } from "./iusecase";

export class LoginUseCase implements ILoginUseCase {
  constructor(private readonly authService: IAuthService) {}

  async loginWithGoogle(redirectTo: string): Promise<void> {
    await this.authService.signInWithGoogle(redirectTo);
  }
}
