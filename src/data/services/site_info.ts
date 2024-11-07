import { useEffect, useMemo, useState } from "react";
import { SiteInfo } from "../models/site";
import { fetcher } from "../actions/queryFn";
import illustrationIntro from "../../assets/my_images/man-thinker.jpg";
import bookImage from "../../assets/my_images/image.png";
export function useSiteInfo() {
  const defaultSiteInfo: SiteInfo = useMemo(
    () => ({
      profile: "",
      title:
        'The <span className="text-primaryLight">Book</span> That Will <span className="text-white">Change</span> <span className="text-tertiary">Everything</span>',
      title2: "",
      description:
        'What separates the top <span className="font-bold tracking-widest text-xl mx-1">1%</span> of the society from everyone else? The book you have been looking for is finally within your reach. ',
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
