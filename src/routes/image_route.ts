import { NextFunction, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
export const imageRoute = Router();

imageRoute.post(
  "/upload",
  //   authMiddleware,
  async (req, res, next: NextFunction) => {
    try {
      const jsonResponse = await handleUpload({
        body: req.body,

        request: req,
        onBeforeGenerateToken: async (
          pathname
          /* clientPayload */
        ) => {
          return {
            //TODO - run cleanup
            // allowedContentTypes: [
            //   "image/*",
            //   "application/pdf",
            //   "application/epub+zip",
            // ],
            tokenPayload: JSON.stringify({
              // optional, sent to your server on upload completion
              // you could pass a user id from auth, or a value from clientPayload
            }),
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
