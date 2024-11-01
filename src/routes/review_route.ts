import { Router } from "express";
import { reviewService } from "../services/review_service";
import {
  listAll,
  getOne,
  createOne,
  deleteOne,
  supplyUser,
} from "../utils/route_handlers";
import { createReviewSchema } from "./schemas/review_schemas";
import { authMiddleware } from "../middleware/authMiddleware";

export const reviewRouter = Router();

reviewRouter.get("/", listAll(reviewService));
reviewRouter.get("/:id", getOne(reviewService));
reviewRouter.post(
  "/",
  authMiddleware,
  supplyUser,
  createOne(reviewService, createReviewSchema)
);
reviewRouter.delete("/:id", authMiddleware, deleteOne(reviewService));
