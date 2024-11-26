import { NextFunction, Router } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";

import { del, list } from "@vercel/blob";
import cloudinary from "../config/cloudinary";
import { getAllBookFiles } from "../services/book_service";
import { getAllReviewFiles } from "../services/review_service";
import { getAllSiteFiles } from "../services/site_service";
import s from "../utils/safe_async_handler";
export const imageRoute = Router();

imageRoute.post(
  "/upload",
  //   authMiddleware,
  async (req, res, next: NextFunction) => {
    const paramsToSign = {
      timestamp: Math.round(new Date().getTime() / 1000),
      folder: "signed_uploads", // Specify folder
    };

    const signature = cloudinary.v2.utils.api_sign_request(
      paramsToSign,
      cloudinary.v2.config().api_secret!
    );

    res.json({
      signature,
      timestamp: paramsToSign.timestamp,
      folder: paramsToSign.folder,
      api_key: cloudinary.v2.config().api_key,
    });
  }
);

imageRoute.get(
  "/gc",
  s(async (_, res) => {
    const files = await getDatabaseFiles();
    res.send(files);
  })
);
imageRoute.post(
  "/gc",
  s(async (_, res) => {
    const files = await getDatabaseFiles();
    const cutOff = Date.now() - 2 * 60 * 60 * 1000;
    let cursor: string = undefined!;
    do {
      const { blobs, hasMore, cursor: _cursor } = await list({ cursor });
      cursor = _cursor as string;
      const gc = [];
      for (const blob of blobs) {
        if (
          blob.uploadedAt.getTime() < cutOff &&
          !files.includes(blob.downloadUrl)
        ) {
          gc.push(blob.pathname);
        }
      }
      if (gc.length) {
        if (process.env.NODE_ENV === "production") await del(gc);
        else console.log("Deleting.... " + gc.join("\n"));
      }
      if (!hasMore) break;
      // eslint-disable-next-line no-constant-condition
    } while (true);
    res.send({
      message: "Garbage collection completed.",
    });
  })
);

async function getDatabaseFiles() {
  return (
    (
      await Promise.all(
        [getAllBookFiles(), getAllReviewFiles(), getAllSiteFiles()].flat()
      )
    ).flat() as Record<string, string>[]
  ).reduce((a, e) => {
    a.push(
      ...Object.keys(e)
        .filter((e) => e !== "updated_at")
        .map((f) => e[f])
        .filter(Boolean)
    );
    return a;
  }, [] as string[]);
}
