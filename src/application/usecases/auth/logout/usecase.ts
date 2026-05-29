import { IAuthService } from "@/application/services/iauth.service";
import { ILogoutUseCase } from "./iusecase";

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private authService: IAuthService) {}

  async execute(): Promise<void> {
    await this.authService.signOut();
  }
}
