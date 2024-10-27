import { v4 as uuid } from "uuid";
import { db, JoinColumn, Selection, Table, Type } from "../config/database";
import { Purchase, PurchaseStatus } from "../data/models/purchase";
import { User } from "../data/models/user";
import { getCart } from "./cart_service";
import { Cart } from "../data/models/cart";
import reshape from "../utils/reshape";

export class EmptyCartException extends Error {
  constructor() {
    super("Cannot checkout empty cart");
  }
}
export async function getPurchaseByReference(
  reference: string,
): Promise<Purchase> {
  const purchase = reshape(
    await db<Purchase>(Type<Table>("purchase"))
      .where("reference", reference)
      .leftJoin(
        Type<Table>("carts"),
        Type<JoinColumn>("carts.cart_id"),
        Type<JoinColumn>("purchase.cart_id"),
      )

      .leftJoin(
        Type<Table>("cart_book"),
        Type<JoinColumn>("carts.cart_id"),
        Type<JoinColumn>("cart_book.cart_id"),
      )
      .leftJoin(
        Type<Table>("books"),
        Type<JoinColumn>("cart_book.book_id"),
        Type<JoinColumn>("books.book_id"),
      )
      .leftJoin(
        Type<Table>("book_authors"),
        Type<JoinColumn>("books.book_id"),
        Type<JoinColumn>("book_authors.book_id"),
      )
      .leftJoin(
        Type<Table>("authors"),
        Type<JoinColumn>("book_authors.author_id"),
        Type<JoinColumn>("authors.author_id"),
      )
      .select(
        Type<Selection[]>([
          "purchase.cart_id",
          "purchase.purchase_price",
          "purchase.created_at",
          "purchase.completed_at",
          "purchase.status",
          "purchase.reference",
          "carts.cart_id as cart.cart_id",
          "carts.checked_out as cart.checked_out",
          "books.book_id as cart.books[].book_id",
          "price as cart.books[].price",
          "title as cart.books[].title",
          "book_cover_url as cart.books[].book_cover_url",
          "description as cart.books[].description",
          "books.created_at as cart.books[].created_at",
          "authors.name as cart.books[].authors[].name",
          "authors.author_id as cart.books[].authors[].id",
        ]),
      ),
  )[0];

  return purchase;
}

export async function checkout(user: Pick<User, "user_id">, cart_id: number) {
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
  await db<Purchase>(Type<Table>("purchase"))
    .where("reference", reference)
    .update("status", status);
}
