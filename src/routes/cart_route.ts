import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";
import { getCart, setCart, GuestUser } from "../services/cart_service";
import { getSession } from "../utils/session";
import { validateRequest } from "../middleware/validate_request";
import {
  addToCartSchema,
  checkoutSchema,
  paySchema,
} from "./schemas/cart_schemas";
import { createUser } from "../services/user_service";
import {
  checkout,
  EmptyCartException,
  getPurchaseByReference,
  updateStatus,
} from "../services/purchase_service";
import { getUser } from "../utils/get_user";
import { getBookDownloadLink } from "../services/book_service";
import { PurchaseStatus } from "../data/models/purchase";

const cartRoute = Router();

cartRoute.get("/", authMiddleware, async (req, res) => {
  const page = parseInt((req.query.page as string) ?? "0");
  const user = (await getSession(req, res)).user;
  res.send(await getCart(user));
});

cartRoute.post(
  "/",
  validateRequest(addToCartSchema),
  authMiddleware,
  async (req, res, next) => {
    try {
      const user = (await getSession(req, res)).user;
      const cart_id = await setCart(
        user,
        (req.validated_data as z.infer<typeof addToCartSchema>).cart,
      );
      res.send({
        message: "Successful",
        cart_id: cart_id,
      });
    } catch (e) {
      next(e);
    }
  },
);

cartRoute.get("/checkout/callback", async (req, res) => {
  const {
    redirect_url = process.env.WEBSITE_URL + "/login",
    tx_ref,
    transaction_id,
  } = req.query;
  const url = new URL(redirect_url as string);
  const purchase = await getPurchaseByReference(tx_ref as string);
  if (!tx_ref) {
    url.searchParams.set("status", "not-found");
  } else {
    if (purchase.status !== PurchaseStatus.success) {
      const response = await (
        await fetch(
          `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
          {
            headers: {
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            },
          },
        )
      ).json();

      console.log(response);

      if (
        response.data.tx_ref === tx_ref &&
        response.data.status === "successful" &&
        response.data.amount >= parseFloat(purchase.purchase_price) &&
        response.data.currency === "NGN"
      ) {
        url.searchParams.set("status", "success");
        await updateStatus(purchase.reference, PurchaseStatus.success);
      } else {
        url.searchParams.set("status", "failed");
      }
    }
  }

  res.redirect(url.toString());
});

cartRoute.post(
  "/checkout",
  validateRequest(checkoutSchema),
  async (req, res, next) => {
    try {
      const user = (await getSession(req, res)).user ?? GuestUser;
      const data = req.validated_data as z.infer<typeof checkoutSchema>;
      if (!user.user_id && !data.anonymous) {
        return res.status(400).send({
          message: "Cannot checkout anonymously when anonymous is false",
        });
      }
      const cart_id = await setCart(user, data.cart);
      if (cart_id === -1) {
        return res.status(400).send({
          message: "Cannot checkout empty cart",
        });
      }
      try {
        const purchase = await checkout(user, cart_id);
        return res.send({
          message: "Successful",
          data: purchase,
        });
      } catch (e) {
        if (e instanceof EmptyCartException) {
          return res.status(400).send({
            message: "Cannot checkout empty cart",
          });
        }
        throw e;
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  },
);

cartRoute.get("/checkout/:ref", async (req, res, next) => {
  const user = (await getUser(req, res)) ?? GuestUser;
  const purchase = await getPurchaseByReference(req.params.ref);
  if (!purchase) {
    return res.status(404).send({
      message: "Unable to find checkout",
    });
  }
  res.send(purchase);
});

cartRoute.post(
  "/checkout/:ref/pay",
  validateRequest(paySchema),
  async (req, res, next) => {
    let user = await getUser(req, res);
    const email = (req.validated_data as z.infer<typeof paySchema>).email;

    const purchase = await getPurchaseByReference(req.params.ref);
    if (!purchase) {
      return res.status(404).send({
        message: "Unable to find checkout",
      });
    }
    try {
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        body: JSON.stringify({
          tx_ref: purchase.reference,
          amount: purchase.purchase_price,
          currency: "NGN",
          redirect_url:
            process.env.SERVER_URL +
            "/api/cart/checkout/callback/?redirect_url=" +
            encodeURIComponent(
              (req.query.redirect_url as string) ??
                process.env.WEBSITE_URL +
                  "/purchase-completed/?reference=" +
                  purchase.reference,
            ),
          customer: {
            email: email,
            name: !user || email !== user.email ? undefined : user.username,
          },
          customizations: {
            title: "The Light Library",
            logo: process.env.WEBSITE_URL + "/android-chrome-192x192.png",
            description:
              "Payment for " +
              (purchase.cart!.books!.length > 1
                ? purchase.cart!.books!.length + "book"
                : purchase.cart!.books![0].title),
          },
        }),
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data["status"] === "success") {
        return res.send({ paymentURL: data["data"]["link"] });
      } else {
        console.error(data);
      }
    } catch (err: any) {
      console.error(err);
    }
    res.status(503).send({
      error: "Service Not Available",
    });
  },
);

export default cartRoute;
