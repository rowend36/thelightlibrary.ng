import { Router } from "express";
import { reviewRepository } from "../services/review_service";
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

reviewRouter.get("/", listAll(reviewRepository));
reviewRouter.get("/:id", getOne(reviewRepository));
reviewRouter.post(
  "/",
  authMiddleware,
  supplyUser,
  createOne(reviewRepository, createReviewSchema)
);
reviewRouter.delete("/:id", authMiddleware, deleteOne(reviewRepository));
