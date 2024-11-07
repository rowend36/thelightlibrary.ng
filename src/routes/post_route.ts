import { Router } from "express";
import { validateRequest } from "../middleware/validate_request";

import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createPost,
  deletePost,
  getAdminPosts,
  getPosts,
  publishPost,
  selectAdminPostById,
  selectPostById,
  updatePost,
} from "../services/post_service";
import { getUser } from "../utils/get_user";
import { simpleGetOne, simpleUpdateOne } from "../utils/route_handlers";
import s from "../utils/safe_async_handler";
import { createPostSchema, updatePostSchema } from "./schemas/post_schemas";

const postsRoute = Router();

postsRoute.delete(
  "/:id",
  authMiddleware,
  s(async (req, res) => {
    await deletePost(parseInt(req.params.id));
    res.send({
      success: true,
    });
  })
);

postsRoute.post(
  "/",
  validateRequest(createPostSchema),
  authMiddleware,
  s(async (req, res) => {
    const data = req.validated_data as z.infer<typeof createPostSchema>;

    res.send({
      success: true,
      post_id: await createPost({
        user_id: (await getUser(req, res))!.user_id,
        ...data,
      }),
    });
  })
);

postsRoute.patch(
  "/:id",
  authMiddleware,
  validateRequest(updatePostSchema),
  s(async (req, res) => {
    const data = req.validated_data as z.infer<typeof updatePostSchema>;
    await updatePost(parseInt(req.params.id), {
      ...data,
      updated_at: new Date(),
    });
    res.send({ success: true });
  })
);

postsRoute.get(
  "/",
  s(async (req, res) => {
    res.send({
      posts: await getPosts(
        parseInt(req.params.limit) || 100,
        parseInt(req.params.offset) || 0
      ),
    });
  })
);

postsRoute.get(
  "/admin/:id",
  authMiddleware,
  simpleGetOne((req) => selectAdminPostById(parseInt(req.params.id)))
);

postsRoute.post(
  "/admin/:id/publish",
  authMiddleware,
  s(async (req, res) => {
    await publishPost(parseInt(req.params.id));
    res.send({
      message: "success",
    });
  })
);

postsRoute.get(
  "/admin",
  authMiddleware,
  s(async (req, res) => {
    res.send({
      posts: await getAdminPosts(
        parseInt(req.params.limit) || 100,
        parseInt(req.params.offset) || 0
      ),
    });
  })
);
postsRoute.get(
  "/:id",
  simpleGetOne((req) => selectPostById(parseInt(req.params.id)))
);

export default postsRoute;
