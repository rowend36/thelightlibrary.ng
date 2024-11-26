import { Router } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";

import { getAllBookFiles } from "../services/book_service";
import { getAllReviewFiles } from "../services/review_service";
import { getAllSiteFiles } from "../services/site_service";
import s from "../utils/safe_async_handler";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },

  filename: async function (req, file, cb) {
    const { nanoid } = await import("nanoid");
    cb(null, nanoid() + path.extname(file.originalname)); //Appending extension
  },
});
const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
const upload = multer({
  fileFilter(req, file, callback) {
    if (!allowedExtensions.includes(path.extname(file.originalname))) {
      callback(
        new Error("Bad File Extension: " + path.extname(file.originalname))
      );
    } else {
      callback(null, true);
    }
  },
  storage,
});
export const imageRoute = Router();

imageRoute.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  s((req, res) => {
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded!" });
    }
    res.send({
      message: "Done",
      url:
        process.env.SERVER_URL + "/" + req.file.destination + req.file.filename,
    });
  })
);

imageRoute.get(
  "/gc",
  s(async (_, res) => {
    const files = await getDatabaseFiles();
    res.send(files);
  })
);

// imageRoute.post(
//   "/gc",
//   s(async (_, res) => {
//     const files = await getDatabaseFiles();
//     const cutOff = Date.now() - 2 * 60 * 60 * 1000;
//     let cursor: string = undefined!;
//     do {
//       const { blobs, hasMore, cursor: _cursor } = await fs.({ cursor });
//       cursor = _cursor as string;
//       const gc = [];
//       for (const blob of blobs) {
//         if (
//           blob.uploadedAt.getTime() < cutOff &&
//           !files.includes(blob.downloadUrl)
//         ) {
//           gc.push(blob.pathname);
//         }
//       }
//       if (gc.length) {
//         if (process.env.NODE_ENV === "production") await del(gc);
//         else console.log("Deleting.... " + gc.join("\n"));
//       }
//       if (!hasMore) break;
//       // eslint-disable-next-line no-constant-condition
//     } while (true);
//     res.send({
//       message: "Garbage collection completed.",
//     });
//   })
// );

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
