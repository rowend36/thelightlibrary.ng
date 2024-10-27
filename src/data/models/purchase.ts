import { Decimal } from "./book";
import { Cart } from "./cart";

export enum PurchaseStatus {
  success = 0,
  failure = 1,
  pending = 2,
}
export class Purchase {
  cart_id!: number;
  purchase_price!: Decimal;
  cart?: Cart;
  created_at!: Date;
  completed_at!: number | null;
  status!: PurchaseStatus;
  reference!: string;
}
