export class Post {
  post_id!: number;
  user_id!: number;
  title!: string;
  slug!: string;
  content!: string;
  status!: "draft" | "published";
  published_at!: number;
  created_at!: number;
  updated_at!: number;
  tags?: number[];
}
