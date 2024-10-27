import { Column, db, Type } from "../config/database";
import { User } from "../data/models/user";

export async function getUserByEmail(email: string): Promise<User | null> {
  return (
    (await db<Required<User>>("users").where("email", email).first()) ?? null
  );
}

export async function setRole(user_id: number, role: string): Promise<void> {
  await db<Required<User>>("users")
    .where("user_id", user_id)
    .update("role", role);
}

export async function getUserById(user_id: number): Promise<User | null> {
  return (
    (await db<User>("users").where(Type<Column>("user_id"), user_id).first()) ??
    null
  );
}

export async function listUsers(): Promise<User[]> {
  return await db<User>("users");
}

export async function createUser(user: Partial<User>): Promise<number> {
  return (await db<User>("users").insert(user).returning("user_id"))[0].user_id;
}
