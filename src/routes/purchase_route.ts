import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getPurchasesAdmin,
  getPurchasesForUserId,
} from "../services/purchase_service";
import { getUser } from "../utils/get_user";
import s from "../utils/safe_async_handler";

const purchaseRoute = Router();

purchaseRoute.get(
  "/",
  authMiddleware,
  s(async (req, res) => {
    const user = await getUser(req, res);
    res.send({
      purchases: await getPurchasesForUserId(
        user!.user_id,
        parseInt(req.params.limit) || 100,
        parseInt(req.params.offset) || 0
      ),
    });
  })
);

purchaseRoute.get(
  "/admin",
  authMiddleware,
  s(async (req, res) => {
    res.send({
      purchases: await getPurchasesAdmin(
        parseInt(req.params.limit) || 100,
        parseInt(req.params.offset) || 0
      ),
    });
  })
);

export default purchaseRoute;
