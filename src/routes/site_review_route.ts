import { Router } from "express";
import { siteReviewService } from "../services/review_service";
import {
  listAll,
  getOne,
  createOne,
  deleteOne,
  supplyUser,
} from "../utils/route_handlers";
import { createReviewSchema } from "./schemas/review_schemas";
import { authMiddleware } from "../middleware/authMiddleware";

export const siteReviewRouter = Router();

siteReviewRouter.get("/", listAll(siteReviewService));
siteReviewRouter.get("/:id", getOne(siteReviewService));
siteReviewRouter.post(
  "/",
  authMiddleware,
  supplyUser,
  createOne(siteReviewService, createReviewSchema)
);
siteReviewRouter.delete("/:id", authMiddleware, deleteOne(siteReviewService));
