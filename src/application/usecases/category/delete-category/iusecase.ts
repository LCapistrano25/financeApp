export interface IDeleteCategoryUseCase {
  execute(id: string): Promise<void>;
}

