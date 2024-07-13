export class Review {
  review_id!: number;
  book_id!: number;
  user_id!: number;
  rating!: number;
  comment!: string;
  created_at?: Date;
}
