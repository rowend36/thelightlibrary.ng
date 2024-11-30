export async function httpUpload(url: string, file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result = await uploadResponse.json();
  return result.url;
}
