import Image from "next/image";
import illustrationIntro from "@/assets/images/library2.jpg";

import { AppLogo } from "@/components/AppLogo";
import { ButtonBase } from "@/components/base/ButtonBase";
import Link from "@/components/base/Link";
import Navbar from "@/components/about/Navbar";
import { getUser } from "@/utils/get_user";

export default async function LoginLayout(props: {
  children: any;
  modal: any;
}) {
  const user = await getUser();
  return (
    <>
      <Navbar user={user ?? undefined} />
      <style>{`
            html {
              background: linear-gradient(-45deg, rgba(20, 35, 30), rgba(15, 30, 35));
            }
            body {
              background-color: transparent;
            }
          `}</style>
      <div className="min-h-screen flex justify-center sm:items-center sm:container sm:max-w-none md:py-8">
        <Image
          priority
          src={illustrationIntro}
          className="object-cover h-full absolute inset-0 opacity-10"
          alt=""
        />
        {props.modal}
      </div>
    </>
  );
}
