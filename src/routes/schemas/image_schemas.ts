import { z } from "zod";

export const uploadImageSchema = z.object({
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/svg+xml",
    "image/webp",
    "application/pdf",
    "application/epub+zip",
    "application/x-mobipocket-ebook",
    "application/vnd.amazon.ebook",
    "application/msword ",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document ",
    "text/plain ",
    "text/htm",
  ]),
});
