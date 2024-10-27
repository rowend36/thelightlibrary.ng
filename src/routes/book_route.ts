import {
  addBook,
  deleteBook,
  feature,
  getBookById,
  getBookDownloadLink,
  getBooks,
  getBooksAdmin,
  getFeatured,
  getFeaturedAdmin,
  getRecommended,
  searchAuthors,
  searchBooks,
  setRecommended,
  unfeature,
} from "../services/book_service";
import { NextFunction, Router } from "express";
import { z, ZodError } from "zod";
import {
  featureSchema,
  recommendBooksSchema,
  searchAuthorSchema,
  submitBookSchema,
} from "./schemas/books_schemas";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validate_request";
import { getUser } from "../utils/get_user";

const bookRoute = Router();

bookRoute.get("/", async (req, res) => {
  const page = parseInt((req.query.page as string) ?? "0");
  if (req.query.query) {
    res.send(await searchBooks(req.query.query as string, 50, page * 50));
  } else res.send(await getBooks(50, page * 50));
});
bookRoute.get("/admin", authMiddleware, async (req, res) => {
  const page = parseInt((req.query.page as string) ?? "0");
  res.send(await getBooksAdmin(50, page * 50));
});
bookRoute.get("/recommended", async (req, res) => {
  res.send(await getRecommended());
});
bookRoute.get("/featured", async (req, res) => {
  res.send(await getFeatured());
});
bookRoute.get("/featured/admin", async (req, res) => {
  res.send(await getFeaturedAdmin());
});
bookRoute.post(
  "/featured",
  validateRequest(featureSchema),
  authMiddleware,
  async (req, res, next) => {
    try {
      const data = req.validated_data as z.infer<typeof featureSchema>;

      await feature(data.book_id, data.synopsis, data.images, data.enabled);
    } catch (error) {
      return next(error);
    }
    res.send({ success: true });
  },
);
bookRoute.delete("/featured/:id", authMiddleware, async (req, res, next) => {
  try {
    await unfeature(parseInt(req.params.id));
  } catch (error) {
    return next(error);
  }
  res.send({ success: true });
});
bookRoute.get("/:id/download", authMiddleware, async (req, res) => {
  const user = await getUser(req, res);
  const link = await getBookDownloadLink(parseInt(req.params.id), user);
  if (!link) {
    res.status(404).send();
  }
  res.redirect("/api/download/" + link);
});
bookRoute.delete("/:id", authMiddleware, async (req, res) => {
  return await deleteBook(parseInt(req.params.id));
});

bookRoute.post(
  "/",
  validateRequest(submitBookSchema),
  authMiddleware,
  async (req, res, next: NextFunction) => {
    try {
      const data = req.validated_data as z.infer<typeof submitBookSchema>;
      await addBook(data);
    } catch (error) {
      return next(error);
    }
    res.send({ success: true });
    // Call the service function to submit the book
  },
);

bookRoute.post(
  "/recommend",
  validateRequest(recommendBooksSchema),
  authMiddleware,
  async (req, res, next: NextFunction) => {
    try {
      const data = req.validated_data as z.infer<typeof recommendBooksSchema>;

      await setRecommended(data);
    } catch (error) {
      return next(error);
    }
    res.send({ success: true });
  },
);

bookRoute.get("/authors/search", async (req, res) => {
  const data = searchAuthorSchema.parse({
    author_name: req.query.query,
  });
  return await searchAuthors(data.author_name).then((e) => res.json(e));
});
export default bookRoute;
