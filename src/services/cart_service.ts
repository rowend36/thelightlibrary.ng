import { Knex } from "knex";
import {
  getDatabase,
  JoinColumn,
  Selection,
  Table,
  Type,
} from "../config/database";
import { Cart } from "../data/models/cart";
import { User } from "../data/models/user";
import reshape from "../utils/reshape";
import { ModelRepository } from "../utils/model_repository";
import { bookRepository } from "./book_repository";

export const cartRepository = new ModelRepository("carts", "cart_id", [
  "cart_id",
  "checked_out",
]).hasMany({ ...bookRepository, through: "cart_book" });

type CartRequest = number[];
export const GuestUser = {
  user_id: null,
} as const;
type RequestUser = Pick<User, "user_id"> | typeof GuestUser;

export async function setCart(user: RequestUser, request: CartRequest) {
  const db = getDatabase();
  const cart = await db<Cart>(Type<Table>("carts"))
    .where("user_id", user.user_id)
    .where("checked_out", "<>", true)
    .select(Type<Selection>("cart_id"));

  let cart_id: number;
  if (cart.length < 1) {
    if (!request.length) return -1;
    cart_id = await cartRepository.create({
      checked_out: false,
      user_id: user.user_id,
    });
  } else {
    cart_id = cart[0].cart_id;
  }

  if (request.length > 0) {
    try {
      await db(Type<Table>("cart_book"))
        .insert(request.map((e) => ({ cart_id, book_id: e })))
        .onConflict(["cart_id", "book_id"])
        .ignore();
    } catch {
      const valid_ids = await db(Type<Table>("books"))
        .whereIn("book_id", request)
        .select("book_id");
      if (valid_ids.length < request.length) {
        throw new Error(
          "Invalid book ids - " +
            request
              .filter((f) => !valid_ids.some((e) => e.book_id === f))
              .join(", ") +
            ".",
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
  trx?: Knex.Transaction,
): Promise<Required<Cart>> {
  const db = getDatabase();
  let query = (trx ?? db)<Cart>(Type<Table>("carts")).where(
    "user_id",
    user.user_id,
  );
  if (cart_id) {
    query = query.where(Type<JoinColumn>("carts.cart_id"), cart_id);
  } else {
    query = query.where(Type<JoinColumn>("checked_out"), "<>", true);
  }

  const cart = reshape(await cartRepository.filter(query)) as Required<Cart>[];

  return (
    cart[0] ?? {
      cart_id: -1,
      books: [],
      checked_out: false,
      user_id: user.user_id,
    }
  );
}
