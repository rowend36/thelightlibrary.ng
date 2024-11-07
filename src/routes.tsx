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
import SiteInfoPage from "./pages/admin/site";
import AdminBlogPage from "./pages/admin/blog";
import AdminEditBlogPage from "./pages/admin/blog__id";
import AdminNewBlogPage from "./pages/admin/blog__new";
import AdminPurchasesPage from "./pages/admin/purchases";
import AdminUsersPage from "./pages/admin/users";
import AdminReviewsPage from "./pages/admin/reviews";
import AdminEditUserPage from "./pages/admin/users__id";
import SiteReviewsPage from "./pages/admin/site_reviews";
import AdminNewSiteReviewPage from "./pages/admin/site_reviews__new";
import AdminEditSiteReviewsPage from "./pages/admin/site_reviews__id";

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
            element: <AdminBlogPage />,
            path: "blog",
            handle: {
              meta: {
                title: "Blog",
              },
            },
          },
          {
            element: <AdminNewBlogPage />,
            path: "blog/new",
            handle: {
              meta: {
                title: "Create Blog Post",
                allowBack: true,
              },
            },
          },
          {
            element: <AdminEditBlogPage />,
            path: "blog/:id",
            handle: {
              meta: {
                title: "Edit Blog Post",
                allowBack: true,
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
            element: <AdminReviewsPage />,
            path: "reviews",
            handle: {
              meta: {
                title: "Reviews",
              },
            },
          },
          {
            element: <AdminPurchasesPage />,
            path: "purchases",
            handle: {
              meta: {
                title: "Purchases",
              },
            },
          },
          {
            element: <AdminUsersPage />,
            path: "users",
            handle: {
              meta: {
                title: "Users",
              },
            },
          },
          {
            element: <AdminEditUserPage />,
            path: "users/:id",
            handle: {
              meta: {
                title: "Edit User",
                allowBack: true,
              },
            },
          },
          {
            element: <SiteInfoPage />,
            path: "site",
            handle: {
              meta: {
                title: "Site Information",
              },
            },
          },
          {
            element: <SiteReviewsPage />,
            path: "site-reviews",
            handle: {
              meta: {
                title: "Site Reviews",
              },
            },
          },
          {
            element: <AdminEditSiteReviewsPage />,
            path: "site-reviews/:id",
            handle: {
              meta: {
                title: "Site Reviews",
                allowBack: true,
              },
            },
          },
          {
            element: <AdminNewSiteReviewPage />,
            path: "site-reviews/new",
            handle: {
              meta: {
                title: "Site Reviews",
                allowBack: true,
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
        path: "blog",
        children: [
          {
            element: <BlogPage />,
            index: true,
          },
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
      { element: <PurchaseCompletedPage />, path: "purchase-completed" },
      { element: <NotFound />, path: "*" },
    ],
  },
];

export default routes;
