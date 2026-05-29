import { Account } from "@/domain/entities/account/account";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { AccountMapper } from "@/infrastructure/mappers/account.mapper";
import { supabase } from "../supabase.client";

export class AccountRepository implements IAccountRepository {
  async getAccountById(id: string): Promise<Account | null> {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }

    return AccountMapper.toDomain(data);
  }

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map(AccountMapper.toDomain);
  }

  async createAccount(account: Account): Promise<Account> {
    const { data, error } = await supabase
      .from("accounts")
      .insert(AccountMapper.toPersistence(account))
      .select()
      .single();

    if (error) throw new Error(error.message);

    return AccountMapper.toDomain(data);
  }

  async updateAccount(id: string, account: Account): Promise<Account> {
    const { data, error } = await supabase
      .from("accounts")
      .update(AccountMapper.toPersistence(account))
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return AccountMapper.toDomain(data);
  }

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from("accounts")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

export const accountRepository = new AccountRepository();
