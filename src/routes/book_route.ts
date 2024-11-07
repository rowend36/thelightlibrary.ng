import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validate_request";
import {
  addBook,
  deleteBook,
  feature,
  getBookDownloadLink,
  getBooks,
  getBooksAdmin,
  getFeatured,
  getFeaturedAdmin,
  getRecommended,
  searchBooks,
  setRecommended,
  unfeature,
  updateBook,
} from "../services/book_service";
import { getUser } from "../utils/get_user";
import s from "../utils/safe_async_handler";
import {
  featureSchema,
  recommendBooksSchema,
  submitBookSchema,
  updateBookSchema,
} from "./schemas/books_schemas";

const bookRoute = Router();

bookRoute.get(
  "/",
  s(async (req, res) => {
    const page = parseInt((req.query.page as string) ?? "0");
    if (req.query.query) {
      res.send(await searchBooks(req.query.query as string, 50, page * 50));
    } else res.send(await getBooks(50, page * 50));
  })
);

bookRoute.get(
  "/admin",
  authMiddleware,
  s(async (req, res) => {
    const page = parseInt((req.query.page as string) ?? "0");
    res.send(await getBooksAdmin(50, page * 50));
  })
);

bookRoute.get(
  "/recommended",
  s(async (req, res) => {
    res.send(await getRecommended());
  })
);

bookRoute.get(
  "/featured",
  s(async (req, res) => {
    res.send(await getFeatured());
  })
);

bookRoute.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateBookSchema),
  s(async (req, res) => {
    await updateBook(
      parseInt(req.params.id),
      req.validated_data as z.infer<typeof updateBookSchema>
    );
    res.send({ success: "true" });
  })
);

bookRoute.get(
  "/featured/admin",
  s(async (req, res) => {
    res.send(await getFeaturedAdmin());
  })
);

bookRoute.post(
  "/featured",
  validateRequest(featureSchema),
  authMiddleware,
  s(async (req, res) => {
    const data = req.validated_data as z.infer<typeof featureSchema>;
    await feature(data.book_id, data.synopsis, data.images, data.enabled);
    res.send({ success: true });
  })
);
bookRoute.delete(
  "/featured/:id",
  authMiddleware,
  s(async (req, res) => {
    await unfeature(parseInt(req.params.id));
    res.send({ success: true });
  })
);
bookRoute.get(
  "/:id/download",
  authMiddleware,
  s(async (req, res) => {
    const user = await getUser(req, res);
    const link = await getBookDownloadLink(parseInt(req.params.id), user);
    if (!link) {
      res.status(404).send();
    }
    res.redirect("/api/download/" + link);
  })
);
bookRoute.delete(
  "/:id",
  authMiddleware,
  s(async (req, res) => {
    await deleteBook(parseInt(req.params.id));
    res.send({
      success: true,
    });
  })
);

bookRoute.post(
  "/",
  validateRequest(submitBookSchema),
  authMiddleware,
  s(async (req, res) => {
    const data = req.validated_data as z.infer<typeof submitBookSchema>;
    await addBook(data);
    res.send({ success: true });
  })
);

bookRoute.post(
  "/recommend",
  validateRequest(recommendBooksSchema),
  authMiddleware,
  s(async (req, res) => {
    const data = req.validated_data as z.infer<typeof recommendBooksSchema>;
    await setRecommended(data);
    res.send({ success: true });
  })
);

export default bookRoute;
