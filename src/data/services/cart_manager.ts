import { EventEmitter } from "events";
import { Book } from "../models/book";
import { Cart } from "../models/cart";
import { syncCartFromServer, syncCartToServer } from "../actions/cartFn";
import { createContext, useContext, useEffect, useState } from "react";
import { Purchase } from "../models/purchase";
import { fetcher } from "../actions/queryFn";

type CartEvents = {
  sync: Promise<void>[][];
  change: Promise<void>[][];
  synced: Promise<void>[][];
  checkout: Promise<void>[][];
};
const listenerMap = new WeakMap();
export class CartManager extends EventEmitter<CartEvents> implements Cart {
  async checkout() {
    const { data: purchase }: { data: Purchase } = await fetcher(
      "cart/checkout",
      {
        data: {
          cart: this.books.map((e) => e.book_id),
        },
      }
    );
    await this.asyncEmit("checkout");
    return purchase;
  }
  books: Book[] = [];
  synced: boolean = false;
  _syncPromise: Promise<void> | undefined = void 0;

  has(book: Book) {
    return this.books.some((e) => e.book_id === book.book_id);
  }
  async asyncEmit(eventName: keyof CartEvents): Promise<void> {
    const ctx: Promise<void>[] = [];
    this.emit(eventName, ctx);
    await Promise.all(ctx);
  }
  on(eventName: keyof CartEvents, listener: () => void): this {
    const _listener =
      listenerMap.get(listener) ||
      async function _listener(ctx: Promise<void>[]) {
        ctx.push(Promise.resolve(listener()).then(() => void 0));
      };
    if (process.env.NODE_ENV === "development") {
      _listener.listener = listener.toString();
    }
    listenerMap.set(listener, _listener);
    return super.on(eventName, _listener);
  }
  off(eventName: keyof CartEvents, listener: () => void): this {
    if (listenerMap.has(listener)) {
      super.off(eventName, listenerMap.get(listener));
    }
    return super.off(eventName, listener);
  }
  async sync() {
    this._syncPromise = this.asyncEmit("sync");
    await this._syncPromise;
    if (this.synced) {
      this.asyncEmit("change");
    } else {
      this.synced = true;
      this.asyncEmit("synced");
    }
  }
  async addToCart(book: Book) {
    await this._syncPromise;
    if (!this.books.some((e) => e.book_id !== book.book_id))
      this.books = this.books.concat(book);
    await this.asyncEmit("change");
  }
  async removeFromCart(book: Book) {
    await this._syncPromise;
    this.books = this.books.filter((e) => e.book_id !== book.book_id);
    await this.asyncEmit("change");
  }
}

export function syncToLocalStorage(manager: CartManager) {
  manager.on("change", function () {
    localStorage.setItem("cart", JSON.stringify(manager.books));
  });
  manager.on("sync", function () {
    let cart: Book[] = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart") ?? "");
      cart.forEach(
        (e) => (e.created_at = new Date(e.created_at as unknown as string))
      );
    } catch (_) {
      // do nothing
    }
    manager.books = cart;
  });
}

export function syncToServer(manager: CartManager) {
  const a1 = async function () {
    try {
      await syncCartToServer(manager.books);
    } catch (_) {
      // TODO -  Notify the user somehow
    }
  };
  const a2 = async function () {
    try {
      const cart = await syncCartFromServer();
      if (cart) {
        manager.books = cart.books;
      }
    } catch (_) {
      // do nothing
    }
  };

  manager.on("change", a1);
  manager.on("sync", a2);
  return () => {
    manager.off("change", a1);
    manager.off("sync", a2);
  };
}

export const CartContext = createContext<CartManager>(null!);
export const useCart = () => {
  const cart = useContext(CartContext);
  const [, setUpdate] = useState({});
  useEffect(() => {
    const reset = () => setUpdate({});
    cart.on("synced", reset);
    cart.on("change", reset);
    return () => {
      cart.off("synced", reset);
      cart.off("change", reset);
    };
  }, [cart]);
  return cart;
};
