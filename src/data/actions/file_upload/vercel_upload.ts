import { upload } from "@vercel/blob/client";

import { nanoid } from "nanoid";

const map = new WeakMap();

export async function vercelUpload(uploadURL: string, image: File) {
  if (map.has(image)) {
    return map.get(image);
  }
  const x = await upload(nanoid(), image, {
    multipart: true,
    access: "public",
    contentType: image.type,
    handleUploadUrl: uploadURL,
  });
  map.set(image, x.downloadUrl);
  return x.downloadUrl;
}
