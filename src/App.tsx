import "./globals.css";
import "boxicons/css/boxicons.css";
import "@fontsource/epilogue";
import "@fontsource/epilogue/latin-400-italic.css";
import "@fontsource/epilogue/latin-700.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect, useState } from "react";
import {
  CartContext,
  CartManager,
  syncToLocalStorage,
  syncToServer,
} from "./data/services/cart_manager";
import { UserContext, UserManager } from "./data/services/user_manager";
import { fetcher } from "./data/actions/queryFn";
import { Purchase } from "./data/models/purchase";

const queryClient = new QueryClient();

function App() {
  const [auth] = useState(() => new UserManager());
  const [cart] = useState(() => {
    const m = new CartManager();
    syncToLocalStorage(m);
    return m;
  });
  const navigate = useNavigate();
  useEffect(() => {
    cart.sync();
    auth.sync();
    let reset: (() => void) | null;
    const handleChange = () => {
      if (reset) reset();

      reset = auth.user ? syncToServer(cart) : null;
      if (reset) reset();

      reset = auth.user ? syncToServer(cart) : null;
      if (reset) reset();

      reset = auth.user ? syncToServer(cart) : null;
    };
    auth.on("change", handleChange);
    const doCheckout = async () => {
      const { data: purchase }: { data: Purchase } = await fetcher(
        "cart/checkout",
        {
          data: {
            cart: cart.books.map((e) => e.book_id),
            anonymous: !auth.user,
          },
        }
      );
      navigate("/checkout/?reference=" + purchase.reference);
    };
    cart.on("checkout", doCheckout);
    return () => {
      auth.off("change", handleChange);
      cart.off("checkout", doCheckout);
      if (reset) reset();
    };
  }, [auth, cart, navigate]);
  return (
    <UserContext.Provider value={auth}>
      <CartContext.Provider value={cart}>
        <QueryClientProvider client={queryClient}>
          <ScrollToTop />
          <Outlet />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
