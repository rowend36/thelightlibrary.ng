export class Like {
  like_id!: number;
  post_id!: number;
  user_id!: number;
  created_at!: number;
}

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

export class Media {
  media_id!: string;
  post_id!: string;
  media_url!: string;
  media_type!: string;
  alt_text!: string;
}
