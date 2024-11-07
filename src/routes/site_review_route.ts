import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { siteReviewRepository } from "../services/review_service";
import {
  createOne,
  deleteOne,
  getOne,
  listAll,
  supplyUser,
  updateOne,
} from "../utils/route_handlers";
import { createSiteReviewSchema } from "./schemas/review_schemas";

export const siteReviewRouter = Router();

siteReviewRouter.get("/", listAll(siteReviewRepository));
siteReviewRouter.get("/:id", getOne(siteReviewRepository));
siteReviewRouter.post(
  "/",
  authMiddleware,
  supplyUser,
  createOne(siteReviewRepository, createSiteReviewSchema)
);
siteReviewRouter.patch(
  "/:id",
  authMiddleware,
  supplyUser,
  updateOne(siteReviewRepository, createSiteReviewSchema.partial())
);
siteReviewRouter.delete(
  "/:id",
  authMiddleware,
  deleteOne(siteReviewRepository)
);
