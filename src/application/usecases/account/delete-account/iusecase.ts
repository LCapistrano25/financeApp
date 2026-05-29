export interface IDeleteAccountUseCase {
  execute(id: string): Promise<void>;
}

