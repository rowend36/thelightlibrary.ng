"use server";
import { getSession } from "../utils/session";
import { createUser, getUserByEmail } from "../services/user_service";
import * as bcrypt from "bcryptjs";

import { loginSchema, signUpSchema } from "./schemas/auth_schemas";
import validateForm from "../utils/validate_form";
import { request, Router } from "express";
import { z, ZodError } from "zod";
import { validateRequest } from "../middleware/validate_request";
const authRoute = Router();

authRoute.post("/login", async (req, res) => {
  let data;
  try {
    data = loginSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError)
      return res.status(400).send({
        code: "app/validation-failed",
        error: "Validation Error",
        errors: e.issues,
      });
    else throw e;
  }
  const user = await getUserByEmail(data.email);

  if (!user) {
    return res.status(400).send({
      code: "auth/user-not-found",
      error: "No user found for supplied credentials.",
      errors: [
        {
          code: "auth/user-not-found",
          message: "User not found",
          path: ["email"],
        },
      ],
    });
  }

  if (!(await bcrypt.compare(data.password, user.password_hash!))) {
    return res.status(400).send({
      code: "auth/incorrect-password",
      error: "Incorrect password supplied.",
      errors: [
        {
          code: "auth/incorrect-password",
          message: "Password incorrect",
          path: ["password"],
        },
      ],
    });
  }

  const session = await getSession(req, res);
  session.user = {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
  await session.save();
  res.json({ data: session.user });
});

authRoute.post("/signup", validateRequest(signUpSchema), async (req, res) => {
  const data = req.validated_data as z.infer<typeof signUpSchema>;
  const user = await getUserByEmail(data.email);

  if (user) {
    return res.status(400).send({
      code: "auth/user-already-exists",
      error: "A user with this email already exists.",
      errors: [
        {
          code: "auth/user-already-exists",
          message: "User already exists",
          path: ["email"],
        },
      ],
    });
  }
  const password_hash = await bcrypt.hash(data.password, 10);
  const user_id = await createUser({
    email: data.email,
    password_hash,
    username: data.username,
    role: "member",
  });

  const session = await getSession(req, res);
  session.user = {
    user_id,
    email: data.email,
    username: data.username,
    role: "member",
  };
  await session.save();
  res.json({ data: session.user });
});

export default authRoute;
