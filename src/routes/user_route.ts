"use server";
import { getSession } from "../utils/session";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validate_request";
import { roleSchema } from "./schemas/user_schemas";
import { z } from "zod";
import { getUserById, listUsers, setRole } from "../services/user_service";
const userRoute = Router();

userRoute.get("/me", authMiddleware, async (req, res) => {
  res.send({
    message: "Success",
    data: (await getSession(req, res)).user,
  });
});
userRoute.get("/", authMiddleware, async (req, res) => {
  res.send({
    message: "Success",
    data: await listUsers(),
  });
});
userRoute.get("/:id", authMiddleware, async (req, res) => {
  res.send({
    message: "Success",
    data: await getUserById(parseInt(req.params.id)),
  });
});

userRoute.post(
  "/:user_id/role",
  authMiddleware,
  validateRequest(roleSchema),
  async (req, res) => {
    const data = req.validated_data as z.infer<typeof roleSchema>;
    const my_user = (await getSession(req, res)).user;

    const user = await getUserById(parseInt(req.params.user_id));
    if (user === null) {
      return res.status(400).send({
        code: "app/validation-failed",
        error: `User with id=${req.params.user_id} not exist`,
      });
    }
    if (my_user.role !== "admin" || my_user.user_id === user.user_id) {
      return res.status(403).send({
        code: "app/forbidden",
        error: `You need another admin to update your role in the system`,
      });
    }

    await setRole(user.user_id, data.role);
    res.send({
      message: "Success",
    });
  },
);

export default userRoute;
