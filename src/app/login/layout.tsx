import Image from "next/image";
import illustrationIntro from "@/assets/images/library2.jpg";

import { AppLogo } from "@/components/AppLogo";
import { ButtonBase } from "@/components/base/ButtonBase";
import Link from "@/components/base/Link";

export default function LoginLayout(props: { children: any; modal: any }) {
  return (
    <>
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
