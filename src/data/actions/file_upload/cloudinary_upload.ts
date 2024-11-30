export async function cloudinaryUpload(url: string, file: File) {
  const response = await fetch(url, { method: "POST" });
  const signature = await response.json();

  const formData = new FormData();
  for (const key in signature) {
    formData.append(key, signature[key]);
  }
  formData.append("file", file);

  const uploadResponse = await fetch(
    "https://api.cloudinary.com/v1_1/thelight/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await uploadResponse.json();
  return result.url;
}
