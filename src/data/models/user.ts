export class User {
  user_id!: number;
  username!: string;
  email!: string;
  password_hash!: string | undefined;
  created_at?: Date;
  role!: string;
}
