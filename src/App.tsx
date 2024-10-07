import "./globals.css";
import "boxicons/css/boxicons.css";
import "@fontsource/epilogue";
import "@fontsource/epilogue/latin-400-italic.css";
import "@fontsource/epilogue/latin-700.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect, useState } from "react";
import {
  CartContext,
  CartManager,
  syncToLocalStorage,
  syncToServer,
} from "./data/services/cart_manager";
import { UserContext, UserManager } from "./data/services/user_manager";

const queryClient = new QueryClient();

function App() {
  const [user] = useState(() => new UserManager());
  const [cart] = useState(() => {
    const m = new CartManager();
    syncToLocalStorage(m);
    return m;
  });

  useEffect(() => {
    cart.sync();
    user.sync();
    let reset: (() => void) | null;
    let handleChange = () => {
      if (reset) reset();

      reset = user.user ? syncToServer(cart) : null;
      if (reset) reset();

      reset = user.user ? syncToServer(cart) : null;
      if (reset) reset();

      reset = user.user ? syncToServer(cart) : null;
    };
    user.on("change", handleChange);
    return () => {
      user.off("change", handleChange);
      if (reset) reset();
    };
  }, [user, cart]);
  return (
    <UserContext.Provider value={user}>
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
