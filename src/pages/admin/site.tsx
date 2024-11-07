import { useQuery } from "@tanstack/react-query";

import { useEffect, useMemo, useState } from "react";
import { Form } from "react-router-dom";
import { ButtonBase } from "../../components/base/ButtonBase";
import InputBase from "../../components/base/InputBase";
import ImageUpload from "../../components/ImageUpload";
import Loader from "../../components/Loader";
import WordPicker from "../../components/WordPicker";
import { mapResponseToSiteInfo } from "../../data/actions/mappers";
import { fetcher, queryFn, uploadAndGetURL } from "../../data/actions/queryFn";

export default function SiteInfoPage(): JSX.Element {
  const [siteTitle, setSiteTitle] = useState("");
  const [siteTitle2, setSiteTitle2] = useState("");
  const [siteSubTitle, setSiteSubTitle] = useState("");
  const [siteSubTitle2, setSiteSubTitle2] = useState("");
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [landingImage, setLandingImage] = useState<File | null>(null);
  const [siteBlueWords, setSiteBlueWords] = useState<string[]>([]);
  const [siteOrangeWords, setSiteOrangeWords] = useState<string[]>([]);
  const [aboutAuthor, setAboutAuthor] = useState("");
  const [aboutSite, setAboutSite] = useState("");
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const siteWords = useMemo(() => {
    return siteTitle
      .split(" ")
      .filter(Boolean)
      .sort()
      .filter((e, i, a) => a.indexOf(e) === i);
  }, [siteTitle]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["site/", "admin"],
    queryFn,
    select: mapResponseToSiteInfo,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!data) return;
    const parser = new DOMParser();
    const html = parser.parseFromString(data.title, "text/html");
    setSiteTitle(html.body.innerText ?? "");
    setSiteTitle2(data.title2);
    setSiteSubTitle(data.description);
    setSiteSubTitle2(data.description2);
    setSiteBlueWords(
      Array.from(html.querySelectorAll(".blue"))
        .map((e) => e.textContent)
        .filter(Boolean) as string[]
    );
    setSiteOrangeWords(
      Array.from(html.querySelectorAll(".orange"))
        .map((e) => e.textContent)
        .filter(Boolean) as string[]
    );
    setAboutAuthor(data.about_author);
    setAboutSite(data.about_website);
  }, [data]);
  return (
    <div>
      <Form
        onSubmit={async (e) => {
          try {
            setLoading(true);
            e.preventDefault();
            const {
              title_text,
              title_text2,
              author_img,
              background_img,
              landing_img,
              ...data
            } = Object.fromEntries(
              new FormData(e.target as HTMLFormElement).entries()
            );
            const x = (title_text as string | undefined)
              ?.replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/&/g, "&amp;")
              .replace(/\b\w+\b/g, (value) => {
                if (siteBlueWords.includes(value))
                  return `<span class="blue">${value}</span>`;
                if (siteOrangeWords.includes(value))
                  return `<span class="orange">${value}</span>`;
                return value;
              });
            if (x) {
              data.title = x;
            }
            data.title2 = title_text2;
            if (author_img instanceof File && author_img.size > 0) {
              data.author_img = await uploadAndGetURL(author_img);
            }
            if (background_img instanceof File && background_img.size > 0) {
              data.background_img = await uploadAndGetURL(background_img);
            }
            if (landing_img instanceof File && landing_img.size > 0) {
              data.landing_img = await uploadAndGetURL(landing_img);
            }

            await fetcher("site/", {
              data: data,
            });
            alert("Site Info Updated Successfully");
          } catch (e) {
            alert("An Error Occured While Updating Site Info: " + e.message);
          }
          setLoading(false);
        }}
        className="pb-32"
      >
        <h2 className="text-xl mb-4 font-bold text-primary">Site Section 1</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-600 my-6 text-lg text-center">
            An Error Occured While Loading Site Info
          </div>
        ) : (
          <>
            <InputBase
              value={siteTitle}
              name="title_text"
              placeholder={data?.title}
              onChange={(e) => setSiteTitle(e.target.value)}
              label="Top Title"
              description="This is the title that will be shown on the site."
              className="mb-4"
            />
            <WordPicker
              label="Highlight blue words"
              value={siteBlueWords}
              onChange={setSiteBlueWords}
              options={siteWords.filter((e) => !siteOrangeWords.includes(e))}
            />
            <WordPicker
              label="Highlight orange words"
              value={siteOrangeWords}
              onChange={setSiteOrangeWords}
              options={siteWords.filter((e) => !siteBlueWords.includes(e))}
            />
            <div className="flex flex-wrap mb-8 justify-between">
              <div>
                <ImageUpload
                  label="Upload Landing Image"
                  name="landing_img"
                  value={bgImage}
                  onChange={setBgImage}
                  previewURL={data?.landing_img}
                />
              </div>
              <div>
                <ImageUpload
                  label="Upload Backdrop Image"
                  name="background_img"
                  value={landingImage}
                  onChange={setLandingImage}
                  previewURL={data?.background_img}
                />
              </div>
            </div>
            <InputBase
              name="description"
              value={siteSubTitle}
              onChange={(e) => setSiteSubTitle(e.target.value)}
              label="Subtitle"
              description="This is the title that will be shown below the title."
              className="mb-4"
            />
          </>
        )}
        <div className="border-slate-200 my-12 border" />
        <h2 className="text-xl mb-4 font-bold text-primary">Site Section 2</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-600 my-6 text-lg text-center">
            An Error Occured While Loading Site Info
          </div>
        ) : (
          <>
            <InputBase
              value={siteTitle2}
              name="title_text2"
              onChange={(e) => setSiteTitle2(e.target.value)}
              label="Top Title"
              description="This is the title that will be shown on the site."
              className="mb-4"
            />
            <InputBase
              name="description2"
              value={siteSubTitle2}
              onChange={(e) => setSiteSubTitle2(e.target.value)}
              label="Subtitle"
              description="This is the title that will be shown below the title."
              className="mb-4"
            />
          </>
        )}
        <div className="border-slate-200 my-12 border" />
        <h2 className="text-xl mb-4 font-bold text-primary">About Us</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-600 my-6 text-lg text-center">
            An Error Occured While Loading Site Info
          </div>
        ) : (
          <>
            <InputBase
              value={aboutAuthor}
              name="about_author"
              onChange={(e) => setAboutAuthor(e.target.value)}
              label="About Author"
              as="textarea"
              className="mb-4"
            />
            <InputBase
              name="about_website"
              value={aboutSite}
              onChange={(e) => setAboutSite(e.target.value)}
              label="About Site"
              as="textarea"
              className="mb-4"
            />
            <ImageUpload
              label="Upload Author Image"
              name="author_img"
              value={authorImage}
              onChange={setAuthorImage}
              previewURL={data?.author_img}
            />
          </>
        )}
        <ButtonBase
          type="submit"
          className="mt-16 w-96 mx-auto block max-w-full"
          disabled={!data}
        >
          {loading ? <Loader /> : <>Save</>}
        </ButtonBase>
      </Form>
    </div>
  );
}
