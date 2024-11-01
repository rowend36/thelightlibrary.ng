import { Router } from "express";
import { validateRequest } from "../middleware/validate_request";
import { siteSchema } from "./schemas/site_schemas";
import { authMiddleware } from "../middleware/authMiddleware";
import s from "../utils/safe_async_handler";
import { z } from "zod";
import { getSiteInfo, updateSite } from "../services/site_service";

const siteRoute = Router();

siteRoute.post(
  "/",
  validateRequest(siteSchema),
  authMiddleware,
  s(async (req, res) => {
    const data = req.validated_data as z.infer<typeof siteSchema>;
    await updateSite(data);
    res.send({ success: true });
  })
);
siteRoute.get(
  "/admin",
  s(async (req, res) => {
    res.send(await getSiteInfo("default"));
  })
);

siteRoute.get(
  "/",
  s(async (req, res) => {
    res.send(await getSiteInfo("default"));
  })
);

export default siteRoute;
