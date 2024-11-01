import { Tag } from "./tag";

export class Post {
  post_id!: number;
  user_id!: number;
  title!: string;
  slug!: string;
  content!: string;
  status!: "draft" | "published";
  published_at!: Date;
  created_at!: Date;
  updated_at!: Date;
  tags?: Tag[];
}
