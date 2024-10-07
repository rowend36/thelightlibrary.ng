import { RouteObject } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/404";
import AboutPage from "./pages/about";
import BooksPage from "./pages/books";
import BookDetailsPage from "./pages/books__id";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import ConfirmPage from "./pages/confirm";
import BlogPage from "./pages/blog";
import BlogDetailsPage from "./pages/blog__id";
import App from "./App";
import AdminPage from "./pages/admin";
import Admin404 from "./pages/admin/404";
import AdminLayout from "./pages/admin/layout";
import AdminBooksPage from "./pages/admin/books";
import LoginPage from "./pages/login";
import PurchaseCompletedPage from "./pages/purchase_completed";

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        element: <Home />,
        path: "/",
      },
      {
        element: <LoginPage />,
        path: "/login",
      },
      {
        element: <AdminLayout />,
        path: "/admin",
        children: [
          {
            element: <AdminPage />,
            index: true,
            handle: {
              meta: {
                title: "Dashboard",
              },
            },
          },
          {
            element: <AdminBooksPage />,
            path: "books",
            handle: {
              meta: {
                title: "Books",
              },
            },
          },
          {
            element: <Admin404 />,
            path: "*",
            handle: {
              meta: {
                title: "Page Not Found",
              },
            },
          },
        ],
      },
      { element: <Home />, path: "home" },
      { element: <AboutPage />, path: "about" },
      { element: <BooksPage />, path: "books" },
      { element: <BooksPage />, path: "search" },
      {
        element: <BlogPage />,

        path: "blog",
        children: [
          {
            element: <BlogDetailsPage />,
            path: ":id",
          },
        ],
      },
      {
        element: <BooksPage />,
        path: "books",
        children: [
          {
            element: <BookDetailsPage />,
            path: ":id",
          },
        ],
      },
      { element: <CartPage />, path: "cart" },
      { element: <ConfirmPage />, path: "confirm" },
      { element: <CheckoutPage />, path: "checkout" },
      { element: <CheckoutPage />, path: "checkout" },
      { element: <PurchaseCompletedPage />, path: "purchase-completed" },
      { element: <NotFound />, path: "*" },
    ],
  },
];

export default routes;
