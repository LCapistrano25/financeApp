import { IAuthService } from "@/application/ports/iauth.service";
import { ILogoutUseCase } from "./iusecase";

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(): Promise<void> {
    await this.authService.signOut();
  }
}
