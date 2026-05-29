interface IDeleteTransactionUseCase {
  execute(id: string): Promise<void>;
}