import { NextFunction, Router } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { list, del } from "@vercel/blob";
import { getDatabase } from "../config/database";
import s from "../utils/safe_async_handler";
import { bookRepository } from "../services/book_repository";
import { getAllBookFiles } from "../services/book_service";
import { getAllReviewFiles } from "../services/review_service";
import { getAllSiteFiles } from "../services/site_service";
export const imageRoute = Router();

imageRoute.post(
  "/upload",
  //   authMiddleware,
  async (req, res, next: NextFunction) => {
    try {
      const db = getDatabase();
      const jsonResponse = await handleUpload({
        body: req.body,

        request: req,
        onBeforeGenerateToken: async (
          pathname
          /* clientPayload */
        ) => {
          return {
            tokenPayload: JSON.stringify({}),
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log("blob upload completed", blob, tokenPayload);

          try {
            // Run any logic after the file upload completed
            // const { userId } = JSON.parse(tokenPayload);
            // await db.update({ avatar: blob.url, userId });
          } catch (error) {
            throw new Error("Could not update user");
          }
        },
      });

      res.json(jsonResponse);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
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
    let cursor = undefined;
    do {
      const { blobs, hasMore, cursor: _cursor } = await list({ cursor });
      cursor = _cursor;
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
