import { Router } from "express";
import s from "../utils/safe_async_handler";
import { searchAuthorSchema } from "./schemas/books_schemas";
import { authorRepository, searchAuthors } from "../services/author_service";
import { listAll } from "../utils/route_handlers";

const authorRoute = Router();
authorRoute.get(
  "/search",
  s(async (req, res) => {
    const data = searchAuthorSchema.parse({
      name: req.query.name,
    });
    return await searchAuthors(data.name).then((e) => res.json(e));
  })
);

authorRoute.get("/", listAll(authorRepository));

export default authorRoute;
