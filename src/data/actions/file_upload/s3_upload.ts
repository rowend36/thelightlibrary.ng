export async function s3Upload(url: string, file: File) {
  console.log(file);
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      contentType: file.type,
      contentLength: file.size,
    }),
  });
  if (!response.ok) {
    console.log(response.json());
    throw new Error("Failed to get signed url");
  }
  const conf = await response.json();
  const uploadResponse = await fetch(conf.url, {
    method: "PUT",
    body: file,
  });
  if (!uploadResponse.ok) {
    console.log(await uploadResponse.text());
    throw new Error("Failed to upload file");
  }

  return conf.fileURL;
}
