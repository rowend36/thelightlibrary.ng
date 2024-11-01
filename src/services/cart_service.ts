import { Knex } from "knex";
import { db, JoinColumn, Selection, Table, Type } from "../config/database";
import { Cart } from "../data/models/cart";
import { User } from "../data/models/user";
import reshape from "../utils/reshape";

type CartRequest = number[];
export const GuestUser = {
  user_id: null,
} as const;
type RequestUser = Pick<User, "user_id"> | typeof GuestUser;

export async function setCart(user: RequestUser, request: CartRequest) {
  const cart = await db<Cart>(Type<Table>("carts"))
    .where("user_id", user.user_id)
    .where("checked_out", "<>", true)
    .select(Type<Selection>("cart_id"));

  let cart_id: number;
  if (cart.length < 1) {
    if (!request.length) return -1;
    cart_id = (
      await db<Cart>(Type<Table>("carts"))
        .insert({
          checked_out: false,
          user_id: user.user_id,
        })
        .returning("cart_id")
    )[0].cart_id;
  } else {
    cart_id = cart[0].cart_id;
  }

  if (request.length > 0) {
    try {
      await db(Type<Table>("cart_book"))
        .insert(request.map((e) => ({ cart_id, book_id: e })))
        .onConflict(["cart_id", "book_id"])
        .ignore();
    } catch (e) {
      const valid_ids = await db(Type<Table>("books"))
        .whereIn("book_id", request)
        .select("book_id");
      if (valid_ids.length < request.length) {
        throw new Error(
          "Invalid book ids - " +
            request
              .filter((f) => !valid_ids.some((e) => e.book_id === f))
              .join(", ") +
            "."
        );
      }
    }
  }

  await db(Type<Table>("cart_book"))
    .whereNotIn("book_id", request)
    .where("cart_id", cart_id)
    .delete();
  return cart_id;
}

export async function getCart(
  user: RequestUser,
  cart_id?: number,
  trx?: Knex.Transaction
): Promise<Required<Cart>> {
  let query = (trx ?? db)<Cart>(Type<Table>("carts")).where(
    "user_id",
    user.user_id
  );
  if (cart_id) {
    query = query.where(Type<JoinColumn>("carts.cart_id"), cart_id);
  } else {
    query = query.where(Type<JoinColumn>("checked_out"), "<>", true);
  }

  const cart = reshape(
    await query
      .leftJoin(
        Type<Table>("cart_book"),
        Type<JoinColumn>("carts.cart_id"),
        Type<JoinColumn>("cart_book.cart_id")
      )
      .leftJoin(
        Type<Table>("books"),
        Type<JoinColumn>("cart_book.book_id"),
        Type<JoinColumn>("books.book_id")
      )
      .leftJoin(
        Type<Table>("book_authors"),
        Type<JoinColumn>("books.book_id"),
        Type<JoinColumn>("book_authors.book_id")
      )
      .leftJoin(
        Type<Table>("authors"),
        Type<JoinColumn>("book_authors.author_id"),
        Type<JoinColumn>("authors.author_id")
      )
      .select(
        Type<Selection[]>([
          "carts.cart_id",
          "carts.checked_out",
          "books.book_id as books[].book_id",
          "price as books[].price",
          "title as books[].title",
          "book_cover_url as books[].book_cover_url",
          "description as books[].description",
          "books.created_at as books[].created_at",
          "authors.name as books[].authors[].name",
          "authors.author_id as books[].authors[].id",
        ])
      )
  );

  return (
    cart[0] ?? {
      cart_id: -1,
      books: [],
      checked_out: false,
      user_id: user.user_id,
    }
  );
}
