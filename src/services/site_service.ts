import { db, Table, Type } from "../config/database";
import { SiteInfo } from "../data/models/site";
import reshape from "../utils/reshape";
import sanitizeHtml from "sanitize-html";

export function clean(title: string | undefined) {
  if (!title) return title;
  return sanitizeHtml(title, {
    allowedTags: ["span", "sup", "sub", "small"],
    allowedClasses: {
      span: ["orange", "blue"],
    },
  });
}

export async function updateSite(
  data: Partial<SiteInfo> & Pick<SiteInfo, "profile">
) {
  await db<SiteInfo>(Type<Table>("site_info"))
    .insert({ ...data, title: clean(data.title) })
    .onConflict("profile")
    .merge([
      "title",
      "description",
      "title2",
      "description2",
      "background_img",
      "landing_img",
      "about_author",
      "about_website",
      "author_img",
    ]);
}

export async function getSiteInfo(profile = "default") {
  const data =
    (await db<SiteInfo>(Type<Table>("site_info"))
      .where("profile", profile)
      .first()) ??
    ({
      title: "The Book That Will Change Everything",
      description:
        "What separates the top 1% of the society from everyone else? The book you have been looking for is finally within your reach.",
      title2: "OUR LATEST PAGE-TURNERS",
      description2:
        "Books that touch on almost every topic of life. The real leaders in every field are the top readers in that field.",
    } as SiteInfo);
  return reshape([data])[0];
}
