import { useEffect, useMemo, useState } from "react";
import { SiteInfo } from "../models/site";
import { fetcher } from "../actions/queryFn";
import illustrationIntro from "../../assets/my_images/man-thinker.jpg";
import bookImage from "../../assets/my_images/image.png";
export function useSiteInfo() {
  const defaultSiteInfo: SiteInfo = useMemo(
    () => ({
      profile: "",
      title: "..",
      title2: "",
      description: "",
      description2: "",
      about_author: "",
      about_website: "",
      background_img: "",
      landing_img: "",
      author_img: "",
      blue_words: [],
      orange_words: [],
    }),
    []
  );
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(defaultSiteInfo);
  useEffect(
    () =>
      void (async () => {
        try {
          const data = await fetcher("site");
          setSiteInfo({
            ...defaultSiteInfo,
            background_img: illustrationIntro,
            landing_img: bookImage,
            ...data,
          });
        } catch (e) {
          setSiteInfo(defaultSiteInfo);
        }
      })(),
    [defaultSiteInfo]
  );
  return siteInfo;
}
