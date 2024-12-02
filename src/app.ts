import express from "express";
import bookRoute from "./routes/book_route";
import authRoute from "./routes/auth_route";
import helmet from "helmet";
import cors from "cors";
import cartRoute from "./routes/cart_route";
import { imageRoute } from "./routes/image_route";
import userRoute from "./routes/user_route";
import downloadRoute from "./routes/download_route";
import postsRoute from "./routes/post_route";
import siteRoute from "./routes/site_route";
import purchaseRoute from "./routes/purchase_route";
import { reviewRouter } from "./routes/review_route";
import { siteReviewRouter } from "./routes/site_review_route";
import authorRoute from "./routes/author_route";

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "same-site",
    },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data: https:"],
      },
    },
  })
);
const allowedOrigins = [
  "http://localhost:5173",
  "https://thelightlibrary.vercel.app",
];
app.use(
  cors({
    credentials: true,
    origin: function origin(
      origin: string | undefined,
      callback: (_: null, __: boolean) => void
    ) {
      if (true || allowedOrigins.includes(origin!)) {
        callback(null, true);
      } else {
        //@ts-ignore
        callback(null, false);
      }
    },
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/api/auth", authRoute);
app.use("/api/authors", authorRoute);
app.use("/api/books", bookRoute);
app.use("/api/cart", cartRoute);
app.use("/api/image", imageRoute);
app.use("/api/users", userRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/site-reviews", siteReviewRouter);
app.use("/api/purchases", purchaseRoute);
app.use("/api/download", downloadRoute);
app.use("/api/posts", postsRoute);
app.use("/api/site", siteRoute);
app.get("/api", (req, res) => {
  res.send("Server is cool.");
});
app.use("/uploads", express.static("uploads"));
app.use(function (
  error: Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
) {
  console.log("Best");
  console.error(error);
  res.status(500).json({
    error: "Internal Server Error",
    detail: error.message,
  });
});

export default app;
