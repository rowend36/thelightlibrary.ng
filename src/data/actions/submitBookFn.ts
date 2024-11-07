import reshape from "../../utils/reshape";
import { fetcher, uploadAndGetURL } from "./queryFn";

export async function submitBookFn(formData: FormData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {};
  for (const entry of formData.entries()) {
    if (entry[0] === "pdf") {
      if (entry[1] == null) continue;
      body.pdf_url = await uploadAndGetURL(entry[1] as File);
    } else if (entry[0] === "book_cover") {
      if (entry[1] == null) continue;
      body.book_cover_url = await uploadAndGetURL(entry[1] as File);
    } else {
      body[entry[0]] = entry[1];
    }
  }
  return fetcher("books", {
    data: reshape([body])[0],
  });
}
