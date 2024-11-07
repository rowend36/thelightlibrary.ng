export class Comment {
  comment_id!: number;
  post_id!: number;
  user_id!: number;
  guest_name?: number;
  guest_email?: number;
  content?: number;
  created_at!: number;
  status!: "approved" | "pending" | "rejected";
}
