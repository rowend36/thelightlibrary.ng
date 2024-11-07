import { v4 as uuid } from "uuid";
import { getDatabase, Table, Type } from "../config/database";
import { Cart } from "../data/models/cart";
import { Purchase, PurchaseStatus } from "../data/models/purchase";
import { User } from "../data/models/user";
import { ModelRepository } from "../utils/model_repository";
import reshape from "../utils/reshape";
import { cartRepository, getCart } from "./cart_service";

export class EmptyCartException extends Error {
  constructor() {
    super("Cannot checkout empty cart");
  }
}

export const purchaseRepository = new ModelRepository("purchase", "cart_id", [
  "cart_id",
  "purchase_price",
  "created_at",
  "completed_at",
  "status",
  "reference",
]).hasOne({ ...cartRepository, prefix: "cart" });

export function selectPurchase() {
  return purchaseRepository.select().orderBy("completed_at", "desc", "last");
}

export async function getPurchaseByReference(
  reference: string,
): Promise<Purchase> {
  const purchase = reshape(
    await selectPurchase().where("reference", reference),
  )[0] as Purchase;
  return purchase;
}

export async function getPurchasesForUserId(
  user_id: number,
  limit = 100,
  offset = 0,
) {
  return reshape(
    await selectPurchase()
      .where("carts.user_id", user_id)
      .limit(limit)
      .offset(offset),
  );
}
export async function getPurchasesAdmin(limit = 100, offset = 0) {
  return purchaseRepository.list({ limit, offset });
}

export async function checkout(user: Pick<User, "user_id">, cart_id: number) {
  const db = getDatabase();
  return db.transaction(async (trx) => {
    const cart = await getCart(user, cart_id, trx);
    if (cart.books.length === 0) {
      throw new EmptyCartException();
    }
    if (cart.checked_out) {
      return trx<Purchase>(Type<Table>("purchase")).where("cart_id", cart_id);
    }
    const totalPrice = cart.books!.reduce(
      (a, e) => a + parseFloat(e.price ?? "0"),
      0,
    );
    trx
      .insert(
        cart.books!.map((e) => ({
          cart_id: cart_id,
          book_id: e.book_id,
          book_price: e.price,
        })),
      )
      .onConflict(["cart_id", "book_id"])
      .merge(["book_price"]);
    const purchase: Purchase = {
      reference: uuid(),
      cart_id,
      purchase_price: totalPrice.toFixed(2),
      created_at: new Date(),
      completed_at: null,
      status: PurchaseStatus.pending,
    };
    await trx<Cart>(Type<Table>("carts")).update("checked_out", true);
    await trx<Purchase>(Type<Table>("purchase")).insert(purchase);
    purchase.cart = cart;
    return purchase;
  });
}

export async function updateStatus(reference: string, status: PurchaseStatus) {
  const db = getDatabase();
  await db<Purchase>(Type<Table>("purchase"))
    .where("reference", reference)
    .update("status", status);
}
